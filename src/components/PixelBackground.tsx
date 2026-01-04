"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTheme, Theme } from "@/contexts/ThemeContext";

/**
 * Theme Configuration
 * - pink: 5 layers with animated airplane on layer 2
 * - twilight: 4 layers with twinkling stars on layer 2
 */
const THEME_CONFIG: Record<
  Theme,
  {
    path: string;
    layerCount: number;
    hasAirplaneAnimation: boolean;
    layerAlts: string[];
  }
> = {
  pink: {
    path: "/theme/pink",
    layerCount: 5,
    hasAirplaneAnimation: true,
    layerAlts: ["Sky background", "Airplane", "Distant clouds", "Mid-ground clouds", "Foreground clouds"],
  },
  twilight: {
    path: "/theme/twilight",
    layerCount: 4,
    hasAirplaneAnimation: false,
    layerAlts: ["Color background", "Stars", "Cloud layer 1", "Cloud layer 2"],
  },
};

export function PixelBackground() {
  const { theme } = useTheme();
  const config = THEME_CONFIG[theme];

  const [isFlying, setIsFlying] = useState(false);

  // Start a new flight
  const startFlight = useCallback(() => {
    setIsFlying(true);
  }, []);

  // Handle animation end - cooldown then restart
  const handleAnimationEnd = useCallback(() => {
    setIsFlying(false);

    // Random delay between 5-12 seconds before next flight
    const delay = 5000 + Math.random() * 7000;
    setTimeout(() => {
      startFlight();
    }, delay);
  }, [startFlight]);

  // Initial trigger for airplane animation (only for pink theme)
  useEffect(() => {
    if (!config.hasAirplaneAnimation) {
      setIsFlying(false);
      return;
    }

    const initialDelay = setTimeout(() => {
      startFlight();
    }, 1000);

    return () => clearTimeout(initialDelay);
  }, [startFlight, config.hasAirplaneAnimation]);

  const commonImageStyles = "w-full h-full object-cover absolute inset-0";
  const pixelatedStyle = { imageRendering: "pixelated" as const };

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-sky">
      {/* Layer 1: Base Background (z-0) - Static */}
      <Image
        src={`${config.path}/1.png`}
        alt={config.layerAlts[0]}
        fill
        priority
        className={`${commonImageStyles} z-0`}
        style={pixelatedStyle}
      />

      {/* Layer 2: Theme-specific animated layer */}
      {config.hasAirplaneAnimation ? (
        // Pink theme: Airplane with fly animation
        <div
          className={`absolute z-10 w-[80vw] h-[40vw] ${isFlying ? "animate-fly-across" : "opacity-0"}`}
          style={{
            top: 0,
            left: 0,
            ...pixelatedStyle,
          }}
          onAnimationEnd={handleAnimationEnd}
        >
          <Image
            src={`${config.path}/2.png`}
            alt={config.layerAlts[1]}
            fill
            className="object-contain"
            style={pixelatedStyle}
          />
        </div>
      ) : (
        // Twilight theme: Stars with twinkling animation
        <Image
          src={`${config.path}/2.png`}
          alt={config.layerAlts[1]}
          fill
          className={`${commonImageStyles} z-10 animate-twinkle`}
          style={pixelatedStyle}
        />
      )}

      {/* Layer 3: Cloud layer 1 (z-20) - Static */}
      <Image
        src={`${config.path}/3.png`}
        alt={config.layerAlts[2]}
        fill
        className={`${commonImageStyles} z-20`}
        style={pixelatedStyle}
      />

      {/* Layer 4: Cloud layer 2 (z-30) - Static */}
      <Image
        src={`${config.path}/4.png`}
        alt={config.layerAlts[3]}
        fill
        className={`${commonImageStyles} z-30`}
        style={pixelatedStyle}
      />

      {/* Layer 5: Foreground (z-40) - Only for Pink theme */}
      {config.layerCount >= 5 && (
        <Image
          src={`${config.path}/5.png`}
          alt={config.layerAlts[4]}
          fill
          className={`${commonImageStyles} z-40`}
          style={pixelatedStyle}
        />
      )}
    </div>
  );
}
