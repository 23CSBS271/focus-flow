export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskCategory = "personal" | "work" | "health" | "shopping" | "other";
export type ViewMode = "daily" | "weekly" | "monthly" | "kanban" | "calendar";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
