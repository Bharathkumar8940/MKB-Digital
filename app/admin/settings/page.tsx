'use client';

import { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Database, HardDrive, Mail, Activity, CheckCircle2, Lock } from 'lucide-react';

interface HealthData {
  database: string;
  storage: string;
  email: string;
  rateLimiting: string;
  environment: string;
}

export default function AdminSettingsPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemHealth();
  }, []);

  const fetchSystemHealth = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (e) {
      console.error('Failed to query system health:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-emerald-900/40 pb-6">
        <h1 className="text-3xl font-extrabold text-white">
          System <span className="emerald-text-gradient">Settings & Health</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor infrastructure connection status, storage buckets, and security policies.
        </p>
      </div>

      {/* Connection Health Grid */}
      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00ff88]" /> Live Service Status
        </h2>

        {loading ? (
          <div className="text-xs text-slate-400 py-6">Checking connection status...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Database Health */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00ff88]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-300">Database Connection</div>
                  <div className="text-xs font-bold text-[#00ff88] mt-0.5">{health?.database}</div>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
            </div>

            {/* Storage Health */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00ff88]">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-300">Image Storage</div>
                  <div className="text-xs font-bold text-[#00ff88] mt-0.5">{health?.storage}</div>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
            </div>

            {/* Email Dispatch Health */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00ff88]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-300">Email Dispatch Service</div>
                  <div className="text-xs font-bold text-[#00ff88] mt-0.5">{health?.email}</div>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
            </div>

            {/* Rate Limiting */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00ff88]">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-300">Rate Limiting Protection</div>
                  <div className="text-xs font-bold text-[#00ff88] mt-0.5">{health?.rateLimiting}</div>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
            </div>
          </div>
        )}
      </div>

      {/* Security Policies Overview */}
      <div className="glass-panel p-8 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Active Security Enforcements
        </h3>

        <ul className="space-y-3 text-xs text-slate-300 divide-y divide-emerald-950/40">
          <li className="flex items-center justify-between pt-2">
            <span>Owner Session Tokens</span>
            <span className="font-mono text-emerald-400 font-bold">HttpOnly, SameSite=Lax, Secure</span>
          </li>
          <li className="flex items-center justify-between pt-2">
            <span>Password Hashing</span>
            <span className="font-mono text-emerald-400 font-bold">Bcrypt Salt Rounds (10)</span>
          </li>
          <li className="flex items-center justify-between pt-2">
            <span>Public Database Permissions</span>
            <span className="font-mono text-emerald-400 font-bold">Read-Only Published Projects</span>
          </li>
          <li className="flex items-center justify-between pt-2">
            <span>Public Registration</span>
            <span className="font-mono text-red-400 font-bold">STRICTLY DISABLED</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
