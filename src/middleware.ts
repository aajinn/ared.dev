import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticatedFromRequest } from '@/lib/auth';

/**
 * Authentication middleware for admin routes protection
 * Handles session validation and route protection for the admin panel
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is authenticated using the auth utility
  const isAuthenticated = isAuthenticatedFromRequest(request);
  
  // Define protected admin paths (everything under /admin except login page)
  const isProtectedAdminPath = pathname.startsWith('/admin') && pathname !== '/admin';
  const isLoginPage = pathname === '/admin';
  
  // Redirect to login if trying to access protected admin routes without authentication
  if (isProtectedAdminPath && !isAuthenticated) {
    const loginUrl = new URL('/admin', request.url);
    // Add redirect parameter to return to original page after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if (isLoginPage && isAuthenticated) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/admin/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Add security headers for admin routes
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    
    // Add security headers
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
    '/api/admin/:path*'
  ],
};
