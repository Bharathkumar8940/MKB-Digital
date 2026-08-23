import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import { ArrowLeft, ExternalLink, Eye, Sparkles, FolderKanban } from 'lucide-react';

export const revalidate = 0; // Always fetch latest published projects

export const metadata = {
  title: 'Portfolio & Client Projects | MKB DIGITAL',
  description: 'Explore live production websites, custom web applications, and digital experiences created by MKB DIGITAL.',
};

export default async function PublicWorkPage() {
  let rawProjects: any[] = [];
  try {
    rawProjects = await prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch (err) {
    console.warn('Public Work page DB query fallback:', err);
  }

  const projects = rawProjects.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    technologies: JSON.parse(p.technologies || '[]'),
  }));

  return (
    <div className="min-h-screen bg-[#060b08] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#00ff88]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-emerald-950 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#00ff88] transition-colors bg-emerald-950/40 px-4 py-2 rounded-xl border border-emerald-900/40"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <Link
            href="/#contact"
            className="btn-emerald px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Start Your Project
          </Link>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <FolderKanban className="w-4 h-4 text-[#00ff88]" />
            Live Client Work & Portfolio
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Websites & Applications <span className="emerald-text-gradient">Added by Admin</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore live production websites, e-commerce platforms, and custom digital systems architected by MKB DIGITAL.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-3xl space-y-4 max-w-xl mx-auto">
            <FolderKanban className="w-12 h-12 text-emerald-400 mx-auto opacity-50" />
            <h3 className="text-xl font-bold text-white">No Published Projects Yet</h3>
            <p className="text-xs text-slate-400">
              New client projects will appear here as soon as they are published from the Admin Console.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass-panel rounded-3xl overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 border-slate-800 hover:border-emerald-500/30"
              >
                {/* Thumbnail & Tags */}
                <div className="relative h-72 overflow-hidden bg-slate-900">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060b08] via-transparent to-transparent opacity-90" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                      {project.category}
                    </span>
                    {project.isConcept && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-black shadow-[0_0_10px_rgba(0,255,136,0.6)]">
                        CONCEPT PROJECT
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#00ff88] transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-xs text-slate-500 font-mono">{project.year}</span>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                      {project.shortDescription}
                    </p>

                    {/* Tech Badges */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.technologies.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-emerald-950">
                    <Link
                      href={`/work/${project.slug}`}
                      className="btn-outline-emerald py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-center"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </Link>

                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-emerald py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-center"
                      >
                        Live Website <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <div className="py-3 rounded-xl text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 text-center flex items-center justify-center">
                        Internal Project
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
