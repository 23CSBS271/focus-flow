"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    user
  } = useAuth();
  const [currentView, setCurrentView] = useState("daily");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(undefined);
  const [showConfetti, setShowConfetti] = useState(false);

  // Filter states
  const [statusFilters, setStatusFilters] = useState([]);
  const [priorityFilters, setPriorityFilters] = useState([]);
  const {
    width,
    height
  } = useWindowSize();

  // Fetch tasks from database
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/tasks?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const formattedTasks = data.tasks.map(task => ({
            id: task._id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            category: task.category,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            tags: task.tags
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
  const handleEdit = task => {
    setEditingTask(task);
    setDialogOpen(true);
  };
  const handleDelete = async taskId => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: taskId
        })
      });
      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };
  const handleToggleComplete = async taskId => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newStatus = task.status === "completed" ? "todo" : "completed";
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: taskId,
          status: newStatus
        })
      });
      if (response.ok) {
        setTasks(tasks.map(t => t.id === taskId ? {
          ...t,
          status: newStatus,
          updatedAt: new Date()
        } : t));
      }
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    }
  };
  const handleStatusChange = async (taskId, status) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: taskId,
          status
        })
      });
      if (response.ok) {
        setTasks(tasks.map(t => t.id === taskId ? {
          ...t,
          status,
          updatedAt: new Date()
        } : t));
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };
  const handleMoveDate = async (taskId, newDate) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: taskId,
          dueDate: newDate
        })
      });
      if (response.ok) {
        setTasks(tasks.map(t => t.id === taskId ? {
          ...t,
          dueDate: newDate,
          updatedAt: new Date()
        } : t));
      }
    } catch (error) {
      console.error('Failed to update task due date:', error);
    }
  };
  const handleSaveTask = async taskData => {
    if (editingTask) {
      // Update existing task in database
      try {
        const response = await fetch('/api/tasks', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: editingTask.id,
            ...taskData
          })
        });
        if (response.ok) {
          // Update local state
          setTasks(tasks.map(t => t.id === editingTask.id ? {
            ...t,
            ...taskData,
            updatedAt: new Date()
          } : t));
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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user?.id,
            ...taskData
          })
        });
        if (response.ok) {
          const data = await response.json();
          // Add to local state
          const newTask = {
            id: data.task._id,
            title: data.task.title,
            description: data.task.description,
            priority: data.task.priority,
            status: data.task.status,
            category: data.task.category,
            dueDate: data.task.dueDate ? new Date(data.task.dueDate) : undefined,
            createdAt: new Date(data.task.createdAt),
            updatedAt: new Date(data.task.updatedAt),
            tags: data.task.tags
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
  const handleQuickAddTask = async taskData => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.id,
          ...taskData
        })
      });
      if (response.ok) {
        const data = await response.json();
        // Add to local state
        const newTask = {
          id: data.task._id,
          title: data.task.title,
          description: data.task.description,
          priority: data.task.priority,
          status: data.task.status,
          category: data.task.category,
          dueDate: data.task.dueDate ? new Date(data.task.dueDate) : undefined,
          createdAt: new Date(data.task.createdAt),
          updatedAt: new Date(data.task.updatedAt),
          tags: data.task.tags
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
  const toggleStatusFilter = status => {
    setStatusFilters(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
  };
  const togglePriorityFilter = priority => {
    setPriorityFilters(prev => prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]);
  };
  const clearFilters = () => {
    setStatusFilters([]);
    setPriorityFilters([]);
  };
  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(task.status);

    // Priority filter
    const matchesPriority = priorityFilters.length === 0 || priorityFilters.includes(task.priority);
    return matchesSearch && matchesStatus && matchesPriority;
  });
  const activeFiltersCount = statusFilters.length + priorityFilters.length;
  const renderView = () => {
    const viewProps = {
      tasks: filteredTasks,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onToggleComplete: handleToggleComplete,
      onMoveDate: handleMoveDate
    };
    switch (currentView) {
      case "daily":
        return /*#__PURE__*/_jsx(DailyView, {
          ...viewProps
        });
      case "weekly":
        return /*#__PURE__*/_jsx(WeeklyView, {
          ...viewProps
        });
      case "monthly":
        return /*#__PURE__*/_jsx(MonthlyView, {
          tasks: filteredTasks,
          onEdit: handleEdit
        });
      case "kanban":
        return /*#__PURE__*/_jsx(KanbanView, {
          ...viewProps,
          onStatusChange: handleStatusChange
        });
      case "calendar":
        return /*#__PURE__*/_jsx(CalendarView, {
          tasks: filteredTasks,
          onEdit: handleEdit,
          onDelete: handleDelete,
          onAddTask: handleAddTask
        });
      default:
        return /*#__PURE__*/_jsx(DailyView, {
          ...viewProps
        });
    }
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "flex h-screen bg-background overflow-hidden",
    children: [/*#__PURE__*/_jsx(Sidebar, {
      currentView: currentView,
      onViewChange: setCurrentView
    }), /*#__PURE__*/_jsxs("main", {
      className: "flex-1 overflow-auto",
      children: [/*#__PURE__*/_jsx(TopHeader, {
        tasks: tasks
      }), /*#__PURE__*/_jsxs("div", {
        className: "max-w-7xl mx-auto p-8",
        children: [/*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: -20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          className: "flex items-center gap-4 mb-8",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "relative flex-1 max-w-md",
            children: [/*#__PURE__*/_jsx(Search, {
              className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
            }), /*#__PURE__*/_jsx(Input, {
              type: "text",
              placeholder: "Search tasks...",
              value: searchQuery,
              onChange: e => setSearchQuery(e.target.value),
              className: "pl-10"
            })]
          }), /*#__PURE__*/_jsxs(Popover, {
            children: [/*#__PURE__*/_jsx(PopoverTrigger, {
              asChild: true,
              children: /*#__PURE__*/_jsxs(Button, {
                variant: "outline",
                className: "gap-2 relative",
                children: [/*#__PURE__*/_jsx(Filter, {
                  className: "w-4 h-4"
                }), "Filters", activeFiltersCount > 0 && /*#__PURE__*/_jsx("span", {
                  className: "absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center",
                  children: activeFiltersCount
                })]
              })
            }), /*#__PURE__*/_jsx(PopoverContent, {
              className: "w-80",
              align: "start",
              children: /*#__PURE__*/_jsxs("div", {
                className: "space-y-4",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsx("h4", {
                    className: "font-semibold",
                    children: "Filters"
                  }), activeFiltersCount > 0 && /*#__PURE__*/_jsx(Button, {
                    variant: "ghost",
                    size: "sm",
                    onClick: clearFilters,
                    className: "h-auto p-1 text-xs",
                    children: "Clear all"
                  })]
                }), /*#__PURE__*/_jsx(Separator, {}), /*#__PURE__*/_jsxs("div", {
                  className: "space-y-3",
                  children: [/*#__PURE__*/_jsx(Label, {
                    className: "text-sm font-semibold",
                    children: "Status"
                  }), /*#__PURE__*/_jsx("div", {
                    className: "space-y-2",
                    children: [{
                      value: "todo",
                      label: "To Do"
                    }, {
                      value: "in-progress",
                      label: "In Progress"
                    }, {
                      value: "completed",
                      label: "Completed"
                    }].map(status => /*#__PURE__*/_jsxs("div", {
                      className: "flex items-center space-x-2",
                      children: [/*#__PURE__*/_jsx(Checkbox, {
                        id: `status-${status.value}`,
                        checked: statusFilters.includes(status.value),
                        onCheckedChange: () => toggleStatusFilter(status.value)
                      }), /*#__PURE__*/_jsx("label", {
                        htmlFor: `status-${status.value}`,
                        className: "text-sm font-normal cursor-pointer",
                        children: status.label
                      })]
                    }, status.value))
                  })]
                }), /*#__PURE__*/_jsx(Separator, {}), /*#__PURE__*/_jsxs("div", {
                  className: "space-y-3",
                  children: [/*#__PURE__*/_jsx(Label, {
                    className: "text-sm font-semibold",
                    children: "Priority"
                  }), /*#__PURE__*/_jsx("div", {
                    className: "space-y-2",
                    children: [{
                      value: "low",
                      label: "Low"
                    }, {
                      value: "medium",
                      label: "Medium"
                    }, {
                      value: "high",
                      label: "High"
                    }, {
                      value: "urgent",
                      label: "Urgent"
                    }].map(priority => /*#__PURE__*/_jsxs("div", {
                      className: "flex items-center space-x-2",
                      children: [/*#__PURE__*/_jsx(Checkbox, {
                        id: `priority-${priority.value}`,
                        checked: priorityFilters.includes(priority.value),
                        onCheckedChange: () => togglePriorityFilter(priority.value)
                      }), /*#__PURE__*/_jsx("label", {
                        htmlFor: `priority-${priority.value}`,
                        className: "text-sm font-normal cursor-pointer",
                        children: priority.label
                      })]
                    }, priority.value))
                  })]
                })]
              })
            })]
          }), /*#__PURE__*/_jsxs(Button, {
            className: "gap-2",
            onClick: handleAddTask,
            children: [/*#__PURE__*/_jsx(Plus, {
              className: "w-5 h-5"
            }), "Add Task"]
          })]
        }), /*#__PURE__*/_jsx(AnimatePresence, {
          mode: "wait",
          children: /*#__PURE__*/_jsx(motion.div, {
            initial: {
              opacity: 0,
              x: 20
            },
            animate: {
              opacity: 1,
              x: 0
            },
            exit: {
              opacity: 0,
              x: -20
            },
            transition: {
              duration: 0.3
            },
            children: renderView()
          }, currentView)
        })]
      })]
    }), /*#__PURE__*/_jsx(QuickAddButton, {
      onAddTask: handleQuickAddTask
    }), /*#__PURE__*/_jsx(TaskDialog, {
      open: dialogOpen,
      onOpenChange: handleCloseDialog,
      task: editingTask,
      onSave: handleSaveTask
    }), showConfetti && /*#__PURE__*/_jsx(Confetti, {
      width: width,
      height: height,
      recycle: false,
      numberOfPieces: 200,
      gravity: 0.3,
      initialVelocityY: 10,
      confettiSource: {
        x: 0,
        y: 0,
        w: width,
        h: 0
      }
    })]
  });
}