
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

type Params = {
  params: {
    id: string;
  }
};

// GET a single blog post
export async function GET(request: Request, { params }: Params) {
  await connectDB();
  try {
    const post = await Blog.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// UPDATE a blog post
export async function PUT(request: Request, { params }: Params) {
    await connectDB();
    try {
        const body = await request.json();
        const updatedPost = await Blog.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updatedPost) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }
        return NextResponse.json({ post: updatedPost });
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json({ error: 'Validation Error', details: error }, { status: 400 });
        }
        return NextResponse.json({ error: 'Server error updating blog post' }, { status: 500 });
    }
}

// DELETE a blog post
export async function DELETE(request: Request, { params }: Params) {
    await connectDB();
    try {
        const deletedPost = await Blog.findByIdAndDelete(params.id);
        if (!deletedPost) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Server error deleting blog post' }, { status: 500 });
    }
}
