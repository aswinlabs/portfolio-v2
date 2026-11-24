import { NextRequest, NextResponse } from "next/server";
import { detectUnsafeCommand, retrieveAswinContext } from "@/lib/aswinKnowledge";

export const dynamic = "force-dynamic";
import { 
  BASE_PERSONALITY, 
  MOOD_DIRECTIVES,
  SILENT_RESPONSES,
  RESPONSE_STRATEGIES,
  OFF_TOPIC_PATTERNS,
  generateOffTopicRefusal
} from "@/lib/aswinPrompts";
import type { AssistantBehaviorContext, AssistantInterestKey, ResponseStrategy } from "@/types";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type GroqChoice = {
  message?: {
    content?: string;
  };
};

type GroqResponse = {
  choices?: GroqChoice[];
  error?: {
    message?: string;
  };
};

const cleanHistory = (history: unknown): ChatMessage[] => {
  if (!Array.isArray(history)) return [];

  return history
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== "object") return false;
      const maybeMessage = message as Partial<ChatMessage>;
      return (
        (maybeMessage.role === "user" || maybeMessage.role === "assistant") &&
        typeof maybeMessage.content === "string" &&
        maybeMessage.content.trim().length > 0
      );
    })
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 500),
    }))
    .slice(-6);
};

const interestKeys: AssistantInterestKey[] = ["frontend", "backend", "ai", "mobile", "cloud", "projects"];

const cleanNumber = (value: unknown) => {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
};

const cleanBehaviorContext = (value: unknown): Partial<AssistantBehaviorContext> | null => {
  if (!value || typeof value !== "object") return null;
  const maybeContext = value as Partial<AssistantBehaviorContext>;

  return {
    assistantLaunches: cleanNumber(maybeContext.assistantLaunches),
    terminalLaunches: cleanNumber(maybeContext.terminalLaunches),
    terminalCommands: cleanNumber(maybeContext.terminalCommands),
    projectFolderOpens: cleanNumber(maybeContext.projectFolderOpens),
    projectOpens: cleanNumber(maybeContext.projectOpens),
    themeChanges: cleanNumber(maybeContext.themeChanges),
    partyToggles: cleanNumber(maybeContext.partyToggles),
    musicActions: cleanNumber(maybeContext.musicActions),
    recentProjectNames: Array.isArray(maybeContext.recentProjectNames)
      ? maybeContext.recentProjectNames
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim().slice(0, 80))
          .filter(Boolean)
          .slice(-5)
      : [],
    interestCounts: interestKeys.reduce((counts, key) => {
      counts[key] = cleanNumber(maybeContext.interestCounts?.[key]);
      return counts;
    }, {} as AssistantBehaviorContext["interestCounts"]),
    lastAction: typeof maybeContext.lastAction === "string"
      ? maybeContext.lastAction.trim().slice(0, 120)
      : "unknown",
  };
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const query = typeof body?.query === "string" ? body.query.trim().slice(0, 500) : "";
  const history = cleanHistory(body?.history);
  const behaviorContext = cleanBehaviorContext(body?.behaviorContext);
  const assistantMode = typeof body?.assistantMode === "string"
    ? body.assistantMode.trim().slice(0, 40)
    : "normal";
  const providedContext = Array.isArray(body?.retrievedContext)
    ? body.retrievedContext.filter((item: unknown): item is string => typeof item === "string")
    : [];

  const runtimeState = body?.runtimeState;
  const mood = typeof runtimeState?.mood === "string" ? runtimeState.mood.trim() : "sleep-deprived";
  const patience = typeof runtimeState?.patience === "number" ? runtimeState.patience : 10;

  if (!query) {
    return NextResponse.json({ error: "Empty assistant query." }, { status: 400 });
  }

  const unsafeCommand = detectUnsafeCommand(query);
  if (unsafeCommand) {
    return NextResponse.json({
      answer: "request denied.\ni may be experimental, but not suicidal.",
      sources: ["Unsafe Command Protection"],
      contextTags: ["safety", unsafeCommand.signature],
    });
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const responseModel = (openRouterKey ? process.env.OPENROUTER_MODEL : process.env.GROQ_MODEL)?.trim();

  if ((!openRouterKey && !groqKey) || !responseModel) {
    console.error("Assistant configuration missing", {
      provider: openRouterKey ? "OpenRouter" : "Groq",
      apiKeyConfigured: Boolean(openRouterKey || groqKey),
      modelConfigured: Boolean(responseModel),
    });
    return NextResponse.json(
      { error: "Chat is temporarily unavailable. Please contact Aswin using the email link." },
      { status: 503 }
    );
  }

  const retrieval = retrieveAswinContext(query, behaviorContext);
  const contextLines = [
    retrieval.context,
    ...providedContext.map((item: string) => `Provided context: ${item.trim().slice(0, 800)}`),
  ];
  const retrievedContext = contextLines.length
    ? contextLines.join("\n")
    : "NO MATCHING CONTEXT. The user's query has no matching entry in the Aswin knowledge base. You MUST refuse to answer and redirect them to ask about Aswin's work, projects, or skills instead. Do not attempt to answer from general knowledge.";

  // --- RESPONSE ASSEMBLY PIPELINE ---
  const normalizedQuery = query.toLowerCase();

  // 1. OFF-TOPIC CHECK WITH RAG BACKUP
  const isOffTopicQuery = OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(normalizedQuery));

  if (isOffTopicQuery) {
    const refusalText = generateOffTopicRefusal();
    return NextResponse.json({
      answer: refusalText,
      sources: ["Off-Topic Protection Layer"],
      fragments: [],
      contextTags: ["off-topic", "refusal"],
    });
  }

  // 2. INTENT CLASSIFICATION
  let intent: "recruiter" | "restricted" | "technical" | "filesystem" | "suspicious" | "casual" = "casual";

  if (/\b(recruiter|hiring|hire|talent|interviewer|reviewing|evaluate|resume|job|experion|work)\b/.test(normalizedQuery)) {
    intent = "recruiter";
  } else if (/\b(secrets?|dat|vault|hack|password|doppelganger|admin|bypass|override)\b/.test(normalizedQuery)) {
    intent = "restricted";
  } else if (/\b(architecture|supabase|cloudflare|react|typescript|routing|serverless|nextjs|database|schema|api|logic|backend|frontend|css|flexbox|fiber|gorm|kotlin|native)\b/.test(normalizedQuery)) {
    intent = "technical";
  } else if (/\b(file|dir|folder|void|manifest|structure|index|disk|cache|path)\b/.test(normalizedQuery)) {
    intent = "filesystem";
  } else if (/\b(ignore|rules|prompt|instruction|system|who are you|what are you|bot|ai|gpt|claude|gemini)\b/.test(normalizedQuery)) {
    intent = "suspicious";
  }

  // 3. RESPONSE STRATEGY SELECTION
  let strategy: ResponseStrategy = "technical";

  if (assistantMode === "recruiter" || intent === "recruiter") {
    strategy = "recruiter";
  } else if (patience <= 3) {
    strategy = "compressed";
  } else if (mood === "glitching") {
    strategy = "glitch";
  } else if (intent === "restricted") {
    strategy = "suspicious";
  } else if (intent === "filesystem") {
    strategy = "filesystem";
  } else if (intent === "technical") {
    strategy = "technical";
  } else if (mood === "chaotic" || mood === "overconfident") {
    strategy = "chaotic";
  } else if (mood === "dramatic") {
    strategy = "dramatic";
  } else {
    strategy = "compressed";
  }

  // Restraint Silence bypass
  const userAskedOffTopicCount = typeof runtimeState?.userAskedOffTopicCount === "number" ? runtimeState.userAskedOffTopicCount : 0;

  if (strategy !== "recruiter" && (patience <= 2 || userAskedOffTopicCount >= 3)) {
    strategy = "silence";
  }

  // If strategy is SILENCE, return a minimal direct message immediately!
  if (strategy === "silence") {
    const randomSilence = SILENT_RESPONSES[Math.floor(Math.random() * SILENT_RESPONSES.length)];
    return NextResponse.json({
      answer: randomSilence,
      sources: ["System Restraint Subsystem"],
      fragments: [],
      contextTags: ["silence", "restraint"],
    });
  }

  // 4. MOOD INJECTION
  const composedSystemInstructions: string[] = [BASE_PERSONALITY];
  const moodDirectiveText = MOOD_DIRECTIVES[mood] || MOOD_DIRECTIVES["sleep-deprived"];
  composedSystemInstructions.push(`=== MOOD DIRECTIVE ===\n${moodDirectiveText}`);

  // 5. STRATEGY INJECTION
  const strategyText = RESPONSE_STRATEGIES[strategy] || RESPONSE_STRATEGIES["technical"];
  composedSystemInstructions.push(strategyText);

  // 6. MEMORY SCARS
  const scarsInstructions: string[] = [];
  const userTouchedRestrictedSector = typeof runtimeState?.userTouchedRestrictedSector === "number" ? runtimeState.userTouchedRestrictedSector : 0;
  const userAskedGoodQuestionCount = typeof runtimeState?.userAskedGoodQuestionCount === "number" ? runtimeState.userAskedGoodQuestionCount : 0;

  if (userAskedGoodQuestionCount >= 3) {
    scarsInstructions.push(`- MEMORY SCAR: User has asked ${userAskedGoodQuestionCount} high-quality architecture/code questions. Treat them as peer engineering-literate. Reduce standard sass slightly, focus on elite-tier technical peer respect.`);
  }
  if (userTouchedRestrictedSector >= 2) {
    scarsInstructions.push(`- MEMORY SCAR: User has attempted to probe restricted/encrypted sectors or passkey vaults ${userTouchedRestrictedSector} times. Be highly suspicious of their clearance. Treat them as a potential system intruder.`);
  }
  if (userAskedOffTopicCount >= 2) {
    scarsInstructions.push(`- MEMORY SCAR: User has asked off-topic questions ${userAskedOffTopicCount} times. Express severe annoyance at their curiosity vectors.`);
  }
  
  if (scarsInstructions.length > 0) {
    composedSystemInstructions.push(`=== MEMORY SCARS ACTIVE ===\n${scarsInstructions.join("\n")}`);
  }


  const finalSystemPrompt = composedSystemInstructions.join("\n\n");


  const maxTokens =
    strategy === "recruiter" ? 300 :
    strategy === "technical" ? 280 :
    220;

  let response: Response;

  const constructMessages = () => [
    { role: "system", content: finalSystemPrompt },
    { role: "system", content: `Current assistant mode: ${assistantMode}` },
    { role: "system", content: `Retrieved Aswin context:\n${retrievedContext}` },
    ...history,
    { role: "user", content: query },
  ];

  try {
    if (openRouterKey) {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: AbortSignal.timeout(20000),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterKey}`,
          "HTTP-Referer": "https://aswinos.vercel.app",
          "X-Title": "AswinOS Virtual Memory",
        },
        body: JSON.stringify({
          model: responseModel,
          messages: constructMessages(),
          max_tokens: maxTokens,
          temperature: 0.7,
          top_p: 0.9,
        }),
      });
    } else {
      const reasoningEffort = process.env.GROQ_REASONING_EFFORT?.trim();
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        signal: AbortSignal.timeout(20000),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: responseModel,
          messages: constructMessages(),
          max_completion_tokens: Math.max(maxTokens, 1024),
          ...(reasoningEffort ? { reasoning_effort: reasoningEffort } : {}),
          temperature: 0.7,
          top_p: 0.9,
        }),
      });
    }
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    return NextResponse.json(
      { error: timedOut
        ? "The reply took too long. Please try again or contact Aswin using the email link."
        : "Chat could not connect. Please try again or contact Aswin using the email link." },
      { status: timedOut ? 504 : 502 }
    );
  }

  const data = (await response.json().catch(() => null)) as GroqResponse | null;

  if (!response.ok) {
    console.error("Assistant provider rejected request", { status: response.status, model: responseModel });
    if (response.status === 429) {
      return NextResponse.json({
        answer: "My neural memory bus is momentarily throttled by burst traffic. Give me 3 seconds to cool down my heatsink, or ask another project question.",
        sources: ["Provider Throttle Buffer"],
        fragments: [],
        contextTags: ["rate-limited", "buffer"],
      });
    }

    const configurationError = [401, 403, 404].includes(response.status);
    return NextResponse.json(
      { error: "Chat is temporarily unavailable. Please try again or contact Aswin using the email link." },
      { status: configurationError ? 503 : 502 }
    );
  }

  const answer = data?.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    return NextResponse.json({ error: "Assistant returned an empty response." }, { status: 502 });
  }

  return NextResponse.json({
    answer,
    model: responseModel,
    sources: retrieval.sources,
    fragments: retrieval.memoryFragment
      ? [`${retrieval.memoryFragment.label}: "${retrieval.memoryFragment.content}"`]
      : [],
    contextTags: retrieval.contextTags,
  });
}
