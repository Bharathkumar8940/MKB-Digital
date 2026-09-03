'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Inbox, Settings, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide admin nav on login page
  if (pathname === '/admin/login') return null;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <header className="bg-[#040806] border-b border-[#00ff88]/20 py-4 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Header Title */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="MKB DIGITAL Logo"
            className="w-9 h-9 object-contain rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.3)]"
          />
          <div>
            <span className="font-extrabold text-white text-base tracking-wider">
              MKB DIGITAL <span className="text-[#00ff88]">ADMIN</span>
            </span>
            <span className="text-[10px] text-emerald-400 block -mt-1 font-mono">Owner Management Console</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#00ff88] text-black font-bold shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                    : 'text-slate-300 hover:text-white hover:bg-emerald-950/40 border border-transparent hover:border-emerald-800/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-xs text-slate-400 hover:text-[#00ff88] flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-emerald-700/40 transition-colors"
          >
            Public Site <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/40 hover:bg-red-900/50 transition-colors font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
