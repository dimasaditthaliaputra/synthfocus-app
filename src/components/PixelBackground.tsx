"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

/**
 * PixelBackground - 5-layer parallax pixel art background with animated airplane
 *
 * Layers (back to front):
 * 1. 1.png - Sky Base (z-0, static)
 * 2. 2.png - Airplane (z-10, animated)
 * 3. 3.png - Distant Clouds (z-20, static)
 * 4. 4.png - Mid-ground Clouds (z-30, static)
 * 5. 5.png - Foreground Details (z-40, static)
 */
export function PixelBackground() {
  const [isFlying, setIsFlying] = useState(false);
  const [topPosition, setTopPosition] = useState(15); // Initial 15%

  // Start a new flight with random vertical position
  const startFlight = useCallback(() => {
    const newTop = Math.random() * 30; // 0-30% of viewport height
    setTopPosition(newTop);
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

  // Initial trigger
  useEffect(() => {
    // Start first flight after a short delay
    const initialDelay = setTimeout(() => {
      startFlight();
    }, 1000);

    return () => clearTimeout(initialDelay);
  }, [startFlight]);

  const commonImageStyles = "w-full h-full object-cover absolute inset-0";
  const pixelatedStyle = { imageRendering: "pixelated" as const };

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-sky">
      {/* Layer 1: Sky Base (z-0) - Static */}
      <Image
        src="/bg/1.png"
        alt="Sky background"
        fill
        priority
        className={`${commonImageStyles} z-0`}
        style={pixelatedStyle}
      />

      {/* Layer 2: Airplane - Animated */}
      <div
        className={`absolute z-10 w-[200px] h-[100px] ${isFlying ? "animate-fly-across" : "opacity-0"}`}
        style={{
          top: `${topPosition}%`,
          ...pixelatedStyle,
        }}
        onAnimationEnd={handleAnimationEnd}
      >
        <Image
          src="/bg/2.png"
          alt="Airplane"
          fill
          className="object-contain"
          style={{
            ...pixelatedStyle,
          }}
        />
      </div>

      {/* Layer 3: Distant Clouds/Mountains (z-20) - Static */}
      <Image src="/bg/3.png" alt="Distant clouds" fill className={`${commonImageStyles} z-20`} style={pixelatedStyle} />

      {/* Layer 4: Mid-ground Clouds (z-30) - Static */}
      <Image
        src="/bg/4.png"
        alt="Mid-ground clouds"
        fill
        className={`${commonImageStyles} z-30`}
        style={pixelatedStyle}
      />

      {/* Layer 5: Foreground Details (z-40) - Static */}
      <Image
        src="/bg/5.png"
        alt="Foreground clouds"
        fill
        className={`${commonImageStyles} z-40`}
        style={pixelatedStyle}
      />
    </div>
  );
}
