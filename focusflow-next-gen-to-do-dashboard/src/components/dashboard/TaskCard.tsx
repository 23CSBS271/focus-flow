"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Task, TaskPriority } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoreVertical, Trash2, Edit, CheckCircle2, CalendarDays } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format, addDays, startOfDay, startOfTomorrow, startOfWeek, endOfWeek } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
  onMoveDate?: (taskId: string, newDate: Date) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function TaskCard({ task, onEdit, onDelete, onToggleComplete, onMoveDate }: TaskCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isCompleted = task.status === "completed";

  const handleDeleteConfirm = () => {
    onDelete?.(task.id);
    setDeleteDialogOpen(false);
  };

  const moveOptions = [
    { label: "Today", date: startOfDay(new Date()) },
    { label: "Tomorrow", date: startOfTomorrow() },
    { label: "Next Week", date: startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 }) },
    { label: "In 3 Days", date: addDays(startOfDay(new Date()), 3) },
    { label: "In 7 Days", date: addDays(startOfDay(new Date()), 7) },
  ];

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`p-4 cursor-pointer hover:shadow-lg transition-shadow ${isCompleted ? "opacity-60" : ""}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              {/* Title */}
              <div className="flex items-start gap-2">
                <button
                  onClick={() => onToggleComplete?.(task.id)}
                  className="mt-0.5"
                >
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      isCompleted
                        ? "text-green-500 fill-green-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
                <h3
                  className={`font-semibold text-sm ${
                    isCompleted ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </h3>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 pl-7">
                  {task.description}
                </p>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pl-7">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Meta info */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground pl-7">
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(task.dueDate, "MMM dd")}
                  </div>
                )}
                <Badge
                  className={`text-xs ${priorityColors[task.priority]}`}
                  variant="outline"
                >
                  {task.priority}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(task)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                
                {onMoveDate && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <CalendarDays className="w-4 h-4 mr-2" />
                      Move to...
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {moveOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.label}
                          onClick={() => onMoveDate(task.id, option.date)}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}

                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{task.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}