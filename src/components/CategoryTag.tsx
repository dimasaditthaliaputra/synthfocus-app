"use client";

import { Category } from "@/types";

interface CategoryTagProps {
  category: Category;
  className?: string;
}

const categoryConfig: Record<Category, { label: string; color: string; bg: string }> = {
  work: {
    label: "WORK",
    color: "text-pop-pink",
    bg: "bg-pop-pink/20",
  },
  college: {
    label: "COLLEGE",
    color: "text-pop-rose",
    bg: "bg-pop-rose/20",
  },
  coding: {
    label: "CODING",
    color: "text-pop-gold",
    bg: "bg-pop-gold/20",
  },
  other: {
    label: "OTHER",
    color: "text-sky-dark",
    bg: "bg-sky-dark/20",
  },
};

export function CategoryTag({ category, className = "" }: CategoryTagProps) {
  const config = categoryConfig[category];

  return (
    <span
      className={`
        inline-block
        font-pixel
        text-[8px]
        ${config.color}
        ${config.bg}
        border-2 border-current
        px-2 py-1
        uppercase
        tracking-wider
        ${className}
      `}
    >
      {config.label}
    </span>
  );
}
