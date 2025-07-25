
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  await connectDB();

  try {
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    const userId = payload.userId;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return user data without password
    const { password, ...userData } = user.toObject();

    return NextResponse.json({ user: userData });

  } catch (error) {
    console.error('Failed to fetch user:', error);
    // Clear the invalid cookie
    const response = NextResponse.json({ error: 'Invalid token or server error' }, { status: 401 });
    response.cookies.delete('token');
    return response;
  }
}
