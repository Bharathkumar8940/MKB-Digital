import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyPassword, signOwnerToken, setOwnerSessionCookie } from '../../../../lib/auth';
import { LoginSchema } from '../../../../lib/validations';
import { rateLimit } from '../../../../lib/ratelimit';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check (5 login attempts per 15 minutes per IP)
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'anonymous_client';
    const rateLimitRes = await rateLimit(`login:${ip}`, 5, 900);

    if (!rateLimitRes.success) {
      return NextResponse.json(
        { error: 'Too many failed login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload with Zod
    const body = await req.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input fields', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const initialAdminEmail = (process.env.ADMIN_INITIAL_EMAIL || 'jsahbfaslkdnalidDKJFDSOGJLBCKSDkjsdnkfjsndfjsn&%*&)(*)*&%$^$&^^(*(*FHLZKCMLlijljnkhgoikljkjLIKNLKn965654684654654132178').trim();
    const initialAdminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'ksjflsdknfskdjffspdlfkmssdf65s4df65s4df7sdf6453dsfsdjfhbdskfjn&%*&#(#*^*#@^(@*&(@Y';

    let isAuthenticated = false;

    // Direct check for Owner Admin Credentials
    if (email.trim() === initialAdminEmail && password === initialAdminPassword) {
      isAuthenticated = true;
    } else {
      try {
        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (admin) {
          isAuthenticated = await verifyPassword(password, admin.passwordHash);
        }
      } catch (dbErr) {
        console.warn('Prisma DB lookup skipped during login:', dbErr);
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 5. Generate Owner JWT Session & Set HttpOnly Secure Cookie
    const token = await signOwnerToken({ userId: 'owner_admin_primary', email: email.trim() });
    await setOwnerSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: { email: email.trim(), role: 'OWNER' },
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'Internal server authentication error' },
      { status: 500 }
    );
  }
}
