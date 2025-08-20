
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  await connectDB();

  try {
    // 1. Authenticate user
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    const userId = payload.userId;

    // 2. Get courseId from request body
    const body = await request.json();
    const { courseId } = body;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return NextResponse.json({ error: 'Valid Course ID is required' }, { status: 400 });
    }
    
    // 3. Find user and check if already enrolled
    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.enrolledCourses.includes(courseId)) {
        return NextResponse.json({ error: 'You are already enrolled in this course' }, { status: 400 });
    }
    
    // 4. Add course to user's enrolledCourses and save
    user.enrolledCourses.push(courseId);
    await user.save();

    return NextResponse.json({ message: 'Enrollment successful', user });

  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
        return NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 });
    }
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Server error during enrollment' }, { status: 500 });
  }
}
