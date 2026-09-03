import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().min(1, 'Admin ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const ProjectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  category: z.string().min(2, 'Category is required'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  description: z.string().min(20, 'Full description must be at least 20 characters'),
  thumbnail: z.string().url('Thumbnail must be a valid URL'),
  images: z.array(z.string().url('Image must be a valid URL')).default([]),
  liveUrl: z.string().url('Invalid Live URL').or(z.literal('')).optional().nullable(),
  githubUrl: z.string().url('Invalid GitHub URL').or(z.literal('')).optional().nullable(),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  clientName: z.string().optional().nullable(),
  year: z.string().min(4, 'Year is required'),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  displayOrder: z.number().int().default(0),
  isConcept: z.boolean().default(false),
});

export const ProjectUpdateSchema = ProjectSchema.partial();

export const EnquirySchema = z.object({
  name: z
    .string()
    .min(2, 'Name is required')
    .regex(/^[a-zA-Z\s\.]+$/, 'Name can only contain letters, spaces, and dots (.)'),
  businessName: z.string().optional().nullable(),
  email: z.string().email('Valid email address is required'),
  phone: z
    .string()
    .min(10, 'Valid phone number is required')
    .regex(/^[0-9\+\s\-]{10,25}$/, 'Phone number must contain a valid 10-digit mobile number'),
  serviceRequired: z.string().min(2, 'Service choice is required'),
  budget: z.string().optional().nullable(),
  message: z.string().optional().nullable().default(''),
  website_url: z.string().optional(), // Honeypot anti-spam field
});

export const EnquiryStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']),
});
