"use client";

import { motion } from "framer-motion";
import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from "date-fns";
import { TrendingUp, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

interface WeeklyViewProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
  onMoveDate?: (taskId: string, newDate: Date) => void;
}

export function WeeklyView({ tasks, onEdit, onDelete, onToggleComplete, onMoveDate }: WeeklyViewProps) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const completedThisWeek = tasks.filter(
    (task) =>
      task.status === "completed" &&
      task.dueDate &&
      task.dueDate >= weekStart &&
      task.dueDate <= weekEnd
  ).length;

  const totalThisWeek = tasks.filter(
    (task) =>
      task.dueDate &&
      task.dueDate >= weekStart &&
      task.dueDate <= weekEnd
  ).length;

  const completionRate = totalThisWeek > 0 ? Math.round((completedThisWeek / totalThisWeek) * 100) : 0;

  // Prepare data for priority chart (Area Chart)
  const priorityData = [
    { name: "Low", value: tasks.filter(t => t.priority === "low").length, color: "#10b981" },
    { name: "Medium", value: tasks.filter(t => t.priority === "medium").length, color: "#f59e0b" },
    { name: "High", value: tasks.filter(t => t.priority === "high").length, color: "#ef4444" },
    { name: "Urgent", value: tasks.filter(t => t.priority === "urgent").length, color: "#dc2626" },
  ];

  // Prepare data for status chart (Bar Chart)
  const statusData = [
    { name: "To Do", value: tasks.filter(t => t.status === "todo").length, color: "#6b7280" },
    { name: "In Progress", value: tasks.filter(t => t.status === "in-progress").length, color: "#3b82f6" },
    { name: "Completed", value: tasks.filter(t => t.status === "completed").length, color: "#10b981" },
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
          <h2 className="text-3xl font-bold">Weekly Overview</h2>
          <p className="text-muted-foreground mt-1">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </p>
        </div>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">Completion Rate</p>
          </div>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Distribution Chart - Area Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Task Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Distribution Chart - Bar Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Week Days Grid */}
      <div className="grid grid-cols-7 gap-4">
        {daysOfWeek.map((day, index) => {
          const dayTasks = tasks.filter(
            (task) => task.dueDate && isSameDay(task.dueDate, day)
          );
          const isToday = isSameDay(day, now);

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2"
            >
              <div
                className={`text-center p-3 rounded-lg ${
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <p className="text-xs font-medium">{format(day, "EEE")}</p>
                <p className={`text-2xl font-bold ${isToday ? "" : "text-muted-foreground"}`}>
                  {format(day, "d")}
                </p>
                <p className="text-xs mt-1">
                  {dayTasks.length} task{dayTasks.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="space-y-2">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="bg-card border border-border rounded-lg p-2 text-xs cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => onEdit?.(task)}
                  >
                    <p className="font-medium truncate">{task.title}</p>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{dayTasks.length - 3} more
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* All Tasks This Week */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">All Tasks This Week</h3>
        <div className="grid gap-3">
          {tasks
            .filter(
              (task) =>
                task.dueDate &&
                task.dueDate >= weekStart &&
                task.dueDate <= weekEnd
            )
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onToggleComplete={onToggleComplete}
                onMoveDate={onMoveDate}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
