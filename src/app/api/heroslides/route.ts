
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';

// GET all hero slides
export async function GET() {
  await connectDB();
  try {
    const slides = await HeroSlide.find({}).sort({ order: 1 });
    return NextResponse.json({ slides });
  } catch (error) {
    return NextResponse.json({ error: 'Server error fetching hero slides' }, { status: 500 });
  }
}

// POST a new hero slide
export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const newSlide = new HeroSlide(body);
    await newSlide.save();
    return NextResponse.json({ slide: newSlide }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation Error', details: error }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error creating hero slide' }, { status: 500 });
  }
}
