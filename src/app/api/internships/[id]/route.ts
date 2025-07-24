import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Internship from '@/models/Internship';

type Params = {
  params: {
    id: string;
  }
};

// GET a single internship
export async function GET(request: Request, { params }: Params) {
  await connectDB();
  try {
    const internship = await Internship.findById(params.id);
    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }
    return NextResponse.json({ internship });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// UPDATE an internship
export async function PUT(request: Request, { params }: Params) {
    await connectDB();
    try {
        const body = await request.json();
        const updatedInternship = await Internship.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updatedInternship) {
            return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
        }
        return NextResponse.json({ internship: updatedInternship });
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json({ error: 'Validation Error', details: error }, { status: 400 });
        }
        return NextResponse.json({ error: 'Server error updating internship' }, { status: 500 });
    }
}

// DELETE an internship
export async function DELETE(request: Request, { params }: Params) {
    await connectDB();
    try {
        const deletedInternship = await Internship.findByIdAndDelete(params.id);
        if (!deletedInternship) {
            return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Internship deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Server error deleting internship' }, { status: 500 });
    }
}
