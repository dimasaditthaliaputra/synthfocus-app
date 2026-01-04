"use client";

import { ReactNode } from "react";

interface PixelCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "dark" | "accent";
}

export function PixelCard({ children, className = "", variant = "default" }: PixelCardProps) {
  const variantStyles = {
    default: "bg-cloud-white",
    dark: "bg-sky-dark",
    accent: "bg-cloud-cream",
  };

  return (
    <div
      className={`
        border-4 border-ink-border
        ${variantStyles[variant]}
        shadow-pixel
        rounded-none
        ${className}
      `}
    >
      {children}
    </div>
  );
}
