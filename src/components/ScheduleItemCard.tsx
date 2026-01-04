"use client";

import { ScheduleItem } from "@/types";
import { CategoryTag } from "./CategoryTag";
import { PixelButton } from "./PixelButton";
import { Check, Pencil, Trash2, Clock } from "lucide-react";

interface ScheduleItemCardProps {
  item: ScheduleItem;
  onToggleStatus: (id: string) => void;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

export function ScheduleItemCard({ item, onToggleStatus, onEdit, onDelete }: ScheduleItemCardProps) {
  const isDone = item.status === "done";

  return (
    <div
      className={`
        border-4 border-sf-border
        bg-sf-panel
        shadow-pixel-sm
        rounded-none
        p-4
        transition-all
        ${isDone ? "opacity-60" : ""}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggleStatus(item.id)}
          className={`
            w-8 h-8
            border-4 border-sf-border
            flex items-center justify-center
            cursor-pointer
            transition-colors
            flex-shrink-0
            mt-1
            ${isDone ? "bg-sf-success" : "bg-sf-bg-dark hover:bg-sf-accent"}
          `}
          aria-label={isDone ? "Mark as pending" : "Mark as done"}
        >
          {isDone && <Check size={16} className="text-black" strokeWidth={4} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-2 text-sf-warning font-terminal text-lg">
              <Clock size={16} strokeWidth={3} />
              <span>{item.time}</span>
            </div>
            <CategoryTag category={item.category} />
          </div>
          <p
            className={`
              font-terminal text-xl text-sf-text
              ${isDone ? "line-through text-sf-text-muted" : ""}
            `}
          >
            {item.activity}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <PixelButton variant="secondary" size="sm" onClick={() => onEdit(item)} aria-label="Edit task">
            <Pencil size={14} strokeWidth={3} />
          </PixelButton>
          <PixelButton variant="danger" size="sm" onClick={() => onDelete(item.id)} aria-label="Delete task">
            <Trash2 size={14} strokeWidth={3} />
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
