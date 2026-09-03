'use client';

import { useState, useEffect } from 'react';
import { Inbox, Mail, Phone, Building, IndianRupee, Calendar, Trash2, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface Enquiry {
  id: string;
  name: string;
  businessName?: string | null;
  email: string;
  phone?: string | null;
  serviceRequired: string;
  budget?: string | null;
  message: string;
  status: string;
  ipAddress?: string | null;
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchEnquiries();
      }
    } catch (e) {
      console.error('Status change error:', e);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchEnquiries();
      }
    } catch (e) {
      console.error('Delete enquiry error:', e);
    }
  };

  const filtered =
    statusFilter === 'ALL'
      ? enquiries
      : enquiries.filter((e) => e.status === statusFilter);

  const statuses = ['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Client <span className="emerald-text-gradient">Enquiries</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage incoming project requests and quote submissions from website visitors.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-[#00ff88] text-black font-bold shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                  : 'glass-panel text-slate-300 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading enquiries...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl text-slate-400">
          No enquiries found in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-2xl space-y-4 border-emerald-950/60 hover:border-emerald-700/40 transition-colors"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00ff88] font-bold text-sm">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      {item.name}
                      {item.businessName && (
                        <span className="text-xs text-slate-400 font-normal">({item.businessName})</span>
                      )}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-0.5">
                      <a href={`mailto:${item.email}`} className="hover:text-[#00ff88] flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-emerald-400" /> {item.email}
                      </a>
                      {item.phone && (
                        <a href={`tel:${item.phone}`} className="hover:text-[#00ff88] flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" /> {item.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Selector & Actions */}
                <div className="flex items-center gap-3">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="bg-[#080f0b] text-xs font-bold text-emerald-400 py-1.5 px-3 rounded-lg border border-emerald-800/40 focus:outline-none"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>

                  <button
                    onClick={() => handleDeleteEnquiry(item.id)}
                    className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/40 text-red-400 hover:text-red-300"
                    title="Delete Enquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Requirement & Budget Pills */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 font-mono">
                  Service: <strong>{item.serviceRequired}</strong>
                </span>
                {item.budget && (
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                    Budget: <strong>{item.budget}</strong>
                  </span>
                )}
                <span className="text-slate-500 font-mono flex items-center gap-1 ml-auto">
                  <Calendar className="w-3.5 h-3.5" /> {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Message Content */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 text-slate-300 text-xs leading-relaxed whitespace-pre-line">
                <MessageSquare className="w-4 h-4 text-emerald-400 mb-1 inline mr-2" />
                {item.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
