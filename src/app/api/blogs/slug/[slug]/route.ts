
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

type Params = {
  params: {
    slug: string;
  }
};

// GET a single blog post by slug
export async function GET(request: Request, { params }: Params) {
  await connectDB();
  try {
    const post = await Blog.findOne({ slug: params.slug });
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
