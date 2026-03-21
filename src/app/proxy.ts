import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticatedFromRequest } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthenticated = isAuthenticatedFromRequest(request);
  const isProtectedAdminPath = pathname.startsWith('/admin') && pathname !== '/admin';
  const isLoginPage = pathname === '/admin';

  if (isProtectedAdminPath && !isAuthenticated) {
    const loginUrl = new URL('/admin', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && isAuthenticated) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/admin/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
