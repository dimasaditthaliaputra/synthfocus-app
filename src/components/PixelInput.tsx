"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PixelInput = forwardRef<HTMLInputElement, PixelInputProps>(({ label, className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block font-pixel text-xs text-sf-text-muted mb-2 uppercase">{label}</label>}
      <input
        ref={ref}
        className={`
            w-full
            font-terminal
            text-xl
            bg-black
            text-sf-success
            border-4 border-sf-border
            shadow-pixel-sm
            rounded-none
            px-4 py-3
            placeholder:text-sf-text-muted
            focus:outline-none
            focus:border-sf-primary
            focus:shadow-pixel-primary
            transition-colors
            ${className}
          `}
        {...props}
      />
    </div>
  );
});

PixelInput.displayName = "PixelInput";
