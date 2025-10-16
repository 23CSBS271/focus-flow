"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Calendar, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function QuickAddButton({
  onAddTask
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState(undefined);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const handleSubmit = () => {
    if (title.trim()) {
      onAddTask({
        title: title.trim(),
        priority,
        status: "todo",
        dueDate,
        tags,
        createdAt: new Date()
      });
      setTitle("");
      setPriority("medium");
      setDueDate(undefined);
      setTags([]);
      setTagInput("");
      setIsOpen(false);
    }
  };
  const handleKeyPress = e => {
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
  const removeTag = tagToRemove => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  const handleTagKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };
  const priorityOptions = [{
    value: "low",
    label: "Low",
    color: "bg-blue-500"
  }, {
    value: "medium",
    label: "Medium",
    color: "bg-yellow-500"
  }, {
    value: "high",
    label: "High",
    color: "bg-orange-500"
  }, {
    value: "urgent",
    label: "Urgent",
    color: "bg-red-500"
  }];
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(AnimatePresence, {
      children: isOpen && /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          className: "fixed inset-0 bg-background/80 backdrop-blur-sm z-40",
          onClick: () => setIsOpen(false)
        }), /*#__PURE__*/_jsx(motion.div, {
          initial: {
            opacity: 0,
            scale: 0.9,
            y: 20
          },
          animate: {
            opacity: 1,
            scale: 1,
            y: 0
          },
          exit: {
            opacity: 0,
            scale: 0.9,
            y: 20
          },
          transition: {
            type: "spring",
            damping: 25,
            stiffness: 300
          },
          className: "fixed bottom-24 right-8 z-50",
          children: /*#__PURE__*/_jsxs(Card, {
            className: "w-[400px] p-6 shadow-2xl",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between mb-4",
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-lg font-semibold",
                children: "Quick Add Task"
              }), /*#__PURE__*/_jsx(Button, {
                variant: "ghost",
                size: "sm",
                className: "h-8 w-8 p-0",
                onClick: () => setIsOpen(false),
                children: /*#__PURE__*/_jsx(X, {
                  className: "w-4 h-4"
                })
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "space-y-4",
              children: [/*#__PURE__*/_jsx(Input, {
                placeholder: "What needs to be done?",
                value: title,
                onChange: e => setTitle(e.target.value),
                onKeyDown: handleKeyPress,
                autoFocus: true,
                className: "text-base"
              }), /*#__PURE__*/_jsx("div", {
                className: "flex flex-wrap gap-2",
                children: priorityOptions.map(option => /*#__PURE__*/_jsxs("button", {
                  onClick: () => setPriority(option.value),
                  className: `flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${priority === option.value ? "border-primary bg-primary/10" : "border-border hover:bg-accent"}`,
                  children: [/*#__PURE__*/_jsx("div", {
                    className: `w-2 h-2 rounded-full ${option.color}`
                  }), /*#__PURE__*/_jsx("span", {
                    className: "text-sm",
                    children: option.label
                  })]
                }, option.value))
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex gap-2",
                children: [/*#__PURE__*/_jsxs(Popover, {
                  children: [/*#__PURE__*/_jsx(PopoverTrigger, {
                    asChild: true,
                    children: /*#__PURE__*/_jsxs(Button, {
                      variant: "outline",
                      size: "sm",
                      className: "flex-1 gap-2 justify-start",
                      children: [/*#__PURE__*/_jsx(Calendar, {
                        className: "w-4 h-4"
                      }), dueDate ? format(dueDate, "MMM d, yyyy") : "Due Date"]
                    })
                  }), /*#__PURE__*/_jsx(PopoverContent, {
                    className: "w-auto p-0",
                    align: "start",
                    children: /*#__PURE__*/_jsx(CalendarComponent, {
                      mode: "single",
                      selected: dueDate,
                      onSelect: setDueDate,
                      initialFocus: true,
                      disabled: date => date < new Date(new Date().setHours(0, 0, 0, 0))
                    })
                  })]
                }), /*#__PURE__*/_jsxs(Popover, {
                  children: [/*#__PURE__*/_jsx(PopoverTrigger, {
                    asChild: true,
                    children: /*#__PURE__*/_jsxs(Button, {
                      variant: "outline",
                      size: "sm",
                      className: "flex-1 gap-2 justify-start",
                      children: [/*#__PURE__*/_jsx(TagIcon, {
                        className: "w-4 h-4"
                      }), "Tags ", tags.length > 0 && `(${tags.length})`]
                    })
                  }), /*#__PURE__*/_jsx(PopoverContent, {
                    className: "w-80",
                    align: "start",
                    children: /*#__PURE__*/_jsxs("div", {
                      className: "space-y-3",
                      children: [/*#__PURE__*/_jsxs("div", {
                        className: "flex gap-2",
                        children: [/*#__PURE__*/_jsx(Input, {
                          placeholder: "Add tag...",
                          value: tagInput,
                          onChange: e => setTagInput(e.target.value),
                          onKeyDown: handleTagKeyPress,
                          className: "flex-1"
                        }), /*#__PURE__*/_jsx(Button, {
                          size: "sm",
                          onClick: addTag,
                          disabled: !tagInput.trim(),
                          children: "Add"
                        })]
                      }), tags.length > 0 && /*#__PURE__*/_jsx("div", {
                        className: "flex flex-wrap gap-2",
                        children: tags.map(tag => /*#__PURE__*/_jsxs(Badge, {
                          variant: "secondary",
                          className: "cursor-pointer hover:bg-destructive hover:text-destructive-foreground",
                          onClick: () => removeTag(tag),
                          children: [tag, " \xD7"]
                        }, tag))
                      })]
                    })
                  })]
                })]
              }), /*#__PURE__*/_jsxs(Button, {
                className: "w-full",
                onClick: handleSubmit,
                disabled: !title.trim(),
                children: [/*#__PURE__*/_jsx(Plus, {
                  className: "w-4 h-4 mr-2"
                }), "Add Task"]
              })]
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-muted-foreground text-center mt-4",
              children: ["Press ", /*#__PURE__*/_jsx("kbd", {
                className: "px-1 py-0.5 bg-muted rounded",
                children: "Enter"
              }), " to add or ", /*#__PURE__*/_jsx("kbd", {
                className: "px-1 py-0.5 bg-muted rounded",
                children: "Esc"
              }), " to cancel"]
            })]
          })
        })]
      })
    }), /*#__PURE__*/_jsx(motion.div, {
      initial: {
        scale: 0
      },
      animate: {
        scale: 1
      },
      transition: {
        delay: 0.5,
        type: "spring"
      },
      className: "fixed bottom-8 right-8 z-30",
      children: /*#__PURE__*/_jsx(motion.div, {
        whileHover: {
          scale: 1.1
        },
        whileTap: {
          scale: 0.9
        },
        children: /*#__PURE__*/_jsx(Button, {
          size: "lg",
          onClick: () => setIsOpen(!isOpen),
          className: "rounded-full w-16 h-16 shadow-2xl bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
          children: /*#__PURE__*/_jsx(motion.div, {
            animate: {
              rotate: isOpen ? 45 : 0
            },
            transition: {
              type: "spring",
              damping: 15
            },
            children: /*#__PURE__*/_jsx(Plus, {
              className: "w-8 h-8"
            })
          })
        })
      })
    })]
  });
}