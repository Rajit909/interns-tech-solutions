
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';

type Params = {
  params: {
    id: string;
  }
};

// GET a single hero slide
export async function GET(request: Request, { params }: Params) {
  await connectDB();
  try {
    const slide = await HeroSlide.findById(params.id);
    if (!slide) {
      return NextResponse.json({ error: 'Hero slide not found' }, { status: 404 });
    }
    return NextResponse.json({ slide });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// UPDATE a hero slide
export async function PUT(request: Request, { params }: Params) {
    await connectDB();
    try {
        const body = await request.json();
        const updatedSlide = await HeroSlide.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updatedSlide) {
            return NextResponse.json({ error: 'Hero slide not found' }, { status: 404 });
        }
        return NextResponse.json({ slide: updatedSlide });
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json({ error: 'Validation Error', details: error }, { status: 400 });
        }
        return NextResponse.json({ error: 'Server error updating hero slide' }, { status: 500 });
    }
}

// DELETE a hero slide
export async function DELETE(request: Request, { params }: Params) {
    await connectDB();
    try {
        const deletedSlide = await HeroSlide.findByIdAndDelete(params.id);
        if (!deletedSlide) {
            return NextResponse.json({ error: 'Hero slide not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Hero slide deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Server error deleting hero slide' }, { status: 500 });
    }
}
