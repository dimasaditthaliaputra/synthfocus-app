export type DayOfWeek = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface ScheduleItem {
  id: string;
  dayOfWeek: DayOfWeek; // Recurring day (not a specific date)
  time: string;
  activity: string;
  category: "work" | "college" | "coding" | "other";
  status: "pending" | "done";
}

export type Category = ScheduleItem["category"];
export type Status = ScheduleItem["status"];
