'use client';

import Tray from "@/components/Tray";
import DesktopItem from "./DesktopItem";
import { DesktopProps,  } from "@/types";
import { rootItems } from "./DesktopItems";


const Desktop = ({ 
  onItemClick,
  viewStyle,
  setViewStyle,
  path,
  onBack,
  activePanel
}: DesktopProps) => {

  return (
    <div 
      className="relative h-full w-full overflow-y-auto md:px-4"
      role="application"
      aria-label="Desktop interface"
    >
      <Tray
        viewStyle={viewStyle}
        setViewStyle={setViewStyle}
        currentFolder={path}
        canGoBack={path.length > 0}
        onBack={onBack}
      />

      <DesktopItem
        items={rootItems}
        path={path}
        viewStyle={viewStyle}
        onItemClick={onItemClick}
        activePanel={activePanel}
      />
    </div>
  );
};

export default Desktop;