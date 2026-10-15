"use client";

import React from "react";
import Image from "next/image";
import { DesktopItemType } from "@/types";

const ProjectViewer = ({ name, description, image }: DesktopItemType) => {
  if (!description) return null;

  const caseStudyRows = [
    { label: "Role", value: description.role },
    { label: "Impact", value: description.impact },
    { label: "Source", value: description.source },
    { label: "Demo", value: description.demo },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  return (
    <div className="w-full p-4 relative text-base">
      <h2 className="text-3xl mb-4">{name}</h2>
      <hr className="border-t border-dashed border-gray-500 mb-4" />
      
      <div className="space-y-4">
        <div>
          <div className="font-bold mb-2 flex items-center gap-2">
            <span className="text-lg">🛠️</span>
            <span className="underline">Tech Stack:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {description.techStack.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[var(--secondary)]/20 border border-[var(--secondary)] rounded text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="font-bold mb-2 flex items-center gap-2">
            <span className="text-lg">📝</span>
            <span className="underline">Overview:</span>
          </div>
          <p className="leading-relaxed">{description.description}</p>
        </div>

        {caseStudyRows.length > 0 && (
          <div className="space-y-3 pt-1">
            {caseStudyRows.map((row) => (
              <div key={row.label} className="border-t border-dashed border-gray-500/60 pt-3">
                <div className="font-bold mb-1 text-sm tracking-wide uppercase opacity-80">
                  {row.label}
                </div>
                <p className="leading-relaxed">{row.value}</p>
              </div>
            ))}
          </div>
        )}
        
        {image && (
          <div>
            <div className="font-bold mb-2 flex items-center gap-2">
              <span className="text-lg">📸</span>
              <span className="underline">Preview:</span>
            </div>
            <div className="border-2 border-[var(--foreground)] p-1 cursor-zoom-in">
              <div className="relative">
                <Image
                  src={image}
                  alt={`${name} preview`}
                  width={640}
                  height={360}
                  className="w-full h-auto border border-[var(--secondary)]"
                />
                
                {image === "/images/txt.webp" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(45deg, transparent, transparent 49px, var(--foreground) 49px, var(--foreground) 50px, transparent 50px, transparent)',
                      backgroundSize: '70px 70px'
                    }}></div>
                    
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(-45deg, transparent, transparent 49px, var(--foreground) 49px, var(--foreground) 50px, transparent 50px, transparent)',
                      backgroundSize: '70px 70px'
                    }}></div>
                    
                    <div className="z-10 text-foreground bg-background px-4 py-2 rounded-full shadow-md border border-foreground/20">
                      no image found
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-center mt-1">
                Click to enlarge
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectViewer;
