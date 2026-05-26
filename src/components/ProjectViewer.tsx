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
  ].filter((row) => row.value);

  return (
    <div className="w-full p-4 relative text-base">
      <h2 className="text-3xl mb-4">{name}</h2>
      <hr className="border-t border-dashed border-gray-500 mb-4" />
      <div className="p-4 space-y-4">
        <div>
          <div className="font-bold mb-2 flex items-center gap-2">
            <span className="text-lg">💾</span>
            <span className="underline">Tech Stack:</span>
          </div>
          <ul className="list-disc pl-6 space-y-1">
            {description.techStack.map((tech) => (
              <li key={tech}>
                {tech}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <div className="font-bold mb-2 flex items-center gap-2">
            <span className="text-lg">📜</span>
            <span className="underline">Description:</span>
          </div>
          <p className="whitespace-pre-line p-2 border border-[var(--foreground)] shadow-inner">
            {description.description}
          </p>
        </div>

        {caseStudyRows.length > 0 && (
          <div>
            <div className="font-bold mb-2 flex items-center gap-2">
              <span className="text-lg">🗂</span>
              <span className="underline">Private Case Study:</span>
            </div>
            <dl className="border border-[var(--foreground)] shadow-inner">
              {caseStudyRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[88px_1fr] gap-2 border-b border-dashed border-[var(--foreground)] last:border-b-0 p-2"
                >
                  <dt className="font-bold">{row.label}:</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
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
