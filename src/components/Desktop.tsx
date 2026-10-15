'use client';

import Tray from "@/components/Tray";
import DesktopItem from "./DesktopItem";
import { DesktopProps,  } from "@/types";
import { rootItems } from "./DesktopItems";

const featuredProjects = [35, 34, 37].flatMap(id =>
  rootItems.find(item => item.id === 3)?.subfolder?.filter(item => item.id === id) ?? []
);

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
      aria-label="Portfolio projects and desktop"
    >
      {path.length === 0 && !activePanel && (
        <section aria-labelledby="selected-work-heading" className="pb-8 pt-4">
          <h2 id="selected-work-heading" className="text-3xl mb-2">Selected work</h2>
          <p className="font-sans text-sm mb-6">A closer look at what I build, my role, and the technology behind it.</p>
          <div className="divide-y divide-dashed divide-[var(--foreground)]">
            {featuredProjects.map(project => (
              <button
                key={project.id}
                type="button"
                onClick={() => onItemClick(project)}
                className="block w-full text-left py-5 focus-visible:outline-2 focus-visible:outline-offset-2 group"
              >
                <span className="flex items-center justify-between gap-4 text-2xl group-hover:underline underline-offset-4">
                  {project.name}<span aria-hidden="true">↗</span>
                </span>
                <span className="block font-sans text-sm leading-relaxed mt-2 max-w-prose">
                  {project.description?.impact ?? project.description?.description}
                </span>
                <span className="block font-sans text-xs leading-relaxed mt-3">
                  {project.description?.techStack.join(' · ')}
                </span>
                <span className="block mt-3 text-base underline underline-offset-4">View case study</span>
              </button>
            ))}
          </div>
        </section>
      )}

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
