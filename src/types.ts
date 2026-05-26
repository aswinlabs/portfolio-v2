type ProjectDescription = {
  techStack: string[];
  description: string;
  role?: string;
  impact?: string;
  proof?: string[];
  source?: string;
  demo?: string;
  image?: string;
};


export type DesktopItemType = {
    id: number | string;
    name: string;
    image?: string;
    type: "folder" | "executable" | "text" | "terminal";
    description?:ProjectDescription;
    subfolder?: DesktopItemType[];
    renderItem?:string;
    parentId?:number|null
    
  };
  

export type DesktopItemProps = {
  items: DesktopItemType[];
  path: DesktopItemType[];
  viewStyle: ViewStyle;
  onItemClick: (item: DesktopItemType) => void;
  activePanel:DesktopItemType|null,
};



export type TrayProps = {
  viewStyle: ViewStyle;
  setViewStyle: (style: ViewStyle) => void;
  currentFolder: DesktopItemType[] | null;
  canGoBack: boolean;
  onBack: () => void;
};

export  type ViewStyle = "grid" | "list";

export type DesktopProps = {
  onItemClick: (item: DesktopItemType | null) => void;
  viewStyle: ViewStyle;
  setViewStyle: (style: ViewStyle) => void;
  path: DesktopItemType[];
  onBack: () => void;
  activePanel:DesktopItemType|null;
};


export type Command = {
  text: string;
  isCommand: boolean;
  dir?: string;
};

export type Position = {
  x: number;
  y: number;
};

export type WindowState = {
  id: string; // 'terminal' | 'assistant'
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  zIndex: number;
};

export type TerminalProps = {
  handleClose: () => void;
  onExecuteItem:(item: DesktopItemType) => void;
  onMinimize:() => void;
  onCommand?: (command: string) => void;
  zIndex?: number;
  onFocus?: () => void;
};

export type MusicCommand = {
  id: number;
  action: "play" | "stop";
};

export type AssistantInterestKey = "frontend" | "backend" | "ai" | "mobile" | "cloud" | "projects";

export type AssistantBehaviorContext = {
  assistantLaunches: number;
  terminalLaunches: number;
  terminalCommands: number;
  projectFolderOpens: number;
  projectOpens: number;
  themeChanges: number;
  partyToggles: number;
  musicActions: number;
  recentProjectNames: string[];
  interestCounts: Record<AssistantInterestKey, number>;
  lastAction: string;
};


export interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (item: DesktopItemType) => void;
  onTerminalOpen: () => void;
  onShutdown: () => void;
  togglePartyMode: () => void;
  partyMode: boolean;
}

export type MusicPlayerProps= {
  stopPlaying?: boolean; 
  command?: MusicCommand | null;
}


export type ProfileTabProps= {
  shouldStopMusic: boolean;
  musicCommand?: MusicCommand | null;
}

export type AssistantMessage = {
  role: "user" | "assistant";
  text: string;
};

export type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AssistantApiResponse = {
  answer?: string;
  error?: string;
  sources?: string[];
  fragments?: string[];
  contextTags?: string[];
};

export type PendingAssistantAction = {
  type: "theme" | "music" | "party";
  label: string;
  value?: string;
};

export type AwaitingAssistantSelection = {
  type: "theme";
};

export type AssistantMode = "intro" | "recruiter" | "normal";

export type Mood =
  | "sleep-deprived"
  | "overconfident"
  | "glitching"
  | "dramatic"
  | "professional"
  | "chaotic";

export type ResponseStrategy =
  | "compressed"
  | "dramatic"
  | "recruiter"
  | "glitch"
  | "technical"
  | "filesystem"
  | "suspicious"
  | "chaotic"
  | "silence";

export type RuntimeState = {
  mood: Mood;
  sassLevel: number;
  patience: number;
  glitchChance: number;
  recruiterDetected: boolean;
  userSuspicionLevel: number;
  messageCount: number;
  offTopicCount: number;
  // Memory Scars:
  userAskedOffTopicCount: number;
  userMentionedRecruiting: boolean;
  userTouchedRestrictedSector: number;
  userAskedGoodQuestionCount: number;
  lastStrategyUsed?: ResponseStrategy;
};

