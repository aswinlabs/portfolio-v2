'use client';

import { DesktopItemType, StartMenuProps } from "@/types";
import { rootItems } from "@/components/DesktopItems";
import { Power } from "lucide-react";

const StartMenu = ({
  isOpen,
  onClose,
  onItemClick,
  onTerminalOpen,
  onShutdown,
  togglePartyMode,
  partyMode,
}: StartMenuProps) => {
  const findItemById = (items: DesktopItemType[], id: number): DesktopItemType | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.subfolder) {
        const found = findItemById(item.subfolder, id);
        if (found) return found;
      }
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute bottom-12 left-0 w-64 bg-[color:var(--background)]
              border-2 border-[color:var(--foreground)] shadow-lg z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2 border-b border-[color:var(--primary)]">
        <div className="font-bold text-[color:var(--foreground)]">Portfolio OS</div>
      </div>
      <div className="p-1">
        <button
          onClick={() => {
            const profileItem = findItemById(rootItems, 1);
            if (profileItem) onItemClick(profileItem);
            onClose();
          }}
          className="w-full text-left px-2 py-1 hover:bg-[color:var(--primary)] hover:text-white flex items-center"
        >
          <span className="mr-2">📁 Profile</span>
        </button>
        <button
          onClick={() => {
            onTerminalOpen();
            onClose();
          }}
          className="w-full text-left px-2 py-1 hover:bg-[color:var(--primary)] hover:text-white flex items-center"
        >
          <span className="mr-2">💻 Terminal</span>
        </button>
        
        <div className="border-t border-[color:var(--primary)] my-1"></div>
        
        <button
          onClick={() => {
            togglePartyMode();
            onClose();
          }}
          className={`w-full text-left px-2 py-1 flex items-center ${
            partyMode ? 'bg-[color:var(--primary)] text-white' : 'hover:bg-[color:var(--primary)] hover:text-white'
          }`}
        >
          <span className="mr-2">🎉 {partyMode ? 'Party Mode ON!' : 'Party Mode'}</span>
        </button>
        
        <div className="border-t border-[color:var(--primary)] my-1"></div>
        
        <button
          onClick={() => {
            onShutdown();
            onClose();
          }}
          className="w-full text-left px-2 py-1 hover:bg-red-600 hover:text-white flex items-center"
        >
          <Power size={16} className="mr-2" />
          <span className="mr-2 flex"> Shutdown</span>
        </button>
      </div>
    </div>
  );
};

export default StartMenu;