import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

export async function GET() {
  await connectDB();
  try {
    const courses = await Course.find({});
    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
