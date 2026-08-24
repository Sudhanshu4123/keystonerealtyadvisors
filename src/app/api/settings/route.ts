import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromSession } from '@/lib/auth';

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'site_settings' },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 'site_settings',
          companyName: 'Keystone Real Estate Developments',
          phone: '+1 (800) 555-7325',
          whatsapp: '+1 (800) 555-7325',
          email: 'contact@keystonedev.com',
          address: '555 Fifth Avenue, 18th Floor, New York, NY 10017',
          workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM EST',
          siteTitle: 'Keystone | Premium Real Estate Projects Showcase',
          siteDescription: 'Explore luxury residential and commercial developments built for modern living and lasting value.',
          projectsDelivered: '48+',
          yearsExperience: '15+',
          happyCustomers: '12,500+',
          ongoingProjects: '12',
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      companyName,
      phone,
      whatsapp,
      email,
      address,
      workingHours,
      siteTitle,
      siteDescription,
      projectsDelivered,
      yearsExperience,
      happyCustomers,
      ongoingProjects,
    } = body;

    const settings = await prisma.settings.upsert({
      where: { id: 'site_settings' },
      update: {
        companyName,
        phone,
        whatsapp,
        email,
        address,
        workingHours,
        siteTitle,
        siteDescription,
        projectsDelivered,
        yearsExperience,
        happyCustomers,
        ongoingProjects,
      },
      create: {
        id: 'site_settings',
        companyName: companyName || 'Keystone Real Estate Developments',
        phone: phone || '+1 (800) 555-7325',
        whatsapp: whatsapp || '+1 (800) 555-7325',
        email: email || 'contact@keystonedev.com',
        address: address || '555 Fifth Avenue, 18th Floor, New York, NY 10017',
        workingHours: workingHours || 'Mon - Sat: 9:00 AM - 7:00 PM EST',
        siteTitle: siteTitle || 'Keystone | Premium Real Estate Projects Showcase',
        siteDescription: siteDescription || 'Explore luxury residential and commercial developments built for modern living and lasting value.',
        projectsDelivered: projectsDelivered || '48+',
        yearsExperience: yearsExperience || '15+',
        happyCustomers: happyCustomers || '12,500+',
        ongoingProjects: ongoingProjects || '12',
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
