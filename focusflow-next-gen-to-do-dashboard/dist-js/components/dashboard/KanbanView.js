"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const columns = [{
  id: "todo",
  title: "To Do",
  color: "from-blue-500 to-cyan-500"
}, {
  id: "in-progress",
  title: "In Progress",
  color: "from-yellow-500 to-orange-500"
}, {
  id: "completed",
  title: "Completed",
  color: "from-green-500 to-emerald-500"
}];
function DroppableColumn({
  column,
  children
}) {
  const {
    setNodeRef,
    isOver
  } = useDroppable({
    id: column.id
  });
  return /*#__PURE__*/_jsx("div", {
    ref: setNodeRef,
    className: `space-y-3 min-h-[400px] bg-muted/30 rounded-lg p-3 transition-colors ${isOver ? "bg-muted/50 ring-2 ring-primary" : ""}`,
    children: children
  });
}
function KanbanCard({
  task,
  onEdit,
  onDelete,
  onClick
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const priorityColors = {
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    urgent: "bg-red-500/10 text-red-500 border-red-500/20"
  };
  const categoryColors = {
    personal: "bg-purple-500/10 text-purple-500",
    work: "bg-blue-500/10 text-blue-500",
    health: "bg-green-500/10 text-green-500",
    shopping: "bg-orange-500/10 text-orange-500",
    other: "bg-gray-500/10 text-gray-500"
  };
  const statusColors = {
    todo: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    "in-progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20"
  };
  const handleDeleteConfirm = () => {
    onDelete?.(task.id);
    setDeleteDialogOpen(false);
  };
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      ref: setNodeRef,
      style: style,
      ...attributes,
      ...listeners,
      children: /*#__PURE__*/_jsxs(Card, {
        className: "p-3 cursor-move hover:shadow-md transition-shadow",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-start justify-between gap-2 mb-2",
          children: [/*#__PURE__*/_jsx("h4", {
            className: "font-semibold text-sm flex-1 cursor-pointer hover:text-primary",
            onClick: e => {
              e.stopPropagation();
              onClick?.();
            },
            children: task.title
          }), /*#__PURE__*/_jsxs(DropdownMenu, {
            children: [/*#__PURE__*/_jsx(DropdownMenuTrigger, {
              asChild: true,
              onClick: e => e.stopPropagation(),
              children: /*#__PURE__*/_jsx(Button, {
                variant: "ghost",
                size: "sm",
                className: "h-6 w-6 p-0",
                children: /*#__PURE__*/_jsx(MoreVertical, {
                  className: "w-3 h-3"
                })
              })
            }), /*#__PURE__*/_jsxs(DropdownMenuContent, {
              align: "end",
              children: [/*#__PURE__*/_jsx(DropdownMenuItem, {
                onClick: () => onEdit?.(task),
                children: "Edit"
              }), /*#__PURE__*/_jsx(DropdownMenuItem, {
                onClick: () => setDeleteDialogOpen(true),
                className: "text-destructive",
                children: "Delete"
              })]
            })]
          })]
        }), task.description && /*#__PURE__*/_jsx("p", {
          className: "text-xs text-muted-foreground mb-2 line-clamp-2",
          children: task.description
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between flex-wrap gap-2",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1",
            children: [/*#__PURE__*/_jsx(Badge, {
              className: `text-xs ${priorityColors[task.priority]}`,
              variant: "outline",
              children: task.priority
            }), /*#__PURE__*/_jsx(Badge, {
              className: `text-xs ${categoryColors[task.category]}`,
              variant: "outline",
              children: task.category
            }), /*#__PURE__*/_jsx(Badge, {
              className: `text-xs ${statusColors[task.status]}`,
              variant: "outline",
              children: task.status === "in-progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)
            })]
          }), task.dueDate && /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1 text-xs text-muted-foreground",
            children: [/*#__PURE__*/_jsx(Calendar, {
              className: "w-3 h-3"
            }), format(task.dueDate, "MMM dd")]
          })]
        }), task.tags && task.tags.length > 0 && /*#__PURE__*/_jsxs("div", {
          className: "flex flex-wrap gap-1 mt-2",
          children: [task.tags.slice(0, 2).map(tag => /*#__PURE__*/_jsx(Badge, {
            variant: "secondary",
            className: "text-xs",
            children: tag
          }, tag)), task.tags.length > 2 && /*#__PURE__*/_jsxs(Badge, {
            variant: "secondary",
            className: "text-xs",
            children: ["+", task.tags.length - 2]
          })]
        })]
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
export function KanbanView({
  tasks,
  onEdit,
  onDelete,
  onStatusChange
}) {
  const [activeTask, setActiveTask] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8
    }
  }));
  const handleDragStart = event => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };
  const handleDragEnd = event => {
    const {
      active,
      over
    } = event;
    if (over) {
      const taskId = active.id;

      // Check if dropping on a column (droppable area)
      const targetColumn = columns.find(col => col.id === over.id);
      if (targetColumn) {
        onStatusChange?.(taskId, targetColumn.id);
      } else {
        // Dropping on another task - get that task's status
        const targetTask = tasks.find(t => t.id === over.id);
        if (targetTask && targetTask.status !== tasks.find(t => t.id === taskId)?.status) {
          onStatusChange?.(taskId, targetTask.status);
        }
      }
    }
    setActiveTask(null);
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
          children: "Board"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-muted-foreground mt-1",
          children: "Drag and drop tasks to update their status"
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "flex gap-4 text-sm",
        children: columns.map(col => /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx("div", {
            className: `w-3 h-3 rounded-full bg-gradient-to-br ${col.color}`
          }), /*#__PURE__*/_jsxs("span", {
            className: "text-muted-foreground",
            children: [tasks.filter(t => t.status === col.id).length, " ", col.title]
          })]
        }, col.id))
      })]
    }), /*#__PURE__*/_jsxs(DndContext, {
      sensors: sensors,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      children: [/*#__PURE__*/_jsx("div", {
        className: "grid grid-cols-3 gap-6",
        children: columns.map((column, index) => {
          const columnTasks = tasks.filter(task => task.status === column.id);
          return /*#__PURE__*/_jsxs(motion.div, {
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
            className: "space-y-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3",
              children: [/*#__PURE__*/_jsx("div", {
                className: `w-10 h-10 rounded-lg bg-gradient-to-br ${column.color}`
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("h3", {
                  className: "font-semibold",
                  children: column.title
                }), /*#__PURE__*/_jsxs("p", {
                  className: "text-xs text-muted-foreground",
                  children: [columnTasks.length, " tasks"]
                })]
              })]
            }), /*#__PURE__*/_jsx(DroppableColumn, {
              column: column,
              children: /*#__PURE__*/_jsx(SortableContext, {
                items: columnTasks.map(t => t.id),
                strategy: verticalListSortingStrategy,
                children: /*#__PURE__*/_jsxs("div", {
                  className: "space-y-3",
                  children: [columnTasks.map(task => /*#__PURE__*/_jsx(KanbanCard, {
                    task: task,
                    onEdit: onEdit,
                    onDelete: onDelete,
                    onClick: () => onEdit?.(task)
                  }, task.id)), columnTasks.length === 0 && /*#__PURE__*/_jsx("div", {
                    className: "flex items-center justify-center h-32 text-sm text-muted-foreground",
                    children: "Drop tasks here"
                  })]
                })
              })
            })]
          }, column.id);
        })
      }), /*#__PURE__*/_jsx(DragOverlay, {
        children: activeTask && /*#__PURE__*/_jsx(Card, {
          className: "p-3 shadow-xl rotate-3",
          children: /*#__PURE__*/_jsx("h4", {
            className: "font-semibold text-sm",
            children: activeTask.title
          })
        })
      })]
    })]
  });
}