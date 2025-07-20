import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Internship from '@/models/Internship';

export async function GET() {
  await connectDB();
  try {
    const internships = await Internship.find({});
    return NextResponse.json({ internships });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
