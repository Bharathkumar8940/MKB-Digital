import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MKB DIGITAL Database...');

  // 1. Seed Owner Admin User from Environment Variables
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'bharathkumarmatsa@gmail.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (!adminPassword) {
    throw new Error('FATAL: ADMIN_INITIAL_PASSWORD environment variable is not defined!');
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
    },
  });

  console.log(`✅ Owner Admin account configured: ${admin.email}`);

  // 2. Seed AETHERIS Project (Featured Concept Project)
  const aetherisProject = await prisma.project.upsert({
    where: { slug: 'aetheris' },
    update: {
      title: 'AETHERIS',
      category: 'Luxury Watch E-Commerce / Concept',
      shortDescription: 'A premium luxury watch experience created to demonstrate advanced UI, product presentation and interactive web development.',
      description: 'AETHERIS is an immersive luxury watch visual e-commerce showcase built with cutting-edge 3D interactive product rendering, fluid animations, custom typography, and high-performance WebGL aesthetics. Designed to illustrate agency capabilities in delivering ultra-high-end digital commerce experiences.',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1547996160-01c1782698e9?q=80&w=1000&auto=format&fit=crop'
      ]),
      liveUrl: 'https://solitary-limit-8847.sriramnaidu9441.workers.dev/',
      githubUrl: null,
      technologies: JSON.stringify(['Three.js', 'WebGL', 'JavaScript', 'HTML5/CSS3', 'Tailwind CSS']),
      clientName: 'Internal Concept',
      year: '2026',
      featured: true,
      status: 'PUBLISHED',
      displayOrder: 1,
      isConcept: true,
    },
    create: {
      title: 'AETHERIS',
      slug: 'aetheris',
      category: 'Luxury Watch E-Commerce / Concept',
      shortDescription: 'A premium luxury watch experience created to demonstrate advanced UI, product presentation and interactive web development.',
      description: 'AETHERIS is an immersive luxury watch visual e-commerce showcase built with cutting-edge 3D interactive product rendering, fluid animations, custom typography, and high-performance WebGL aesthetics. Designed to illustrate agency capabilities in delivering ultra-high-end digital commerce experiences.',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1547996160-01c1782698e9?q=80&w=1000&auto=format&fit=crop'
      ]),
      liveUrl: 'https://solitary-limit-8847.sriramnaidu9441.workers.dev/',
      githubUrl: null,
      technologies: JSON.stringify(['Three.js', 'WebGL', 'JavaScript', 'HTML5/CSS3', 'Tailwind CSS']),
      clientName: 'Internal Concept',
      year: '2026',
      featured: true,
      status: 'PUBLISHED',
      displayOrder: 1,
      isConcept: true,
    },
  });

  console.log(`✅ AETHERIS Concept project seeded successfully (ID: ${aetherisProject.id})`);
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
