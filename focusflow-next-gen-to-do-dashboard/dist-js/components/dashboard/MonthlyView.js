"use client";

import { motion } from "framer-motion";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isSameMonth, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function MonthlyView({
  tasks,
  onEdit
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, {
    weekStartsOn: 0
  });
  const calendarEnd = endOfWeek(monthEnd, {
    weekStartsOn: 0
  });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsxs(motion.div, {
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
          children: "Monthly Calendar"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-muted-foreground mt-1",
          children: format(currentDate, "MMMM yyyy")
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2",
        children: [/*#__PURE__*/_jsx(Button, {
          variant: "outline",
          size: "sm",
          onClick: prevMonth,
          children: /*#__PURE__*/_jsx(ChevronLeft, {
            className: "w-4 h-4"
          })
        }), /*#__PURE__*/_jsx(Button, {
          variant: "outline",
          size: "sm",
          onClick: () => setCurrentDate(new Date()),
          children: "Today"
        }), /*#__PURE__*/_jsx(Button, {
          variant: "outline",
          size: "sm",
          onClick: nextMonth,
          children: /*#__PURE__*/_jsx(ChevronRight, {
            className: "w-4 h-4"
          })
        })]
      })]
    }), /*#__PURE__*/_jsxs(Card, {
      className: "p-4",
      children: [/*#__PURE__*/_jsx("div", {
        className: "grid grid-cols-7 gap-2 mb-2",
        children: weekDays.map(day => /*#__PURE__*/_jsx("div", {
          className: "text-center font-semibold text-sm text-muted-foreground p-2",
          children: day
        }, day))
      }), /*#__PURE__*/_jsx("div", {
        className: "grid grid-cols-7 gap-2",
        children: calendarDays.map((day, index) => {
          const dayTasks = tasks.filter(task => task.dueDate && isSameDay(task.dueDate, day));
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentDate);
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
              delay: index * 0.01
            },
            className: `min-h-[100px] border rounded-lg p-2 ${isToday ? "bg-primary/10 border-primary" : "border-border hover:bg-accent"} ${!isCurrentMonth ? "opacity-40" : ""} transition-colors cursor-pointer`,
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between mb-1",
              children: [/*#__PURE__*/_jsx("span", {
                className: `text-sm font-semibold ${isToday ? "text-primary" : ""}`,
                children: format(day, "d")
              }), dayTasks.length > 0 && /*#__PURE__*/_jsx("span", {
                className: "text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center",
                children: dayTasks.length
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "space-y-1",
              children: [dayTasks.slice(0, 2).map(task => /*#__PURE__*/_jsx("div", {
                className: "text-xs p-1 rounded bg-card truncate",
                onClick: () => onEdit?.(task),
                children: task.title
              }, task.id)), dayTasks.length > 2 && /*#__PURE__*/_jsxs("div", {
                className: "text-xs text-muted-foreground text-center",
                children: ["+", dayTasks.length - 2]
              })]
            })]
          }, day.toISOString());
        })
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-4 gap-4",
      children: [{
        label: "Total Tasks",
        value: tasks.filter(t => t.dueDate && t.dueDate >= monthStart && t.dueDate <= monthEnd).length,
        color: "from-blue-500 to-cyan-500"
      }, {
        label: "Completed",
        value: tasks.filter(t => t.status === "completed" && t.dueDate && t.dueDate >= monthStart && t.dueDate <= monthEnd).length,
        color: "from-green-500 to-emerald-500"
      }, {
        label: "In Progress",
        value: tasks.filter(t => t.status === "in-progress" && t.dueDate && t.dueDate >= monthStart && t.dueDate <= monthEnd).length,
        color: "from-yellow-500 to-orange-500"
      }, {
        label: "Overdue",
        value: tasks.filter(t => t.dueDate && t.dueDate < new Date() && t.status !== "completed").length,
        color: "from-red-500 to-pink-500"
      }].map((stat, index) => /*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0,
          y: 20
        },
        animate: {
          opacity: 1,
          y: 0
        },
        transition: {
          delay: index * 0.1
        },
        children: /*#__PURE__*/_jsxs(Card, {
          className: "p-4",
          children: [/*#__PURE__*/_jsx("div", {
            className: `w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} mb-3`
          }), /*#__PURE__*/_jsx("p", {
            className: "text-2xl font-bold",
            children: stat.value
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm text-muted-foreground",
            children: stat.label
          })]
        })
      }, stat.label))
    })]
  });
}