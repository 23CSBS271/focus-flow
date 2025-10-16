"use client";

import { motion } from "framer-motion";
import { TaskCard } from "./TaskCard";
import { format, isToday, isTomorrow, isThisWeek, isThisMonth } from "date-fns";
import { CalendarDays } from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DailyView({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  onMoveDate
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks = tasks.filter(task => {
    if (task.status === 'completed') return false;
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  });
  const todayTasks = tasks.filter(task => task.dueDate && isToday(task.dueDate));
  const tomorrowTasks = tasks.filter(task => task.dueDate && isTomorrow(task.dueDate));
  const thisWeekTasks = tasks.filter(task => task.dueDate && isThisWeek(task.dueDate) && !isToday(task.dueDate) && !isTomorrow(task.dueDate));
  const thisMonthTasks = tasks.filter(task => task.dueDate && isThisMonth(task.dueDate) && !isThisWeek(task.dueDate) && !isToday(task.dueDate) && !isTomorrow(task.dueDate));
  const noDateTasks = tasks.filter(task => !task.dueDate);
  const sections = [{
    title: "Overdue",
    tasks: overdueTasks,
    icon: "⚠️"
  }, {
    title: "Today",
    tasks: todayTasks,
    icon: "🔥"
  }, {
    title: "Tomorrow",
    tasks: tomorrowTasks,
    icon: "📅"
  }, {
    title: "This Week",
    tasks: thisWeekTasks,
    icon: "📆"
  }, {
    title: "This Month",
    tasks: thisMonthTasks,
    icon: "📅"
  }, {
    title: "No Due Date",
    tasks: noDateTasks,
    icon: "📋"
  }];
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-8",
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
    }), /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
      children: sections.map((section, index) => /*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0,
          scale: 0.9
        },
        animate: {
          opacity: 1,
          scale: 1
        },
        transition: {
          delay: index * 0.1
        },
        className: `bg-card rounded-xl border p-8 shadow-sm hover:shadow-md transition-shadow ${section.title === "Overdue" ? "border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800" : ""}`,
        children: section.tasks.length > 0 ? /*#__PURE__*/_jsxs("div", {
          className: "space-y-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-2xl",
                children: section.icon
              }), /*#__PURE__*/_jsx("h3", {
                className: "text-lg font-semibold",
                children: section.title
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full",
                children: [section.tasks.length]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3 text-xs",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "w-2 h-2 rounded-full bg-gray-500"
                }), section.tasks.filter(t => t.status === "todo").length]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "w-2 h-2 rounded-full bg-yellow-500"
                }), section.tasks.filter(t => t.status === "in-progress").length]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "w-2 h-2 rounded-full bg-green-500"
                }), section.tasks.filter(t => t.status === "completed").length]
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
          className: "space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent scrollbar-w-1",
            children: section.tasks.map(task => /*#__PURE__*/_jsx(TaskCard, {
              task: task,
              onEdit: onEdit,
              onDelete: onDelete,
              onToggleComplete: onToggleComplete,
              onMoveDate: onMoveDate
            }, task.id))
          })]
        }) : /*#__PURE__*/_jsxs("div", {
          className: "flex flex-col items-center justify-center py-8 text-center text-muted-foreground",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-3xl mb-2",
            children: section.icon
          }), /*#__PURE__*/_jsx("h4", {
            className: "font-medium",
            children: section.title
          }), /*#__PURE__*/_jsx("p", {
            className: "text-xs mt-1",
            children: "No tasks"
          })]
        })
      }, section.title))
    }), tasks.length === 0 && /*#__PURE__*/_jsxs(motion.div, {
      initial: {
        opacity: 0
      },
      animate: {
        opacity: 1
      },
      className: "flex flex-col items-center justify-center py-20 text-center col-span-full",
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