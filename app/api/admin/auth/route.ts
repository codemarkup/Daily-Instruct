import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      // FIXED COOKIE SETTINGS
      response.cookies.set({
        name: 'admin-auth',
        value: 'true',
        httpOnly: false, // Changed to false so client can read it
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Changed to lax
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/', // Changed to root so all pages can access
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin-auth');
  return response;
}