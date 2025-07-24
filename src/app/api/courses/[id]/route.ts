import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

type Params = {
  params: {
    id: string;
  }
};

// GET a single course
export async function GET(request: Request, { params }: Params) {
  await connectDB();
  try {
    const course = await Course.findById(params.id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ course });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// UPDATE a course
export async function PUT(request: Request, { params }: Params) {
    await connectDB();
    try {
        const body = await request.json();
        const updatedCourse = await Course.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updatedCourse) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }
        return NextResponse.json({ course: updatedCourse });
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json({ error: 'Validation Error', details: error }, { status: 400 });
        }
        return NextResponse.json({ error: 'Server error updating course' }, { status: 500 });
    }
}

// DELETE a course
export async function DELETE(request: Request, { params }: Params) {
    await connectDB();
    try {
        const deletedCourse = await Course.findByIdAndDelete(params.id);
        if (!deletedCourse) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Course deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Server error deleting course' }, { status: 500 });
    }
}
