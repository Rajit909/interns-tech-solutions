
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Quiz } from '@/models/Quiz';

export async function GET() {
  await connectDB();
  try {
    const quizzes = await Quiz.find({}).populate('questions');
    return NextResponse.json({ quizzes });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const newQuiz = new Quiz(body);
    await newQuiz.save();
    return NextResponse.json({ quiz: newQuiz }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation Error', details: error }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error creating quiz' }, { status: 500 });
  }
}
