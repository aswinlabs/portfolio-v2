import { DesktopItemType } from "@/types";

export const rootItems: DesktopItemType[] = [
  {
    id: 1,
    name: "About me.pdf",
    image: "/images/txt.webp",
    type: "text",
    renderItem: "AboutMeViewer",
    parentId: null 
  },
  {
    id: 2,
    name: "Stack.exe",
    image: "/images/exe.webp",
    type: "executable",
    renderItem: "Skills",
    parentId: null 
  },
  {
    id: 3,
    name: "Projects",
    image: "/images/pc.webp",
    type: "folder",
    parentId: null, 
    subfolder: [
      {
        id: 31,
        name: "TrackIn",
        type: "text",
        image: "/images/txt.webp",
        renderItem: "ProjectViewer",
        parentId: 3, 
        description: {
          techStack: ["React", "Node", "HTML", "CSS5", "Material UI"],
          description: "Built a learning management system...",
        }
      },
      {
        id: 32,
        name: "RemA",
        type: "text",
        image: "/images/txt.webp",
        renderItem: "ProjectViewer",
        parentId: 3, 
        description: {
          techStack: ["Kotlin", "DistilBERT", "Machine Learning", "Google Colab"],
          description: "Built RemA, a Reminder Assistant mobile app that listens to conversations, detects reminder intent with a trained DistilBERT model, and adds detected reminders as to-dos.",
        }
      },
      {
        id: 33,
        name: "Tourmaker",
        type: "text",
        image: "/images/txt.webp",
        renderItem: "ProjectViewer",
        parentId: 3, 
        description: {
          techStack: ["Go", "Fiber Framework", "GORM", "AWS Lambda", "PostgreSQL"],
          description: "Built the backend for an e-commerce app...",
        }
      },
      {
        id: 34,
        name: "Aloi",
        type: "text",
        image: "/images/txt.webp",
        renderItem: "ProjectViewer",
        parentId: 3, 
        description: {
          techStack: ["React.js", "Material UI", "Supabase", "Convex"],
          description: "Developed a responsive real-time chat app with live messaging, user presence tracking, and fast message delivery.",
          role: "Owned real-time app logic, chat flows, and backend integration.",
          impact: "Delivered a private communication product with fast collaborative messaging.",
          source: "Private repository",
          demo: "Available on request"
        }
      },
      {
        id: 35,
        name: "AI Site Deployer",
        type: "text",
        image: "/images/txt.webp",
        renderItem: "ProjectViewer",
        parentId: 3,
        description: {
          techStack: ["Next.js", "AI PDF Parsing", "AI SEO Generation", "Cloudflare Workers", "Supabase", "Template Platform"],
          description: "Built a Next.js admin platform that uses AI to parse PDFs, generate SEO fields automatically, collect guided site details, and deploy template-based websites in seconds.",
          role: "Owned the admin workflow, Supabase integration, AI-assisted site data flow, and edge deployment pipeline.",
          impact: "Reduced manual setup work by tailoring website content and SEO data from PDFs plus guided pre-deployment answers.",
          source: "Private repository",
          demo: "Available on request"
        }
      },
      {
        id: 36,
        name: "Gym Manager App",
        type: "text",
        image: "/images/txt.webp",
        renderItem: "ProjectViewer",
        parentId: 3,
        description: {
          techStack: ["React Native", "Supabase", "Codex", "Google AI Studio"],
          description: "Shipped a cross-platform gym app for workouts, trainers, clients, and incentives, with Supabase backend and AI-assisted UI delivery.",
          role: "Owned the Supabase backend, data model, app logic, and AI-assisted UI delivery.",
          impact: "Helped deliver trainer and client management workflows faster across mobile platforms.",
          source: "Private repository",
          demo: "Available on request"
        }
      },
      {
        id: 37,
        name: "AI Meeting Bot",
        type: "text",
        image: "/images/txt.webp",
        renderItem: "ProjectViewer",
        parentId: 3,
        description: {
          techStack: ["LangChain", "Supabase", "Natural Language Scheduling", "Chatbot"],
          description: "Built a LangChain chatbot that schedules meetings from natural language and returns contextual user data from Supabase.",
          role: "Built the agent flow, scheduling intent handling, and Supabase-backed context retrieval.",
          impact: "Turned natural-language meeting requests into useful scheduling actions.",
          source: "Private repository",
          demo: "Available on request"
        }
      }
    ]
  },
  {
    id: 4,
    name: "Certifications",
    image: "/images/folder.webp",
    type: "folder",
    subfolder:[],
    parentId: null, 
  },
  {
    id: 5,
    name: "Terminal",
    image: "/images/terminal.webp",
    type: "terminal",
    renderItem: "Terminal",
    parentId: null 
  },
  {
    id: 6,
    name: "Theme.exe",
    image: "/images/exe.webp",
    type: "executable",
    renderItem: "ThemeSwitcher",
    parentId: null
  },
  {
    id: 7,
    name: "Assistant.exe",
    image: "/images/assistant.webp",
    type: "executable",
    renderItem: "Assistant",
    parentId: null,
  }
];
