"use client";

import { useState } from "react";
import { DayOfWeek } from "@/types";
import { DAY_NAMES, DAYS_ORDER } from "@/hooks/useSchedule";

interface WeeklyNavProps {
  selectedDay: DayOfWeek;
  onChange: (day: DayOfWeek) => void;
  getTaskCount: (day: DayOfWeek) => { total: number; pending: number; done: number };
}

export function WeeklyNav({ selectedDay, onChange, getTaskCount }: WeeklyNavProps) {
  const [hoveredDay, setHoveredDay] = useState<DayOfWeek | null>(null);

  return (
    <div className="mb-6">
      {/* 7-Day Grid - No dates, just day names */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {DAYS_ORDER.map((day) => {
          const isSelected = day === selectedDay;
          const taskInfo = getTaskCount(day);
          const isHovered = hoveredDay === day;

          return (
            <div key={day} className="relative">
              <button
                onClick={() => onChange(day)}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`
                  w-full p-2 md:p-4
                  border-4 transition-all
                  flex flex-col items-center justify-center
                  ${
                    isSelected
                      ? "bg-pop-pink text-cloud-white border-ink-border shadow-pixel-sm"
                      : "bg-cloud-cream text-ink border-ink-border hover:bg-sky-light"
                  }
                `}
              >
                <span className="font-pixel text-[8px] md:text-xs">{DAY_NAMES[day]}</span>
                {taskInfo.total > 0 && (
                  <div className="flex gap-1 mt-2">
                    {taskInfo.pending > 0 && (
                      <span className="w-2 h-2 bg-pop-gold rounded-none" title={`${taskInfo.pending} pending`} />
                    )}
                    {taskInfo.done > 0 && (
                      <span className="w-2 h-2 bg-emerald-500 rounded-none" title={`${taskInfo.done} done`} />
                    )}
                  </div>
                )}
              </button>

              {/* Hover Tooltip */}
              {isHovered && taskInfo.total > 0 && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 animate-pixel-popup">
                  <div className="bg-cloud-white border-4 border-ink-border shadow-pixel p-2 whitespace-nowrap">
                    <p className="font-terminal text-sm text-ink">
                      <span className="text-pop-gold">{taskInfo.pending}</span> pending
                      {" • "}
                      <span className="text-emerald-600">{taskInfo.done}</span> done
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
