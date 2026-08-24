import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, message, website_url_honeypot } = body;

    // Honeypot check
    if (website_url_honeypot && website_url_honeypot.trim() !== '') {
      return NextResponse.json({
        success: true,
        message: 'Thank you for reaching out! We will be in touch shortly.',
      });
    }

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const contactMsg = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      id: contactMsg.id,
    });
  } catch (error) {
    console.error('Contact message error:', error);
    return NextResponse.json({ error: 'Failed to send contact message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Fetch contact messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch contact messages' }, { status: 500 });
  }
}
