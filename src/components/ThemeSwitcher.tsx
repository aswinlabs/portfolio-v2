"use client";
import { useEffect, useState } from "react";
import { applyTheme, defaultTheme, getSavedTheme, themes } from "@/lib/themes";

const ThemeSwitcher=()=> {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme.className);
  const [currentVars, setCurrentVars] = useState(defaultTheme.vars);

  useEffect(() => {
    const foundTheme = applyTheme(getSavedTheme().className);
    setCurrentTheme(foundTheme.className);
    setCurrentVars(foundTheme.vars);
  }, []);

  const switchTheme = (themeClass: string) => {
    const selectedTheme = applyTheme(themeClass);
    setCurrentVars(selectedTheme.vars);
    setCurrentTheme(selectedTheme.className);
  };

  return (
    
    <div className="w-full p-4 relative text-base  flex flex-col">
      <h2 className="text-3xl mb-4">🎨 Theme Switcher</h2>
      <hr className="border-t border-dashed border-gray-500 mb-4" />

      <div
        className="p-3 flex flex-col flex-grow"
        style={{
          borderColor: currentVars.foreground,
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        {/* Theme Selector */}
        <div className="mb-3">
          <div className="text-sm mb-2 font-bold">Select Color Scheme:</div>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((t) => (
              <button
                key={t.className}
                onClick={() => switchTheme(t.className)}
                className="w-full p-2 flex flex-col items-center text-xs transition-all duration-200"
                style={{
                  backgroundColor: t.vars.background,
                  color: t.vars.foreground,
                  border: `1px solid ${t.vars.foreground}`,
                  outline: currentTheme === t.className ? `2px solid ${t.vars.primary}` : "none",
                }}
              >
                <div className="flex gap-1 mb-1">
                  <div
                    className="w-4 h-4"
                    style={{
                      backgroundColor: t.vars.background,
                      border: `1px solid ${t.vars.foreground}`,
                    }}
                  />
                  <div
                    className="w-4 h-4"
                    style={{
                      backgroundColor: t.vars.foreground,
                      border: `1px solid ${t.vars.foreground}`,
                    }}
                  />
                  <div
                    className="w-4 h-4"
                    style={{
                      backgroundColor: t.vars.primary,
                      border: `1px solid ${t.vars.foreground}`,
                    }}
                  />
                </div>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

    
      </div>
    </div>
  );
}
export default ThemeSwitcher
