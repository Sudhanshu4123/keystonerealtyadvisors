import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromSession } from '@/lib/auth';

const inquiryLimits = new Map<string, { count: number; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();

    const current = inquiryLimits.get(ip);
    if (current && current.expiresAt > now) {
      if (current.count >= 3) {
        return NextResponse.json(
          { error: 'You have submitted multiple inquiries recently. Please wait a few minutes before trying again.' },
          { status: 429 }
        );
      }
    } else {
      inquiryLimits.set(ip, { count: 0, expiresAt: now + 5 * 60 * 1000 });
    }

    const body = await req.json();
    const {
      name,
      phone,
      email,
      projectId,
      message,
      preferredContact,
      visitDate,
      website_url_honeypot,
    } = body;

    // Honeypot anti-spam
    if (website_url_honeypot && website_url_honeypot.trim() !== '') {
      return NextResponse.json({
        success: true,
        message: 'Thank you for your inquiry. Our team will contact you shortly.',
      });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Full Name is required' }, { status: 400 });
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: 'Phone Number is required' }, { status: 400 });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid Email Address is required' }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const limitRecord = inquiryLimits.get(ip) || { count: 0, expiresAt: now + 5 * 60 * 1000 };
    inquiryLimits.set(ip, { ...limitRecord, count: limitRecord.count + 1 });

    const inquiry = await prisma.inquiry.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        projectId: projectId || null,
        message: message.trim(),
        preferredContact: preferredContact || 'PHONE',
        visitDate: visitDate || null,
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry. Our team will contact you shortly.',
      inquiryId: inquiry.id,
    });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim();

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search && search !== '') {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { message: { contains: search } },
      ];
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            city: true,
            area: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}
