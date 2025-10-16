"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, Heart, ShoppingCart, MoreHorizontal, ArrowLeft, Plus, Edit, Trash2, CheckCircle, Circle, Sparkles, Zap, Target, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const categoryConfig = {
  personal: {
    icon: User,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  work: {
    icon: Briefcase,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800"
  },
  health: {
    icon: Heart,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800"
  },
  shopping: {
    icon: ShoppingCart,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  other: {
    icon: MoreHorizontal,
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
    borderColor: "border-gray-200 dark:border-gray-800"
  }
};

export function CategoryView() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: selectedCategory || 'personal',
    dueDate: '',
    status: 'todo',
    tags: ''
  });
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState(['personal', 'work', 'health', 'shopping', 'other']);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/tasks?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user]);

  const getCategoryStats = (category) => {
    const categoryTasks = tasks.filter(task => task.category === category);
    const total = categoryTasks.length;
    const completed = categoryTasks.filter(task => task.status === 'completed').length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const categoryTasks = selectedCategory ? tasks.filter(task => task.category === selectedCategory) : [];

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      category: selectedCategory || 'personal',
      dueDate: '',
      status: 'todo',
      tags: ''
    });
    setDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: task.status || 'todo',
      tags: task.tags || ''
    });
    setDialogOpen(true);
  };

  const handleSaveTask = async () => {
    if (!taskForm.title.trim()) return;

    try {
      const taskData = {
        userId: user.id,
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        category: taskForm.category,
        dueDate: taskForm.dueDate || undefined,
        status: taskForm.status,
        tags: taskForm.tags
      };

      let response;
      if (editingTask) {
        response = await fetch(`/api/tasks`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingTask._id, ...taskData })
        });
      } else {
        response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
      }

      if (response.ok) {
        const data = await response.json();
        if (editingTask) {
          setTasks(tasks.map(t => t._id === editingTask._id ? data.task : t));
        } else {
          setTasks([...tasks, data.task]);
        }
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskToDelete._id })
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== taskToDelete._id));
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      const newStatus = task.status === 'completed' ? 'pending' : 'completed';

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTasks(tasks.map(t =>
          t._id === taskId ? { ...t, status: newStatus } : t
        ));
      } else {
        console.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Categories</h1>
              <p className="text-muted-foreground">Organize and track your tasks by category</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto p-8">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="categories-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {categories.map((category, index) => {
                const config = categoryConfig[category] || categoryConfig.other;
                const stats = getCategoryStats(category);
                const Icon = config.icon;

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`relative overflow-hidden ${config.bgColor} ${config.borderColor} border-2 hover:shadow-lg transition-all duration-300 cursor-pointer group`} onClick={() => setSelectedCategory(category)}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-xs text-muted-foreground">Total Tasks</div>
                          </div>
                        </div>
                        <CardTitle className="capitalize text-xl">{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Completed</span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">{stats.completed}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Pending</span>
                            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">{stats.pending}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-4 overflow-hidden">
                            <motion.div
                              className={`h-2 rounded-full bg-gradient-to-r ${config.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: stats.total > 0 ? `${(stats.completed / stats.total) * 100}%` : '0%' }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            ></motion.div>
                          </div>
                        </div>
                      </CardContent>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="category-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={() => setSelectedCategory(null)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Categories
                  </Button>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryConfig[selectedCategory]?.color || categoryConfig.other.color} flex items-center justify-center`}>
                    {React.createElement(categoryConfig[selectedCategory]?.icon || categoryConfig.other.icon, { className: "w-5 h-5 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold capitalize">{selectedCategory}</h2>
                    <p className="text-muted-foreground">{categoryTasks.length} tasks</p>
                  </div>
                </div>
                <Button onClick={handleAddTask} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Task
                </Button>
              </div>

              <div className="space-y-4">
                {categoryTasks.length === 0 ? (
                  <Card className="p-8 text-center">
                    <div className="text-muted-foreground">
                      <MoreHorizontal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No tasks in this category yet.</p>
                      <Button onClick={handleAddTask} className="mt-4" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Create your first task
                      </Button>
                    </div>
                  </Card>
                ) : (
                  categoryTasks.map((task, index) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleComplete(task._id)}
                                className="p-0 h-auto"
                              >
                                {task.status === 'completed' ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-muted-foreground" />
                                )}
                              </Button>
                              <div className="flex-1">
                                <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                  {task.title}
                                </h3>
                                {task.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <Badge variant={task.priority === 'urgent' ? 'destructive' : task.priority === 'high' ? 'default' : 'secondary'}>
                                    {task.priority}
                                  </Badge>
                                  <Badge variant="outline" className="capitalize">
                                    {task.status.replace('-', ' ')}
                                  </Badge>
                                  {task.dueDate && (
                                    <span className="text-xs text-muted-foreground">
                                      Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                {task.tags && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <span className="text-xs text-muted-foreground">Tags:</span>
                                    {task.tags.split(',').map((tag, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {tag.trim()}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task)} className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Task Form Dialog */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title" className="text-sm font-medium">Title</label>
                      <Input
                        id="title"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="description" className="text-sm font-medium">Description</label>
                      <Textarea
                        id="description"
                        value={taskForm.description}
                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                        placeholder="Enter task description"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                      <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({ ...taskForm, priority: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="category" className="text-sm font-medium">Category</label>
                      <Select value={taskForm.category} onValueChange={(value) => setTaskForm({ ...taskForm, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="status" className="text-sm font-medium">Status</label>
                      <Select value={taskForm.status} onValueChange={(value) => setTaskForm({ ...taskForm, status: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="tags" className="text-sm font-medium">Tags</label>
                      <Input
                        id="tags"
                        value={taskForm.tags}
                        onChange={(e) => setTaskForm({ ...taskForm, tags: e.target.value })}
                        placeholder="Enter tags (comma separated)"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveTask}>
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete the task "{taskToDelete?.title}"? This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={confirmDeleteTask}>
                      Delete Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Stats - Only show when not in category detail view */}
        {!selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-center">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary">{tasks.length}</div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600">{tasks.filter(t => t.status !== 'completed').length}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
