'use client';

import { useState, useRef, MouseEvent, FormEvent, useEffect, useCallback, useMemo, KeyboardEvent } from "react";
import { rootItems } from "./DesktopItems";
import { Command, DesktopItemType, Position, TerminalProps } from "@/types";
import clsx from "clsx";
import useIsMobile from "@/hooks/useIsMobile";
import { skills } from "./Skills";
import { ASSISTANT_SCAN_OUTPUT } from "./Assistant";
import { detectUnsafeCommand } from "@/lib/aswinKnowledge";

const AI_PROJECT_OUTPUT = [
  "PROJECT MEMORY INDEX",
  "====================",
  "",
  "Assistant.exe",
  "- Virtual Aswin Memory: retrieval-backed portfolio assistant with safe local actions",
  "",
  "AI Site Deployer",
  "- AI PDF parsing, guided site questions, SEO generation, and Cloudflare edge deployment",
  "",
  "RemA",
  "- Mobile Reminder Assistant using trained DistilBERT reminder-intent detection",
  "",
  "AI Meeting Bot",
  "- LangChain chatbot that schedules meetings and retrieves Supabase context",
  "",
  "Gym Manager App",
  "- React Native delivery accelerated with Codex and Google AI Studio",
  "",
  "Private vault: LOCKED",
  "Assistant key exposure: BLOCKED",
].join("\n");

const HIRE_SIGNAL_OUTPUT = [
  "RECRUITER SIGNAL",
  "================",
  "",
  "Aswin is not using AI as decoration.",
  "",
  "Evidence:",
  "- full-stack ownership across frontend, backend, mobile, and deployment",
  "- practical AI workflows involving retrieval, intent detection, and orchestration",
  "- Supabase and Cloudflare experience",
  "- playful interface taste backed by working product logic",
  "- private-data boundaries respected by design",
  "",
  "Run Assistant.exe for the interactive memory archive.",
].join("\n");

const COMMAND_OUTPUTS = {
  help: [
    "TERMINAL HELP",
    "=============",
    "ls        - List directory contents",
    "ls -a     - List ALL contents (including hidden)",
    "cd <dir>  - Change directory",
    "cd ..     - Go back (may require courage)",
    "cat <file>- Read file contents (try project.pdf files)",
    "clear     - Purge terminal history",
    "help      - Reveal this wisdom",
    "about     - Decrypt creator info",
    "assistant - Reveal Assistant.exe hint",
    "hire      - Print recruiter summary",
    "ai        - List AI-related project evidence",
    "<app>.exe - Launch application (e.g., Assistant.exe)",
    "exit      - Escape to reality",
    "",
    "Hidden knowledge awaits those who explore..."
  ].join("\n"),

  about: [
    "ASWIN'S TERMINAL",
    "================",
    "Version: 1.0 (Evolving)",
    "Last Updated: [REDACTED]",
    "Memory Allocation: Infinite",
    "Purpose: To create and explore",
    "",
    "Warning: This system contains traces of human consciousness.",
    "",
    "For more secrets, keep digging..."
  ].join("\n")
};

const Terminal = ({ handleClose, onExecuteItem, onMinimize, onCommand, zIndex, onFocus }: TerminalProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 100, y: 100 });
  const [commands, setCommands] = useState<Command[]>([]);
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState(["aswin", "Desktop"]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isMobile = useIsMobile();

  const dragRef = useRef<HTMLDivElement | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const offset = useRef<Position>({ x: 0, y: 0 });

  const currentDir = useMemo(() => currentPath.join("/"), [currentPath]);
  const currentLocation = useMemo(() => currentPath[currentPath.length - 1], [currentPath]);

  const normalizeArg = useCallback((value: string) => {
    return value.trim().replace(/^["']|["']$/g, "");
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commands]);

  const getCurrentDirectoryItems = useCallback(() => {
    if (currentLocation === "Desktop") return rootItems;
    
    const parentItem = rootItems.find(
      item => item.name === currentLocation && item.type === "folder"
    );
    
    return parentItem?.type === "folder" ? parentItem.subfolder || [] : [];
  }, [currentLocation]);

  const resolvePath = useCallback((targetDir: string) => {
    if (targetDir === "..") {
      if(currentDir==="aswin"){
        return["void"]
      }
      return currentPath.slice(0, -1);
    }
    if (targetDir === "Desktop" && currentDir === "aswin") {
      return ["aswin", "Desktop"];
    }
    
    const currentItems = getCurrentDirectoryItems();
    const match = currentItems.find(
      item => item.name === targetDir && item.type === "folder"
    );
    
    return match ? [...currentPath, match.name] : null;
  }, [currentPath, currentDir, getCurrentDirectoryItems]);

  const formatProjectOutput = (project: DesktopItemType) => {
    if (!project.description) return "PROJECT DETAILS UNAVAILABLE";

    const details = [
      `${project.name.toUpperCase()} PROJECT DETAILS`,
      "=".repeat(project.name.length + 18),
      "",
      "TECH STACK:",
      ...project.description.techStack.map((tech: string) => `- ${tech}`),
      "",
      "DESCRIPTION:",
      project.description.description,
      ""
    ];

    if (
      project.description.role ||
      project.description.impact ||
      project.description.proof?.length ||
      project.description.source ||
      project.description.demo
    ) {
      details.push(
        "PRIVATE CASE STUDY:",
        project.description.role ? `Role: ${project.description.role}` : "",
        project.description.impact ? `Impact: ${project.description.impact}` : "",
        project.description.proof?.length ? `AI / Agentic Proof:\n${project.description.proof.map((item) => `- ${item}`).join("\n")}` : "",
        project.description.source ? `Source: ${project.description.source}` : "",
        project.description.demo ? `Demo: ${project.description.demo}` : "",
        ""
      );
    }

    return details.filter((line) => line !== "").join("\n");
  };

  const handleExecutable = (exeName: string) => {
    const normalizedExeName = normalizeArg(exeName);
    const currentItems = getCurrentDirectoryItems();
    const exeFile = currentItems.find(item => 
      item.name.toLowerCase() === normalizedExeName.toLowerCase() && 
      item.type === "executable"
    );

    if (!exeFile) {
      return `'${normalizedExeName}' is not recognized as an internal or external command, operable program or batch file.`;
    }

    if (exeFile.name === "Stack.exe") {
      return [
        "TECHNICAL SKILLS INVENTORY",
        "==========================",
        "",
        ...skills.map(skill => `- ${skill.name}`),
        ""
      ].join("\n");
    } else if (onExecuteItem) {
      onExecuteItem(exeFile);
      setTimeout(() => {
        setIsMaximized(false);
        handleMinimize();
      }, 500);
      if (exeFile.name === "Assistant.exe") {
        return [
          "Signal detected.",
          "Launching Virtual Aswin Memory...",
          "",
          "Public memory bus: ONLINE",
          "Private vault: LOCKED",
        ].join("\n");
      }
      return `Launching ${normalizedExeName}...`;
    }
    
    return `Executable ${normalizedExeName} launched`;
  };

  const executeCommand = useCallback((command: string) => {
    const trimmedCommand = command.trim();
    const [baseCmd, ...args] = trimmedCommand.split(" ");
    const output: string[] = [];
    const unsafeCommand = detectUnsafeCommand(trimmedCommand);

    if (unsafeCommand) {
      output.push([
        "UNSAFE COMMAND BLOCKED",
        "======================",
        `Reason: ${unsafeCommand.reason}`,
        "",
        "AswinOS survived. barely.",
      ].join("\n"));
    } else {

    const handleLs = () => {
      const showAll = args.includes("-a");
      const items = getCurrentDirectoryItems();

      if (currentLocation === "void") {
        return [
          "NOTHINGNESS",
          "==========",
          "",
          "No files. No directories. No existence.",
          "",
          "The void whispers:",
          "  - You shouldn't be here",
          "  - This place was never meant to be seen",
          "  - Even emptiness feels lonely sometimes",
          "",
        ].join("\n");
      }
    
    
      if (currentLocation === "Projects") {
        const projectFiles = items.map(item => `${item.name}.pdf`);
        return [
          "PROJECT FILES",
          "============",
          "",
          ...projectFiles,
          "",
          "Use 'cat <project>.pdf' to view details"
        ].join("\n");
      }
    
      if (currentLocation === "aswin") {
        if (showAll) {
          return [
            "HIDDEN CHAMBERS REVEALED",
            "=======================",
            "",
            "Directories:",
            "Desktop/      - Digital workspace",
            "Thoughts/     - [REDACTED] (handle with care)",
            "",
            "Files:",
            "manifesto.txt - Personal confessions",
            "secrets.dat   - [DEEP ENCRYPTION]",
            "",
            "WARNING: These aren't meant to be",
            "seen by casual observers. You're",
            "either very curious or lost."
          ].join("\n");
        } else {
          return [
            "WELCOME TO ASWIN'S MIND",
            "=======================",
            "",
            "Directories:",
            "Desktop/      - Digital workspace",
            "",
            "Files:",
            "secrets.dat   - [ENCRYPTED]",
            "",
            "Warning: Proceed with curiosity..."
          ].join("\n");
        }
      }
    
      return items.map(item => item.name).join("\n") || "(empty)";
    };

    const handleCd = (targetDir: string) => {
      const normalizedTargetDir = normalizeArg(targetDir);
      const newPath = resolvePath(normalizedTargetDir);
      
      if (currentLocation === "aswin" && normalizedTargetDir.toLowerCase() === "thoughts") {
        return [
          "Entering the Mindscape...",
          "",
          "WARNING: Cognitive load increasing",
          "Thought density: 87%",
          "Memory allocation:",
          "  - Technical concepts: 45%",
          "  - Creative ideas: 30%",
          "  - Random musings: 25%",
          "",
          "Proceed with caution - some thoughts may still be in beta",
          "Type 'ls' to explore neural pathways"
        ].join("\n");
      }
    
      if (!newPath) {
        return [
          `Directory '${normalizedTargetDir}' not found in ${currentLocation}/`,
          "",
          "Possible causes:",
          "- Typographical illusion",
          "- Quantum directory fluctuation",
          "- You're not meant to find this yet"
        ].join("\n");
      }
    
      setCurrentPath(newPath);
      return "";
    };

    const handlePwd = () => {
    
      if (currentDir === "aswin/Desktop/Projects") {
        return [
          "PROJECTS WORKSPACE",
          "Where ideas become reality",
          "Contains:",
          "- Half-baked dreams",
          "- Caffeinated code",
          "- Infinite possibilities"
        ].join("\n");
      }
    
      if (currentDir === "aswin/Desktop/Certifications") {
        return [
          "ACHIEVEMENT VAULT",
          "Proof that you survived the tutorials",
          "Warning:",
          "- Certificates may expire",
          "- Knowledge doesn't"
        ].join("\n");
      }
    
      if (currentDir === "aswin/Desktop") {
        return [
          "DIGITAL WORKBENCH",
          "Surface area: 1920x1080 pixels",
          "Contents:",
          "- Important files (5%)",
          "- Temporary stuff (95%)",
          "- That one icon you can't delete"
        ].join("\n");
      }
    
      if (currentDir === "aswin") {
        return [
          "PERSONAL SPACE",
          "Access level: [ADMIN]",
          "Systems:",
          "- Brain OS v2.3.1",
          "- Memory: 128TB (mostly useless trivia)",
          "- Firewall: Occasionally active"
        ].join("\n");
      }
    
      if (currentDir === "void") {
        return [
          "THE VOID",
          "Error: Directory not found",
          "Or was it?",
          "",
          "The void stares back...",
        ].join("\n");
      }
      return currentDir;
    };
    const handleCat = (filename: string) => {
      const normalizedFilename = normalizeArg(filename);
      const projectsFolder = rootItems.find(item => item.name === "Projects");
      const projectFiles = projectsFolder?.subfolder || [];
      const projectFile = projectFiles.find(proj => 
        `${proj.name}.pdf`.toLowerCase() === normalizedFilename.toLowerCase()
      );

      if (projectFile) {
        return formatProjectOutput(projectFile);
      }

      const files: { [key: string]: string } = {
        "manifesto.txt": [
          "MANIFESTO.TXT",
          "=============",
          "",
          "TOP SECRET - YOUR EYES ONLY",
          "",
          "SYSTEM BOOT: 0xC0FFEE [OK]",
          "MEMORY CHECK: 640K SHOULD BE ENOUGH [WARNING]",
          "CONSCIOUSNESS.EXE LOADED [STABLE]",
          "",
          "##################################################",
          "",
          "Welcome to my digital sanctuary.",
          "",
          "I create code by day, chaos by night.",
          "80% programmer, 20% digital wanderer.",
          "",
          "This 'mysterious hacker' interface?",
          "Just smoke and mirrors for the nostalgic.",
          "",
          "The only thing I'm hacking is my sleep",
          "schedule and the expectations of normalcy.",
          "",
          "##################################################",
          "",
          "[END OF TRANSMISSION - 1985]"
        ].join("\n"),
        "secrets.dat": [
          "SECRETS.DAT",
          "===========",
          "",
          "DECRYPTION ATTEMPT DETECTED",
          "ACCESS DENIED",
          "",
          "01010111 01101000 01111001 00100000 01100001 01110010",
          "01100101 00100000 01111001 01101111 01110101 00100000",
          "01110100 01110010 01111001 01101001 01101110 01100111",
          "00100000 01110011 01101111 00100000 01101000 01100001",
          "01110010 01100100 00111111",
          "",
          "[SYSTEM LOCKDOWN IMMINENT]"
        ].join("\n")
      };

      return files[normalizedFilename] || `ACCESS DENIED: ${normalizedFilename} - File corrupted or does not exist`;
    };

    switch (baseCmd.toLowerCase()) {
      case "ls":
        output.push(handleLs());
        break;

      case "cd":
        output.push(handleCd(args.join(" ")));
        break;

      case "cat":
        output.push(handleCat(args.join(" ")));
        break;

      case "pwd":
        output.push(handlePwd());
        break;

      case "clear":
        setCommands([]);
        return;

      case "help":
        output.push(COMMAND_OUTPUTS.help);
        break;

      case "about":
        output.push(COMMAND_OUTPUTS.about);
        break;

      case "assistant":
        output.push(ASSISTANT_SCAN_OUTPUT);
        break;

      case "hire":
        output.push(HIRE_SIGNAL_OUTPUT);
        break;

      case "ai":
        output.push(AI_PROJECT_OUTPUT);
        break;

      case "exit":
        output.push("Terminating connection...\n[Press any key to close]");
        setTimeout(handleClose, 2000);
        break;

      default:
        if (trimmedCommand.toLowerCase().endsWith('.exe')) {
          output.push(handleExecutable(trimmedCommand));
        } else {
          output.push(
            `Command '${command}' not recognized\nTry 'help' for available commands`
          );
        }
    }
    }

    if (output.length > 0) {
      setCommands(prev => [...prev, { 
        text: output.join("\n"), 
        isCommand: false 
      }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation, currentDir, getCurrentDirectoryItems, normalizeArg, resolvePath, handleClose, onExecuteItem, onMinimize]);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setCommandHistory(prev => [input, ...prev]);
    setHistoryIndex(-1);
    onCommand?.(input);

    setCommands(prev => [
      ...prev,
      { text: input, isCommand: true, dir: currentDir }
    ]);
    
    executeCommand(input);
    setInput("");
  }, [input, currentDir, executeCommand, onCommand]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (commandHistory.length === 0) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
      setHistoryIndex(newIndex);
      setInput(newIndex >= 0 ? commandHistory[newIndex] : "");
    }
  }, [commandHistory, historyIndex]);

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y
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


  const handleMinimize=()=>{
    setIsMaximized(false);
    onMinimize?.();
  }

  return (
    <div
      ref={dragRef}
      onMouseDown={onFocus}
      className={clsx(
        "fixed shadow-lg pixelated text-xl border-2",
        {
          "top-0 left-0 w-full h-[calc(100dvh-48px)]": isMaximized || isMobile,
          "w-[500px] h-[400px]": !isMaximized && !isMobile
        }
      )}
      style={{
        ...(!isMaximized && !isMobile ? { top: position.y, left: position.x } : {}),
        backgroundColor: "var(--assistant-window-bg)",
        borderColor: "var(--assistant-border)",
        zIndex: zIndex,
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="cursor-move px-3 py-2 flex justify-between items-center border-b select-none"
        style={{
          backgroundColor: "var(--assistant-accent)",
          color: "var(--assistant-accent-text)",
          borderColor: "var(--assistant-border)",
        }}
      >
        <span className="text-sm font-bold tracking-wider">TERMINAL</span>
        <div className="flex space-x-2">
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
          {
            !isMaximized?
            <button
              onClick={setMaximise}
              className="w-4 h-4 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white text-xs select-none cursor-pointer"
              aria-label={"Maximize"}
            >
               □
            </button>:null
          }
        </div>
      </div>

      <div 
        className="p-3 h-[calc(100%-40px)] overflow-y-auto scrollbar-hidden bg-black"
        style={{
          color: "var(--terminal-text)",
        }}
      >
        <div className="mb-4 space-y-1" style={{ color: "var(--terminal-text)" }}>
          <div>Microsoft(R) Windows 95</div>
          <div>(C)Copyright Aswin&apos;s Mind 2023</div>
          <div>Type &quot;help&quot; to begin exploration</div>
        </div>

        {commands.map((cmd, i) => (
          <div key={i} className="mb-1">
            {cmd.isCommand ? (
              <div style={{ color: "var(--terminal-text)", opacity: 0.8 }}>
                {cmd.dir}&gt; {cmd.text}
              </div>
            ) : (
              <div className="whitespace-pre" style={{ color: "var(--terminal-text)" }}>{cmd.text}</div>
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="mr-1" style={{ color: "var(--terminal-text)", opacity: 0.85 }}>{currentDir}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-black border-none outline-none focus:outline-none"
            style={{
              color: "var(--terminal-text)",
              caretColor: "var(--terminal-text)",
            }}
            autoFocus
            aria-label="Terminal input"
            spellCheck="false"
          />
        </form>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};

export default Terminal; 
