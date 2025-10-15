"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MoreVertical, Trash2, Edit, CheckCircle2, CalendarDays } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format, addDays, startOfDay, startOfTomorrow, startOfWeek } from "date-fns";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const priorityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-500 border-red-500/20"
};
export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  onMoveDate
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isCompleted = task.status === "completed";
  const handleDeleteConfirm = () => {
    onDelete?.(task.id);
    setDeleteDialogOpen(false);
  };
  const moveOptions = [{
    label: "Today",
    date: startOfDay(new Date())
  }, {
    label: "Tomorrow",
    date: startOfTomorrow()
  }, {
    label: "Next Week",
    date: startOfWeek(addDays(new Date(), 7), {
      weekStartsOn: 1
    })
  }, {
    label: "In 3 Days",
    date: addDays(startOfDay(new Date()), 3)
  }, {
    label: "In 7 Days",
    date: addDays(startOfDay(new Date()), 7)
  }];
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(motion.div, {
      layout: true,
      initial: {
        opacity: 0,
        y: 20
      },
      animate: {
        opacity: 1,
        y: 0
      },
      exit: {
        opacity: 0,
        scale: 0.9
      },
      whileHover: {
        scale: 1.02
      },
      transition: {
        duration: 0.2
      },
      children: /*#__PURE__*/_jsx(Card, {
        className: `p-4 cursor-pointer hover:shadow-lg transition-shadow ${isCompleted ? "opacity-60" : ""}`,
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex items-start justify-between gap-3",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex-1 space-y-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-start gap-2",
              children: [/*#__PURE__*/_jsx("button", {
                onClick: () => onToggleComplete?.(task.id),
                className: "mt-0.5",
                children: /*#__PURE__*/_jsx(CheckCircle2, {
                  className: `w-5 h-5 ${isCompleted ? "text-green-500 fill-green-500" : "text-muted-foreground"}`
                })
              }), /*#__PURE__*/_jsx("h3", {
                className: `font-semibold text-sm ${isCompleted ? "line-through text-muted-foreground" : ""}`,
                children: task.title
              })]
            }), task.description && /*#__PURE__*/_jsx("p", {
              className: "text-sm text-muted-foreground line-clamp-2 pl-7",
              children: task.description
            }), task.tags && task.tags.length > 0 && /*#__PURE__*/_jsx("div", {
              className: "flex flex-wrap gap-1 pl-7",
              children: task.tags.map(tag => /*#__PURE__*/_jsx(Badge, {
                variant: "secondary",
                className: "text-xs",
                children: tag
              }, tag))
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3 text-xs text-muted-foreground pl-7",
              children: [task.dueDate && /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(Calendar, {
                  className: "w-3 h-3"
                }), format(task.dueDate, "MMM dd")]
              }), /*#__PURE__*/_jsx(Badge, {
                className: `text-xs ${priorityColors[task.priority]}`,
                variant: "outline",
                children: task.priority
              })]
            })]
          }), /*#__PURE__*/_jsxs(DropdownMenu, {
            children: [/*#__PURE__*/_jsx(DropdownMenuTrigger, {
              asChild: true,
              children: /*#__PURE__*/_jsx(Button, {
                variant: "ghost",
                size: "sm",
                className: "h-8 w-8 p-0",
                children: /*#__PURE__*/_jsx(MoreVertical, {
                  className: "w-4 h-4"
                })
              })
            }), /*#__PURE__*/_jsxs(DropdownMenuContent, {
              align: "end",
              children: [/*#__PURE__*/_jsxs(DropdownMenuItem, {
                onClick: () => onEdit?.(task),
                children: [/*#__PURE__*/_jsx(Edit, {
                  className: "w-4 h-4 mr-2"
                }), "Edit"]
              }), onMoveDate && /*#__PURE__*/_jsxs(DropdownMenuSub, {
                children: [/*#__PURE__*/_jsxs(DropdownMenuSubTrigger, {
                  children: [/*#__PURE__*/_jsx(CalendarDays, {
                    className: "w-4 h-4 mr-2"
                  }), "Move to..."]
                }), /*#__PURE__*/_jsx(DropdownMenuSubContent, {
                  children: moveOptions.map(option => /*#__PURE__*/_jsx(DropdownMenuItem, {
                    onClick: () => onMoveDate(task.id, option.date),
                    children: option.label
                  }, option.label))
                })]
              }), /*#__PURE__*/_jsx(DropdownMenuSeparator, {}), /*#__PURE__*/_jsxs(DropdownMenuItem, {
                onClick: () => setDeleteDialogOpen(true),
                className: "text-destructive",
                children: [/*#__PURE__*/_jsx(Trash2, {
                  className: "w-4 h-4 mr-2"
                }), "Delete"]
              })]
            })]
          })]
        })
      })
    }), /*#__PURE__*/_jsx(AlertDialog, {
      open: deleteDialogOpen,
      onOpenChange: setDeleteDialogOpen,
      children: /*#__PURE__*/_jsxs(AlertDialogContent, {
        children: [/*#__PURE__*/_jsxs(AlertDialogHeader, {
          children: [/*#__PURE__*/_jsx(AlertDialogTitle, {
            children: "Are you sure?"
          }), /*#__PURE__*/_jsxs(AlertDialogDescription, {
            children: ["This will permanently delete the task \"", task.title, "\". This action cannot be undone."]
          })]
        }), /*#__PURE__*/_jsxs(AlertDialogFooter, {
          children: [/*#__PURE__*/_jsx(AlertDialogCancel, {
            children: "Cancel"
          }), /*#__PURE__*/_jsx(AlertDialogAction, {
            onClick: handleDeleteConfirm,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: "Delete"
          })]
        })]
      })
    })]
  });
}