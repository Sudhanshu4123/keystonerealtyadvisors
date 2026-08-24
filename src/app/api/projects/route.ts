import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const location = searchParams.get('location')?.trim();
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const publishedOnly = searchParams.get('includeUnpublished') === 'true' ? false : true;
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (publishedOnly) {
      where.published = true;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (type && type !== 'ALL') {
      where.type = type;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (location && location !== '') {
      where.OR = [
        { area: { contains: location } },
        { city: { contains: location } },
        { address: { contains: location } },
      ];
    }

    if (search && search !== '') {
      where.OR = [
        { name: { contains: search } },
        { shortDescription: { contains: search } },
        { description: { contains: search } },
        { area: { contains: search } },
        { city: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'name-asc') orderBy = { name: 'asc' };

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        include: {
          images: true,
          amenities: true,
          floorPlans: true,
          brochures: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      type,
      status,
      shortDescription,
      description,
      developer,
      address,
      area,
      city,
      state,
      pincode,
      totalArea,
      buildings,
      floors,
      units,
      completionDate,
      featured,
      published,
      images,
      amenities,
      floorPlans,
      brochures,
      seoTitle,
      metaDescription,
    } = body;

    if (!name || !type || !status || !area || !city) {
      return NextResponse.json({ error: 'Missing required project fields' }, { status: 400 });
    }

    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    let slug = `${baseSlug}-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        type,
        status,
        shortDescription: shortDescription || '',
        description: description || '',
        developer: developer || 'Keystone Developments',
        address: address || area,
        area,
        city,
        state: state || '',
        pincode: pincode || '',
        totalArea: totalArea || '',
        buildings: buildings ? parseInt(buildings) : null,
        floors: floors ? parseInt(floors) : null,
        units: units ? parseInt(units) : null,
        completionDate: completionDate || '',
        featured: Boolean(featured),
        published: published !== undefined ? Boolean(published) : true,
        seoTitle: seoTitle || name,
        metaDescription: metaDescription || shortDescription,
        images: {
          create: Array.isArray(images)
            ? images.map((img: any, index: number) => ({
                imageUrl: typeof img === 'string' ? img : img.imageUrl,
                isPrimary: index === 0 || img.isPrimary === true,
              }))
            : [],
        },
        amenities: {
          create: Array.isArray(amenities)
            ? amenities.map((a: any) => ({
                name: typeof a === 'string' ? a : a.name,
              }))
            : [],
        },
        floorPlans: {
          create: Array.isArray(floorPlans)
            ? floorPlans.map((fp: any) => ({
                title: fp.title || 'Floor Plan',
                description: fp.description || '',
                fileUrl: fp.fileUrl,
              }))
            : [],
        },
        brochures: {
          create: Array.isArray(brochures)
            ? brochures.map((b: any) => ({
                fileUrl: b.fileUrl,
                fileName: b.fileName || 'Project_Brochure.pdf',
              }))
            : [],
        },
      },
      include: {
        images: true,
        amenities: true,
        floorPlans: true,
        brochures: true,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
