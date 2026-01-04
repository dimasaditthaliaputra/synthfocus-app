"use client";

import { useState, useEffect, useCallback } from "react";
import { ScheduleItem } from "@/types";

const STORAGE_KEY = "synthfocus_schedule";

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
          setSchedule(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load schedule from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Auto-save to localStorage whenever schedule changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
      } catch (error) {
        console.error("Failed to save schedule to localStorage:", error);
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

  const replaceSchedule = useCallback((items: ScheduleItem[]) => {
    setSchedule(items);
  }, []);

  // Sort schedule by time
  const sortedSchedule = [...schedule].sort((a, b) => {
    const timeA = a.time.replace(/[^0-9:]/g, "");
    const timeB = b.time.replace(/[^0-9:]/g, "");
    return timeA.localeCompare(timeB);
  });

  return {
    schedule: sortedSchedule,
    isHydrated,
    addItem,
    addItems,
    updateItem,
    deleteItem,
    toggleStatus,
    clearSchedule,
    replaceSchedule,
  };
}
