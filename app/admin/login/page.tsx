'use client';

import { useState } from 'react';
import { Lock, Mail, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Perform hard navigation so browser presents HttpOnly cookie to middleware
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative z-10 pt-20">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 sm:p-10 rounded-3xl border-[#00ff88]/30 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <img
            src="/logo.png"
            alt="MKB DIGITAL Logo"
            className="w-16 h-16 object-contain rounded-2xl mx-auto shadow-[0_0_25px_rgba(0,255,136,0.4)]"
          />
          <h1 className="text-2xl font-extrabold text-white tracking-wide mt-4">
            MKB DIGITAL <span className="text-[#00ff88]">ADMIN</span>
          </h1>
          <p className="text-xs text-slate-400">
            Owner Authentication Portal. Restricted Access.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Admin ID / Owner Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                required
                placeholder="Enter Admin ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-emerald w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm mt-2"
          >
            {loading ? (
              <>Authenticating...</>
            ) : (
              <>
                LOGIN TO DASHBOARD <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-500">
            System protected by HttpOnly Session Tokens & Server Authorization.
          </p>
        </div>
      </div>
    </div>
  );
}
