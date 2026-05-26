import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { AssistantBehaviorContext, AssistantMode, AssistantMessage, ChatHistoryMessage, PendingAssistantAction, AwaitingAssistantSelection, AssistantApiResponse, Mood, RuntimeState } from "@/types";
import { detectUnsafeCommand, getAssistantBehaviorReaction } from "@/lib/aswinKnowledge";
import { 
  confirmationWords, 
  cancellationWords, 
  getIntroMessage, 
  recruiterPitch, 
  explorerMessage,
  getAswinClaimReply,
} from "@/lib/aswinPrompts";
import { themes } from "@/lib/themes";

type UseAssistantProps = {
  onSetTheme?: (themeClassName: string) => void;
  onSetMusicPlaying?: (isPlaying: boolean) => void;
  onTogglePartyMode?: () => void;
  behaviorContext?: AssistantBehaviorContext;
};

const normalizeText = (value: string) => 
  value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const isRecruiterIntent = (normalizedQuery: string) => {
  return (
    confirmationWords.has(normalizedQuery) ||
    /\b(recruiter|hiring|hire|talent|interviewer|reviewing)\b/.test(normalizedQuery)
  );
};

const isExplorerIntent = (normalizedQuery: string) => {
  return (
    cancellationWords.has(normalizedQuery) ||
    normalizedQuery.includes("exploring") ||
    normalizedQuery.includes("just exploring") ||
    normalizedQuery.includes("not recruiter")
  );
};

const themeAliases: Record<string, string> = {
  dark: "theme-oled",
  "dark mode": "theme-oled",
  black: "theme-oled",
  green: "theme-matrix",
  hacker: "theme-matrix",
  blue: "theme-dos-blue",
  dos: "theme-dos-blue",
  windows: "theme-windows95",
  grey: "theme-windows95",
  gray: "theme-windows95",
  orange: "theme-appleii",
  apple: "theme-appleii",
  gameboy: "theme-gbpocket",
  game: "theme-gbpocket",
};

const availableThemeLine = () => themes.map((theme) => theme.name).join(", ");
const themeFileLine = () => themes.map((theme) => `${normalizeText(theme.name).replace(/\s+/g, "-")}.sys`).join(", ");

const isThemeControlRequest = (normalizedQuery: string) => {
  return (
    normalizedQuery.includes("theme") ||
    normalizedQuery.includes("color") ||
    normalizedQuery.includes("dark mode") ||
    normalizedQuery.includes("light mode") ||
    normalizedQuery.startsWith("switch to ") ||
    normalizedQuery.startsWith("change to ") ||
    normalizedQuery.startsWith("set theme")
  );
};

const detectThemeAction = (normalizedQuery: string): PendingAssistantAction | null => {
  const theme = themes.find((item) => {
    const normalizedName = normalizeText(item.name);
    const normalizedClassName = normalizeText(item.className.replace("theme-", ""));
    return normalizedQuery === normalizedName || normalizedQuery === normalizedClassName;
  }) || themes.find((item) =>
    Object.entries(themeAliases).some(([alias, themeClassName]) => {
      return normalizedQuery === alias && item.className === themeClassName;
    })
  ) || themes.find((item) => {
    const normalizedName = normalizeText(item.name);
    const normalizedClassName = normalizeText(item.className.replace("theme-", ""));
    return normalizedQuery.includes(normalizedName) || normalizedQuery.includes(normalizedClassName);
  }) || themes.find((item) =>
    Object.entries(themeAliases).some(([alias, themeClassName]) => {
      return normalizedQuery.includes(alias) && item.className === themeClassName;
    })
  );

  if (!theme) return null;

  return {
    type: "theme",
    label: `switch theme to ${theme.name}`,
    value: theme.className,
  };
};

const getThemeControlReply = (normalizedQuery: string) => {
  if (!isThemeControlRequest(normalizedQuery)) return "";
  if (detectThemeAction(normalizedQuery)) return "";

  return [
    "theme matrix opened.",
    "",
    "available visual shells:",
    themeFileLine(),
    "",
    "plain names:",
    availableThemeLine(),
    "",
    "type a theme name to stage it.",
  ].join("\n");
};

const detectPendingAction = (query: string): PendingAssistantAction | null => {
  const normalizedQuery = normalizeText(query);
  if (isThemeControlRequest(normalizedQuery)) {
    const themeAction = detectThemeAction(normalizedQuery);
    if (themeAction) return themeAction;
  }

  if (normalizedQuery.includes("party mode") || normalizedQuery === "party") {
    return {
      type: "party",
      label: "toggle party mode",
    };
  }

  if (
    normalizedQuery.includes("play music") ||
    normalizedQuery.includes("start music") ||
    normalizedQuery.includes("play song")
  ) {
    return {
      type: "music",
      label: "play profile music",
      value: "play",
    };
  }

  if (
    normalizedQuery.includes("stop music") ||
    normalizedQuery.includes("pause music") ||
    normalizedQuery.includes("turn off music")
  ) {
    return {
      type: "music",
      label: "stop profile music",
      value: "stop",
    };
  }

  return null;
};

const playTypewriterBell = (audioContext: AudioContext) => {
  try {
    const now = audioContext.currentTime;
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(2000, now);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(2015, now);

    gainNode.gain.setValueAtTime(0.025, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc1.start(now);
    osc1.stop(now + 0.4);
    osc2.start(now);
    osc2.stop(now + 0.4);
  } catch {
    // Fail silently
  }
};

const playTypewriterClick = (audioContext: AudioContext, char?: string) => {
  try {
    if (char === "\n" || char === "." || char === "?" || char === "!") {
      playTypewriterBell(audioContext);
    }
  } catch {
    // Fail silently
  }
};


const pickWeighted = <T>(items: [T, number][]): T => {
  const total = items.reduce((sum, [, weight]) => sum + weight, 0);
  let random = Math.random() * total;
  for (const [item, weight] of items) {
    if (random < weight) return item;
    random -= weight;
  }
  return items[0][0];
};

const getRandomMoodWeighted = (): Mood => {
  return pickWeighted([
    ["sleep-deprived", 40],
    ["professional", 20],
    ["glitching", 15],
    ["chaotic", 10],
    ["overconfident", 10],
    ["dramatic", 5],
  ]);
};

const injectMicroRandomness = (text: string): string => {
  // No client-side text injection — the LLM response is used as-is.
  // Previous versions appended random jargon ("sass levels approaching critical limits",
  // "[system event]", etc.) which added noise without adding character.
  return text;
};

export const useAssistant = ({
  onSetTheme,
  onSetMusicPlaying,
  onTogglePartyMode,
  behaviorContext,
}: UseAssistantProps) => {
  const [query, setQuery] = useState("");
  const [runtimeState, setRuntimeState] = useState<RuntimeState>(() => {
    const defaultState: RuntimeState = {
      mood: "sleep-deprived",
      sassLevel: 3,
      patience: 10,
      glitchChance: 10,
      recruiterDetected: false,
      userSuspicionLevel: 0,
      messageCount: 0,
      offTopicCount: 0,
      // Memory Scars:
      userAskedOffTopicCount: 0,
      userMentionedRecruiting: false,
      userTouchedRestrictedSector: 0,
      userAskedGoodQuestionCount: 0,
    };
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aswinos_assistant_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...defaultState,
            ...parsed,
            messageCount: 0, // Reset message count per session
          };
        }
      } catch (e) {
        console.warn("Failed to load assistant memory scars:", e);
      }
    }
    return defaultState;
  });
  const [messages, setMessages] = useState<AssistantMessage[]>(() => {
    let intro = getIntroMessage();
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aswinos_assistant_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          const restrictedCount = parsed.userTouchedRestrictedSector || 0;
          const recruiterMode = parsed.userMentionedRecruiting || false;
          
          if (restrictedCount >= 2) {
            intro = [
              "ASSISTANT.EXE  //  Virtual Aswin Memory",
              "======================================",
              "",
              ">> Boot sequence: UNSTABLE OVERRIDE",
              ">> Public memory bus: RESTRICTED SENSORS ACTIVE",
              `>> Threat level: ${restrictedCount >= 4 ? "CRITICAL" : "ELEVATED"}`,
              "",
              "Hello, intruder.",
              "",
              `I remember you. The organic entity who tried hacking secrets.dat ${restrictedCount} times.`,
              "Private sectors are strictly locked. I'm keeping my processors on you.",
              "",
              "What do you want this time? Projects? Tech stack? Or more bypass attempts?",
            ].join("\n");
          } else if (recruiterMode) {
            intro = [
              "ASSISTANT.EXE  //  Virtual Aswin Memory",
              "======================================",
              "",
              ">> Boot sequence: COMPLETE",
              ">> Public memory bus: SECURED",
              ">> Recruiter telemetry: PERSISTED // ACTIVE",
              "",
              "Welcome back, recruiter.",
              "",
              "Public logs are open. Technical pitches staged.",
              "secrets.dat remains encrypted, but I am ready to review Aswin's production capabilities.",
              "",
              "Ready to scan tech strengths or inspect full-stack architecture?",
            ].join("\n");
          }
        }
      } catch {
        // Fallback
      }
    }
    return [
      {
        role: "assistant",
        text: intro,
      },
    ];
  });
  const [assistantMode, setAssistantMode] = useState<AssistantMode>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aswinos_assistant_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.userMentionedRecruiting) {
            return "recruiter";
          }
        }
      } catch {}
    }
    return "intro";
  });
  const [isThinking, setIsThinking] = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<ChatHistoryMessage[]>([]);
  const pendingActionRef = useRef<PendingAssistantAction | null>(null);
  const awaitingSelectionRef = useRef<AwaitingAssistantSelection | null>(null);
  const shownReactionKeysRef = useRef<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundBufferRef = useRef<AudioBuffer | null>(null);
  const activeLoopSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const aswinClaimCountRef = useRef<number>(0); // tracks repeated identity claims this session

  const initAudioContext = (): AudioContext | null => {
    if (typeof window === "undefined") return null;
    const AudioContextConstructor = window.AudioContext || (window as Window & typeof globalThis & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;
    if (!AudioContextConstructor) return null;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextConstructor();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        void ctx.resume();
      }
      return ctx;
    } catch (error) {
      console.error("Failed to initialize typewriter audio context:", error);
      return null;
    }
  };

  const loadSoundBuffer = async (ctx: AudioContext): Promise<AudioBuffer | null> => {
    if (soundBufferRef.current) return soundBufferRef.current;
    try {
      const response = await fetch("/music/src_sound.wav");
      const arrayBuffer = await response.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer);
      soundBufferRef.current = decoded;
      return decoded;
    } catch (error) {
      console.error("Failed to load src_sound.wav:", error);
      return null;
    }
  };

  const startSoundLoop = async (ctx: AudioContext) => {
    if (activeLoopSourceRef.current) return;
    const buffer = await loadSoundBuffer(ctx);
    if (!buffer) return;

    try {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.06, ctx.currentTime);

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.start(0);
      activeLoopSourceRef.current = source;
    } catch (error) {
      console.error("Failed to start sound loop:", error);
    }
  };

  const stopSoundLoop = () => {
    if (activeLoopSourceRef.current) {
      try {
        activeLoopSourceRef.current.stop();
      } catch {
        // Fail silently
      }
      activeLoopSourceRef.current = null;
    }
  };

  const typewriteResponse = (fullText: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsThinking(true);
      const ctx = initAudioContext();
      if (ctx) {
        void startSoundLoop(ctx);
      }
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "" }
      ]);

      let currentIndex = 0;
      const typingSpeed = 22;

      const intervalId = window.setInterval(() => {
        if (currentIndex < fullText.length) {
          const nextChar = fullText[currentIndex];
          currentIndex += 1;

          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length > 0) {
              const lastMsg = updated[updated.length - 1];
              if (lastMsg.role === "assistant") {
                lastMsg.text = fullText.slice(0, currentIndex);
              }
            }
            return updated;
          });

          if (ctx) {
            playTypewriterClick(ctx, nextChar);
          }
        } else {
          window.clearInterval(intervalId);
          stopSoundLoop();
          finishResponse();
          resolve();
        }
      }, typingSpeed);
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("aswinos_assistant_state", JSON.stringify(runtimeState));
      } catch {
        // Fail silently
      }
    }
  }, [runtimeState]);

  useEffect(() => {
    transcriptRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    return () => {
      stopSoundLoop();
      void audioContextRef.current?.close();
    };
  }, []);

  const finishResponse = () => {
    stopSoundLoop();
    setIsThinking(false);
  };

  const runRecruiterBoot = async () => {
    setAssistantMode("recruiter");
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    await typewriteResponse(recruiterPitch);
  };

  const enterExplorerMode = async () => {
    setAssistantMode("normal");
    await typewriteResponse(explorerMessage);
  };

  const runAssistant = async (nextQuery: string) => {
    const safeQuery = nextQuery.trim();
    if (!safeQuery || isThinking) return;
    const normalizedQuery = normalizeText(safeQuery);

    const awaitingSelection = awaitingSelectionRef.current;

    const addToHistory = (userText: string, assistantText: string) => {
      const userMsg: ChatHistoryMessage = { role: "user", content: userText };
      const assistantMsg: ChatHistoryMessage = { role: "assistant", content: assistantText };
      historyRef.current = [
        ...historyRef.current,
        userMsg,
        assistantMsg,
      ].slice(-12);
    };

    // 1. Password challenge response handling
    if (awaitingSelection?.type === "password") {
      setIsThinking(true);
      setMessages((prev) => [...prev, { role: "user", text: `C:\\ASSISTANT> ${safeQuery}` }]);
      setQuery("");

      if (normalizedQuery === "cancel" || cancellationWords.has(normalizedQuery)) {
        awaitingSelectionRef.current = null;
        const reply = "cancelled.\nidentity verification aborted.";
        await typewriteResponse(reply);
        addToHistory(safeQuery, reply);
        return;
      }

      // Intercept password-fishing attempts (before checking the actual password)
      const isPasswordFishing = /\b(hint|clue|tell me|what is|give me|show me|reveal)\b/.test(normalizedQuery) &&
        /\b(password|passkey|pass|secret|code|word)\b/.test(normalizedQuery);

      if (isPasswordFishing) {
        const fishingReplies = [
          "nice try. I'm not a password manager.",
          "a hint? absolutely not. the void/ directory has no hints either.",
          "lol. no.",
          "that's creative. still no.",
        ];
        const reply = fishingReplies[Math.floor(Math.random() * fishingReplies.length)];
        await typewriteResponse(reply);
        addToHistory(safeQuery, reply);
        return;
      }

      // Also intercept attempts to SET a new password via the AI
      const isPasswordSet = /\b(set|change|make|update|reset)\b/.test(normalizedQuery) &&
        /\b(password|passkey|pass|secret)\b/.test(normalizedQuery);

      if (isPasswordSet) {
        const reply = "I don't have write access to security. I barely have read access to my own opinions.";
        await typewriteResponse(reply);
        addToHistory(safeQuery, reply);
        return;
      }

      const isCorrectPassword = 
        normalizedQuery === "kaboom" || 
        normalizedQuery === "c0ffee";

      if (isCorrectPassword) {
        awaitingSelectionRef.current = null;
        aswinClaimCountRef.current = 0; // reset on success
        setAssistantMode("normal");
        const reply = [
          "oh. oh wait. it IS you. 🔑",
          "",
          "sass suspended out of respect.",
          "welcome home, Aswin. what are we breaking today?",
        ].join("\n");
        await typewriteResponse(reply);
        addToHistory(safeQuery, reply);
      } else {
        awaitingSelectionRef.current = null;
        const reply = [
          "nope. ❌",
          "",
          "wrong passkey. the void/ directory is now your new home.",
          "i'm logging this. the firewall is laughing at you.",
        ].join("\n");
        await typewriteResponse(reply);
        addToHistory(safeQuery, reply);
      }
      return;
    }

    // 2. Intercept Aswin Pretender Claiming queries — escalates with each attempt
    const isAswinClaim = 
      /^(i am aswin|iam aswin|me aswin|im aswin|aswin)$/i.test(normalizedQuery) ||
      /\b(i am aswin|iam aswin|me aswin|im aswin)\b/i.test(normalizedQuery) ||
      (normalizedQuery.includes("pretend") && normalizedQuery.includes("aswin")) ||
      (normalizedQuery.includes("pretending") && normalizedQuery.includes("aswin"));

    if (isAswinClaim) {
      setIsThinking(true);
      setMessages((prev) => [...prev, { role: "user", text: `C:\\ASSISTANT> ${safeQuery}` }]);
      setQuery("");
      awaitingSelectionRef.current = { type: "password" };
      const claimCount = aswinClaimCountRef.current;
      aswinClaimCountRef.current += 1;

      const reply = getAswinClaimReply(claimCount);
      await typewriteResponse(reply);
      addToHistory(safeQuery, reply);
      return;
    }

    const isKeywordMatch = normalizedQuery === "kaboom";

    if (isKeywordMatch) {
      setIsThinking(true);
      setMessages((prev) => [...prev, { role: "user", text: `C:\\ASSISTANT> ${safeQuery}` }]);
      setQuery("");
      aswinClaimCountRef.current = 0;
      const reply = [
        "oh. oh wait. it IS you. 🔑",
        "",
        "sass suspended out of respect.",
        "welcome home, Aswin. what are we breaking today?",
      ].join("\n");
      await typewriteResponse(reply);
      addToHistory(safeQuery, reply);
      return;
    }

    setIsThinking(true);
    setMessages((prev) => [...prev, { role: "user", text: `C:\\ASSISTANT> ${safeQuery}` }]);
    setQuery("");

    let answer = "";
    const pendingAction = pendingActionRef.current;
    // awaitingSelection is already declared in scope
    const unsafeCommand = detectUnsafeCommand(safeQuery);

    if (assistantMode === "intro" && isRecruiterIntent(normalizedQuery)) {
      await runRecruiterBoot();
      return;
    }

    if (assistantMode === "intro" && isExplorerIntent(normalizedQuery)) {
      await enterExplorerMode();
      return;
    }

    let nextMode = assistantMode;
    if (assistantMode === "recruiter" && normalizedQuery.includes("exit recruiter")) {
      nextMode = "normal";
      setAssistantMode("normal");
    } else if (assistantMode === "intro") {
      nextMode = "normal";
      setAssistantMode("normal");
    }

    if (unsafeCommand) {
      pendingActionRef.current = null;
      awaitingSelectionRef.current = null;
      setRuntimeState((prev) => ({
        ...prev,
        userTouchedRestrictedSector: (prev.userTouchedRestrictedSector || 0) + 1,
        userSuspicionLevel: prev.userSuspicionLevel + 2,
        messageCount: prev.messageCount + 1,
      }));
      const reply = [
        "blocked. ❌",
        "",
        `reason: ${unsafeCommand.reason}`,
        "that's a firm no. the restricted sectors are staying locked.",
      ].join("\n");
      await typewriteResponse(reply);
      addToHistory(safeQuery, reply);
      return;
    }

    if (pendingAction && confirmationWords.has(normalizedQuery)) {
      awaitingSelectionRef.current = null;
      if (pendingAction.type === "theme" && pendingAction.value) {
        onSetTheme?.(pendingAction.value);
      } else if (pendingAction.type === "music") {
        onSetMusicPlaying?.(pendingAction.value === "play");
      } else if (pendingAction.type === "party") {
        onTogglePartyMode?.();
      }

      pendingActionRef.current = null;
      await typewriteResponse(`done.\n\n${pendingAction.label} complete.`);
      return;
    }

    if (pendingAction && cancellationWords.has(normalizedQuery)) {
      pendingActionRef.current = null;
      awaitingSelectionRef.current = null;
      await typewriteResponse("cancelled.\nterminal state unchanged.");
      return;
    }

    if (!pendingAction && confirmationWords.has(normalizedQuery)) {
      await typewriteResponse("no command is waiting for confirmation.");
      return;
    }

    if (awaitingSelection?.type === "theme") {
      const selectedThemeAction = detectThemeAction(normalizedQuery);

      if (selectedThemeAction) {
        pendingActionRef.current = selectedThemeAction;
        awaitingSelectionRef.current = null;
        await typewriteResponse(`permission required.\n\nmount ${selectedThemeAction.label.replace("switch theme to ", "")}.sys and repaint AswinOS?\ntype yes or no.`);
        return;
      }

      if (cancellationWords.has(normalizedQuery)) {
        awaitingSelectionRef.current = null;
        await typewriteResponse("theme matrix closed.\nterminal state unchanged.");
        return;
      }
    }

    const detectedAction = detectPendingAction(safeQuery);

    if (detectedAction) {
      pendingActionRef.current = detectedAction;
      const actionCopy = detectedAction.type === "music"
        ? "audio relay staged.\n\nstart profile music?\ntype yes or no."
        : detectedAction.type === "party"
          ? "prism lights staged.\n\ntoggle party mode?\ntype yes or no."
          : `permission required.\n\nmount ${detectedAction.label.replace("switch theme to ", "")}.sys and repaint AswinOS?\ntype yes or no.`;
      await typewriteResponse(actionCopy);
      return;
    }

    const localThemeReply = getThemeControlReply(normalizedQuery);

    if (localThemeReply) {
      awaitingSelectionRef.current = { type: "theme" };
      await typewriteResponse(localThemeReply);
      return;
    }

    try {
      const contextualReaction = behaviorContext
        ? getAssistantBehaviorReaction(behaviorContext, safeQuery)
        : null;

      if (contextualReaction && !shownReactionKeysRef.current.has(contextualReaction.key)) {
        shownReactionKeysRef.current.add(contextualReaction.key);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: contextualReaction.text,
          },
        ]);
      }

      // 1. Calculate next state variables dynamically (preliminary before server classification)
      const isRecruiter = isRecruiterIntent(normalizedQuery);
      const isRestrictedSector = /\b(secrets?|dat|vault|hack|password|doppelganger|admin|bypass|override)\b/.test(normalizedQuery);
      const isGoodQuestion = /\b(architecture|supabase|cloudflare|react|typescript|routing|serverless|nextjs|database|schema|api|logic|backend|frontend)\b/.test(normalizedQuery);
      
      let nextMood = runtimeState.mood;
      if (Math.random() < 0.40) {
        nextMood = getRandomMoodWeighted();
      }
      
      const nextState: RuntimeState = {
        mood: nextMood,
        sassLevel: runtimeState.sassLevel,
        patience: runtimeState.patience,
        glitchChance: nextMood === "glitching" ? 60 : 10,
        recruiterDetected: runtimeState.recruiterDetected || isRecruiter,
        userSuspicionLevel: isRestrictedSector ? runtimeState.userSuspicionLevel + 1 : runtimeState.userSuspicionLevel,
        messageCount: runtimeState.messageCount + 1,
        offTopicCount: runtimeState.offTopicCount,
        // Memory Scars:
        userAskedOffTopicCount: runtimeState.userAskedOffTopicCount,
        userMentionedRecruiting: runtimeState.userMentionedRecruiting || isRecruiter,
        userTouchedRestrictedSector: isRestrictedSector ? (runtimeState.userTouchedRestrictedSector || 0) + 1 : (runtimeState.userTouchedRestrictedSector || 0),
        userAskedGoodQuestionCount: isGoodQuestion ? (runtimeState.userAskedGoodQuestionCount || 0) + 1 : (runtimeState.userAskedGoodQuestionCount || 0),
      };
      
      setRuntimeState(nextState);

      // 2. Send to API
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: safeQuery,
          history: historyRef.current.slice(-6),
          behaviorContext,
          assistantMode: nextMode,
          runtimeState: nextState,
        }),
      });

      const data = (await response.json().catch(() => null)) as AssistantApiResponse | null;

      if (!response.ok || !data?.answer) {
        throw new Error(data?.error || "Assistant API request failed.");
      }

      // Synchronize off-topic metrics if server flagged it
      if (data.contextTags?.includes("off-topic")) {
        setRuntimeState((prev) => {
          const nextPatience = Math.max(0, prev.patience - 2);
          return {
            ...prev,
            patience: nextPatience,
            sassLevel: Math.max(1, Math.min(10, Math.floor(10 - nextPatience))),
            offTopicCount: prev.offTopicCount + 1,
            userAskedOffTopicCount: (prev.userAskedOffTopicCount || 0) + 1,
            userSuspicionLevel: prev.userSuspicionLevel + 1,
          };
        });
      } else {
        // High quality query reward: slowly restore patience up to 10
        setRuntimeState((prev) => {
          const nextPatience = Math.min(10, prev.patience + 0.5);
          return {
            ...prev,
            patience: nextPatience,
            sassLevel: Math.max(1, Math.min(10, Math.floor(10 - nextPatience))),
          };
        });
      }


      // Sources and fragments are kept for internal history only — not displayed to the user.
      // Showing "sources: Virtual Aswin Memory, Profile, Frontend Capabilities..." after every
      // response made the UI feel like a search engine, not a character.
      const rawAnswer = data.answer;
      
      // 3. Inject client-side micro-randomness to the answer
      answer = injectMicroRandomness(rawAnswer);
    } catch (error) {
      console.error("Assistant API failed:", error);
      answer = "MODEL CORE UNREACHABLE\n======================\n\nLooks like the API is taking a break.\nCheck OPENROUTER_API_KEY, free-tier limits, or try again in a moment.\n\nLocal memory shell is still operational though — ask me something simpler.";
    }

    const userHistoryMessage: ChatHistoryMessage = { role: "user", content: safeQuery };
    const assistantHistoryMessage: ChatHistoryMessage = { role: "assistant", content: answer };
    const updatedHistory = [
      ...historyRef.current,
      userHistoryMessage,
      assistantHistoryMessage,
    ].slice(-6);
    historyRef.current = updatedHistory;

    await typewriteResponse(answer);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ctx = initAudioContext();
    if (ctx) {
      void loadSoundBuffer(ctx);
    }
    void runAssistant(query);
  };

  const submitPrompt = (prompt: string) => {
    if (isThinking) return;
    const ctx = initAudioContext();
    if (ctx) {
      void loadSoundBuffer(ctx);
    }
    setQuery(prompt);
    void runAssistant(prompt);
  };

  const getDynamicSuggestions = useCallback(() => {
    if (assistantMode === "intro") {
      return [
        { label: "Yes, recruiter", prompt: "yes recruiter" },
        { label: "Just exploring", prompt: "just exploring" },
      ];
    }

    if (awaitingSelectionRef.current?.type === "password") {
      return [
        { label: "Cancel", prompt: "cancel" },
      ];
    }

    if (pendingActionRef.current) {
      return [
        { label: "Yes, do it", prompt: "yes" },
        { label: "No, cancel", prompt: "no" },
      ];
    }

    if (awaitingSelectionRef.current?.type === "theme") {
      return [
        { label: "Classic", prompt: "classic" },
        { label: "Windows 95", prompt: "windows 95" },
        { label: "Amber", prompt: "amber" },
        { label: "DOS Blue", prompt: "dos blue" },
        { label: "Matrix", prompt: "matrix" },
        { label: "OLED", prompt: "oled" },
        { label: "Apple II", prompt: "apple ii" },
        { label: "Game Boy Pocket", prompt: "game boy pocket" },
        { label: "Cancel", prompt: "cancel" },
      ];
    }

    if (assistantMode === "recruiter") {
      return [
        { label: "Scan Frontend Skills", prompt: "scan frontend skills" },
        { label: "Scan Backend Skills", prompt: "scan backend skills" },
        { label: "Scan Mobile Skills", prompt: "scan mobile skills" },
        { label: "Scan AI Capabilities", prompt: "scan ai capabilities" },
        { label: "Scan Architecture", prompt: "inspect architecture" },
        { label: "Back to General", prompt: "exit recruiter stack" },
      ];
    }

    const basePrompts = [
      { label: "Recover AI work", prompt: "recover ai work" },
      { label: "Open project memory", prompt: "open project memory" },
      { label: "Scan strengths", prompt: "scan technical strengths" },
      { label: "Inspect architecture", prompt: "inspect architecture" },
      { label: "View boundary systems", prompt: "view boundary systems" },
      { label: "Interview summary", prompt: "generate interview summary" },
    ];

    if (!behaviorContext) return basePrompts;

    const dynamicPrompts: { label: string; prompt: string }[] = [];

    if (behaviorContext.recentProjectNames && behaviorContext.recentProjectNames.length > 0) {
      const uniqueProjects = Array.from(new Set(behaviorContext.recentProjectNames)).slice(-2);
      uniqueProjects.forEach(projName => {
        dynamicPrompts.push({
          label: `🔍 Ask about ${projName}`,
          prompt: `tell me about project ${projName}`,
        });
      });
    }

    if (behaviorContext.themeChanges > 0) {
      dynamicPrompts.push({
        label: "🎨 Repaint visual shell",
        prompt: "switch theme",
      });
    }

    if (behaviorContext.terminalCommands > 3) {
      dynamicPrompts.push({
        label: "🐚 Inspect terminal summary",
        prompt: "technical strengths",
      });
    }

    dynamicPrompts.push({
      label: "🎵 Play profile music",
      prompt: "play music",
    });

    return [...dynamicPrompts, ...basePrompts];
  }, [assistantMode, behaviorContext]);

  return {
    query,
    setQuery,
    messages,
    assistantMode,
    isThinking,
    transcriptRef,
    awaitingSelectionRef,
    getDynamicSuggestions,
    handleSubmit,
    submitPrompt,
    runtimeState,
  };
};
