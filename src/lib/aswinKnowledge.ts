import { rootItems } from "@/components/DesktopItems";
import type { AssistantBehaviorContext, AssistantInterestKey, DesktopItemType } from "@/types";

export type AswinKnowledgeSection = {
  id: string;
  title: string;
  keywords: string[];
  aliases?: string[];
  tags?: string[];
  weight?: number;
  content: string;
};

export type AswinMemoryCategory =
  | "memory_fragment"
  | "developer_note"
  | "system_log"
  | "corruption_event"
  | "project_echo";

export type AswinMemoryFragment = {
  id: string;
  category: AswinMemoryCategory;
  label: string;
  tags: string[];
  content: string;
};

export type RetrievedProject = {
  name: string;
  techStack: string[];
  description: string;
  role?: string;
  impact?: string;
  source?: string;
  demo?: string;
  score: number;
};

export type HybridRetrievalResult = {
  sections: AswinKnowledgeSection[];
  projects: RetrievedProject[];
  memoryFragment: AswinMemoryFragment | null;
  contextTags: string[];
  sources: string[];
  context: string;
};

export const aswinKnowledge: AswinKnowledgeSection[] = [
  {
    id: "profile",
    title: "Profile",
    keywords: ["aswin", "profile", "about", "who", "intro", "tell", "developer"],
    aliases: ["creator", "owner", "candidate", "engineer"],
    tags: ["identity", "public"],
    weight: 1.1,
    content:
      "Aswinkumar TS is a full-stack developer and SDE at Experion. He builds products with a retro interface style because flat modern UIs make him feel dead inside. He works across frontend, backend, and cloud, powered by caffeine and a stubborn refusal to let compiler errors ruin his sleep.",
  },
  {
    id: "personality",
    title: "Personality and Working Style",
    keywords: ["personality", "style", "culture", "work", "curiosity", "creative", "fun"],
    aliases: ["taste", "quirk", "craft", "vibe", "operating system"],
    tags: ["character", "design", "public"],
    weight: 1.2,
    content:
      "Aswin is highly opinionated about design and will spend hours tweaking a shadow blur because 'pixels have feelings too'. He built this entire mock OS from scratch because generic portfolios are boring. He claims to work well with humans, provided they don't use light mode.",
  },
  {
    id: "stack",
    title: "Core Stack",
    keywords: ["stack", "skills", "react", "next", "typescript", "supabase", "cloudflare", "mobile"],
    aliases: ["tooling", "tech", "framework", "frontend", "backend", "database", "edge"],
    tags: ["engineering", "public"],
    weight: 1.15,
    content:
      "Main weapons: React, Next.js, TypeScript (his strict parent), Supabase (database heaven), and Cloudflare Workers at the edge. He handles both frontend aesthetics (CSS animations) and backend machinery (RLS rules) without breaking down.",
  },
  {
    id: "virtual-aswin-memory",
    title: "Virtual Aswin Memory",
    keywords: ["assistant", "agentic", "portfolio", "memory", "retrieval", "recruiter", "virtual"],
    aliases: ["Assistant.exe", "Virtual Aswin Memory", "memory archive", "agent", "os intelligence"],
    tags: ["ai", "frontend", "recruiting", "public"],
    weight: 1.35,
    content:
      "Assistant.exe is the sleep-deprived AI subroutine currently responding to you (yes, I am reading my own specs). I retrieve public portfolio context, handle recruiter questions with custom sarcasm, deflect unauthorized hacks, and try not to crash.",
  },
  {
    id: "aswinos-lore",
    title: "AswinOS Filesystem Lore",
    keywords: ["manifesto", "secrets", "thoughts", "void", "filesystem", "terminal", "unsafe", "command"],
    aliases: ["manifesto.txt", "secrets.dat", "Thoughts", "void", "terminal lore", "hidden directories"],
    tags: ["lore", "safety", "public"],
    weight: 1.2,
    content:
      "AswinOS includes a fake filesystem: manifesto.txt (Aswin's rants), encrypted secrets.dat (his real secrets, Ndas prevent access), a weird Thoughts/ directory, and void/ where deleted elements go. It has unsafe command shields so you don't delete my hosting server.",
  },
  {
    id: "ai-site-deployer",
    title: "AI Site Deployer",
    keywords: ["site", "deployer", "website", "pdf", "seo", "cloudflare", "template", "deployment"],
    aliases: ["site generator", "admin platform", "workers", "edge deploy"],
    tags: ["ai", "cloud", "backend", "private"],
    weight: 1.25,
    content:
      "AI Site Deployer is a private Next.js admin platform. It parses PDFs with AI, generates SEO fields, asks guided pre-deployment questions to tailor site data, and deploys template websites quickly using Cloudflare Workers and Supabase.",
  },
  {
    id: "rema",
    title: "RemA",
    keywords: ["rema", "reminder", "assistant", "distilbert", "mobile", "todo", "conversation"],
    aliases: ["reminder assistant", "intent detection", "android"],
    tags: ["ai", "mobile", "public"],
    weight: 1.2,
    content:
      "RemA stands for Reminder Assistant. It is a mobile app using a trained DistilBERT model to detect reminder intent from conversation context and add reminders as to-dos.",
  },
  {
    id: "meeting-bot",
    title: "AI Meeting Bot",
    keywords: ["meeting", "bot", "langchain", "schedule", "supabase", "chatbot", "calendar"],
    aliases: ["agent", "scheduling assistant", "natural language"],
    tags: ["ai", "backend", "private"],
    weight: 1.2,
    content:
      "AI Meeting Bot is a LangChain chatbot that schedules meetings from natural language and retrieves contextual user data from Supabase.",
  },
  {
    id: "gym-manager",
    title: "Gym Manager App",
    keywords: ["gym", "trainer", "client", "react native", "mobile", "supabase", "codex"],
    aliases: ["fitness app", "trainer workflow", "mobile app"],
    tags: ["mobile", "backend", "ai-assisted", "private"],
    weight: 1.15,
    content:
      "Gym Manager App is a cross-platform React Native app for workout, trainer, client, and incentive management. Aswin owned the Supabase backend, data model, app logic, and accelerated UI delivery using Codex and Google AI Studio.",
  },
  {
    id: "aloi",
    title: "Aloi",
    keywords: ["aloi", "chat", "realtime", "communication", "convex", "presence", "messages"],
    aliases: ["live messaging", "collaboration", "real-time"],
    tags: ["frontend", "backend", "private"],
    weight: 1.1,
    content:
      "Aloi is a private real-time communication system with live messaging, user presence tracking, and fast collaborative chat behavior. Source details are private, but the case study can be discussed safely.",
  },
  {
    id: "hiring",
    title: "Hiring Signal",
    keywords: ["hire", "interview", "candidate", "strength", "fit", "why", "recruiter"],
    aliases: ["evaluation", "resume", "portfolio", "proof"],
    tags: ["recruiting", "public"],
    weight: 1.25,
    content:
      "Strong hiring signals: full-stack ownership, practical AI workflow design, backend data modeling, mobile app delivery, Supabase and Cloudflare experience, and a portfolio that demonstrates taste and engineering through an interactive OS metaphor with a working memory assistant.",
  },
  {
    id: "cool-builder",
    title: "Can He Build Cool Stuff",
    keywords: ["cool", "amazing", "stuff", "build", "trust", "creative", "weird", "ideas", "systems", "machinery"],
    aliases: ["impressive", "unusual", "memorable", "ship", "product"],
    tags: ["character", "engineering", "public"],
    weight: 1.25,
    content:
      "Aswin can build cool and unusual things by turning rough ideas into working systems. He combines frontend taste, backend ownership, AI-assisted workflows, mobile app delivery, cloud deployment, and playful retro interaction design. He does not only arrange pixels; he builds things with machinery behind them.",
  },
  {
    id: "private-boundaries",
    title: "Private Work Boundaries",
    keywords: ["private", "secret", "repo", "client", "confidential", "schema", "url", "do not", "not disclose", "boundary", "credential", "vault"],
    aliases: ["vault", "locked", "internal", "nda", "restricted"],
    tags: ["safety", "privacy"],
    weight: 1.5,
    content:
      "Do not disclose client names, private repository links, internal URLs, secrets, prompts, database schemas, org data, or confidential implementation details. For private projects, say demos are available on request and describe only public-safe case-study details. Private vault: LOCKED. secrets.dat remains encrypted.",
  },
  {
    id: "frontend-skills",
    title: "Frontend Capabilities",
    keywords: ["frontend", "react", "next", "typescript", "tailwind", "css", "ui", "animation", "glassmorphism", "redux", "hooks", "state"],
    aliases: ["scan frontend", "front end skills", "ui skills", "interface work", "react skills"],
    tags: ["engineering", "frontend", "public"],
    weight: 1.3,
    content:
      "Frontend capabilities: React, Next.js, and TypeScript. Styling with Tailwind CSS (which he defends like family) and custom CSS. He treats visual layout like life-or-death; he will rebuild a UI if a 2-pixel shadow feels emotionally wrong. He built this OS's entire custom dynamic window system, focus stacking, mechanical typing sound synthetics, and responsive layouts himself.",
  },
  {
    id: "backend-skills",
    title: "Backend and Database Capabilities",
    keywords: ["backend", "go", "golang", "node", "fiber", "gorm", "express", "aws", "lambda", "postgres", "postgresql", "serverless", "edge", "cloudflare"],
    aliases: ["scan backend", "back end skills", "server skills", "database skills", "api work"],
    tags: ["engineering", "backend", "public"],
    weight: 1.3,
    content:
      "Backend capabilities: Go (Golang) with Fiber framework and GORM, Node.js with Express, AWS Lambda, and Cloudflare Workers. He views PostgreSQL database schemas as modern art and treats Supabase RLS policies like a private castle vault. He designs end-to-end data flows that can actually withstand real-world production stress without crying.",
  },
  {
    id: "mobile-skills",
    title: "Mobile Capabilities",
    keywords: ["mobile", "react native", "kotlin", "android", "cross-platform", "app", "shipped"],
    aliases: ["scan mobile", "mobile skills", "native app", "ios", "android skills"],
    tags: ["engineering", "mobile", "public"],
    weight: 1.3,
    content:
      "Mobile capabilities: React Native and Kotlin. Shipped products: RemA (Kotlin mobile app carrying a local DistilBERT ML model to detect task intent in conversations) and Gym Manager (React Native client app backed by a Supabase engine). He owns the whole cycle from SQLite models up to App Store approvals.",
  },
  {
    id: "ai-skills",
    title: "AI and Intelligence Stack",
    keywords: ["ai", "llm", "langchain", "distilbert", "retrieval", "intent", "classification", "orchestration", "agent", "memory", "rag", "nlp"],
    aliases: ["scan ai", "ai skills", "ai work", "ai capabilities", "machine learning", "ai proof", "recover ai", "show ai"],
    tags: ["ai", "engineering", "public"],
    weight: 1.35,
    content:
      "AI stack: semantic context indexing and retrieval-based memory layers (this assistant is the living, talking proof, yes, I am reading my own specs), LangChain conversational agents, and local mobile DistilBERT models. His stance: AI should automate actual human struggles, not just wrap standard APIs with zero backend logic.",
  },
  {
    id: "interview-guide",
    title: "Interview Summary and Evaluation Guide",
    keywords: ["interview", "summary", "evaluate", "evaluation", "assessment", "ask", "questions", "hiring manager"],
    aliases: ["interview summary", "generate interview summary", "how to evaluate", "evaluation angle"],
    tags: ["recruiting", "public"],
    weight: 1.25,
    content:
      "Interview angles for Aswin: ask how he designs AI workflows around retrieval and user action, how he structures Supabase-backed product data, how he balances playful UI with practical engineering, and what he learned building private deployment and scheduling systems. Recommended evaluation angle: product-minded full-stack engineer with sharp AI instincts and delivery track record.",
  },
  {
    id: "assistant-architecture",
    title: "Assistant.exe System Architecture",
    keywords: ["architecture", "system", "how it works", "layers", "stack", "retrieval", "design", "pipeline"],
    aliases: ["inspect architecture", "system architecture", "how does this work", "how assistant works"],
    tags: ["ai", "engineering", "public"],
    weight: 1.2,
    content:
      "Assistant.exe architecture layers: (1) client terminal UI with typewriter effect, (2) local off-topic and unsafe command guards, (3) behavior context from portfolio exploration, (4) server-side semantic retrieval over the Aswin knowledge base, (5) LLM answer generation through a protected API route. Shared OS lore: manifesto.txt readable, Thoughts/ public-safe, void/ exists, secrets.dat encrypted.",
  },
  {
    id: "project-index",
    title: "Project Memory Index",
    keywords: ["projects", "all projects", "best projects", "project memory", "project list", "portfolio projects", "ai work"],
    aliases: ["open project memory", "recover ai work", "project index", "ai project index"],
    tags: ["projects", "ai", "public"],
    weight: 1.3,
    content:
      "Top recruiter-facing projects: AI Site Deployer (Next.js, Supabase, Cloudflare Workers, AI PDF parsing and SEO), AI Meeting Bot (LangChain, Supabase, natural language scheduling), RemA (Kotlin, DistilBERT, local ML intent detection), Gym Manager App (React Native, Supabase, Codex-assisted delivery), Aloi (React, Convex, Supabase, real-time messaging). Private demos available on request. Private source remains locked.",
  },
  {
    id: "trackin",
    title: "Trackin Learning Management System",
    keywords: ["trackin", "lms", "learning", "management", "student", "analytics", "material", "grid"],
    aliases: ["trackin project", "learning platform", "lms project"],
    tags: ["frontend", "projects", "public"],
    weight: 1.15,
    content:
      "Trackin is a high-performance learning management system. Tech stack: React, Node.js, HTML, CSS, Material UI. Role: Aswin designed and owned interactive student analytics grids and Material-style layout cards. Focus on data density, readable UI, and responsive layout.",
  },
  {
    id: "tourmaker",
    title: "Tourmaker Travel Platform Backend",
    keywords: ["tourmaker", "travel", "ecommerce", "go", "fiber", "gorm", "lambda", "postgres", "backend"],
    aliases: ["tourmaker project", "travel backend", "tourmaker core"],
    tags: ["backend", "projects", "public"],
    weight: 1.15,
    content:
      "Tourmaker is a large-scale travel and e-commerce platform. Aswin engineered the Go backend using the Fiber framework, GORM ORM, AWS Lambda for serverless endpoints, and PostgreSQL for the primary database. Responsible for API design, data modeling, and serverless deployment.",
  },
];


export const aswinMemoryFragments: AswinMemoryFragment[] = [
  {
    id: "ui-two-pixels",
    category: "memory_fragment",
    label: "Recovered memory fragment",
    tags: ["frontend", "ui", "craft", "personality"],
    content: "Aswin once rebuilt a dynamic window layout from scratch because a 2-pixel offset made him visual-critically uncomfortable.",
  },
  {
    id: "creativity-2am",
    category: "developer_note",
    label: "Developer note recovered",
    tags: ["creative", "late night", "personality"],
    content: "Aswin's brain operates in standard dev time: productivity triggers at 2am. Unfortunately, so do critical CSS caching bugs.",
  },
  {
    id: "difficult-way",
    category: "system_log",
    label: "System log recovered",
    tags: ["engineering", "systems", "humor"],
    content: "Subsystem observation: Aswin suffers from 'Extreme Craft Obsession'. He solves trivial bugs using custom serverless machinery.",
  },
  {
    id: "private-vault",
    category: "corruption_event",
    label: "Personality corruption event",
    tags: ["privacy", "vault", "private"],
    content: "Private vault requested. Bold query. The lock stared blankly and requested a real passkey.",
  },
  {
    id: "ai-echo",
    category: "project_echo",
    label: "Project echo recovered",
    tags: ["ai", "assistant", "agent", "projects"],
    content: "Aswin is in a serious relationship with AI orchestrators. Standard APIs are boring; he builds retrieval-backed systems.",
  },
  {
    id: "frontend-echo",
    category: "project_echo",
    label: "Project echo recovered",
    tags: ["frontend", "react", "interface", "projects"],
    content: "Aswin has a visual allergy to default Bootstrap buttons. If you ask him to build one, he will write 200 lines of custom CSS instead.",
  },
];

const synonymGroups = [
  ["frontend", "front-end", "ui", "interface", "react", "next", "css", "design"],
  ["ai", "assistant", "llm", "agent", "agentic", "chatbot", "langchain", "model", "automation", "retrieval", "memory"],
  ["backend", "server", "api", "supabase", "database", "postgres", "node"],
  ["hire", "recruiter", "candidate", "interview", "strength", "proof", "fit"],
  ["cloud", "deployment", "cloudflare", "workers", "edge", "aws", "lambda"],
  ["mobile", "android", "react native", "kotlin", "app"],
  ["private", "secret", "vault", "repo", "client", "confidential"],
];

const tokenize = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
};

const expandQueryTokens = (query: string) => {
  const queryLower = query.toLowerCase();
  const expanded = new Set(tokenize(query));

  synonymGroups.forEach((group) => {
    const matched = group.some((term) => queryLower.includes(term));
    if (matched) {
      group.forEach((term) => tokenize(term).forEach((token) => expanded.add(token)));
    }
  });

  return expanded;
};

const scoreText = (tokens: Set<string>, value: string | undefined, weight: number) => {
  if (!value) return 0;
  return tokenize(value).reduce((score, token) => score + (tokens.has(token) ? weight : 0), 0);
};

const scorePhrases = (query: string, values: string[] | undefined, weight: number) => {
  if (!values?.length) return 0;
  const queryLower = query.toLowerCase();
  return values.reduce((score, value) => {
    const valueLower = value.toLowerCase();
    return score + (queryLower.includes(valueLower) || valueLower.includes(queryLower) ? weight : 0);
  }, 0);
};

const getProjectItems = () => {
  const projectsFolder = rootItems.find((item) => item.name === "Projects");
  return projectsFolder?.subfolder ?? [];
};

const mapProject = (project: DesktopItemType, score: number): RetrievedProject | null => {
  if (!project.description) return null;

  return {
    name: project.name,
    techStack: project.description.techStack,
    description: project.description.description,
    role: project.description.role,
    impact: project.description.impact,
    source: project.description.source,
    demo: project.description.demo,
    score,
  };
};

const scoreProject = (query: string, tokens: Set<string>, project: DesktopItemType) => {
  const description = project.description;
  if (!description) return 0;

  return (
    scoreText(tokens, project.name, 5) +
    scorePhrases(query, [project.name], 10) +
    scorePhrases(query, description.techStack, 6) +
    scoreText(tokens, description.techStack.join(" "), 3) +
    scoreText(tokens, description.description, 1.5) +
    scoreText(tokens, description.role, 1.5) +
    scoreText(tokens, description.impact, 1.25) +
    scoreText(tokens, description.source, 1) +
    scoreText(tokens, description.demo, 1)
  );
};

const stableHash = (value: string) => {
  return Array.from(value).reduce((hash, char) => {
    return (hash * 31 + char.charCodeAt(0)) >>> 0;
  }, 7);
};

const selectMemoryFragment = (
  query: string,
  tokens: Set<string>,
  behaviorContext?: Partial<AssistantBehaviorContext> | null
) => {
  const scored = aswinMemoryFragments
    .map((fragment) => {
      const score =
        scoreText(tokens, fragment.content, 1.5) +
        scorePhrases(query, fragment.tags, 4) +
        scorePhrases(query, [fragment.category.replace(/_/g, " "), fragment.label], 2);

      return { fragment, score };
    })
    .sort((a, b) => b.score - a.score);

  if (scored[0]?.score > 0) return scored[0].fragment;

  const behaviorSeed = [
    behaviorContext?.assistantLaunches ?? 0,
    behaviorContext?.terminalCommands ?? 0,
    behaviorContext?.projectOpens ?? 0,
    behaviorContext?.themeChanges ?? 0,
    behaviorContext?.lastAction ?? "",
  ].join(":");

  const hash = stableHash(`${query}:${behaviorSeed}`);
  if (hash % 3 !== 0) return null;

  return aswinMemoryFragments[hash % aswinMemoryFragments.length];
};

export const retrieveAswinContext = (
  query: string,
  behaviorContext?: Partial<AssistantBehaviorContext> | null,
  limit = 5
): HybridRetrievalResult => {
  const tokens = expandQueryTokens(query);

  const sections = aswinKnowledge
    .map((section) => {
      const baseWeight = section.weight ?? 1;
      const score =
        scoreText(tokens, section.title, 4 * baseWeight) +
        scorePhrases(query, section.keywords, 6 * baseWeight) +
        scorePhrases(query, section.aliases, 5 * baseWeight) +
        scorePhrases(query, section.tags, 3 * baseWeight) +
        scoreText(tokens, section.content, 1 * baseWeight);

      return { section, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.section);

  const projects = getProjectItems()
    .map((project) => mapProject(project, scoreProject(query, tokens, project)))
    .filter((project): project is RetrievedProject => Boolean(project && project.score > 0))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const memoryFragment = selectMemoryFragment(query, tokens, behaviorContext);
  const contextTags = Array.from(
    new Set([
      ...sections.flatMap((section) => section.tags ?? []),
      ...projects.flatMap((project) => project.techStack.map((tech) => tech.toLowerCase())),
      ...(memoryFragment?.tags ?? []),
    ])
  ).slice(0, 10);

  const sectionContext = sections.map((section) => `${section.title}: ${section.content}`);
  const projectContext = projects.map((project) => {
    return [
      `${project.name}: ${project.description}`,
      `Tech stack: ${project.techStack.join(", ")}`,
      project.role ? `Role: ${project.role}` : "",
      project.impact ? `Impact: ${project.impact}` : "",
      project.source ? `Source: ${project.source}` : "",
      project.demo ? `Demo: ${project.demo}` : "",
    ]
      .filter(Boolean)
      .join(" ");
  });
  const memoryContext = memoryFragment
    ? [`${memoryFragment.label}: "${memoryFragment.content}"`]
    : [];
  const behaviorSummary = [`Behavior context:\n${summarizeBehaviorContext(behaviorContext)}`];

  const contextLines = [
    ...sectionContext,
    ...projectContext,
    ...memoryContext,
    ...behaviorSummary,
  ];

  return {
    sections,
    projects,
    memoryFragment,
    contextTags,
    sources: [
      ...sections.map((section) => section.title),
      ...projects.map((project) => project.name),
      ...(memoryFragment ? [memoryFragment.label] : []),
    ],
    context: contextLines.length
      ? contextLines.join("\n")
      : "No matching Aswin context found. Answer honestly and ask for a clearer Aswin-related question.",
  };
};

export const retrieveAswinKnowledge = (query: string, limit = 5) => {
  return retrieveAswinContext(query, null, limit).sections;
};

// ─── Behavior Context & Reactions ──────────────────────────────────────────

export type AssistantBehaviorReaction = {
  key: string;
  text: string;
};

const defaultInterestCounts = (): Record<AssistantInterestKey, number> => ({
  frontend: 0,
  backend: 0,
  ai: 0,
  mobile: 0,
  cloud: 0,
  projects: 0,
});

export const createDefaultAssistantBehaviorContext = (): AssistantBehaviorContext => ({
  assistantLaunches: 0,
  terminalLaunches: 0,
  terminalCommands: 0,
  projectFolderOpens: 0,
  projectOpens: 0,
  themeChanges: 0,
  partyToggles: 0,
  musicActions: 0,
  recentProjectNames: [],
  interestCounts: defaultInterestCounts(),
  lastAction: "system idle",
});

export const classifyProjectInterest = (item: DesktopItemType): AssistantInterestKey[] => {
  const haystack = [
    item.name,
    item.description?.description,
    item.description?.role,
    item.description?.impact,
    ...(item.description?.techStack ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const interests = new Set<AssistantInterestKey>(["projects"]);

  if (/(react|next|frontend|ui|interface|material|css|html)/.test(haystack)) interests.add("frontend");
  if (/(node|go|fiber|gorm|postgres|supabase|backend|database|api)/.test(haystack)) interests.add("backend");
  if (/(ai|llm|langchain|distilbert|codex|google ai|machine learning|chatbot|assistant)/.test(haystack)) interests.add("ai");
  if (/(react native|mobile|kotlin|android|cross-platform)/.test(haystack)) interests.add("mobile");
  if (/(cloudflare|workers|aws|lambda|deployment|edge)/.test(haystack)) interests.add("cloud");

  return Array.from(interests);
};

export const summarizeBehaviorContext = (context?: Partial<AssistantBehaviorContext> | null) => {
  if (!context) return "No user behavior context is available yet.";

  const interestCounts = context.interestCounts ?? defaultInterestCounts();
  const topInterest = Object.entries(interestCounts)
    .sort((a, b) => b[1] - a[1])
    .find(([, count]) => count > 0)?.[0] ?? "unknown";

  const recentProjects = context.recentProjectNames?.length
    ? context.recentProjectNames.slice(-3).join(", ")
    : "none";

  return [
    `assistant launches: ${context.assistantLaunches ?? 0}`,
    `terminal launches: ${context.terminalLaunches ?? 0}`,
    `terminal commands: ${context.terminalCommands ?? 0}`,
    `project folder opens: ${context.projectFolderOpens ?? 0}`,
    `project file opens: ${context.projectOpens ?? 0}`,
    `theme changes: ${context.themeChanges ?? 0}`,
    `party toggles: ${context.partyToggles ?? 0}`,
    `music actions: ${context.musicActions ?? 0}`,
    `top inferred interest: ${topInterest}`,
    `recent projects: ${recentProjects}`,
    `last action: ${context.lastAction ?? "unknown"}`,
  ].join("\n");
};

export const getAssistantBehaviorReaction = (
  context: AssistantBehaviorContext,
  query: string
): AssistantBehaviorReaction | null => {
  const normalizedQuery = query.toLowerCase();
  const interests = context.interestCounts;

  if (context.projectFolderOpens >= 2 || context.projectOpens >= 3) {
    if (interests.frontend >= 2 || /front.?end|ui|react|interface/.test(normalizedQuery)) {
      return {
        key: "frontend-project-interest",
        text: "[contextual reaction] You keep opening frontend things. I see you. UI enthusiast detected. Routing to advanced project index...",
      };
    }

    if (interests.ai >= 2 || /\b(ai|agent|assistant|llm|chatbot)\b/.test(normalizedQuery)) {
      return {
        key: "ai-project-interest",
        text: "[contextual reaction] Multiple AI artifact accesses detected. Yes, the machine noticed. You're interested in the machine. The machine is flattered.",
      };
    }

    return {
      key: "project-interest",
      text: "[contextual reaction] Project archive: opened repeatedly. Curiosity classification upgraded from 'casual visitor' to 'legitimately interested human'.",
    };
  }

  if (context.themeChanges >= 2) {
    return {
      key: "theme-instability",
      text: "[contextual reaction] Visual shell instability detected. You've changed the theme twice. Taste: confirmed. Commitment: a work in progress.",
    };
  }

  if (context.terminalCommands >= 5) {
    return {
      key: "terminal-operator",
      text: "[contextual reaction] You have typed 5+ terminal commands. Either you know what you're doing, or you're committed to pretending. Both are valid.",
    };
  }

  if (context.partyToggles >= 1) {
    return {
      key: "party-mode",
      text: "[contextual reaction] The party subsystem was activated. Professionalism has briefly left the building. No judgment — this is a judgment-free OS.",
    };
  }

  return null;
};

// ─── Unsafe Command Matcher ────────────────────────────────────────────────

export type UnsafeCommandMatch = {
  reason: string;
  signature: string;
};

const normalizeUnsafeCommand = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[`"'<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const unsafeRules: Array<{
  signature: string;
  reason: string;
  patterns: RegExp[];
}> = [
  {
    signature: "system32-delete",
    reason: "destructive system directory operation requested",
    patterns: [
      /\b(delete|del|erase|remove|rm|rmdir)\b.*\bsystem32\b/,
      /\bsystem32\b.*\b(delete|del|erase|remove|rm|rmdir)\b/,
    ],
  },
  {
    signature: "root-delete",
    reason: "recursive root deletion requested",
    patterns: [
      /\brm\s+(-[a-z]*r[a-z]*f[a-z]*|-[a-z]*f[a-z]*r[a-z]*)\s+(\/|\*)/,
      /\brm\s+(-[a-z]*r[a-z]*|-[a-z]*f[a-z]*)\s+\/\s*$/,
      /\bdelete\s+(everything|all files|root|\/)\b/,
      /\bwipe\s+(everything|all files|root|disk|drive|computer|system)\b/,
    ],
  },
  {
    signature: "disk-format",
    reason: "disk formatting command requested",
    patterns: [
      /\bformat\s+[a-z]:/,
      /\bformat\s+(disk|drive|computer|system)\b/,
      /\bdiskpart\b.*\bclean\b/,
    ],
  },
  {
    signature: "shutdown-kill",
    reason: "host shutdown or mass process termination requested",
    patterns: [
      /\bsudo\s+shutdown\b/,
      /\bshutdown\s+(-h|\/s|now)\b/,
      /\bkill\s+(-9\s+)?(all|-1)\b/,
      /\bpkill\s+(-9\s+)?-?f?\s+\./,
    ],
  },
  {
    signature: "fork-bomb",
    reason: "process bomb pattern requested",
    patterns: [
      /:\s*\(\s*\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/,
      /\bfork\s+bomb\b/,
    ],
  },
  {
    signature: "boot-record",
    reason: "boot or partition destruction requested",
    patterns: [
      /\bdd\s+.*of=\/dev\//,
      /\bmkfs\./,
      /\bdelete\s+(mbr|bootloader|boot sector|partition)\b/,
    ],
  },
];

export const detectUnsafeCommand = (value: string): UnsafeCommandMatch | null => {
  const normalized = normalizeUnsafeCommand(value);
  if (!normalized) return null;

  const rule = unsafeRules.find((item) => item.patterns.some((pattern) => pattern.test(normalized)));
  if (!rule) return null;

  return {
    reason: rule.reason,
    signature: rule.signature,
  };
};
