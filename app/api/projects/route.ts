import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getOwnerSession } from '../../../lib/auth';
import { ProjectSchema } from '../../../lib/validations';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: NextRequest) {
  try {
    const session = await getOwnerSession();
    const isOwner = !!session;

    // Public users see ONLY Published projects. Owner sees all (Drafts + Published).
    const projects = await prisma.project.findMany({
      where: isOwner ? {} : { status: 'PUBLISHED' },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    // Format JSON fields (images, technologies)
    const formatted = projects.map((p: any) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      technologies: JSON.parse(p.technologies || '[]'),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to retrieve projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Strict Server-Side Owner Authorization Check
    const session = await getOwnerSession();
    if (!session || session.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized: Only the website owner can create projects' },
        { status: 401 }
      );
    }

    // 2. Validate Payload with Zod
    const body = await req.json();
    const validation = ProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;
    let baseSlug = slugify(data.title);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 3. Create Project in Database
    const newProject = await prisma.project.create({
      data: {
        title: data.title,
        slug: uniqueSlug,
        category: data.category,
        shortDescription: data.shortDescription,
        description: data.description,
        thumbnail: data.thumbnail,
        images: JSON.stringify(data.images),
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        technologies: JSON.stringify(data.technologies),
        clientName: data.clientName || null,
        year: data.year,
        featured: data.featured,
        status: data.status,
        displayOrder: data.displayOrder,
        isConcept: data.isConcept,
      },
    });

    return NextResponse.json(
      {
        ...newProject,
        images: JSON.parse(newProject.images),
        technologies: JSON.parse(newProject.technologies),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Server error creating project' }, { status: 500 });
  }
}
