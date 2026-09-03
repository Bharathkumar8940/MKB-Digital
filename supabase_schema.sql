-- PostgreSQL / Supabase Schema & Row Level Security (RLS) Policies for MKB DIGITAL

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Project" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "category" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "thumbnail" TEXT NOT NULL,
  "images" TEXT NOT NULL, -- JSON array
  "liveUrl" TEXT,
  "githubUrl" TEXT,
  "technologies" TEXT NOT NULL, -- JSON array
  "clientName" TEXT,
  "year" TEXT NOT NULL,
  "featured" BOOLEAN DEFAULT FALSE,
  "status" TEXT DEFAULT 'DRAFT', -- DRAFT | PUBLISHED
  "displayOrder" INT DEFAULT 0,
  "isConcept" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Enquiry" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "businessName" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "serviceRequired" TEXT NOT NULL,
  "budget" TEXT,
  "message" TEXT NOT NULL,
  "status" TEXT DEFAULT 'NEW', -- NEW | CONTACTED | IN_PROGRESS | COMPLETED | ARCHIVED
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Enquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;

-- 3. Project RLS Policies
-- Public (anon) can ONLY SELECT published projects
CREATE POLICY "Public users can view published projects"
  ON "Project" FOR SELECT
  USING ("status" = 'PUBLISHED');

-- Authenticated owner has full access on Project
CREATE POLICY "Owner has full access on Project"
  ON "Project" FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Enquiry RLS Policies
-- Public (anon) can ONLY INSERT enquiries
CREATE POLICY "Public users can submit enquiries"
  ON "Enquiry" FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated owner can SELECT, UPDATE, DELETE enquiries
CREATE POLICY "Owner can manage enquiries"
  ON "Enquiry" FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. AdminUser RLS Policies
-- Restricted exclusively to authenticated service role / owner
CREATE POLICY "Owner access to AdminUser"
  ON "AdminUser" FOR ALL
  TO authenticated
  USING (true);
