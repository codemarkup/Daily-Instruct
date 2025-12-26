import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  console.log('Middleware running for path:', path); // Debug log
  
  // Check if accessing admin routes
  if (path.startsWith('/admin')) {
    const isAuthenticated = request.cookies.get('admin-auth')?.value === 'true';
    
    console.log('Admin route detected. Authenticated:', isAuthenticated); // Debug
    
    // If NOT authenticated, redirect to login
    if (!isAuthenticated) {
      console.log('Redirecting to login...'); // Debug
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', path);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // If accessing login page but already authenticated, redirect to admin
  if (path === '/login') {
    const isAuthenticated = request.cookies.get('admin-auth')?.value === 'true';
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

// CRITICAL: Make sure middleware runs on ALL admin and login routes
export const config = {
  matcher: [
    '/admin/:path*',  // All admin routes
    '/login',         // Login page
  ],
};