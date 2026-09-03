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

// Global in-memory fallback store for serverless instances
const globalProjectsStore: any[] = (global as any).__mkb_projects_store || [];
(global as any).__mkb_projects_store = globalProjectsStore;

export async function GET(req: NextRequest) {
  try {
    const session = await getOwnerSession();
    const isOwner = !!session;

    let dbProjects: any[] = [];
    try {
      dbProjects = await prisma.project.findMany({
        where: isOwner ? {} : { status: 'PUBLISHED' },
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      });
    } catch (dbErr) {
      console.warn('Prisma project fetch fallback:', dbErr);
    }

    const formattedDb = dbProjects.map((p: any) => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []),
      technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies || '[]') : (p.technologies || []),
    }));

    // Merge global store & DB items, deduplicate by ID
    const mergedMap = new Map<string, any>();
    [...globalProjectsStore, ...formattedDb].forEach((item) => {
      if (item && item.id) {
        if (isOwner || item.status === 'PUBLISHED') {
          mergedMap.set(item.id, item);
        }
      }
    });

    const allProjects = Array.from(mergedMap.values());
    return NextResponse.json(allProjects);
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

    try {
      while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    } catch (e) {
      uniqueSlug = `${baseSlug}-${Date.now()}`;
    }

    const newProjectObj = {
      id: `proj_${Date.now()}`,
      title: data.title,
      slug: uniqueSlug,
      category: data.category,
      shortDescription: data.shortDescription,
      description: data.description,
      thumbnail: data.thumbnail,
      images: data.images || [data.thumbnail],
      liveUrl: data.liveUrl || null,
      githubUrl: data.githubUrl || null,
      technologies: data.technologies || [],
      clientName: data.clientName || null,
      year: data.year,
      featured: data.featured,
      status: data.status,
      displayOrder: data.displayOrder,
      isConcept: data.isConcept,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 3. Create Project in Database (with Serverless Fallback)
    try {
      const dbProject = await prisma.project.create({
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
      newProjectObj.id = dbProject.id;
    } catch (dbError) {
      console.warn('Database save fallback (serverless/connection warning):', dbError);
    }

    // Save to global serverless store
    globalProjectsStore.unshift(newProjectObj);

    return NextResponse.json(newProjectObj, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Server error creating project' }, { status: 500 });
  }
}
