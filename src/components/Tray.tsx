'use client';

import { TrayProps, ViewStyle } from "@/types";
import clsx from "clsx";
import { Grid2X2, LayoutList, ArrowLeft } from "lucide-react";

const Tray = ({ viewStyle, setViewStyle, currentFolder, canGoBack, onBack }: TrayProps) => {
  const renderPath = () => {
    if (viewStyle === "list" || !currentFolder || currentFolder.length === 0) {
      return "Desktop";
    }
    return "Desktop/" + currentFolder.map((item) => item.name).join("/");
  };

  return (
    <div className="border-y border-dashed border-gray-500 p-4 flex justify-between items-center z-20 hidden md:flex">
      <div className="flex items-center gap-2">
        {viewStyle === "grid" && canGoBack && (
          <button onClick={onBack} className="hover:opacity-80 transition">
            <ArrowLeft size={18} />
          </button>
        )}
        <span className="text-md">
          {renderPath()}
        </span>
      </div>

      <div className="bg-[var(--secondary)]/30 rounded-md p-1 flex gap-1 backdrop-blur-sm">
        {(["grid", "list"] as ViewStyle[]).map((style) => {
          const Icon = style === "grid" ? Grid2X2 : LayoutList;
          const isActive = viewStyle === style;
          return (
            <button
              key={style}
              type="button"
              className={clsx(
                "p-2 rounded transition-all duration-200",
                isActive
                  ? "bg-[var(--foreground)] text-white shadow-md"
                  : "text-[var(--text-secondary)] hover:bg-[var(--secondary)]"
              )}
              onClick={() => setViewStyle(style)}
            >
              <Icon size={14} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tray;
