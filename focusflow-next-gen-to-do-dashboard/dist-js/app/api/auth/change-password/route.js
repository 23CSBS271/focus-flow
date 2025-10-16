import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { userId, currentPassword, newPassword } = await request.json();

    // Validate input
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json({
        error: 'User ID, current password, and new password are required'
      }, {
        status: 400
      });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({
        error: 'New password must be at least 8 characters long'
      }, {
        status: 400
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, {
        status: 404
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({
        error: 'Current password is incorrect'
      }, {
        status: 401
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedNewPassword;
    user.updatedAt = new Date();
    await user.save();

    return NextResponse.json({
      message: 'Password updated successfully'
    }, {
      status: 200
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}
