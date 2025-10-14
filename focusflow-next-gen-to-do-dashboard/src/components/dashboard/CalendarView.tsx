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
  addMonths,
  subMonths,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface CalendarViewProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onAddTask?: () => void;
}

export function CalendarView({ tasks, onEdit, onDelete, onAddTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const selectedDayTasks = selectedDate
    ? tasks.filter((task) => task.dueDate && isSameDay(task.dueDate, selectedDate))
    : [];

  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    urgent: "bg-red-500",
  };

  const handleDeleteClick = (task: Task) => {
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

  const isDateInFuture = (date: Date) => {
    const today = startOfDay(new Date());
    const checkDate = startOfDay(date);
    return checkDate >= today;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold">Calendar</h2>
          <p className="text-muted-foreground mt-1">{format(currentDate, "MMMM yyyy")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDate(new Date());
            }}
          >
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Calendar Grid */}
        <Card className="p-6">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
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
              const isCurrentDay = isToday(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <motion.button
                  key={day.toISOString()}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.005 }}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[100px] border rounded-lg p-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : isCurrentDay
                      ? "bg-accent border-primary"
                      : "border-border hover:bg-accent"
                  } ${!isCurrentMonth ? "opacity-40" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-semibold ${
                        isSelected ? "text-primary-foreground" : isCurrentDay ? "text-primary" : ""
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    {dayTasks.length > 0 && (
                      <span
                        className={`text-xs rounded-full w-5 h-5 flex items-center justify-center ${
                          isSelected
                            ? "bg-primary-foreground text-primary"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {dayTasks.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className={`text-xs p-1 rounded truncate ${
                          isSelected
                            ? "bg-primary-foreground/20"
                            : task.status === 'completed'
                            ? "bg-green-500/20 border border-green-500/30"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}
                          />
                          <span className={`truncate ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</span>
                          {task.status === 'completed' && (
                            <span className="text-green-600 text-xs">✓</span>
                          )}
                        </div>
                        {task.description && (
                          <p className={`text-xs truncate ${task.status === 'completed' ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}>{task.description}</p>
                        )}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div
                        className={`text-xs text-center ${
                          isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Card>

        {/* Selected Day Details */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select a day"}
                </h3>
                {selectedDate && (
                  <p className="text-sm text-muted-foreground">
                    {selectedDayTasks.length} task{selectedDayTasks.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              {selectedDate && isDateInFuture(selectedDate) && (
                <Button size="sm" onClick={onAddTask}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              )}
            </div>

            <ScrollArea className="h-[500px] pr-4">
              {selectedDate ? (
                selectedDayTasks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDayTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => onEdit?.(task)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-sm">{task.title}</h4>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-blue-500 hover:text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(task);
                              }}
                              title="Edit task"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(task);
                              }}
                              title="Delete task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <Badge
                            className={`text-xs ${priorityColors[task.priority]} text-white`}
                          >
                            {task.priority}
                          </Badge>
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
                    <p>No tasks scheduled</p>
                    {selectedDate && isDateInFuture(selectedDate) && (
                      <Button variant="link" size="sm" onClick={onAddTask} className="mt-2">
                        Add a task
                      </Button>
                    )}
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-32 text-center text-muted-foreground">
                  <p>Click on a date to view tasks</p>
                  <Hand className="w-6 h-6 mt-2 text-muted-foreground/50" />
                </div>
              )}
            </ScrollArea>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
