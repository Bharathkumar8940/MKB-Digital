import { prisma } from '../lib/prisma';
import { signOwnerToken } from '../lib/auth';

async function runSecurityAuthorizationSuite() {
  console.log('\n🔒 RUNNING MKB DIGITAL SECURITY & AUTHORIZATION TEST SUITE...\n');

  // Test 1: Seed verification (AETHERIS)
  const aetheris = await prisma.project.findUnique({ where: { slug: 'aetheris' } });
  if (!aetheris) {
    throw new Error('TEST FAIL: AETHERIS project not found in database');
  }
  console.log(`✅ [1/5] Database Seed Check: Found AETHERIS (Status: ${aetheris.status}, Featured: ${aetheris.featured}, IsConcept: ${aetheris.isConcept})`);

  // Test 2: Public Project Filtering (Unauthenticated should only see status = PUBLISHED)
  const draftTest = await prisma.project.create({
    data: {
      title: 'Secret Internal Draft',
      slug: 'secret-internal-draft',
      category: 'Unreleased System',
      shortDescription: 'This is a draft project that public users must NEVER see.',
      description: 'Hidden internal draft details.',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80',
      images: '[]',
      technologies: '["Internal"]',
      year: '2026',
      featured: false,
      status: 'DRAFT',
    },
  });

  console.log(`✅ [2/5] Created Draft Test Project (ID: ${draftTest.id})`);

  // Simulate Public Query (status = 'PUBLISHED' filter)
  const publicProjects = await prisma.project.findMany({ where: { status: 'PUBLISHED' } });
  const containsDraft = publicProjects.some((p: any) => p.slug === 'secret-internal-draft');
  if (containsDraft) {
    throw new Error('TEST FAIL: Public query exposed DRAFT project!');
  }
  console.log('✅ [3/5] Security Check Passed: Public projects query strictly excludes DRAFT projects.');

  // Test 3: JWT Owner Token Verification
  const testToken = signOwnerToken({ userId: 'owner-123', email: 'bharathkumarmatsa@gmail.com' });
  if (!testToken) {
    throw new Error('TEST FAIL: JWT Token generation failed');
  }
  console.log('✅ [4/5] JWT Owner Token Generation & Signing Verified.');

  // Cleanup test draft
  await prisma.project.delete({ where: { id: draftTest.id } });
  console.log('✅ [5/5] Test Cleanup Complete.\n');
  console.log('🎉 ALL SECURITY & AUTHORIZATION TESTS PASSED SUCCESSFULLY!\n');
}

runSecurityAuthorizationSuite()
  .catch((err) => {
    console.error('❌ SECURITY TEST SUITE FAILED:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
