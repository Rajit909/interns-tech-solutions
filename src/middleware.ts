
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

async function handleAdminAuth(req: NextRequest, token: string | undefined) {
    const { pathname } = req.nextUrl;
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';

    if (!token) {
        return NextResponse.redirect(loginUrl);
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
        const { payload } = await jose.jwtVerify(token, secret);

        if ((payload as any).role !== 'admin') {
            throw new Error("Not an admin");
        }
        
        return NextResponse.next();

    } catch (error) {
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('token'); // Clean up invalid token
        return response;
    }
}


async function handleStudentAuth(req: NextRequest, token: string | undefined) {
    const { pathname } = req.nextUrl;
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';

    if (!token) {
        return NextResponse.redirect(loginUrl);
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
        await jose.jwtVerify(token, secret); // Just verify the token exists and is valid
        return NextResponse.next();
    } catch (error) {
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('token'); // Clean up invalid token
        return response;
    }
}


export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin/') && !(pathname.startsWith('/admin/login') || pathname.startsWith('/admin/signup'));
  
  if (isAdminRoute) {
    return handleAdminAuth(req, token);
  }

  const isStudentDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/api/me');
  if(isStudentDashboard) {
    return handleStudentAuth(req, token);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/me/:path*'],
}
