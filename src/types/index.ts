export interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  category: "work" | "college" | "coding" | "other";
  status: "pending" | "done";
}

export type Category = ScheduleItem["category"];
export type Status = ScheduleItem["status"];
