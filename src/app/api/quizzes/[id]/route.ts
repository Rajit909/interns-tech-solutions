
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Quiz } from '@/models/Quiz';

type Params = {
  params: {
    id: string;
  }
};

export async function GET(request: Request, { params }: Params) {
  await connectDB();
  try {
    const quiz = await Quiz.findById(params.id).populate('questions');
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json({ quiz });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
    await connectDB();
    try {
        const body = await request.json();
        const updatedQuiz = await Quiz.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updatedQuiz) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }
        return NextResponse.json({ quiz: updatedQuiz });
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json({ error: 'Validation Error', details: error }, { status: 400 });
        }
        return NextResponse.json({ error: 'Server error updating quiz' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: Params) {
    await connectDB();
    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(params.id);
        if (!deletedQuiz) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Server error deleting quiz' }, { status: 500 });
    }
}
