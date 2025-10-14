import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/Task';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ tasks }, { status: 200 });

  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { userId, title, description, status, priority, category, dueDate } = await request.json();

    if (!userId || !title) {
      return NextResponse.json(
        { error: 'User ID and title are required' },
        { status: 400 }
      );
    }

    const newTask = new Task({
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      category: category || 'other',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId,
    });

    const savedTask = await newTask.save();
    return NextResponse.json(
      { message: 'Task created successfully', task: savedTask },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const { id, title, description, status, priority, category, dueDate } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (category !== undefined) updateData.category = category;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : undefined;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Task updated successfully', task: updatedTask },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
