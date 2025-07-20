import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  const isApiAdminRoute = pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login') && !pathname.startsWith('/api/admin/signup');
  const isAdminDashboard = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/signup');

  if (isApiAdminRoute || isAdminDashboard) {
    if (!token) {
        const url = req.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
      const { payload } = await jose.jwtVerify(token, secret);
      
      if ((payload as any).role !== 'admin') {
        throw new Error("Not an admin");
      }
      
      return NextResponse.next();

    } catch (error) {
        const url = req.nextUrl.clone()
        url.pathname = '/admin/login'
        const response = NextResponse.redirect(url)
        response.cookies.delete('token') // Clean up invalid token
        return response
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
