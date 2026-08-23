import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  let dbStatus = 'Disconnected';
  let storageStatus = 'Local Fallback (Active)';
  let emailStatus = 'Console Fallback (Active)';

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'Connected';
  } catch (e) {
    dbStatus = 'Error connecting to DB';
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
      storageStatus = 'Supabase Storage Connected';
    }
  }

  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.length > 5) {
    emailStatus = 'Resend API Connected';
  }

  return NextResponse.json({
    database: dbStatus,
    storage: storageStatus,
    email: emailStatus,
    rateLimiting: process.env.UPSTASH_REDIS_REST_URL ? 'Upstash Redis Connected' : 'Local In-Memory Limiter Active',
    environment: process.env.NODE_ENV || 'development',
  });
}
