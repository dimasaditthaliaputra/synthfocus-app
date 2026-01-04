"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface PixelTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const PixelTextarea = forwardRef<HTMLTextAreaElement, PixelTextareaProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block font-pixel text-xs text-ink-dim mb-2 uppercase">{label}</label>}
        <textarea
          ref={ref}
          className={`
            w-full
            font-terminal
            text-xl
            bg-cloud-white
            text-ink
            border-4 border-ink-border
            shadow-pixel-sm
            rounded-none
            px-4 py-3
            placeholder:text-ink-dim
            focus:outline-none
            focus:border-pop-pink
            focus:shadow-pixel-primary
            transition-colors
            resize-none
            min-h-[120px]
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

PixelTextarea.displayName = "PixelTextarea";
