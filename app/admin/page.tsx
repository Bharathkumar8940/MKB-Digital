import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import { getOwnerSession } from '../../lib/auth';
import { redirect } from 'next/navigation';
import { FolderKanban, CheckCircle2, FileEdit, Inbox, AlertCircle, Plus, ArrowRight, Eye } from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await getOwnerSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch Dashboard Metrics
  const totalProjects = await prisma.project.count();
  const publishedProjects = await prisma.project.count({ where: { status: 'PUBLISHED' } });
  const draftProjects = await prisma.project.count({ where: { status: 'DRAFT' } });
  const totalEnquiries = await prisma.enquiry.count();
  const newEnquiries = await prisma.enquiry.count({ where: { status: 'NEW' } });

  // Fetch Recent Items
  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
  });

  const recentEnquiries = await prisma.enquiry.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Dashboard <span className="emerald-text-gradient">Overview</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Welcome back, {session.email}. Here is your agency business snapshot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="btn-emerald px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> ADD NEW PROJECT
          </Link>
        </div>
      </div>

      {/* Overview Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Projects */}
        <div className="glass-panel p-5 rounded-2xl space-y-2 border-emerald-950/60">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Projects</span>
            <FolderKanban className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalProjects}</div>
        </div>

        {/* Published Projects */}
        <div className="glass-panel p-5 rounded-2xl space-y-2 border-emerald-950/60">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Published</span>
            <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
          </div>
          <div className="text-3xl font-extrabold text-[#00ff88]">{publishedProjects}</div>
        </div>

        {/* Draft Projects */}
        <div className="glass-panel p-5 rounded-2xl space-y-2 border-emerald-950/60">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Drafts</span>
            <FileEdit className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{draftProjects}</div>
        </div>

        {/* Total Enquiries */}
        <div className="glass-panel p-5 rounded-2xl space-y-2 border-emerald-950/60">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Enquiries</span>
            <Inbox className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalEnquiries}</div>
        </div>

        {/* New Enquiries */}
        <div className="glass-panel p-5 rounded-2xl space-y-2 border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">New Enquiries</span>
            <AlertCircle className="w-4 h-4 text-[#00ff88]" />
          </div>
          <div className="text-3xl font-extrabold text-[#00ff88]">{newEnquiries}</div>
        </div>
      </div>

      {/* Main Grid: Projects & Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projects Preview */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-emerald-400" /> Recent Projects
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-6">No projects created yet.</div>
            ) : (
              recentProjects.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 hover:border-emerald-700/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.thumbnail} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        {p.title}
                        {p.isConcept && (
                          <span className="text-[10px] bg-emerald-500 text-black font-extrabold px-1.5 py-0.5 rounded">
                            CONCEPT
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{p.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.status === 'PUBLISHED'
                          ? 'bg-emerald-500/20 text-[#00ff88] border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {p.status}
                    </span>
                    <Link
                      href={`/admin/projects/edit/${p.id}`}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      <FileEdit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enquiries Preview */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <Inbox className="w-5 h-5 text-sky-400" /> Recent Client Enquiries
            </h2>
            <Link
              href="/admin/enquiries"
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Inbox <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentEnquiries.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-6">No enquiries received yet.</div>
            ) : (
              recentEnquiries.map((e: any) => (
                <div
                  key={e.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-800/40 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-white">{e.name}</div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                      {e.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>{e.serviceRequired}</span>
                    <span>{new Date(e.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
