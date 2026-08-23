import { NextRequest, NextResponse } from 'next/server';
import { getOwnerSession } from '../../lib/auth';
import { uploadProjectImage } from '../../lib/storage';

export async function POST(req: NextRequest) {
  try {
    // 1. Owner Authorization Check
    const session = await getOwnerSession();
    if (!session || session.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized: Only the owner can upload images' },
        { status: 401 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in request' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image file size exceeds 10MB limit' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Upload to Storage Solution
    const publicUrl = await uploadProjectImage(buffer, file.name, file.type);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Failed to process image upload' }, { status: 500 });
  }
}
