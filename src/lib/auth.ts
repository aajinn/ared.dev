import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

/**
 * Session management utilities for admin authentication
 * Provides secure cookie handling and session validation
 */

// Session configuration
const SESSION_CONFIG = {
  cookieName: 'admin_session',
  maxAge: 60 * 60 * 24, // 24 hours in seconds
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

/**
 * Creates a secure admin session
 */
export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_CONFIG.cookieName, 'true', {
    httpOnly: SESSION_CONFIG.httpOnly,
    secure: SESSION_CONFIG.secure,
    sameSite: SESSION_CONFIG.sameSite,
    path: SESSION_CONFIG.path,
    maxAge: SESSION_CONFIG.maxAge,
  });
}

/**
 * Destroys the admin session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_CONFIG.cookieName);
}

/**
 * Validates if the current session is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_CONFIG.cookieName);
  return sessionCookie?.value === 'true';
}

/**
 * Validates session from a NextRequest (for middleware)
 */
export function isAuthenticatedFromRequest(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get(SESSION_CONFIG.cookieName);
  return sessionCookie?.value === 'true';
}

/**
 * Gets the admin password from environment variables
 * Falls back to a default for development (should be changed in production)
 */
export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || '9562';
}

/**
 * Validates admin credentials
 */
export function validateCredentials(password: string): boolean {
  return password === getAdminPassword();
}

/**
 * Middleware helper to require authentication
 * Returns null if authenticated, or a redirect response if not
 */
export function requireAuth(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) {
    const loginUrl = new URL('/admin', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }
  return null;
}