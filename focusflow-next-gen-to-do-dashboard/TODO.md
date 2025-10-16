# TODO: Enhance CategoryView with Advanced Features

## Pending Tasks
- [x] Update Sidebar.js to add categories navigation item linking to /categories
- [x] Create src/app/categories/page.js to render CategoryView
- [x] Create src/components/dashboard/CategoryView.js with distinct category display (cards with icons, colors, task counts)
- [x] Test navigation between categories page and dashboard
- [x] Make categories clickable to show tasks within each category
- [x] Add smooth animations with AnimatePresence
- [ ] Add "Add Category" button with dialog for creating new categories
- [ ] Implement TaskForm dialog component for adding/editing tasks
- [ ] Enhance task management UI with floating action buttons and animations
- [ ] Add unique visual effects (particle animations, gradient backgrounds, micro-interactions)
- [ ] Implement dynamic category creation (update Task model enum if needed)
- [ ] Test all CRUD operations for tasks within categories
- [ ] Add category deletion functionality
- [ ] Make the design uniquely attractive with custom animations

# TODO: Implement Email Notifications for Overdue Tasks

## Pending Tasks
- [x] Add nodemailer and node-cron dependencies to package.json
- [x] Create src/lib/email.js with email service utility functions
- [x] Create src/scripts/overdue-notifications.js cron job script
- [x] Update TODO.md with implementation steps
- [x] Install new dependencies
- [x] Set up email credentials (SMTP settings in .env)
- [x] Test email sending with sample data
- [x] Run cron job manually for testing
- [x] Confirm email service choice and credentials

# TODO: Implement Immediate Overdue Notifications with Time Support

## Pending Tasks
- [x] Modify src/scripts/overdue-notifications.js to use setInterval for continuous monitoring (every 1-5 minutes)
- [x] Add 'notified' field to Task model to prevent duplicate notifications
- [x] Update TaskDialog.js to include time picker alongside date picker (converted from JSX to regular JSX)
- [x] Update email template in src/lib/email.js to show date and time
- [x] Test real-time notifications with sample overdue tasks
- [x] Verify time picker works correctly
- [x] Confirm notification frequency (1-5 minutes)
