'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative z-10 bg-[#040806] border-t border-[#00ff88]/15 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MKB DIGITAL Logo" className="w-8 h-8 object-contain rounded-lg" />
            <span className="font-extrabold text-white text-lg">
              MKB <span className="text-[#00ff88]">DIGITAL</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-sm text-center md:text-left">
            High-performance web architecture, luxury web apps, and bespoke digital development.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-400">
          <a href="#work" className="hover:text-[#00ff88] transition-colors">
            Portfolio
          </a>
          <a href="#services" className="hover:text-[#00ff88] transition-colors">
            Services
          </a>
          <a href="#pricing" className="hover:text-[#00ff88] transition-colors">
            Pricing
          </a>
          <Link href="/admin" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Owner Portal
          </Link>
        </div>

        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} MKB Digital. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
