import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOwnerSession } from '@/lib/auth';
import { ProjectUpdateSchema } from '@/lib/validations';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const session = await getOwnerSession();
    const isOwner = !!session;

    // Search by ID or Slug
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // REQUIREMENT #20 & SECURITY RULE: Public users cannot view draft projects
    if (!isOwner && project.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...project,
      images: JSON.parse(project.images || '[]'),
      technologies: JSON.parse(project.technologies || '[]'),
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Independent Server Authorization
    const session = await getOwnerSession();
    if (!session || session.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized: Only the owner can modify projects' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await req.json();

    // 2. Validate Payload
    const validation = ProjectUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;
    const existing = await prisma.project.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 3. Perform Database Update
    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.category && { category: data.category }),
        ...(data.shortDescription && { shortDescription: data.shortDescription }),
        ...(data.description && { description: data.description }),
        ...(data.thumbnail && { thumbnail: data.thumbnail }),
        ...(data.images !== undefined && { images: JSON.stringify(data.images) }),
        ...(data.liveUrl !== undefined && { liveUrl: data.liveUrl || null }),
        ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl || null }),
        ...(data.technologies !== undefined && { technologies: JSON.stringify(data.technologies) }),
        ...(data.clientName !== undefined && { clientName: data.clientName || null }),
        ...(data.year && { year: data.year }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.status && { status: data.status }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.isConcept !== undefined && { isConcept: data.isConcept }),
      },
    });

    return NextResponse.json({
      ...updated,
      images: JSON.parse(updated.images),
      technologies: JSON.parse(updated.technologies),
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Server error updating project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Independent Server Authorization
    const session = await getOwnerSession();
    if (!session || session.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized: Only the owner can delete projects' },
        { status: 401 }
      );
    }

    const { id } = params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Project permanently deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Server error deleting project' }, { status: 500 });
  }
}
