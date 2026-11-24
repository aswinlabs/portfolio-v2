# AGENTS.md — Repository Instructions & Architecture Rules

This repository defines **AswinOS** (v2), an interactive desktop operating system portfolio built with Next.js, React, TypeScript, and an embedded conversational intelligence system (`Assistant.exe`).

## Core Engineering Principles

1. **Safety & Input Sanitization First:**
   - Any raw user query to `/api/assistant` must pass through `detectUnsafeCommand()` before tokenization.
   - Guardrails are non-negotiable: prompt injection, system file overrides (`secrets.dat`), and off-topic general trivia are intercepted deterministically.
2. **Behavioral Telemetry Integration:**
   - Client-side OS interactions (window launches, theme switches, terminal executions) are synthesized via `cleanBehaviorContext` and injected into assistant state.
3. **Resilient Provider Fallbacks:**
   - When downstream providers (Groq/OpenRouter) experience rate limiting (HTTP 429), failover gracefully with in-character throttle buffers. Never crash the UI.
4. **Retro Visual Metaphor & Aesthetic Polish:**
   - Maintain CRT scanlines, pixelated borders, and responsive desktop window management (`Assistant.tsx`).
   - Respect theme tokens defined across `src/lib/themes.ts`.
