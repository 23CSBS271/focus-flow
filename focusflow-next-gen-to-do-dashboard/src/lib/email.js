import nodemailer from 'nodemailer';

// Create transporter with SMTP configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send overdue task notification email
export const sendOverdueTaskNotification = async (userEmail, overdueTasks) => {
  try {
    const transporter = createTransporter();

    // Verify connection configuration
    await transporter.verify();

    const taskList = overdueTasks.map(task =>
      `- ${task.title} (Due: ${new Date(task.dueDate).toLocaleString()})`
    ).join('\n');

    const mailOptions = {
      from: `"FocusFlow" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: 'Overdue Tasks Reminder - FocusFlow',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Overdue Tasks Reminder</h2>
          <p>Hello,</p>
          <p>You have the following overdue tasks that need your attention:</p>
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 16px 0;">
            <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${taskList}</pre>
          </div>
          <p>Please log in to <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #2563eb;">FocusFlow</a> to update these tasks.</p>
          <p>Stay productive!</p>
          <p>The FocusFlow Team</p>
        </div>
      `,
      text: `
        Overdue Tasks Reminder

        Hello,

        You have the following overdue tasks that need your attention:

        ${taskList}

        Please log in to ${process.env.NEXT_PUBLIC_APP_URL} to update these tasks.

        Stay productive!

        The FocusFlow Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Overdue notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending overdue notification email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email to new users
export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"FocusFlow" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: 'Welcome to FocusFlow!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to FocusFlow, ${userName}!</h2>
          <p>Thank you for joining FocusFlow, your ultimate task management companion.</p>
          <p>Start organizing your tasks, setting priorities, and boosting your productivity today!</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Started</a></p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Happy tasking!</p>
          <p>The FocusFlow Team</p>
        </div>
      `,
      text: `
        Welcome to FocusFlow, ${userName}!

        Thank you for joining FocusFlow, your ultimate task management companion.

        Start organizing your tasks, setting priorities, and boosting your productivity today!

        Get Started: ${process.env.NEXT_PUBLIC_APP_URL}

        If you have any questions, feel free to reach out to our support team.

        Happy tasking!

        The FocusFlow Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return { success: true };
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return { success: false, error: error.message };
  }
};
