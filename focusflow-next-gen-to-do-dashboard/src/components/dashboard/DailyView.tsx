"use client";

import { motion } from "framer-motion";
import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import { CalendarDays } from "lucide-react";

interface DailyViewProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
  onMoveDate?: (taskId: string, newDate: Date) => void;
}

export function DailyView({ tasks, onEdit, onDelete, onToggleComplete, onMoveDate }: DailyViewProps) {
  const todayTasks = tasks.filter((task) => task.dueDate && isToday(task.dueDate));
  const tomorrowTasks = tasks.filter((task) => task.dueDate && isTomorrow(task.dueDate));
  const upcomingTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      isThisWeek(task.dueDate) &&
      !isToday(task.dueDate) &&
      !isTomorrow(task.dueDate)
  );
  const noDateTasks = tasks.filter((task) => !task.dueDate);

  const sections = [
    { title: "Today", tasks: todayTasks, icon: "🔥" },
    { title: "Tomorrow", tasks: tomorrowTasks, icon: "📅" },
    { title: "This Week", tasks: upcomingTasks, icon: "📆" },
    { title: "No Due Date", tasks: noDateTasks, icon: "📋" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold">Daily Tasks</h2>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-muted-foreground">
              {tasks.filter((t) => t.status === "todo").length} To Do
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-muted-foreground">
              {tasks.filter((t) => t.status === "in-progress").length} In Progress
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">
              {tasks.filter((t) => t.status === "completed").length} Completed
            </span>
          </div>
        </div>
      </motion.div>

      {/* Task Sections */}
      {sections.map((section, index) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {section.tasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{section.icon}</span>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <span className="text-sm text-muted-foreground">
                  ({section.tasks.length})
                </span>
              </div>
              <div className="grid gap-3">
                {section.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleComplete={onToggleComplete}
                    onMoveDate={onMoveDate}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}

      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <CalendarDays className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
          <p className="text-muted-foreground">
            Click the + button to create your first task
          </p>
        </motion.div>
      )}
    </div>
  );
}