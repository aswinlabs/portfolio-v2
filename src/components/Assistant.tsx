'use client';

import { useState, useCallback, useRef, MouseEvent } from "react";
import { AssistantBehaviorContext, Position } from "@/types";
import clsx from "clsx";
import useIsMobile from "@/hooks/useIsMobile";
import { useAssistant } from "@/hooks/useAssistant";
import { SendHorizontal } from "lucide-react";

type AssistantProps = {
  handleClose: () => void;
  onMinimize: () => void;
  onSetTheme?: (themeClassName: string) => void;
  onSetMusicPlaying?: (isPlaying: boolean) => void;
  onTogglePartyMode?: () => void;
  behaviorContext?: AssistantBehaviorContext;
  zIndex?: number;
  onFocus?: () => void;
};

const isSystemMessage = (value: string) => {
  return /request denied|unsafe command|recovered|contextual reaction|permission required|private vault|recruiter signal|explorer mode/i.test(value);
};

const getDisplayMessage = (text: string, role: string) => {
  if (role !== "user") return text;
  return text.replace(/^C:\\ASSISTANT>\s*/i, "");
};

const Assistant = ({
  handleClose,
  onMinimize,
  onSetTheme,
  onSetMusicPlaying,
  onTogglePartyMode,
  behaviorContext,
  zIndex,
  onFocus,
}: AssistantProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 140, y: 120 });
  const isMobile = useIsMobile();
  const offset = useRef<Position>({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement | null>(null);

  const {
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
  } = useAssistant({
    onSetTheme,
    onSetMusicPlaying,
    onTogglePartyMode,
    behaviorContext,
  });

  const { mood } = runtimeState;

  const handleMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return;

    offset.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };

    const handleMouseMove = (moveEvent: { clientX: number; clientY: number }) => {
      setPosition({
        x: moveEvent.clientX - offset.current.x,
        y: moveEvent.clientY - offset.current.y,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [isMaximized, position]);

  const setMaximise = useCallback(() => {
    setIsMaximized(true);
  }, []);

  const handleMinimize = () => {
    setIsMaximized(false);
    onMinimize?.();
  };

  const modeEmoji = assistantMode === "recruiter" ? "📡" : assistantMode === "intro" ? "🤖" : "💾";
  const modeLabel = assistantMode === "recruiter" ? "RECRUITER MODE" : assistantMode === "intro" ? "IDENTIFYING..." : "MEMORY ACTIVE";

  const moodEmoji = {
    "sleep-deprived": "😴",
    overconfident: "😎",
    glitching: "👾",
    dramatic: "🎭",
    professional: "👔",
    chaotic: "🌀",
  }[mood] || "🤖";

  const displayLabel = `${modeLabel} [${moodEmoji} ${mood.toUpperCase()}]`;

  return (
    <div
      ref={dragRef}
      onMouseDown={onFocus}
      className={clsx(
        "fixed shadow-2xl pixelated border-2 select-none flex flex-col transition-shadow duration-300 text-xl",
        {
          "top-0 left-0 w-full h-[calc(100dvh-48px)]": isMaximized || isMobile,
          "w-[min(680px,calc(100vw-24px))] h-[min(520px,calc(100dvh-72px))]": !isMaximized && !isMobile
        }
      )}
      style={{
        ...(!isMaximized && !isMobile ? { top: position.y, left: position.x } : {}),
        backgroundColor: "var(--assistant-window-bg)",
        color: "var(--assistant-panel-text)",
        borderColor: "var(--assistant-border)",
        zIndex: zIndex,
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="cursor-move px-3 py-2 flex justify-between items-center border-b select-none gap-2"
        style={{
          backgroundColor: "var(--assistant-accent)",
          color: "var(--assistant-accent-text)",
          borderColor: "var(--assistant-border)",
        }}
      >
        <div className="text-xs sm:text-sm font-bold tracking-wider flex items-center gap-1.5 flex-1 min-w-0">
          <span
            className={clsx(
              "w-2 h-2 shrink-0 rounded-full",
              isThinking ? "assistant-status-thinking" : "assistant-status-online"
            )}
          />
          <span className="truncate text-sm sm:text-base">ASSISTANT.EXE</span>
          <span className="hidden xs:inline opacity-30">|</span>
          <span className={clsx(
            "text-[10px] uppercase font-semibold px-1.5 py-0.5 border border-current/25 bg-black/10 truncate",
            {
              "border-red-500/50 text-red-400 animate-pulse": mood === "glitching" || mood === "chaotic",
              "border-amber-500/50 text-amber-400": mood === "sleep-deprived",
              "border-blue-500/50 text-blue-400": mood === "dramatic",
              "border-green-500/50 text-green-400": mood === "overconfident",
            }
          )}>
            {modeEmoji} {displayLabel}
          </span>
          {isThinking && (
            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-current/20 border border-current/30 animate-pulse shrink-0">
              PROCESSING...
            </span>
          )}
        </div>
        <div className="flex space-x-2 shrink-0">
          <button
            onClick={handleClose}
            className="w-4 h-4 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-xs select-none cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
          <button
            onClick={handleMinimize}
            className="w-4 h-4 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white text-xs select-none cursor-pointer"
            aria-label="Minimize"
          >
            -
          </button>
          {!isMaximized && (
            <button
              onClick={setMaximise}
              className="w-4 h-4 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white text-xs select-none cursor-pointer"
              aria-label="Maximize"
            >
              □
            </button>
          )}
        </div>
      </div>

      <div className="relative flex h-[calc(100%-40px)] flex-col gap-3 overflow-hidden p-3 sm:p-4">
        {/* Themed CRT Scanline Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "linear-gradient(color-mix(in srgb, var(--assistant-accent) 70%, transparent) 1px, transparent 1px)",
            backgroundSize: "100% 6px",
          }}
          aria-hidden="true"
        />

        {/* Message area */}
        <div
          className="relative min-h-0 flex-1 border p-3 pr-1 shadow-inner"
          style={{
            borderColor: "var(--assistant-border)",
            backgroundColor: "var(--assistant-panel-bg)"
          }}
        >
          <div className="assistant-scrollbar h-full overflow-y-auto pr-3">
            {messages.map((message, index) => {
              const system = message.role === "assistant" && isSystemMessage(message.text);
              const displayText = getDisplayMessage(message.text, message.role);
              const isLast = index === messages.length - 1;

              if (system) {
                return (
                  <div
                    key={`${message.role}-${index}`}
                    className="mb-3 w-full assistant-msg-system px-3 py-2.5 leading-6 whitespace-pre-wrap shadow-sm assistant-msg-fadein"
                  >
                    {displayText}
                  </div>
                );
              }

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={clsx(
                    "mb-3 flex assistant-msg-fadein",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <span
                      className="mr-2 mt-1 text-[10px] shrink-0 font-mono opacity-60 select-none"
                      style={{ color: "var(--assistant-accent)" }}
                      aria-hidden="true"
                    >
                      AI&gt;
                    </span>
                  )}
                  <div
                    className={clsx(
                      "max-w-[min(85%,46rem)] px-3 py-2 leading-6 whitespace-pre-wrap shadow-sm",
                      message.role === "user"
                        ? "assistant-msg-user"
                        : "assistant-msg-assistant",
                      isLast && isThinking && message.role === "assistant"
                        ? "assistant-msg-typing"
                        : ""
                    )}
                  >
                    {displayText}
                    {isLast && isThinking && message.role === "assistant" && (
                      <span className="assistant-cursor" aria-hidden="true">▋</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Cognitive load bar while thinking */}
            {isThinking && (
              <div className="mb-2 px-1">
                <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1" style={{ color: "var(--assistant-accent)" }}>
                  cognitive load...
                </div>
                <div
                  className="h-[2px] w-full overflow-hidden"
                  style={{ backgroundColor: "color-mix(in srgb, var(--assistant-accent) 20%, transparent)" }}
                >
                  <div className="assistant-thinking-bar h-full" style={{ backgroundColor: "var(--assistant-accent)" }} />
                </div>
              </div>
            )}

            <div ref={transcriptRef} />
          </div>
        </div>

        {/* Quick Suggestion Scrolling Chips */}
        <div className="flex flex-col gap-1 select-none">
          <div className="flex items-center justify-between px-1 text-[9px] uppercase font-bold tracking-wider opacity-60" style={{ color: "var(--assistant-panel-text)" }}>
            <span>⚡ Quick Commands</span>
            {assistantMode === "intro" && <span className="animate-pulse">◉ AWAITING IDENTIFICATION</span>}
            {assistantMode === "recruiter" && <span style={{ color: "var(--assistant-accent)" }}>◉ RECRUITER STACK ACTIVE</span>}
            {assistantMode === "normal" && !isThinking && <span>◉ MEMORY ONLINE</span>}
            {isThinking && <span className="animate-pulse" style={{ color: "var(--assistant-accent)" }}>◉ PROCESSING QUERY...</span>}
            {awaitingSelectionRef.current?.type === "theme" && <span className="text-amber-500">◉ AWAITING THEME SELECTION</span>}
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hidden pb-1 px-0.5">
            {getDynamicSuggestions().map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={isThinking}
                onClick={() => submitPrompt(item.prompt)}
                className={clsx(
                  "min-h-8 px-3.5 py-1 text-xs font-semibold whitespace-nowrap shadow-sm active:scale-95 transition-transform cursor-pointer",
                  item.prompt === "yes" || item.prompt === "yes recruiter"
                    ? "assistant-btn-primary"
                    : item.prompt === "no" || item.prompt === "just exploring"
                      ? "assistant-btn-secondary"
                      : assistantMode === "recruiter" && item.prompt.startsWith("scan")
                        ? "assistant-quick-prompt border-[var(--assistant-accent)] font-bold text-[color:var(--assistant-accent)]"
                        : "assistant-quick-prompt"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border px-3 py-1.5 shadow-sm shrink-0"
          style={{
            borderColor: "var(--assistant-border)",
            backgroundColor: "var(--assistant-input-bg)",
          }}
        >
          <label htmlFor="assistant-query" className="sr-only">
            Ask Assistant.exe
          </label>
          <span className="shrink-0 font-bold select-none tracking-wider text-[10px]" style={{ color: "var(--assistant-accent)" }}>
            {isThinking ? "WAIT >" : "ASK >"}
          </span>
          <input
            id="assistant-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            disabled={isThinking}
            className="assistant-input min-w-0 flex-1 bg-transparent outline-none focus:outline-none"
            style={{
              color: "var(--assistant-input-text)",
              caretColor: "var(--assistant-accent)",
            }}
            placeholder={isThinking ? "processing your last query..." : "type a question or click a suggestion chip"}
            autoComplete="off"
            autoFocus
            aria-label="Assistant input"
            spellCheck="false"
          />
          <button
            type="submit"
            disabled={isThinking || !query.trim()}
            className="h-8 w-8 shrink-0 assistant-btn-primary flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send assistant query"
          >
            <SendHorizontal size={16} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
};

export { ASSISTANT_SCAN_OUTPUT } from "@/lib/aswinPrompts";
export default Assistant;
