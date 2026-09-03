'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    images: [] as string[],
    liveUrl: '',
    githubUrl: '',
    technologies: '',
    clientName: '',
    year: '',
    featured: false,
    status: 'PUBLISHED',
    displayOrder: 0,
    isConcept: false,
  });

  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title || '',
          category: data.category || '',
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          thumbnail: data.thumbnail || '',
          images: Array.isArray(data.images) ? data.images : [],
          liveUrl: data.liveUrl || '',
          githubUrl: data.githubUrl || '',
          technologies: Array.isArray(data.technologies) ? data.technologies.join(', ') : '',
          clientName: data.clientName || '',
          year: data.year || '',
          featured: !!data.featured,
          status: data.status || 'DRAFT',
          displayOrder: data.displayOrder || 0,
          isConcept: !!data.isConcept,
        });
      } else {
        setError('Failed to fetch project details');
      }
    } catch (e) {
      setError('Error loading project');
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumb(true);
    setError(null);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, thumbnail: data.url }));
      } else {
        setError(data.error || 'Failed to upload thumbnail image');
      }
    } catch (err) {
      setError('Upload request failed');
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setError(null);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', files[i]);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          newUrls.push(data.url);
        }
      }

      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }));
    } catch (err) {
      setError('Failed to upload gallery images');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = async (overrideStatus?: 'DRAFT' | 'PUBLISHED') => {
    setSubmitting(true);
    setError(null);

    const targetStatus = overrideStatus || formData.status;

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      ...formData,
      status: targetStatus,
      technologies: techArray,
      images: formData.images.length > 0 ? formData.images : [formData.thumbnail],
    };

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        setError(data.error || 'Failed to update project.');
      }
    } catch (err) {
      setError('Network error updating project.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-24 text-xs text-slate-400">Loading project details...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-900/40 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-xl glass-panel text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Edit <span className="emerald-text-gradient">{formData.title || 'Project'}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Update project details, status, or display order.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          {error}
        </div>
      )}

      {/* Main Form Container */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
        {/* Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Project Category *
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Short Description *
          </label>
          <input
            type="text"
            required
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm"
          />
        </div>

        {/* Full Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Full Description *
          </label>
          <textarea
            required
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm"
          ></textarea>
        </div>

        {/* Thumbnail Image Upload */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Project Thumbnail *
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="url"
              required
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm flex-grow"
            />
            <label className="btn-outline-emerald px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shrink-0">
              <Upload className="w-4 h-4" />
              {uploadingThumb ? 'Uploading...' : 'Upload Image File'}
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
            </label>
          </div>
          {formData.thumbnail && (
            <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-emerald-500/40">
              <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Gallery Image Uploads */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Additional Screenshots
          </label>
          <div className="flex items-center gap-4">
            <label className="btn-outline-emerald px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              {uploadingGallery ? 'Uploading...' : 'Add Screenshot Files'}
              <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
              {formData.images.map((imgUrl, idx) => (
                <div key={idx} className="relative group h-20 rounded-lg overflow-hidden border border-emerald-950">
                  <img src={imgUrl} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Live Website URL
            </label>
            <input
              type="url"
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              GitHub Repository URL
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* Technologies & Year */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Technologies Used *
            </label>
            <input
              type="text"
              required
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Project Year *
            </label>
            <input
              type="text"
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* Client & Display Order */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Client Name
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Display Order
            </label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-emerald-900/40">
          <label className="flex items-center gap-3 glass-panel p-4 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isConcept}
              onChange={(e) => setFormData({ ...formData, isConcept: e.target.checked })}
              className="w-4 h-4 accent-[#00ff88]"
            />
            <div>
              <div className="font-bold text-xs text-white">Concept Project</div>
              <div className="text-[10px] text-slate-400">Shows CONCEPT badge</div>
            </div>
          </label>

          <label className="flex items-center gap-3 glass-panel p-4 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 accent-[#00ff88]"
            />
            <div>
              <div className="font-bold text-xs text-white">Featured Project</div>
              <div className="text-[10px] text-slate-400">Highlight on portfolio</div>
            </div>
          </label>

          <div className="space-y-1 glass-panel p-4 rounded-xl">
            <label className="text-xs font-semibold text-slate-300 block">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[#080f0b] text-xs py-1.5 px-2 rounded-lg text-emerald-400 font-bold border border-emerald-800/40"
            >
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="DRAFT">DRAFT</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-emerald-900/40">
          <Link
            href="/admin/projects"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 text-center"
          >
            CANCEL
          </Link>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave('DRAFT')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold btn-outline-emerald"
          >
            SAVE AS DRAFT
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave('PUBLISHED')}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-bold btn-emerald"
          >
            {submitting ? 'Saving Changes...' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
}
