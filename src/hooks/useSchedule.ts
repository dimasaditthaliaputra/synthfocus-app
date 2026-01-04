"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ScheduleItem, DayOfWeek } from "@/types";

const STORAGE_KEY = "synthfocus_timetable";

// Day names for display
export const DAY_NAMES: Record<DayOfWeek, string> = {
  sun: "SUN",
  mon: "MON",
  tue: "TUE",
  wed: "WED",
  thu: "THU",
  fri: "FRI",
  sat: "SAT",
};

export const DAYS_ORDER: DayOfWeek[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// Get current day of week
export function getCurrentDayOfWeek(): DayOfWeek {
  const dayIndex = new Date().getDay();
  return DAYS_ORDER[dayIndex];
}

export function useSchedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Validate items have dayOfWeek field
          const validItems = parsed.filter(
            (item: ScheduleItem) => item.dayOfWeek && DAYS_ORDER.includes(item.dayOfWeek)
          );
          setSchedule(validItems);
        }
      }
    } catch (error) {
      console.error("Failed to load timetable from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsHydrated(true);
  }, []);

  // Auto-save to localStorage whenever schedule changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
      } catch (error) {
        console.error("Failed to save timetable to localStorage:", error);
      }
    }
  }, [schedule, isHydrated]);

  const addItem = useCallback((item: ScheduleItem) => {
    setSchedule((prev) => [...prev, item]);
  }, []);

  const addItems = useCallback((items: ScheduleItem[]) => {
    setSchedule((prev) => [...prev, ...items]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<ScheduleItem>) => {
    setSchedule((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setSchedule((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: item.status === "pending" ? "done" : "pending" } : item))
    );
  }, []);

  const clearSchedule = useCallback(() => {
    setSchedule([]);
  }, []);

  const clearScheduleByDay = useCallback((day: DayOfWeek) => {
    setSchedule((prev) => prev.filter((item) => item.dayOfWeek !== day));
  }, []);

  const replaceSchedule = useCallback((items: ScheduleItem[]) => {
    setSchedule(items);
  }, []);

  // Get tasks for a specific day of week
  const getTasksByDay = useCallback(
    (day: DayOfWeek): ScheduleItem[] => {
      return schedule
        .filter((item) => item.dayOfWeek === day)
        .sort((a, b) => {
          const timeA = a.time.replace(/[^0-9:]/g, "");
          const timeB = b.time.replace(/[^0-9:]/g, "");
          return timeA.localeCompare(timeB);
        });
    },
    [schedule]
  );

  // Get task count for a specific day (for indicators)
  const getTaskCountByDay = useCallback(
    (day: DayOfWeek): { total: number; pending: number; done: number } => {
      const tasks = schedule.filter((item) => item.dayOfWeek === day);
      return {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "pending").length,
        done: tasks.filter((t) => t.status === "done").length,
      };
    },
    [schedule]
  );

  // Sort schedule by day then time
  const sortedSchedule = useMemo(() => {
    return [...schedule].sort((a, b) => {
      const dayCompare = DAYS_ORDER.indexOf(a.dayOfWeek) - DAYS_ORDER.indexOf(b.dayOfWeek);
      if (dayCompare !== 0) return dayCompare;
      const timeA = a.time.replace(/[^0-9:]/g, "");
      const timeB = b.time.replace(/[^0-9:]/g, "");
      return timeA.localeCompare(timeB);
    });
  }, [schedule]);

  return {
    schedule: sortedSchedule,
    isHydrated,
    addItem,
    addItems,
    updateItem,
    deleteItem,
    toggleStatus,
    clearSchedule,
    clearScheduleByDay,
    replaceSchedule,
    getTasksByDay,
    getTaskCountByDay,
  };
}
