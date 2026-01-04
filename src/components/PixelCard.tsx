"use client";

import { ReactNode } from "react";

interface PixelCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "dark" | "accent";
}

export function PixelCard({ children, className = "", variant = "default" }: PixelCardProps) {
  const variantStyles = {
    default: "bg-sf-panel",
    dark: "bg-sf-bg-dark",
    accent: "bg-sf-accent",
  };

  return (
    <div
      className={`
        border-4 border-sf-border
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
