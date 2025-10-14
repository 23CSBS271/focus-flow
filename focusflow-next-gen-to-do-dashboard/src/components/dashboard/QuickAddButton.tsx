"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Calendar, Flag, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Task, TaskPriority } from "@/types/task";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface QuickAddButtonProps {
  onAddTask: (task: Partial<Task>) => void;
}

export function QuickAddButton({ onAddTask }: QuickAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      onAddTask({
        title: title.trim(),
        priority,
        status: "todo",
        dueDate,
        tags,
        createdAt: new Date(),
      });
      setTitle("");
      setPriority("medium");
      setDueDate(undefined);
      setTags([]);
      setTagInput("");
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
    { value: "low", label: "Low", color: "bg-blue-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "urgent", label: "Urgent", color: "bg-red-500" },
  ];

  return (
    <>
      {/* Quick Add Card */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Quick Add Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-8 z-50"
            >
              <Card className="w-[400px] p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Quick Add Task</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <Input
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoFocus
                    className="text-base"
                  />

                  <div className="flex flex-wrap gap-2">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPriority(option.value)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                          priority === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-accent"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${option.color}`} />
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 gap-2 justify-start">
                          <Calendar className="w-4 h-4" />
                          {dueDate ? format(dueDate, "MMM d, yyyy") : "Due Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dueDate}
                          onSelect={setDueDate}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 gap-2 justify-start">
                          <TagIcon className="w-4 h-4" />
                          Tags {tags.length > 0 && `(${tags.length})`}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="start">
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add tag..."
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleTagKeyPress}
                              className="flex-1"
                            />
                            <Button size="sm" onClick={addTag} disabled={!tagInput.trim()}>
                              Add
                            </Button>
                          </div>
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={() => removeTag(tag)}
                                >
                                  {tag} ×
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={!title.trim()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Press <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd> to add
                  or <kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> to cancel
                </p>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed bottom-8 right-8 z-30"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            size="lg"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full w-16 h-16 shadow-2xl bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Plus className="w-8 h-8" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
}
