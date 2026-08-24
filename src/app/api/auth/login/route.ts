import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signAdminToken, setAdminSessionCookie } from '@/lib/auth';

// Simple in-memory brute-force protection tracking
const loginAttempts = new Map<string, { count: number; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();

    // Check rate limit: 5 attempts per 15 minutes
    const attempt = loginAttempts.get(ip);
    if (attempt && attempt.expiresAt > now) {
      if (attempt.count >= 5) {
        return NextResponse.json(
          { error: 'Too many failed login attempts. Please try again after 15 minutes.' },
          { status: 429 }
        );
      }
    } else {
      loginAttempts.set(ip, { count: 0, expiresAt: now + 15 * 60 * 1000 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!admin) {
      // Increment attempt counter
      const current = loginAttempts.get(ip) || { count: 0, expiresAt: now + 15 * 60 * 1000 };
      loginAttempts.set(ip, { ...current, count: current.count + 1 });
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const isValid = await comparePassword(password, admin.passwordHash);
    if (!isValid) {
      const current = loginAttempts.get(ip) || { count: 0, expiresAt: now + 15 * 60 * 1000 };
      loginAttempts.set(ip, { ...current, count: current.count + 1 });
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    // Clear failed attempts on success
    loginAttempts.delete(ip);

    const token = signAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    });

    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
