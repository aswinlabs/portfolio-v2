'use client';

import { useState, useCallback, useEffect, useMemo, useReducer } from "react";
import Desktop from "@/components/Desktop";
import Skills from "@/components/Skills";
import DefaultPanel from "@/components/DefaultPanel";
import useIsMobile from "@/hooks/useIsMobile";
import ProjectViewer from "@/components/ProjectViewer";
import { AssistantBehaviorContext, DesktopItemType, MusicCommand, WindowState } from "@/types";
import ProfileTab from "@/components/profileTab";
import AboutMeViewer from "@/components/AboutMeViewer";
import Terminal from "@/components/Terminal";
import { jersey_15 } from './fonts';
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Assistant from "@/components/Assistant";
import { rootItems } from "@/components/DesktopItems";
import { applyTheme } from "@/lib/themes";
import Clock from "@/components/Clock";
import BlueScreen from "@/components/BlueScreen";
import StartButton from "@/components/StartButton";
import PowerScreen from "@/components/PowerScreen";
import BootScreen from "@/components/BootScreen";
import ShutdownScreen from "@/components/ShutdownScreen";
import StartMenu from "@/components/StartMenu";
import Confetti from 'react-confetti';
import clsx from "clsx";
import { classifyProjectInterest, createDefaultAssistantBehaviorContext } from "@/lib/aswinKnowledge";

export type ViewStyle = "grid" | "list";

type PowerState = 'off' | 'booting' | 'on' | 'shuttingDown';
type PowerAction = 
  | { type: 'BOOT' } 
  | { type: 'SHUTDOWN' }
  | { type: 'COMPLETE_BOOT' }
  | { type: 'TURN_OFF' };

function powerReducer(state: PowerState, action: PowerAction): PowerState {
  switch (action.type) {
    case 'BOOT':
      localStorage.setItem("powerState", "on");
      return 'booting';
    case 'SHUTDOWN':
      localStorage.setItem("powerState", "off");
      return 'shuttingDown';
    case 'COMPLETE_BOOT':
      return 'on';
    case 'TURN_OFF':
      return 'off';
    default:
      return state;
  }
}

export default function Home() {
  const [activePanel, setActivePanel] = useState<DesktopItemType | null>(null);
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: "terminal",
      title: "Terminal",
      isOpen: false,
      isMinimized: false,
      position: { x: 100, y: 100 },
      zIndex: 100,
    },
    {
      id: "assistant",
      title: "Assistant",
      isOpen: false,
      isMinimized: false,
      position: { x: 140, y: 120 },
      zIndex: 100,
    },
  ]);
  const [viewStyle, setViewStyle] = useState<ViewStyle>("grid");
  const [path, setPath] = useState<DesktopItemType[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [showBlueScreen, setShowBlueScreen] = useState(false);
  const [powerState, dispatch] = useReducer(powerReducer, 'on');
  const [partyMode, setPartyMode] = useState(false);
  const [musicCommand, setMusicCommand] = useState<MusicCommand | null>(null);
  const [assistantBehavior, setAssistantBehavior] = useState<AssistantBehaviorContext>(() =>
    createDefaultAssistantBehaviorContext()
  );

  const terminalWindow = windows.find(w => w.id === "terminal")!;
  const assistantWindow = windows.find(w => w.id === "assistant")!;

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      const target = prev.find(w => w.id === id);
      if (!target) return prev;
      const maxZ = Math.max(...prev.map(w => w.zIndex), 100);
      if (target.zIndex === maxZ && prev.filter(w => w.zIndex === maxZ).length === 1) {
        return prev;
      }
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
    });
  }, []);

  const openWindow = useCallback((id: string) => {
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex), 100);
      return prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w);
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  }, []);

  const toggleWindow = useCallback((id: string) => {
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (!win) return prev;
      const maxZ = Math.max(...prev.map(w => w.zIndex), 100);
      return prev.map(w => {
        if (w.id === id) {
          if (!w.isOpen) {
            return { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 };
          }
          if (w.isMinimized) {
            return { ...w, isMinimized: false, zIndex: maxZ + 1 };
          }
          const isFocused = w.zIndex === maxZ;
          if (isFocused) {
            return { ...w, isMinimized: true };
          } else {
            return { ...w, zIndex: maxZ + 1 };
          }
        }
        return w;
      });
    });
  }, []);

  const isWindowFocused = useCallback((id: string) => {
    const win = windows.find(w => w.id === id);
    if (!win || !win.isOpen || win.isMinimized) return false;
    const openWindows = windows.filter(w => w.isOpen && !w.isMinimized);
    if (openWindows.length === 0) return false;
    const maxZ = Math.max(...openWindows.map(w => w.zIndex), 0);
    return win.zIndex === maxZ;
  }, [windows]);

  const isMobile = useIsMobile();
  const effectiveViewStyle = isMobile ? "list" : viewStyle;
  
  const memoizedRootItems = useMemo(() => rootItems, []);

  const applySavedTheme = useCallback(() => {
    applyTheme(localStorage.getItem("theme") || "theme-classic");
  }, []);

  useEffect(() => {
    applySavedTheme();
  }, [applySavedTheme]);

  const handlePartyMode = useCallback(() => {
    const audio = new Audio('/music/party.mp3');
    
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    };

    playAudio();
    setPartyMode(true);

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (!partyMode) return;
    const cleanup = handlePartyMode();
    return cleanup;
  }, [partyMode, handlePartyMode]);

  const handleAssistantTheme = useCallback((themeClassName: string) => {
    applyTheme(themeClassName);
    setAssistantBehavior(prev => ({
      ...prev,
      themeChanges: prev.themeChanges + 1,
      lastAction: `changed theme to ${themeClassName.replace("theme-", "")}`,
    }));
  }, []);

  const handleAssistantMusic = useCallback((isPlaying: boolean) => {
    setMusicCommand({
      id: Date.now(),
      action: isPlaying ? "play" : "stop",
    });
    setAssistantBehavior(prev => ({
      ...prev,
      musicActions: prev.musicActions + 1,
      lastAction: `${isPlaying ? "started" : "stopped"} profile music`,
    }));
  }, []);

  const handleAssistantPartyMode = useCallback(() => {
    setPartyMode(prev => !prev);
    setAssistantBehavior(prev => ({
      ...prev,
      partyToggles: prev.partyToggles + 1,
      lastAction: "toggled party mode through assistant",
    }));
  }, []);

  const recordProjectOpen = useCallback((item: DesktopItemType) => {
    const interests = classifyProjectInterest(item);

    setAssistantBehavior(prev => {
      const interestCounts = { ...prev.interestCounts };
      interests.forEach((interest) => {
        interestCounts[interest] += 1;
      });

      return {
        ...prev,
        projectOpens: prev.projectOpens + 1,
        recentProjectNames: [...prev.recentProjectNames, item.name].slice(-5),
        interestCounts,
        lastAction: `opened project ${item.name}`,
      };
    });
  }, []);

  useEffect(() => {
    const wasShutDown = localStorage.getItem("powerState") === 'off';
    
    if (wasShutDown) {
      dispatch({ type: 'TURN_OFF' });
    } else {
      const timer = setTimeout(() => dispatch({ type: 'COMPLETE_BOOT' }), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const findItemById = useCallback((items: DesktopItemType[], id: number): DesktopItemType | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.subfolder) {
        const found = findItemById(item.subfolder, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const handlePowerOn = useCallback(() => {
    dispatch({ type: 'BOOT' });
    const timer = setTimeout(() => dispatch({ type: 'COMPLETE_BOOT' }), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = useCallback(() => {
    setPath(prev => prev.length > 0 ? prev.slice(0, -1) : prev);
    setActivePanel(null);
  }, []);

  const handleClosePanel = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    setActivePanel(null);
    if (activePanel?.type === "executable" || activePanel?.parentId === null) {
      handleBack();
    }
  }, [activePanel, handleBack]);

  const handleCloseTerminal = useCallback(() => {
    closeWindow("terminal");
  }, [closeWindow]);

  const handleToggleTerminal = useCallback(() => {
    toggleWindow("terminal");
  }, [toggleWindow]);

  const handleCloseAssistant = useCallback(() => {
    closeWindow("assistant");
  }, [closeWindow]);

  const handleToggleAssistant = useCallback(() => {
    toggleWindow("assistant");
  }, [toggleWindow]);

  const handleCloseBlueScreen = useCallback(() => {
    setShowBlueScreen(false);
  }, []);

  const handleDesktopItemClicked = useCallback((item: DesktopItemType | null) => {
    if (Math.random() < 0.09) setShowBlueScreen(true);

    if (!item) {
      setActivePanel(null);
      return;
    }

    if (item.type === "folder") {
      if (item.name === "Projects") {
        setAssistantBehavior(prev => ({
          ...prev,
          projectFolderOpens: prev.projectFolderOpens + 1,
          lastAction: "opened Projects folder",
        }));
      }
      setActivePanel(null);
      setPath(prev => {
        const currentParent = prev[prev.length - 1];
        const isInCurrentFolder = currentParent?.subfolder?.some(sub => sub.id === item.id);
        return isInCurrentFolder ? [...prev, item] : [item];
      });
    } else if (item.type === "terminal" && item.renderItem === "Terminal") {
      setAssistantBehavior(prev => ({
        ...prev,
        terminalLaunches: prev.terminalLaunches + 1,
        lastAction: "opened terminal",
      }));
      openWindow("terminal");
    } else if (item.type === "executable" && item.renderItem === "Assistant") {
      setAssistantBehavior(prev => ({
        ...prev,
        assistantLaunches: prev.assistantLaunches + 1,
        lastAction: "opened Assistant.exe",
      }));
      openWindow("assistant");
      setActivePanel(null);
      setPath([]);
    } else {
      if (item.parentId === 3 && item.description) {
        recordProjectOpen(item);
      } else if (item.renderItem === "ThemeSwitcher") {
        setAssistantBehavior(prev => ({
          ...prev,
          lastAction: "opened theme switcher",
        }));
      }
      setActivePanel(item);
      const parent = item.parentId != null ? findItemById(memoizedRootItems, item.parentId) : null;
      setPath(parent ? [parent] : [item]);
    }
    setStartMenuOpen(false);
  }, [findItemById, memoizedRootItems, recordProjectOpen, openWindow]);

  const handleExecuteItem = useCallback((item: DesktopItemType) => {
    if (item.type === "executable" && item.renderItem !== "Terminal") {
      handleDesktopItemClicked(item);
    }
  }, [handleDesktopItemClicked]);

  const panelComponents = useMemo(() => ({
    Skills: <Skills />,
    ProjectViewer: activePanel ? <ProjectViewer {...activePanel} /> : null,
    AboutMeViewer: <AboutMeViewer />,
    ThemeSwitcher: <ThemeSwitcher />,
    Default: <DefaultPanel />
  }), [activePanel]);

  const renderPanelContent = useCallback(() => {
    if (!activePanel) return panelComponents.Default;
    return panelComponents[activePanel.renderItem as keyof typeof panelComponents] || panelComponents.Default;
  }, [activePanel, panelComponents]);

  const handleShutdown = useCallback(() => {
    setStartMenuOpen(false);
    dispatch({ type: 'SHUTDOWN' });
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (startMenuOpen) {
        setStartMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [startMenuOpen]);

  const CloseButton = useMemo(() => {
    const Button = () => (
      <button
        onClick={handleClosePanel}
        className="absolute fixed top-4 right-4 w-8 h-8 p-1 z-[99] 
                   border border-[color:var(--foreground)] 
                   bg-[color:var(--background)] 
                   shadow-[inset_-1px_-1px_0_var(--foreground),inset_1px_1px_0_#000] 
                   active:shadow-[inset_1px_1px_0_var(--foreground),inset_-1px_-1px_0_#000] 
                   flex items-center justify-center 
                   text-[color:var(--foreground)] 
                   font-bold text-sm select-none"
        aria-label="Close panel"
      >
        ✕
      </button>
    );
  
    Button.displayName = 'CloseButton';
    return Button;
  }, [handleClosePanel]);
  

  if (powerState === 'off') {
    return <PowerScreen onPowerOn={handlePowerOn} />;
  }
  
  if (powerState === 'booting') {
    return <BootScreen />;
  }
  
  if (powerState === 'shuttingDown') {
    return <ShutdownScreen />;
  }

  return (
    <div className={`relative h-dvh flex flex-col ${jersey_15.className} ${
      partyMode ? 'party-mode-animation' : ''
    }`}>
      {showBlueScreen && <BlueScreen onClose={handleCloseBlueScreen} />}
      {partyMode && <Confetti recycle={false} numberOfPieces={200} />}

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-13 divide-y md:divide-y-0 md:divide-x divide-dashed divide-gray-500 p-4 h-[calc(100dvh-48px)] overflow-auto">
          <div className="md:col-span-4 layout-panel md:h-full md:overflow-auto scrollbar-hidden">
            <ProfileTab shouldStopMusic={partyMode} musicCommand={musicCommand} />
          </div>
          <div className={clsx(
  activePanel ? "md:col-span-5" : "md:col-span-9",
  "md:h-full md:overflow-auto flex flex-col scrollbar-hidden"
)}>

            <Desktop 
              onItemClick={handleDesktopItemClicked}
              viewStyle={effectiveViewStyle}
              setViewStyle={setViewStyle}
              path={path}
              onBack={handleBack}
              activePanel={activePanel}
            />
          </div>

          {!isMobile && activePanel ? (
            <div className="md:col-span-4 h-full overflow-hidden flex flex-col relative">
              {activePanel && <CloseButton />}
              <div className="flex-grow overflow-y-auto scrollbar-hidden">
                {renderPanelContent()}
              </div>
            </div>
          ) : (
            activePanel && (
              <div
                className="fixed inset-0 z-[99] bg-[color:var(--background)] overflow-y-auto"
                onClick={handleClosePanel}
              >
                <div
                  className="relative p-4 max-w-screen-md mx-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CloseButton />
                  {renderPanelContent()}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[color:var(--background)] h-12 border-t-2 flex items-center justify-between px-2 z-[999] shadow-[0_-2px_4px_rgba(0,0,0,0.2)]">
        <div className="flex items-center space-x-2">
          <StartButton onClick={(e) => {
            e.stopPropagation();
            setStartMenuOpen(!startMenuOpen);
          }} />
          
          <StartMenu
            isOpen={startMenuOpen}
            onClose={() => setStartMenuOpen(false)}
            onItemClick={handleDesktopItemClicked}
            onTerminalOpen={() => {
              openWindow("terminal");
              setAssistantBehavior(prev => ({
                ...prev,
                terminalLaunches: prev.terminalLaunches + 1,
                lastAction: "opened terminal from start menu",
              }));
            }}
            onShutdown={handleShutdown}
            togglePartyMode={() => {
              setPartyMode(prev => !prev);
              setAssistantBehavior(prev => ({
                ...prev,
                partyToggles: prev.partyToggles + 1,
                lastAction: "toggled party mode from start menu",
              }));
            }}
            partyMode={partyMode}
          />

          {terminalWindow.isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleTerminal();
              }}
              className={clsx(
                "h-8 px-3 flex items-center justify-center text-sm font-bold text-[color:var(--button-text)]",
                isWindowFocused("terminal")
                  ? "bg-[color:var(--button-hover)] border-t-2 border-l-2 border-[color:var(--button-dark)] border-r-2 border-b-2 border-[color:var(--button-light)]"
                  : "bg-[color:var(--button)] hover:bg-[color:var(--button-hover)] border-t-2 border-l-2 border-[color:var(--button-light)] border-r-2 border-b-2 border-[color:var(--button-dark)] active:border-[color:var(--button-pressed)]"
              )}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" className="mr-1" fill="none" stroke="black">
                <rect x="1" y="3" width="14" height="10" fill="black" stroke="black" />
                <path d="M3 5l3 3-3 3" stroke="white" strokeWidth="1.2" />
                <path d="M7 11h5" stroke="white" strokeWidth="1.2" />
              </svg>
              <span>Terminal</span>
            </button>
          )}

          {assistantWindow.isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleAssistant();
              }}
              className={clsx(
                "h-8 px-3 flex items-center justify-center text-sm font-bold text-[color:var(--button-text)]",
                isWindowFocused("assistant")
                  ? "bg-[color:var(--button-hover)] border-t-2 border-l-2 border-[color:var(--button-dark)] border-r-2 border-b-2 border-[color:var(--button-light)]"
                  : "bg-[color:var(--button)] hover:bg-[color:var(--button-hover)] border-t-2 border-l-2 border-[color:var(--button-light)] border-r-2 border-b-2 border-[color:var(--button-dark)] active:border-[color:var(--button-pressed)]"
              )}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" className="mr-1" fill="none" stroke="black">
                <rect x="1" y="3" width="14" height="10" fill="black" stroke="black" />
                <path d="M3 5l3 3-3 3" stroke="white" strokeWidth="1.2" />
                <path d="M7 11h5" stroke="white" strokeWidth="1.2" />
              </svg>
              <span>Assistant</span>
            </button>
          )}
        </div>
        <Clock />
      </div>

      {terminalWindow.isOpen && !terminalWindow.isMinimized && (
        <Terminal 
          handleClose={handleCloseTerminal} 
          onExecuteItem={handleExecuteItem}
          onCommand={(command) => {
            setAssistantBehavior(prev => ({
              ...prev,
              terminalCommands: prev.terminalCommands + 1,
              lastAction: `ran terminal command: ${command.slice(0, 48)}`,
            }));
          }}
          onMinimize={() => minimizeWindow("terminal")}
          zIndex={terminalWindow.zIndex}
          onFocus={() => focusWindow("terminal")}
        />
      )}

      {assistantWindow.isOpen && !assistantWindow.isMinimized && (
        <Assistant
          handleClose={handleCloseAssistant}
          onMinimize={() => minimizeWindow("assistant")}
          onSetTheme={handleAssistantTheme}
          onSetMusicPlaying={handleAssistantMusic}
          onTogglePartyMode={handleAssistantPartyMode}
          behaviorContext={assistantBehavior}
          zIndex={assistantWindow.zIndex}
          onFocus={() => focusWindow("assistant")}
        />
      )}
    </div>
  );
}
