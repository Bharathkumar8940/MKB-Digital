import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('your-project')) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Upload image buffer to Supabase Storage or Local public folder fallback
 * Returns public access URL of the uploaded image
 */
export async function uploadProjectImage(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // 1. Production / Cloud: Upload to Supabase Storage Bucket 'portfolio-images'
  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('portfolio-images')
        .upload(cleanFileName, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        console.warn('Supabase storage upload failed:', error.message);
      } else if (data) {
        const { data: publicUrlData } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(cleanFileName);
        return publicUrlData.publicUrl;
      }
    } catch (err) {
      console.warn('Supabase storage error, using local public fallback:', err);
    }
  }

  // 2. Local Fallback: Try saving to /public/uploads/ or return Base64 Data URI for serverless
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, cleanFileName);
    fs.writeFileSync(filePath, fileBuffer);
    return `/uploads/${cleanFileName}`;
  } catch (fsErr) {
    console.warn('Serverless read-only filesystem detected, converting image to Data URI fallback:', fsErr);
    // Base64 Data URI Fallback for Serverless / Read-Only environments
    const base64Image = fileBuffer.toString('base64');
    return `data:${mimeType || 'image/png'};base64,${base64Image}`;
  }
}
