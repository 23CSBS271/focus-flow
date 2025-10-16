import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
export async function POST(request) {
  try {
    await connectToDatabase();
    const {
      email,
      password
    } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password are required'
      }, {
        status: 400
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    });
    if (!user) {
      return NextResponse.json({
        error: 'Invalid email or password'
      }, {
        status: 401
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({
        error: 'Invalid email or password'
      }, {
        status: 401
      });
    }

    // Return user data (without password)
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profileImage: user.profileImage,
      bio: user.bio,
      timezone: user.timezone
    };
    return NextResponse.json({
      message: 'Login successful',
      user: userResponse
    }, {
      status: 200
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    });
  }
}