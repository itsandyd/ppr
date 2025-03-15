import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { writeFile, mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // In a production environment, you would likely use a cloud storage service
    // like AWS S3, Cloudinary, or similar. This is a simplified example.
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return new NextResponse("Invalid file type. Only JPEG, PNG, and WebP formats are allowed.", { status: 400 });
    }
    
    // Generate a unique file name
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Create the directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(publicDir, 'uploads');
    
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    
    // Save the file
    const filePath = path.join(uploadsDir, fileName);
    const publicPath = `/uploads/${fileName}`;
    
    await writeFile(filePath, buffer);
    
    // Return the public URL for the file
    return NextResponse.json({ url: publicPath });
  } catch (error) {
    console.error('[UPLOAD_IMAGE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 