import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import { getOwnerSession } from '../../../lib/auth';
import { ArrowLeft, ExternalLink, Code2, Calendar, Layers, ShieldCheck, Sparkles } from 'lucide-react';

export async function generateStaticParams() {
  return [{ slug: 'sample-project' }];
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  let project: any = null;
  try {
    project = await prisma.project.findFirst({
      where: { slug: params.slug },
    });
  } catch (err) {}

  if (!project) return { title: 'Project Not Found | MKB DIGITAL' };
  return {
    title: `${project.title} - ${project.category} | MKB DIGITAL Portfolio`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const session = await getOwnerSession();
  const isOwner = !!session;

  let project: any = null;
  try {
    project = await prisma.project.findFirst({
      where: {
        OR: [{ id: params.slug }, { slug: params.slug }],
      },
    });
  } catch (err) {
    console.warn('Project detail page DB query fallback:', err);
  }

  // REQUIREMENT #20 & SECURITY RULE: 404 if project is missing or draft when accessed publicly
  if (!project) {
    notFound();
  }

  if (!isOwner && project.status !== 'PUBLISHED') {
    notFound();
  }

  const images: string[] = JSON.parse(project.images || '[]');
  const technologies: string[] = JSON.parse(project.technologies || '[]');

  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 btn-outline-emerald px-4 py-2 rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO WORK
        </Link>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            {project.category}
          </span>
          {/* CRITICAL REQUIREMENT #22: CONCEPT PROJECT LABEL */}
          {project.isConcept && (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.6)]">
              CONCEPT PROJECT
            </span>
          )}
        </div>
      </div>

      {/* Project Title & Short Description */}
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          {project.title}
        </h1>
        <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-emerald px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              Live Project Demo <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-emerald px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              Source Code <Code2 className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Main Feature Image / Gallery */}
      <div className="space-y-6">
        <div className="glass-panel rounded-3xl overflow-hidden border-[#00ff88]/30 shadow-2xl">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full max-h-[500px] object-cover"
          />
        </div>

        {/* Multi-Image Gallery */}
        {images.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((imgUrl, idx) => (
              <div key={idx} className="glass-panel rounded-2xl overflow-hidden h-36">
                <img
                  src={imgUrl}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        {/* Left Column: Full Description */}
        <div className="md:col-span-2 glass-panel p-8 rounded-3xl space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00ff88]" /> Project Overview
          </h2>
          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-4">
            {project.description}
          </div>
        </div>

        {/* Right Column: Metadata Sidebar */}
        <div className="glass-panel p-6 rounded-3xl space-y-6 h-fit">
          <div className="space-y-4">
            <h3 className="font-bold text-white text-base border-b border-emerald-900/60 pb-2">
              Project Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Year
                </span>
                <span className="text-white font-mono">{project.year}</span>
              </div>

              {project.clientName && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" /> Client
                  </span>
                  <span className="text-white">{project.clientName}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Status
                </span>
                <span className="text-[#00ff88] font-bold uppercase">{project.status}</span>
              </div>
            </div>
          </div>

          {/* Technologies Used */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
