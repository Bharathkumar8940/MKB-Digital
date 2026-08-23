import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET_STRING = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || 'fallback_secret_key_mkb_digital_2026';
const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = 'mkb_owner_session';

export interface SessionPayload {
  userId: string;
  email: string;
  role: 'OWNER';
  iat?: number;
  exp?: number;
}

/**
 * Hash password securely using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify password against bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign JWT session token for Owner using jose (Edge & Node compatible)
 */
export async function signOwnerToken(payload: { userId: string; email: string }): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: 'OWNER',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET_KEY);
}

/**
 * Verify JWT session token using jose
 */
export async function verifyOwnerToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    if (payload && payload.role === 'OWNER') {
      return payload as unknown as SessionPayload;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Set secure HttpOnly session cookie
 */
export async function setOwnerSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

/**
 * Clear session cookie (Logout)
 */
export async function clearOwnerSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Helper to get current authenticated session from server component or API route
 */
export async function getOwnerSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyOwnerToken(token);
}
