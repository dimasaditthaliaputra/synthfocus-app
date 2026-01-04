"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type Theme = "pink" | "twilight" | "midnight-zone";
export type TransitionStage = "idle" | "wipe-in" | "wipe-out";

const VALID_THEMES: Theme[] = ["pink", "twilight", "midnight-zone"];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isTransitioning: boolean;
  transitionStage: TransitionStage;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("pink");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStage, setTransitionStage] = useState<TransitionStage>("idle");
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("synthfocus-theme") as Theme;
    if (savedTheme && VALID_THEMES.includes(savedTheme)) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
    setMounted(true);
  }, []);

  // Theme change with two-stage transition
  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (newTheme === theme || isTransitioning) return;

      // Step 1: Start wipe-in animation
      setIsTransitioning(true);
      setTransitionStage("wipe-in");

      // Step 2: After wipe-in covers screen, change theme
      setTimeout(() => {
        setThemeState(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("synthfocus-theme", newTheme);

        // Step 3: Start wipe-out animation to reveal new theme
        setTransitionStage("wipe-out");

        // Step 4: After wipe-out, cleanup
        setTimeout(() => {
          setTransitionStage("idle");
          setIsTransitioning(false);
        }, 400);
      }, 400);
    },
    [theme, isTransitioning]
  );

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isTransitioning, transitionStage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
