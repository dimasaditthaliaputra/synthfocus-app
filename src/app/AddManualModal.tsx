"use client";

import { useState } from "react";
import { ScheduleItem, Category } from "@/types";
import { PixelCard, PixelButton, PixelInput } from "@/components";
import { X, Plus } from "lucide-react";

interface AddManualModalProps {
  onSave: (item: Omit<ScheduleItem, "id" | "status">) => void;
  onClose: () => void;
}

const categories: { value: Category; label: string }[] = [
  { value: "work", label: "WORK" },
  { value: "college", label: "COLLEGE" },
  { value: "coding", label: "CODING" },
  { value: "other", label: "OTHER" },
];

export function AddManualModal({ onSave, onClose }: AddManualModalProps) {
  const [time, setTime] = useState("");
  const [activity, setActivity] = useState("");
  const [category, setCategory] = useState<Category>("other");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      time,
      activity,
      category,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/80" onClick={onClose} />

      {/* Modal */}
      <PixelCard className="relative w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-pixel text-sm text-pop-pink uppercase tracking-wider">New Quest</h2>
          <button onClick={onClose} className="text-ink-dim hover:text-ink transition-colors">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PixelInput
            label="Time"
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="08:00 or 8:00 AM"
            required
          />

          <PixelInput
            label="Activity"
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="What are you doing?"
            required
          />

          <div>
            <label className="block font-pixel text-xs text-ink-dim mb-2 uppercase">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`
                    font-terminal text-lg
                    border-4 border-ink-border
                    px-4 py-2
                    transition-colors
                    ${
                      category === cat.value
                        ? "bg-pop-pink text-cloud-white shadow-pixel-sm"
                        : "bg-cloud-cream text-ink hover:bg-sky-light"
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <PixelButton type="submit" variant="success" className="flex-1">
              <Plus size={18} className="mr-2" strokeWidth={3} />
              ADD QUEST
            </PixelButton>
            <PixelButton type="button" variant="secondary" onClick={onClose}>
              CANCEL
            </PixelButton>
          </div>
        </form>
      </PixelCard>
    </div>
  );
}
