import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        images: true,
        amenities: true,
        floorPlans: true,
        brochures: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Fetch single project error:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

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

    // Delete existing relations if new arrays provided
    if (Array.isArray(images)) {
      await prisma.projectImage.deleteMany({ where: { projectId: id } });
    }
    if (Array.isArray(amenities)) {
      await prisma.projectAmenity.deleteMany({ where: { projectId: id } });
    }
    if (Array.isArray(floorPlans)) {
      await prisma.floorPlan.deleteMany({ where: { projectId: id } });
    }
    if (Array.isArray(brochures)) {
      await prisma.brochure.deleteMany({ where: { projectId: id } });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        type: type !== undefined ? type : existing.type,
        status: status !== undefined ? status : existing.status,
        shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
        description: description !== undefined ? description : existing.description,
        developer: developer !== undefined ? developer : existing.developer,
        address: address !== undefined ? address : existing.address,
        area: area !== undefined ? area : existing.area,
        city: city !== undefined ? city : existing.city,
        state: state !== undefined ? state : existing.state,
        pincode: pincode !== undefined ? pincode : existing.pincode,
        totalArea: totalArea !== undefined ? totalArea : existing.totalArea,
        buildings: buildings !== undefined ? (buildings ? parseInt(buildings) : null) : existing.buildings,
        floors: floors !== undefined ? (floors ? parseInt(floors) : null) : existing.floors,
        units: units !== undefined ? (units ? parseInt(units) : null) : existing.units,
        completionDate: completionDate !== undefined ? completionDate : existing.completionDate,
        featured: featured !== undefined ? Boolean(featured) : existing.featured,
        published: published !== undefined ? Boolean(published) : existing.published,
        seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : existing.metaDescription,
        images: Array.isArray(images)
          ? {
              create: images.map((img: any, index: number) => ({
                imageUrl: typeof img === 'string' ? img : img.imageUrl,
                isPrimary: index === 0 || img.isPrimary === true,
              })),
            }
          : undefined,
        amenities: Array.isArray(amenities)
          ? {
              create: amenities.map((a: any) => ({
                name: typeof a === 'string' ? a : a.name,
              })),
            }
          : undefined,
        floorPlans: Array.isArray(floorPlans)
          ? {
              create: floorPlans.map((fp: any) => ({
                title: fp.title || 'Floor Plan',
                description: fp.description || '',
                fileUrl: fp.fileUrl,
              })),
            }
          : undefined,
        brochures: Array.isArray(brochures)
          ? {
              create: brochures.map((b: any) => ({
                fileUrl: b.fileUrl,
                fileName: b.fileName || 'Project_Brochure.pdf',
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        amenities: true,
        floorPlans: true,
        brochures: true,
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projectId = existing.id;

    // Detach inquiries first so foreign keys never fail
    await prisma.inquiry.updateMany({
      where: { projectId },
      data: { projectId: null },
    });

    // Delete related child records
    await Promise.all([
      prisma.projectImage.deleteMany({ where: { projectId } }),
      prisma.projectAmenity.deleteMany({ where: { projectId } }),
      prisma.floorPlan.deleteMany({ where: { projectId } }),
      prisma.brochure.deleteMany({ where: { projectId } }),
    ]);

    // Delete target project
    await prisma.project.delete({ where: { id: projectId } });

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project: ' + String(error) }, { status: 500 });
  }
}
