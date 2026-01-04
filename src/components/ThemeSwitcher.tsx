"use client";

import { useState } from "react";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { Moon, Sun, Palette } from "lucide-react";

const THEMES: { value: Theme; label: string; icon: typeof Moon }[] = [
  { value: "pink", label: "Cotton Candy", icon: Sun },
  { value: "twilight", label: "Twilight Zone", icon: Moon },
];

export function ThemeSwitcher() {
  const { theme, setTheme, isTransitioning, transitionStage } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <>
      {/* Screen Wipe Overlay - Two Stage Animation */}
      {isTransitioning && (
        <div className={`screen-wipe ${transitionStage === "wipe-in" ? "screen-wipe-in" : "screen-wipe-out"}`} />
      )}

      {/* Theme Switcher Button */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Expanded Menu */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 animate-pixel-popup">
            <div className="bg-cloud-white border-4 border-ink-border shadow-pixel p-2 space-y-2">
              {THEMES.map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => handleThemeChange(t.value)}
                    disabled={isTransitioning}
                    className={`
                      flex items-center gap-2 w-full px-3 py-2
                      font-terminal text-lg uppercase tracking-wide
                      border-4 border-ink-border
                      transition-colors
                      ${
                        isActive
                          ? "bg-pop-pink text-cloud-white shadow-pixel-sm"
                          : "bg-cloud-cream text-ink hover:bg-sky-light"
                      }
                      ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <Icon size={18} strokeWidth={3} />
                    <span className="whitespace-nowrap">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center justify-center
            w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2
            font-terminal text-lg uppercase
            bg-pop-pink text-cloud-white
            border-4 border-ink-border
            shadow-pixel
            btn-pixel
            transition-colors
            hover:bg-pop-rose
          `}
        >
          <Palette size={20} strokeWidth={3} className="md:mr-2" />
          <span className="hidden md:inline">Theme</span>
        </button>
      </div>
    </>
  );
}
