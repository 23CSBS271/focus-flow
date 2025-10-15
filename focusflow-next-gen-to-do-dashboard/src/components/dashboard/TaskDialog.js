"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Tag } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function TaskDialog({
  open,
  onOpenChange,
  task,
  onSave
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [category, setCategory] = useState("personal");
  const [dueDate, setDueDate] = useState(undefined);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setStatus(task.status);
      setCategory(task.category);
      setDueDate(task.dueDate);
      setTags(task.tags || []);
    } else {
      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("todo");
      setCategory("personal");
      setDueDate(undefined);
      setTags([]);
    }
  }, [task, open]);
  const handleSave = () => {
    const taskData = {
      title,
      description,
      priority,
      status,
      category,
      dueDate,
      tags
    };
    if (task) {
      taskData.id = task.id;
    }
    onSave(taskData);
    onOpenChange(false);
  };
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const handleRemoveTag = tag => {
    setTags(tags.filter(t => t !== tag));
  };
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: onOpenChange,
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "sm:max-w-[500px]",
      children: [/*#__PURE__*/_jsxs(DialogHeader, {
        children: [/*#__PURE__*/_jsx(DialogTitle, {
          children: task ? "Edit Task" : "Create New Task"
        }), /*#__PURE__*/_jsx(DialogDescription, {
          children: task ? "Update task details" : "Add a new task to your workflow"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "space-y-4 py-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "space-y-2",
          children: [/*#__PURE__*/_jsx(Label, {
            htmlFor: "title",
            children: "Title *"
          }), /*#__PURE__*/_jsx(Input, {
            id: "title",
            value: title,
            onChange: e => setTitle(e.target.value),
            placeholder: "Enter task title"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-2",
          children: [/*#__PURE__*/_jsx(Label, {
            htmlFor: "description",
            children: "Description"
          }), /*#__PURE__*/_jsx(Textarea, {
            id: "description",
            value: description,
            onChange: e => setDescription(e.target.value),
            placeholder: "Add task description",
            rows: 3
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-2",
          children: [/*#__PURE__*/_jsx(Label, {
            htmlFor: "category",
            children: "Category"
          }), /*#__PURE__*/_jsxs(Select, {
            value: category,
            onValueChange: v => setCategory(v),
            children: [/*#__PURE__*/_jsx(SelectTrigger, {
              id: "category",
              children: /*#__PURE__*/_jsx(SelectValue, {})
            }), /*#__PURE__*/_jsxs(SelectContent, {
              children: [/*#__PURE__*/_jsx(SelectItem, {
                value: "personal",
                children: "Personal"
              }), /*#__PURE__*/_jsx(SelectItem, {
                value: "work",
                children: "Work"
              }), /*#__PURE__*/_jsx(SelectItem, {
                value: "health",
                children: "Health"
              }), /*#__PURE__*/_jsx(SelectItem, {
                value: "shopping",
                children: "Shopping"
              }), /*#__PURE__*/_jsx(SelectItem, {
                value: "other",
                children: "Other"
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "space-y-2",
            children: [/*#__PURE__*/_jsx(Label, {
              htmlFor: "priority",
              children: "Priority"
            }), /*#__PURE__*/_jsxs(Select, {
              value: priority,
              onValueChange: v => setPriority(v),
              children: [/*#__PURE__*/_jsx(SelectTrigger, {
                id: "priority",
                children: /*#__PURE__*/_jsx(SelectValue, {})
              }), /*#__PURE__*/_jsxs(SelectContent, {
                children: [/*#__PURE__*/_jsx(SelectItem, {
                  value: "low",
                  children: "Low"
                }), /*#__PURE__*/_jsx(SelectItem, {
                  value: "medium",
                  children: "Medium"
                }), /*#__PURE__*/_jsx(SelectItem, {
                  value: "high",
                  children: "High"
                }), /*#__PURE__*/_jsx(SelectItem, {
                  value: "urgent",
                  children: "Urgent"
                })]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-2",
            children: [/*#__PURE__*/_jsx(Label, {
              htmlFor: "status",
              children: "Status"
            }), /*#__PURE__*/_jsxs(Select, {
              value: status,
              onValueChange: v => setStatus(v),
              children: [/*#__PURE__*/_jsx(SelectTrigger, {
                id: "status",
                children: /*#__PURE__*/_jsx(SelectValue, {})
              }), /*#__PURE__*/_jsxs(SelectContent, {
                children: [/*#__PURE__*/_jsx(SelectItem, {
                  value: "todo",
                  children: "To Do"
                }), /*#__PURE__*/_jsx(SelectItem, {
                  value: "in-progress",
                  children: "In Progress"
                }), /*#__PURE__*/_jsx(SelectItem, {
                  value: "completed",
                  children: "Completed"
                })]
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-2",
          children: [/*#__PURE__*/_jsx(Label, {
            children: "Due Date"
          }), /*#__PURE__*/_jsxs(Popover, {
            children: [/*#__PURE__*/_jsx(PopoverTrigger, {
              asChild: true,
              children: /*#__PURE__*/_jsxs(Button, {
                variant: "outline",
                className: "w-full justify-start text-left font-normal",
                children: [/*#__PURE__*/_jsx(CalendarIcon, {
                  className: "mr-2 h-4 w-4"
                }), dueDate ? format(dueDate, "PPP") : /*#__PURE__*/_jsx("span", {
                  children: "Pick a date"
                })]
              })
            }), /*#__PURE__*/_jsx(PopoverContent, {
              className: "w-auto p-0",
              children: /*#__PURE__*/_jsx(Calendar, {
                mode: "single",
                selected: dueDate,
                onSelect: setDueDate,
                initialFocus: true,
                disabled: date => date < new Date(new Date().setHours(0, 0, 0, 0))
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-2",
          children: [/*#__PURE__*/_jsx(Label, {
            htmlFor: "tags",
            children: "Tags"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex gap-2",
            children: [/*#__PURE__*/_jsx(Input, {
              id: "tags",
              value: tagInput,
              onChange: e => setTagInput(e.target.value),
              onKeyDown: e => e.key === "Enter" && (e.preventDefault(), handleAddTag()),
              placeholder: "Add tags"
            }), /*#__PURE__*/_jsx(Button, {
              type: "button",
              variant: "secondary",
              onClick: handleAddTag,
              children: /*#__PURE__*/_jsx(Tag, {
                className: "w-4 h-4"
              })
            })]
          }), tags.length > 0 && /*#__PURE__*/_jsx("div", {
            className: "flex flex-wrap gap-2 mt-2",
            children: tags.map(tag => /*#__PURE__*/_jsxs(Badge, {
              variant: "secondary",
              className: "cursor-pointer",
              onClick: () => handleRemoveTag(tag),
              children: [tag, " \xD7"]
            }, tag))
          })]
        })]
      }), /*#__PURE__*/_jsxs(DialogFooter, {
        children: [/*#__PURE__*/_jsx(Button, {
          variant: "outline",
          onClick: () => onOpenChange(false),
          children: "Cancel"
        }), /*#__PURE__*/_jsxs(Button, {
          onClick: handleSave,
          disabled: !title.trim(),
          children: [task ? "Update" : "Create", " Task"]
        })]
      })]
    })
  });
}