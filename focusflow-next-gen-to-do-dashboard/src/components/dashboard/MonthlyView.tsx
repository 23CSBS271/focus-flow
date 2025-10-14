"use client";

import { motion } from "framer-motion";
import { Task } from "@/types/task";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface MonthlyViewProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
}

export function MonthlyView({ tasks, onEdit }: MonthlyViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold">Monthly Calendar</h2>
          <p className="text-muted-foreground mt-1">{format(currentDate, "MMMM yyyy")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Calendar */}
      <Card className="p-4">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-sm text-muted-foreground p-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const dayTasks = tasks.filter(
              (task) => task.dueDate && isSameDay(task.dueDate, day)
            );
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`min-h-[100px] border rounded-lg p-2 ${
                  isToday
                    ? "bg-primary/10 border-primary"
                    : "border-border hover:bg-accent"
                } ${!isCurrentMonth ? "opacity-40" : ""} transition-colors cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-semibold ${
                      isToday ? "text-primary" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="text-xs p-1 rounded bg-card truncate"
                      onClick={() => onEdit?.(task)}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayTasks.length - 2}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Total Tasks",
            value: tasks.filter(
              (t) =>
                t.dueDate &&
                t.dueDate >= monthStart &&
                t.dueDate <= monthEnd
            ).length,
            color: "from-blue-500 to-cyan-500",
          },
          {
            label: "Completed",
            value: tasks.filter(
              (t) =>
                t.status === "completed" &&
                t.dueDate &&
                t.dueDate >= monthStart &&
                t.dueDate <= monthEnd
            ).length,
            color: "from-green-500 to-emerald-500",
          },
          {
            label: "In Progress",
            value: tasks.filter(
              (t) =>
                t.status === "in-progress" &&
                t.dueDate &&
                t.dueDate >= monthStart &&
                t.dueDate <= monthEnd
            ).length,
            color: "from-yellow-500 to-orange-500",
          },
          {
            label: "Overdue",
            value: tasks.filter(
              (t) =>
                t.dueDate &&
                t.dueDate < new Date() &&
                t.status !== "completed"
            ).length,
            color: "from-red-500 to-pink-500",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} mb-3`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}