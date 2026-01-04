"use client";

import { Category } from "@/types";

interface CategoryTagProps {
  category: Category;
  className?: string;
}

const categoryConfig: Record<Category, { label: string; color: string; bg: string }> = {
  work: {
    label: "WORK",
    color: "text-sf-cat-work",
    bg: "bg-sf-cat-work/20",
  },
  college: {
    label: "COLLEGE",
    color: "text-sf-cat-college",
    bg: "bg-sf-cat-college/20",
  },
  coding: {
    label: "CODING",
    color: "text-sf-cat-coding",
    bg: "bg-sf-cat-coding/20",
  },
  other: {
    label: "OTHER",
    color: "text-sf-cat-other",
    bg: "bg-sf-cat-other/20",
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
