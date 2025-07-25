
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

type Params = {
  params: {
    id: string;
  }
};

// GET a single user
export async function GET(request: Request, { params }: Params) {
  await connectDB();
  try {
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// UPDATE a user
export async function PUT(request: Request, { params }: Params) {
    await connectDB();
    try {
        const body = await request.json();
        
        // Prevent password from being updated this way
        if (body.password) {
            delete body.password;
        }

        const updatedUser = await User.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json({ error: 'Validation Error', details: error }, { status: 400 });
        }
        return NextResponse.json({ error: 'Server error updating user' }, { status: 500 });
    }
}

// DELETE a user
export async function DELETE(request: Request, { params }: Params) {
    await connectDB();
    try {
        const deletedUser = await User.findByIdAndDelete(params.id);
        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Server error deleting user' }, { status: 500 });
    }
}

// PATCH to update user status (block/unblock)
export async function PATCH(request: Request, { params }: Params) {
    await connectDB();
    try {
        const body = await request.json();
        const { status } = body;

        if (!status || !['active', 'blocked'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(params.id, { status }, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user: updatedUser });

    } catch (error) {
        return NextResponse.json({ error: 'Server error updating user status' }, { status: 500 });
    }
}
