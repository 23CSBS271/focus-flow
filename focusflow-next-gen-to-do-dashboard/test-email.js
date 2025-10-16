import { testEmailConfiguration, sendOverdueTaskNotification } from './src/lib/email.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test email configuration
async function testEmail() {
  console.log('Testing email configuration...');

  // Debug: Show what environment variables are loaded
  console.log('Environment variables loaded:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
  console.log('SMTP_USER:', process.env.SMTP_USER ? '***' + process.env.SMTP_USER.slice(-10) : 'undefined');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'undefined');
  console.log('---');

  const configTest = await testEmailConfiguration();
  if (!configTest.success) {
    console.error('Email configuration test failed:', configTest.error);
    console.log('Please check your .env file and ensure SMTP settings are correct.');
    return;
  }

  console.log('Email configuration is valid!');

  // Test sending a sample overdue notification
  console.log('Sending test overdue notification...');

  const sampleTasks = [
    {
      title: 'Complete project proposal',
      dueDate: new Date('2024-01-15'),
    },
    {
      title: 'Review code changes',
      dueDate: new Date('2024-01-10'),
    },
  ];

  const result = await sendOverdueTaskNotification('chinmayib35@gmail.com', sampleTasks);

  if (result.success) {
    console.log('Test email sent successfully!');
    console.log('Message ID:', result.messageId);
  } else {
    console.error('Failed to send test email:', result.error);
  }
}

// Run the test
testEmail().catch(console.error);
