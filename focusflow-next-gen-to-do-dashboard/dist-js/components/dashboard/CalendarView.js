"use client";

import { motion } from "framer-motion";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isSameMonth, startOfWeek, endOfWeek, addMonths, subMonths, isToday, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function CalendarView({
  tasks,
  onEdit,
  onDelete,
  onAddTask
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
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
    setCurrentDate(addMonths(currentDate, 1));
  };
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const selectedDayTasks = selectedDate ? tasks.filter(task => task.dueDate && isSameDay(task.dueDate, selectedDate)) : [];
  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    urgent: "bg-red-500"
  };
  const handleDeleteClick = task => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    if (taskToDelete) {
      onDelete?.(taskToDelete.id);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };
  const isDateInFuture = date => {
    const today = startOfDay(new Date());
    const checkDate = startOfDay(date);
    return checkDate >= today;
  };
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
          children: "Calendar"
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
          onClick: () => {
            setCurrentDate(new Date());
            setSelectedDate(new Date());
          },
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
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid lg:grid-cols-[1fr_350px] gap-6",
      children: [/*#__PURE__*/_jsxs(Card, {
        className: "p-6",
        children: [/*#__PURE__*/_jsx("div", {
          className: "grid grid-cols-7 gap-2 mb-4",
          children: weekDays.map(day => /*#__PURE__*/_jsx("div", {
            className: "text-center font-semibold text-sm text-muted-foreground p-2",
            children: day
          }, day))
        }), /*#__PURE__*/_jsx("div", {
          className: "grid grid-cols-7 gap-2",
          children: calendarDays.map((day, index) => {
            const dayTasks = tasks.filter(task => task.dueDate && isSameDay(task.dueDate, day));
            const isCurrentDay = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            return /*#__PURE__*/_jsxs(motion.button, {
              initial: {
                opacity: 0,
                scale: 0.9
              },
              animate: {
                opacity: 1,
                scale: 1
              },
              transition: {
                delay: index * 0.005
              },
              onClick: () => setSelectedDate(day),
              className: `min-h-[100px] border rounded-lg p-2 text-left transition-all cursor-pointer ${isSelected ? "bg-primary text-primary-foreground border-primary" : isCurrentDay ? "bg-accent border-primary" : "border-border hover:bg-accent"} ${!isCurrentMonth ? "opacity-40" : ""}`,
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-between mb-1",
                children: [/*#__PURE__*/_jsx("span", {
                  className: `text-sm font-semibold ${isSelected ? "text-primary-foreground" : isCurrentDay ? "text-primary" : ""}`,
                  children: format(day, "d")
                }), dayTasks.length > 0 && /*#__PURE__*/_jsx("span", {
                  className: `text-xs rounded-full w-5 h-5 flex items-center justify-center ${isSelected ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"}`,
                  children: dayTasks.length
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-1",
                children: [dayTasks.slice(0, 2).map(task => /*#__PURE__*/_jsxs("div", {
                  className: `text-xs p-1 rounded truncate ${isSelected ? "bg-primary-foreground/20" : task.status === 'completed' ? "bg-green-500/20 border border-green-500/30" : "bg-muted"}`,
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-center gap-1",
                    children: [/*#__PURE__*/_jsx("div", {
                      className: `w-2 h-2 rounded-full ${priorityColors[task.priority]}`
                    }), /*#__PURE__*/_jsx("span", {
                      className: `truncate ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`,
                      children: task.title
                    }), task.status === 'completed' && /*#__PURE__*/_jsx("span", {
                      className: "text-green-600 text-xs",
                      children: "\u2713"
                    })]
                  }), task.description && /*#__PURE__*/_jsx("p", {
                    className: `text-xs truncate ${task.status === 'completed' ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`,
                    children: task.description
                  })]
                }, task.id)), dayTasks.length > 2 && /*#__PURE__*/_jsxs("div", {
                  className: `text-xs text-center ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`,
                  children: ["+", dayTasks.length - 2, " more"]
                })]
              })]
            }, day.toISOString());
          })
        })]
      }), /*#__PURE__*/_jsx(Card, {
        className: "p-6",
        children: /*#__PURE__*/_jsxs("div", {
          className: "space-y-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-lg font-semibold",
                children: selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select a day"
              }), selectedDate && /*#__PURE__*/_jsxs("p", {
                className: "text-sm text-muted-foreground",
                children: [selectedDayTasks.length, " task", selectedDayTasks.length !== 1 ? "s" : ""]
              })]
            }), selectedDate && isDateInFuture(selectedDate) && /*#__PURE__*/_jsxs(Button, {
              size: "sm",
              onClick: onAddTask,
              children: [/*#__PURE__*/_jsx(Plus, {
                className: "w-4 h-4 mr-1"
              }), "Add"]
            })]
          }), /*#__PURE__*/_jsx(ScrollArea, {
            className: "h-[500px] pr-4",
            children: selectedDate ? selectedDayTasks.length > 0 ? /*#__PURE__*/_jsx("div", {
              className: "space-y-3",
              children: selectedDayTasks.map(task => /*#__PURE__*/_jsxs(motion.div, {
                initial: {
                  opacity: 0,
                  x: 20
                },
                animate: {
                  opacity: 1,
                  x: 0
                },
                className: "p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors",
                onClick: () => onEdit?.(task),
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-start justify-between gap-2 mb-2",
                  children: [/*#__PURE__*/_jsx("h4", {
                    className: "font-semibold text-sm",
                    children: task.title
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [/*#__PURE__*/_jsx(Button, {
                      variant: "ghost",
                      size: "sm",
                      className: "h-6 w-6 p-0 text-blue-500 hover:text-blue-600",
                      onClick: e => {
                        e.stopPropagation();
                        onEdit?.(task);
                      },
                      title: "Edit task",
                      children: /*#__PURE__*/_jsx(Edit, {
                        className: "w-4 h-4"
                      })
                    }), /*#__PURE__*/_jsx(Button, {
                      variant: "ghost",
                      size: "sm",
                      className: "h-6 w-6 p-0 text-destructive hover:text-destructive",
                      onClick: e => {
                        e.stopPropagation();
                        handleDeleteClick(task);
                      },
                      title: "Delete task",
                      children: /*#__PURE__*/_jsx(Trash2, {
                        className: "w-4 h-4"
                      })
                    })]
                  })]
                }), task.description && /*#__PURE__*/_jsx("p", {
                  className: "text-sm text-muted-foreground mb-2 line-clamp-2",
                  children: task.description
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [/*#__PURE__*/_jsx(Badge, {
                      className: `text-xs ${priorityColors[task.priority]} text-white`,
                      children: task.priority
                    }), /*#__PURE__*/_jsx(Badge, {
                      variant: "outline",
                      className: "text-xs",
                      children: task.status === "in-progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)
                    }), /*#__PURE__*/_jsx(Badge, {
                      variant: "secondary",
                      className: "text-xs",
                      children: task.category
                    })]
                  }), task.tags && task.tags.length > 0 && /*#__PURE__*/_jsx("div", {
                    className: "flex flex-wrap gap-1",
                    children: task.tags.map(tag => /*#__PURE__*/_jsx(Badge, {
                      variant: "secondary",
                      className: "text-xs",
                      children: tag
                    }, tag))
                  })]
                })]
              }, task.id))
            }) : /*#__PURE__*/_jsxs("div", {
              className: "flex flex-col items-center justify-center h-32 text-center text-muted-foreground",
              children: [/*#__PURE__*/_jsx("p", {
                children: "No tasks scheduled"
              }), selectedDate && isDateInFuture(selectedDate) && /*#__PURE__*/_jsx(Button, {
                variant: "link",
                size: "sm",
                onClick: onAddTask,
                className: "mt-2",
                children: "Add a task"
              })]
            }) : /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-center h-32 text-center text-muted-foreground",
              children: [/*#__PURE__*/_jsx("p", {
                children: "Click on a date to view tasks"
              }), /*#__PURE__*/_jsx(Hand, {
                className: "w-6 h-6 mt-2 text-muted-foreground/50"
              })]
            })
          })]
        })
      })]
    }), /*#__PURE__*/_jsx(AlertDialog, {
      open: deleteDialogOpen,
      onOpenChange: setDeleteDialogOpen,
      children: /*#__PURE__*/_jsxs(AlertDialogContent, {
        children: [/*#__PURE__*/_jsxs(AlertDialogHeader, {
          children: [/*#__PURE__*/_jsx(AlertDialogTitle, {
            children: "Delete Task"
          }), /*#__PURE__*/_jsxs(AlertDialogDescription, {
            children: ["Are you sure you want to delete \"", taskToDelete?.title, "\"? This action cannot be undone."]
          })]
        }), /*#__PURE__*/_jsxs(AlertDialogFooter, {
          children: [/*#__PURE__*/_jsx(AlertDialogCancel, {
            children: "Cancel"
          }), /*#__PURE__*/_jsx(AlertDialogAction, {
            onClick: confirmDelete,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: "Delete"
          })]
        })]
      })
    })]
  });
}