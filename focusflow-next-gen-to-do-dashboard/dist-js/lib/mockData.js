export const mockTasks = [{
  id: "1",
  title: "Complete project proposal",
  description: "Draft and finalize the Q1 project proposal for client review",
  priority: "high",
  status: "in-progress",
  category: "work",
  dueDate: new Date(Date.now() + 86400000),
  // Tomorrow
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ["work", "urgent"]
}, {
  id: "2",
  title: "Review design mockups",
  description: "Provide feedback on the new landing page designs",
  priority: "medium",
  status: "todo",
  category: "work",
  dueDate: new Date(Date.now() + 172800000),
  // 2 days
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ["design", "review"]
}, {
  id: "3",
  title: "Team standup meeting",
  description: "Daily sync with development team",
  priority: "medium",
  status: "completed",
  category: "work",
  dueDate: new Date(),
  createdAt: new Date(Date.now() - 86400000),
  updatedAt: new Date(),
  tags: ["meeting", "team"]
}, {
  id: "4",
  title: "Update documentation",
  description: "Add API documentation for new endpoints",
  priority: "low",
  status: "todo",
  category: "work",
  dueDate: new Date(Date.now() + 604800000),
  // 1 week
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ["docs", "backend"]
}, {
  id: "5",
  title: "Fix critical bug in production",
  description: "Resolve authentication issue affecting users",
  priority: "urgent",
  status: "in-progress",
  category: "work",
  dueDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ["bug", "production"]
}, {
  id: "6",
  title: "Prepare presentation slides",
  description: "Create slides for Friday's stakeholder meeting",
  priority: "high",
  status: "todo",
  category: "work",
  dueDate: new Date(Date.now() + 345600000),
  // 4 days
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ["presentation", "meeting"]
}, {
  id: "7",
  title: "Code review for PR #234",
  description: "Review and approve pull request from backend team",
  priority: "medium",
  status: "todo",
  category: "work",
  dueDate: new Date(Date.now() + 86400000),
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ["code-review", "backend"]
}, {
  id: "8",
  title: "Schedule dental appointment",
  description: "Book routine checkup for next month",
  priority: "low",
  status: "todo",
  category: "health",
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ["personal", "health"]
}, {
  id: "9",
  title: "Morning workout",
  description: "30 minutes cardio and strength training",
  priority: "medium",
  status: "completed",
  category: "health",
  dueDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ["fitness", "routine"]
}, {
  id: "10",
  title: "Buy groceries",
  description: "Get items for the week - milk, eggs, vegetables",
  priority: "medium",
  status: "todo",
  category: "shopping",
  dueDate: new Date(Date.now() + 86400000),
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ["groceries", "errands"]
}, {
  id: "11",
  title: "Read chapter 5",
  description: "Continue reading 'Atomic Habits'",
  priority: "low",
  status: "todo",
  category: "personal",
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ["reading", "self-improvement"]
}];