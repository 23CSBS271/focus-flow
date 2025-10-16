"use client";

import { motion } from "framer-motion";
import { TaskCard } from "./TaskCard";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from "date-fns";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function WeeklyView({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  onMoveDate
}) {
  const now = new Date();
  const weekStart = startOfWeek(now, {
    weekStartsOn: 1
  });
  const weekEnd = endOfWeek(now, {
    weekStartsOn: 1
  });
  const daysOfWeek = eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  });
  const completedThisWeek = tasks.filter(task => task.status === "completed" && task.dueDate && task.dueDate >= weekStart && task.dueDate <= weekEnd).length;
  const totalThisWeek = tasks.filter(task => task.dueDate && task.dueDate >= weekStart && task.dueDate <= weekEnd).length;
  const completionRate = totalThisWeek > 0 ? Math.round(completedThisWeek / totalThisWeek * 100) : 0;

  // Prepare data for priority chart (Area Chart)
  const priorityData = [{
    name: "Low",
    value: tasks.filter(t => t.priority === "low").length,
    color: "#10b981"
  }, {
    name: "Medium",
    value: tasks.filter(t => t.priority === "medium").length,
    color: "#f59e0b"
  }, {
    name: "High",
    value: tasks.filter(t => t.priority === "high").length,
    color: "#ef4444"
  }, {
    name: "Urgent",
    value: tasks.filter(t => t.priority === "urgent").length,
    color: "#dc2626"
  }];

  // Prepare data for status chart (Bar Chart)
  const statusData = [{
    name: "To Do",
    value: tasks.filter(t => t.status === "todo").length,
    color: "#6b7280"
  }, {
    name: "In Progress",
    value: tasks.filter(t => t.status === "in-progress").length,
    color: "#3b82f6"
  }, {
    name: "Completed",
    value: tasks.filter(t => t.status === "completed").length,
    color: "#10b981"
  }];
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsx("h2", {
      className: "text-3xl font-bold",
      children: "Analytics"
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid grid-cols-1 md:grid-cols-2 gap-6",
      children: [/*#__PURE__*/_jsxs(Card, {
        className: "p-6",
        children: [/*#__PURE__*/_jsx("h3", {
          className: "text-lg font-semibold mb-4",
          children: "Task Priority Distribution"
        }), /*#__PURE__*/_jsx(ResponsiveContainer, {
          width: "100%",
          height: 300,
          children: /*#__PURE__*/_jsxs(AreaChart, {
            data: priorityData,
            children: [/*#__PURE__*/_jsx(CartesianGrid, {
              strokeDasharray: "3 3"
            }), /*#__PURE__*/_jsx(XAxis, {
              dataKey: "name"
            }), /*#__PURE__*/_jsx(YAxis, {}), /*#__PURE__*/_jsx(Tooltip, {}), /*#__PURE__*/_jsx(Area, {
              type: "monotone",
              dataKey: "value",
              stroke: "#8884d8",
              fill: "#8884d8",
              fillOpacity: 0.6
            })]
          })
        })]
      }), /*#__PURE__*/_jsxs(Card, {
        className: "p-6",
        children: [/*#__PURE__*/_jsx("h3", {
          className: "text-lg font-semibold mb-4",
          children: "Task Status Distribution"
        }), /*#__PURE__*/_jsx(ResponsiveContainer, {
          width: "100%",
          height: 300,
          children: /*#__PURE__*/_jsxs(BarChart, {
            data: statusData,
            children: [/*#__PURE__*/_jsx(CartesianGrid, {
              strokeDasharray: "3 3"
            }), /*#__PURE__*/_jsx(XAxis, {
              dataKey: "name"
            }), /*#__PURE__*/_jsx(YAxis, {}), /*#__PURE__*/_jsx(Tooltip, {}), /*#__PURE__*/_jsx(Bar, {
              dataKey: "value",
              fill: "#8884d8"
            })]
          })
        })]
      })]
    }), /*#__PURE__*/_jsxs(motion.div, {
      initial: {
        opacity: 0,
        y: -20
      },
      animate: {
        opacity: 1,
        y: 0
      },
      className: "flex items-center justify-between",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h2", {
          className: "text-3xl font-bold",
          children: "Weekly Overview"
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-muted-foreground mt-1",
          children: [format(weekStart, "MMM d"), " - ", format(weekEnd, "MMM d, yyyy")]
        })]
      }), /*#__PURE__*/_jsxs(Card, {
        className: "p-4 flex items-center gap-3",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center",
          children: /*#__PURE__*/_jsx(TrendingUp, {
            className: "w-6 h-6 text-white"
          })
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("p", {
            className: "text-2xl font-bold",
            children: [completionRate, "%"]
          }), /*#__PURE__*/_jsx("p", {
            className: "text-xs text-muted-foreground",
            children: "Completion Rate"
          })]
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-7 gap-4",
      children: daysOfWeek.map((day, index) => {
        const dayTasks = tasks.filter(task => task.dueDate && isSameDay(task.dueDate, day));
        const isToday = isSameDay(day, now);
        return /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            scale: 0.9
          },
          animate: {
            opacity: 1,
            scale: 1
          },
          transition: {
            delay: index * 0.05
          },
          className: "space-y-2",
          children: [/*#__PURE__*/_jsxs("div", {
            className: `text-center p-3 rounded-lg ${isToday ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`,
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-xs font-medium",
              children: format(day, "EEE")
            }), /*#__PURE__*/_jsx("p", {
              className: `text-2xl font-bold ${isToday ? "" : "text-muted-foreground"}`,
              children: format(day, "d")
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xs mt-1",
              children: [dayTasks.length, " task", dayTasks.length !== 1 ? "s" : ""]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-2",
            children: [dayTasks.slice(0, 3).map(task => /*#__PURE__*/_jsx("div", {
              className: "bg-card border border-border rounded-lg p-2 text-xs cursor-pointer hover:bg-accent transition-colors",
              onClick: () => onEdit?.(task),
              children: /*#__PURE__*/_jsx("p", {
                className: "font-medium truncate",
                children: task.title
              })
            }, task.id)), dayTasks.length > 3 && /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-muted-foreground text-center",
              children: ["+", dayTasks.length - 3, " more"]
            })]
          })]
        }, day.toISOString());
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "space-y-3",
      children: [/*#__PURE__*/_jsx("h3", {
        className: "text-lg font-semibold",
        children: "All Tasks This Week"
      }), /*#__PURE__*/_jsx("div", {
        className: "grid gap-3",
        children: tasks.filter(task => task.dueDate && task.dueDate >= weekStart && task.dueDate <= weekEnd).map(task => /*#__PURE__*/_jsx(TaskCard, {
          task: task,
          onEdit: onEdit,
          onToggleComplete: onToggleComplete,
          onMoveDate: onMoveDate
        }, task.id))
      })]
    })]
  });
}