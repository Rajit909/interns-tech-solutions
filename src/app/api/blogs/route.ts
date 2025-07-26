
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET(request: Request) {
  await connectDB();
  
  const { searchParams } = new URL(request.url);
  const forAdmin = searchParams.get('admin') === 'true';

  try {
    const query = forAdmin ? {} : { status: 'published', publishDate: { $lte: new Date() } };
    const posts = await Blog.find(query).sort({ publishDate: -1 });
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const newPost = new Blog(body);
    await newPost.save();
    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation Error', details: error }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error creating blog post' }, { status: 500 });
  }
}
