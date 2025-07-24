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

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const newInternship = new Internship(body);
    await newInternship.save();
    return NextResponse.json({ internship: newInternship }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation Error', details: error }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error creating internship' }, { status: 500 });
  }
}
