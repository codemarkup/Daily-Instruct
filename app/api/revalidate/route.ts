import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { secret, paths } = await request.json();

    // Verify secret
    if (secret !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ message: 'Paths array is required' }, { status: 400 });
    }

    // Revalidate each path
    for (const p of paths) {
      revalidatePath(p);
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
