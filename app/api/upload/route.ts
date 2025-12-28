// app/api/upload/route.ts - PERFECTLY MATCHES YOUR SETUP
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, GIF, and AVIF are allowed.' },
        { status: 400 }
      );
    }

    // Check size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Check if we're in production (Vercel)
    const isProduction = process.env.NODE_ENV === 'production';
    const hasGitHubToken = !!process.env.GITHUB_TOKEN;

    if (isProduction && hasGitHubToken) {
      // PRODUCTION: Upload to GitHub using your existing token
      return await uploadToGitHub(file, category);
    } else {
      // DEVELOPMENT: Save locally
      return await saveLocally(file, category);
    }

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error.message },
      { status: 500 }
    );
  }
}

// GitHub upload function - MATCHES YOUR JSON STRUCTURE
async function uploadToGitHub(file: File, category: string) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
  const GITHUB_OWNER = process.env.GITHUB_OWNER || 'codemarkup';
  const GITHUB_REPO = process.env.GITHUB_REPO || 'Daily-Instruct';
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  // Convert file to base64
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64Content = buffer.toString('base64');

  // Create unique filename (matches your pattern: timestamp-random-filename)
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const sanitizedName = file.name.toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/--+/g, '-');
  const filename = `${timestamp}-${randomString}-${sanitizedName}`;
  
  // GitHub path - MATCHES YOUR EXACT STRUCTURE
  // Your images go to: public/images/{category}/filename.ext
  const githubPath = `public/images/${category}/${filename}`;

  console.log(`Uploading to GitHub: ${githubPath}`);

  try {
    // Upload to GitHub
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${githubPath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Upload: ${filename} to ${category} folder`,
          content: base64Content,
          branch: GITHUB_BRANCH
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('GitHub API error:', error);
      
      // Special handling for folder creation
      if (error.message?.includes('This repository is empty')) {
        throw new Error('Repository appears to be empty or path invalid');
      }
      
      throw new Error(`GitHub API error: ${error.message}`);
    }

    const data = await response.json();

    // Generate the URL - MATCHES YOUR JSON STRUCTURE
    // Your JSON uses: "/images/{category}/{filename}"
    const imageUrl = `/images/${category}/${filename}`;

    console.log(`Upload successful! URL: ${imageUrl}`);

    return NextResponse.json({
      success: true,
      url: imageUrl, // This will save in your JSON exactly as you need
      githubUrl: data.content.html_url,
      filename: filename,
      category: category
    });

  } catch (error: any) {
    console.error('GitHub upload error:', error);
    throw new Error(`Failed to upload to GitHub: ${error.message}`);
  }
}

// Local development function - MATCHES YOUR STRUCTURE
async function saveLocally(file: File, category: string) {
  const { writeFile, mkdir } = await import('fs/promises');
  const { join } = await import('path');
  const { existsSync } = await import('fs');

  // Create directory path - matches your structure
  const publicDir = join(process.cwd(), 'public');
  const uploadDir = join(publicDir, 'images', category);
  
  // Create directory if it doesn't exist
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
    console.log(`Created directory: ${uploadDir}`);
  }

  // Generate unique filename (same pattern as GitHub)
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const sanitizedName = file.name.toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/--+/g, '-');
  const filename = `${timestamp}-${randomString}-${sanitizedName}`;
  const filepath = join(uploadDir, filename);

  // Save file locally
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filepath, buffer);

  // Return the public URL path - MATCHES YOUR JSON STRUCTURE
  const publicUrl = `/images/${category}/${filename}`;

  console.log(`Saved locally: ${publicUrl}`);

  return NextResponse.json({
    success: true,
    url: publicUrl, // This matches your JSON structure
    filename: filename,
    category: category,
    note: 'Saved locally (development mode)'
  });
}