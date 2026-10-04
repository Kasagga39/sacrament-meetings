import { NextResponse, type NextRequest } from 'next/server';

/**
 * Optimistic check: visitors without an Auth.js session cookie are sent to the
 * login page before the admin routes render. The signed session is verified
 * again in the admin layout and in every server action, because a cookie alone
 * is never proof of identity.
 */
const PROTECTED_PATHS = ['/meetings/new'];
const EDIT_PATH_PATTERN = /^\/meetings\/\d+\/edit\/?$/;

function isProtectedPath(pathname: string): boolean {
  if (EDIT_PATH_PATTERN.test(pathname)) {
    return true;
  }

  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function hasSessionCookie(request: NextRequest): boolean {
  return (
    request.cookies.has('authjs.session-token') ||
    request.cookies.has('__Secure-authjs.session-token')
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtectedPath(pathname) && !hasSessionCookie(request)) {
    const loginUrl = new URL('/login', request.nextUrl);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/meetings/new', '/meetings/:id/edit'],
};
