"use client";

import { motion } from "framer-motion";
import { TaskCard } from "./TaskCard";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import { CalendarDays } from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DailyView({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  onMoveDate
}) {
  const todayTasks = tasks.filter(task => task.dueDate && isToday(task.dueDate));
  const tomorrowTasks = tasks.filter(task => task.dueDate && isTomorrow(task.dueDate));
  const upcomingTasks = tasks.filter(task => task.dueDate && isThisWeek(task.dueDate) && !isToday(task.dueDate) && !isTomorrow(task.dueDate));
  const noDateTasks = tasks.filter(task => !task.dueDate);
  const sections = [{
    title: "Today",
    tasks: todayTasks,
    icon: "🔥"
  }, {
    title: "Tomorrow",
    tasks: tomorrowTasks,
    icon: "📅"
  }, {
    title: "This Week",
    tasks: upcomingTasks,
    icon: "📆"
  }, {
    title: "No Due Date",
    tasks: noDateTasks,
    icon: "📋"
  }];
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
          children: "Daily Tasks"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-muted-foreground mt-1",
          children: format(new Date(), "EEEE, MMMM d, yyyy")
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-4 text-sm",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-3 h-3 rounded-full bg-blue-500"
          }), /*#__PURE__*/_jsxs("span", {
            className: "text-muted-foreground",
            children: [tasks.filter(t => t.status === "todo").length, " To Do"]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-3 h-3 rounded-full bg-yellow-500"
          }), /*#__PURE__*/_jsxs("span", {
            className: "text-muted-foreground",
            children: [tasks.filter(t => t.status === "in-progress").length, " In Progress"]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-3 h-3 rounded-full bg-green-500"
          }), /*#__PURE__*/_jsxs("span", {
            className: "text-muted-foreground",
            children: [tasks.filter(t => t.status === "completed").length, " Completed"]
          })]
        })]
      })]
    }), sections.map((section, index) => /*#__PURE__*/_jsx(motion.div, {
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
      children: section.tasks.length > 0 && /*#__PURE__*/_jsxs("div", {
        className: "space-y-3",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-2xl",
            children: section.icon
          }), /*#__PURE__*/_jsx("h3", {
            className: "text-lg font-semibold",
            children: section.title
          }), /*#__PURE__*/_jsxs("span", {
            className: "text-sm text-muted-foreground",
            children: ["(", section.tasks.length, ")"]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "grid gap-3",
          children: section.tasks.map(task => /*#__PURE__*/_jsx(TaskCard, {
            task: task,
            onEdit: onEdit,
            onDelete: onDelete,
            onToggleComplete: onToggleComplete,
            onMoveDate: onMoveDate
          }, task.id))
        })]
      })
    }, section.title)), tasks.length === 0 && /*#__PURE__*/_jsxs(motion.div, {
      initial: {
        opacity: 0
      },
      animate: {
        opacity: 1
      },
      className: "flex flex-col items-center justify-center py-20 text-center",
      children: [/*#__PURE__*/_jsx(CalendarDays, {
        className: "w-16 h-16 text-muted-foreground mb-4"
      }), /*#__PURE__*/_jsx("h3", {
        className: "text-xl font-semibold mb-2",
        children: "No tasks yet"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-muted-foreground",
        children: "Click the + button to create your first task"
      })]
    })]
  });
}