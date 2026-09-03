'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Plus,
  Search,
  FileEdit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Star,
  AlertTriangle,
  X,
  ArrowUpDown,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  thumbnail: string;
  liveUrl?: string | null;
  featured: boolean;
  status: string;
  displayOrder: number;
  isConcept: boolean;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.error('Error loading projects:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (project: Project) => {
    const newStatus = project.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (e) {
      console.error('Toggle error:', e);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !project.featured }),
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (e) {
      console.error('Toggle error:', e);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteModalId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${deleteModalId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteModalId(null);
        fetchProjects();
      }
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Project <span className="emerald-text-gradient">Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, publish, or delete agency portfolio projects.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="btn-emerald px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> ADD PROJECT
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
        />
      </div>

      {/* Projects Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border-emerald-950/60">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading projects...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No projects found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-950/40 text-slate-400 uppercase tracking-wider font-semibold border-b border-emerald-900/40">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/40 text-slate-300">
                {filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-emerald-950/20 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-900"
                        />
                        <div>
                          <div className="font-bold flex items-center gap-2">
                            {project.title}
                            {project.isConcept && (
                              <span className="text-[9px] bg-emerald-500 text-black font-extrabold px-1.5 py-0.5 rounded">
                                CONCEPT
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">/{project.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-400">{project.category}</td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(project)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                          project.status === 'PUBLISHED'
                            ? 'bg-emerald-500/20 text-[#00ff88] border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        }`}
                      >
                        {project.status}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          project.featured
                            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-400">{project.displayOrder}</td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/work/${project.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400"
                          title="View Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/edit/${project.id}`}
                          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                          title="Edit Project"
                        >
                          <FileEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModalId(project.id)}
                          className="p-1.5 rounded-lg hover:bg-red-950/60 text-red-400 hover:text-red-300"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-6 border-red-500/40 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-extrabold text-white">Permanently Delete Project?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this project? This action cannot be undone and will remove it from your database and public portfolio immediately.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg"
              >
                {deleting ? 'Deleting...' : 'DELETE PROJECT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
