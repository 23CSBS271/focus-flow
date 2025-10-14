"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, ViewMode } from "@/types/task";
import { Sidebar } from "./Sidebar";
import { DailyView } from "./DailyView";
import { WeeklyView } from "./WeeklyView";
import { MonthlyView } from "./MonthlyView";
import { KanbanView } from "./KanbanView";
import { CalendarView } from "./CalendarView";
import { TaskDialog } from "./TaskDialog";
import { QuickAddButton } from "./QuickAddButton";
import { TopHeader } from "./TopHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>("daily");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showConfetti, setShowConfetti] = useState(false);

  // Filter states
  const [statusFilters, setStatusFilters] = useState<Task["status"][]>([]);
  const [priorityFilters, setPriorityFilters] = useState<Task["priority"][]>([]);

  const { width, height } = useWindowSize();

  // Fetch tasks from database
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/tasks?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const formattedTasks: Task[] = data.tasks.map((task: any) => ({
            id: task._id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            category: task.category,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            tags: task.tags,
          }));
          setTasks(formattedTasks);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId }),
      });

      if (response.ok) {
        setTasks(tasks.filter((t) => t.id !== taskId));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "completed" ? "todo" : "completed";

    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: taskId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setTasks(
          tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: newStatus,
                  updatedAt: new Date(),
                }
              : t
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    }
  };

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: taskId,
          status,
        }),
      });

      if (response.ok) {
        setTasks(
          tasks.map((t) =>
            t.id === taskId
              ? {
                ...t,
                status,
                updatedAt: new Date(),
              }
              : t
          )
        );
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleMoveDate = async (taskId: string, newDate: Date) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: taskId,
          dueDate: newDate,
        }),
      });

      if (response.ok) {
        setTasks(
          tasks.map((t) =>
            t.id === taskId
              ? {
                ...t,
                dueDate: newDate,
                updatedAt: new Date(),
              }
              : t
          )
        );
      }
    } catch (error) {
      console.error('Failed to update task due date:', error);
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (editingTask) {
      // Update existing task in database
      try {
        const response = await fetch('/api/tasks', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingTask.id,
            ...taskData,
          }),
        });

        if (response.ok) {
          // Update local state
          setTasks(
            tasks.map((t) =>
              t.id === editingTask.id
                ? { ...t, ...taskData, updatedAt: new Date() }
                : t
            )
          );
        }
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    } else {
      // Create new task in database
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.id,
            ...taskData,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Add to local state
          const newTask: Task = {
            id: data.task._id,
            title: data.task.title,
            description: data.task.description,
            priority: data.task.priority,
            status: data.task.status,
            category: data.task.category,
            dueDate: data.task.dueDate ? new Date(data.task.dueDate) : undefined,
            createdAt: new Date(data.task.createdAt),
            updatedAt: new Date(data.task.updatedAt),
            tags: data.task.tags,
          };
          setTasks([...tasks, newTask]);
        }
      } catch (error) {
        console.error('Failed to create task:', error);
      }
    }
    setEditingTask(undefined);
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setDialogOpen(true);
  };

  const handleQuickAddTask = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          ...taskData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add to local state
        const newTask: Task = {
          id: data.task._id,
          title: data.task.title,
          description: data.task.description,
          priority: data.task.priority,
          status: data.task.status,
          category: data.task.category,
          dueDate: data.task.dueDate ? new Date(data.task.dueDate) : undefined,
          createdAt: new Date(data.task.createdAt),
          updatedAt: new Date(data.task.updatedAt),
          tags: data.task.tags,
        };
        setTasks([...tasks, newTask]);

        // Trigger confetti animation
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTask(undefined);
  };

  const toggleStatusFilter = (status: Task["status"]) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const togglePriorityFilter = (priority: Task["priority"]) => {
    setPriorityFilters((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const clearFilters = () => {
    setStatusFilters([]);
    setPriorityFilters([]);
  };

  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilters.length === 0 || statusFilters.includes(task.status);

    // Priority filter
    const matchesPriority =
      priorityFilters.length === 0 || priorityFilters.includes(task.priority);

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const activeFiltersCount = statusFilters.length + priorityFilters.length;

  const renderView = () => {
    const viewProps = {
      tasks: filteredTasks,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onToggleComplete: handleToggleComplete,
      onMoveDate: handleMoveDate,
    };

    switch (currentView) {
      case "daily":
        return <DailyView {...viewProps} />;
      case "weekly":
        return <WeeklyView {...viewProps} />;
      case "monthly":
        return <MonthlyView tasks={filteredTasks} onEdit={handleEdit} />;
      case "kanban":
        return <KanbanView {...viewProps} onStatusChange={handleStatusChange} />;
      case "calendar":
        return <CalendarView tasks={filteredTasks} onEdit={handleEdit} onDelete={handleDelete} onAddTask={handleAddTask} />;
      default:
        return <DailyView {...viewProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <TopHeader tasks={tasks} />
        <div className="max-w-7xl mx-auto p-8">
          {/* Search and Add */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 relative">
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Filters</h4>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-auto p-1 text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  <Separator />

                  {/* Status Filters */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Status</Label>
                    <div className="space-y-2">
                      {[
                        { value: "todo", label: "To Do" },
                        { value: "in-progress", label: "In Progress" },
                        { value: "completed", label: "Completed" },
                      ].map((status) => (
                        <div key={status.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status.value}`}
                            checked={statusFilters.includes(status.value as Task["status"])}
                            onCheckedChange={() =>
                              toggleStatusFilter(status.value as Task["status"])
                            }
                          />
                          <label
                            htmlFor={`status-${status.value}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {status.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Priority Filters */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Priority</Label>
                    <div className="space-y-2">
                      {[
                        { value: "low", label: "Low" },
                        { value: "medium", label: "Medium" },
                        { value: "high", label: "High" },
                        { value: "urgent", label: "Urgent" },
                      ].map((priority) => (
                        <div key={priority.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`priority-${priority.value}`}
                            checked={priorityFilters.includes(priority.value as Task["priority"])}
                            onCheckedChange={() =>
                              togglePriorityFilter(priority.value as Task["priority"])
                            }
                          />
                          <label
                            htmlFor={`priority-${priority.value}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {priority.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button className="gap-2" onClick={handleAddTask}>
              <Plus className="w-5 h-5" />
              Add Task
            </Button>
          </motion.div>

          {/* Views */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Quick Add Button */}
      <QuickAddButton onAddTask={handleQuickAddTask} />

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        task={editingTask}
        onSave={handleSaveTask}
      />

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          initialVelocityY={10}
          confettiSource={{
            x: 0,
            y: 0,
            w: width,
            h: 0,
          }}
        />
      )}
    </div>
  );
}
