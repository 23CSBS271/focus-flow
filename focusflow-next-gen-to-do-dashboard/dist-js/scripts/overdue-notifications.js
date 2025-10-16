import connectDB from '../lib/mongodb.js';
import { sendOverdueTaskNotification } from '../lib/email.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

// Function to check and send overdue task notifications
const checkOverdueTasks = async () => {
  try {
    console.log('Checking for overdue tasks...');

    // Connect to database
    await connectDB();

    // Get current date
    const now = new Date();

    // Find all tasks that are overdue (due date < current date and not completed and not notified)
    const overdueTasks = await Task.find({
      dueDate: { $lt: now },
      status: { $ne: 'completed' },
      notified: false,
    }).populate('user', 'email name');

    if (overdueTasks.length === 0) {
      console.log('No overdue tasks found.');
      return;
    }

    // Group overdue tasks by user
    const tasksByUser = {};
    overdueTasks.forEach(task => {
      if (!tasksByUser[task.user._id]) {
        tasksByUser[task.user._id] = {
          user: task.user,
          tasks: [],
        };
      }
      tasksByUser[task.user._id].tasks.push(task);
    });

    // Send notifications to each user and mark tasks as notified
    for (const userId in tasksByUser) {
      const { user, tasks } = tasksByUser[userId];

      console.log(`Sending overdue notification to ${user.email} for ${tasks.length} tasks`);

      const result = await sendOverdueTaskNotification(user.email, tasks);

      if (result.success) {
        console.log(`Notification sent successfully to ${user.email}`);

        // Mark tasks as notified
        await Task.updateMany(
          { _id: { $in: tasks.map(task => task._id) } },
          { notified: true }
        );
      } else {
        console.error(`Failed to send notification to ${user.email}:`, result.error);
      }
    }

    console.log(`Processed ${Object.keys(tasksByUser).length} users with overdue tasks`);
  } catch (error) {
    console.error('Error checking overdue tasks:', error);
  }
};

// Schedule continuous monitoring with setInterval (every 5 minutes)
const scheduleOverdueNotifications = () => {
  const intervalMs = 5 * 60 * 1000; // 5 minutes in milliseconds

  setInterval(() => {
    console.log('Running continuous overdue task check...');
    checkOverdueTasks();
  }, intervalMs);

  console.log('Overdue task notification monitoring scheduled to run every 5 minutes');
};

// Export functions for testing and manual execution
export { checkOverdueTasks, scheduleOverdueNotifications };

// If this script is run directly, execute the check immediately and schedule the cron job
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Running overdue notifications script...');

  // Run immediately for testing
  await checkOverdueTasks();

  // Schedule for daily execution
  scheduleOverdueNotifications();

  console.log('Overdue notifications script initialized. Press Ctrl+C to exit.');
}
