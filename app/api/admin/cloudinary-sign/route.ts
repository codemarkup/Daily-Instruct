import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { folder } = await request.json();
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Any parameter added to the upload request MUST be signed.
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!
    );
    
    return NextResponse.json({ timestamp, signature });
  } catch (error: any) {
    console.error('Error generating signature:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
