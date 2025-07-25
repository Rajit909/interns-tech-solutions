import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  await connectDB();
  try {
    const users = await User.find({});
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        joinedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    });

    await newUser.save();

    // Don't send the password back
    const userObj = newUser.toObject();
    delete userObj.password;

    return NextResponse.json({ user: userObj }, { status: 201 });

  } catch (error) {
     if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation Error', details: error }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error creating user' }, { status: 500 });
  }
}
