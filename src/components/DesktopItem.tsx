'use client';

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";
import { DesktopItemProps, DesktopItemType } from "@/types";

const DesktopItem = ({ items, path, viewStyle, onItemClick, activePanel }: DesktopItemProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string | number>>(new Set());

  const currentItems = useMemo(() => {
    if (viewStyle === "grid") {
      if (path.length === 0) return items;
      const lastItem = path[path.length - 1];
      if (lastItem?.type === "folder") return lastItem.subfolder ?? [];
      if (path.length > 1) return path[path.length - 2]?.subfolder ?? items;
      return items;
    }
    return items;
  }, [items, path, viewStyle]);

  useEffect(() => {
    setExpandedIds(prev => {
      const newExpandedIds = new Set(prev);
      const pathIds = new Set(path.map(item => item.id));
      
      pathIds.forEach(id => newExpandedIds.add(id));
      
      prev.forEach(id => {
        if (!pathIds.has(id)) newExpandedIds.delete(id);
      });

      return newExpandedIds;
    });
  }, [path]);

  const handleItemClick = useCallback((item: DesktopItemType) => {
    onItemClick(item);
  }, [onItemClick]);

  const isItemActive = useCallback((item: DesktopItemType) => {
    return activePanel?.id === item.id;
  }, [activePanel]);

  return (
    <div
      className={clsx(
        "p-2 z-0",
        viewStyle === "grid"
          ? ["grid gap-4 auto-rows-min", activePanel ? "grid-cols-4" : "grid-cols-6"]
          : "flex flex-col w-full",
      )}
    >
      {currentItems.length === 0 ? (
        <div className={clsx(
          "text-sm text-gray-400 col-span-12",
          viewStyle === "list" ? "text-start" : "text-center py-4"
        )}>
          Coming soon...
        </div>
      ) : (
        currentItems.map((item) => (
          <div 
            key={item.id} 
            className={clsx(
              "flex flex-col",
            )}
          >
            <div
              onClick={() => handleItemClick(item)}
              className={clsx(
                "group flex cursor-pointer transition-all",
                viewStyle === "grid"
                  ? "flex-col items-center text-center p-1"
                  : "flex-row items-center gap-2 p-1",
                isItemActive(item) && "bg-blue-100/20"
              )}
            >
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: viewStyle === "grid" ? "42px" : "20px",
                  height: viewStyle === "grid" ? "42px" : "20px",
                }}
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={viewStyle === "grid" ? 42 : 20}
                    height={viewStyle === "grid" ? 42 : 20}
                    className={clsx(
                      "object-contain filter grayscale contrast-150",
                      isItemActive(item) && "grayscale-0 contrast-100"
                    )}
                    style={{ imageRendering: "pixelated" }}
                  />
                )}
              </div>

              <span className="text-md flex items-center">
                {item.name}
                {viewStyle === "list" && item.type === "folder" && item.subfolder && (
                  <span
                    className={clsx(
                      "inline-block ml-2 mt-[-2px] transition-transform duration-300 text-lg font-mono leading-none",
                      expandedIds.has(item.id) ? "rotate-90" : "rotate-0"
                    )}
                  >
                    ⬎
                  </span>                    
                )}
              </span>
            </div>

            {viewStyle === "list" &&
              item.type === "folder" &&
              expandedIds.has(item.id) &&
              item.subfolder && (
                <div className="ml-6 border-l border-dashed border-gray-500 pl-2">
                  <DesktopItem
                    items={item.subfolder}
                    path={path.filter((p) => p.id !== item.id)}
                    viewStyle={viewStyle}
                    onItemClick={onItemClick}
                    activePanel={activePanel}
                  />
                </div>
              )}
          </div>
        ))
      )}
    </div>
  );
};

export default DesktopItem;