'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Sparkles, Menu, X, FolderKanban } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide public navbar on all admin portal routes
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060b08]/85 backdrop-blur-md border-b border-[#00ff88]/15 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="MKB DIGITAL Logo"
            className="w-10 h-10 object-contain rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.4)] group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-lg text-white group-hover:text-[#00ff88] transition-colors">
              MKB <span className="text-[#00ff88]">DIGITAL</span>
            </span>
            <span className="text-[10px] tracking-widest text-emerald-400 uppercase -mt-1 font-medium">
              Web Architecture
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#work" className="hover:text-[#00ff88] transition-colors">
            Selected Work
          </a>
          <a href="#services" className="hover:text-[#00ff88] transition-colors">
            Services
          </a>
          <a href="#pricing" className="hover:text-[#00ff88] transition-colors">
            Pricing
          </a>
          <a href="#about" className="hover:text-[#00ff88] transition-colors">
            About Me
          </a>
          <a href="#contact" className="hover:text-[#00ff88] transition-colors">
            Contact
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/work"
            className="btn-outline-emerald px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
          >
            <FolderKanban className="w-4 h-4 text-[#00ff88]" />
            CHECK OUR WORK
          </Link>
          <a
            href="#contact"
            className="btn-emerald px-4 py-2 rounded-lg text-xs flex items-center gap-2 font-bold"
          >
            <Sparkles className="w-4 h-4" />
            GET A FREE QUOTE
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-[#00ff88] focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a120d] border-b border-[#00ff88]/20 px-4 pt-4 pb-6 space-y-4 shadow-2xl">
          <Link
            href="/work"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-[#00ff88] py-2 font-medium"
          >
            Selected Work
          </Link>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-[#00ff88] py-2 font-medium"
          >
            Services
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-[#00ff88] py-2 font-medium"
          >
            Pricing
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-[#00ff88] py-2 font-medium"
          >
            About Me
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-[#00ff88] py-2 font-medium"
          >
            Contact
          </a>
          <Link
            href="/work"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-outline-emerald w-full py-2.5 rounded-lg text-center text-xs font-bold flex items-center justify-center gap-2"
          >
            <FolderKanban className="w-4 h-4 text-[#00ff88]" />
            CHECK OUR WORK
          </Link>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-emerald w-full py-2.5 rounded-lg text-center text-xs block font-bold"
          >
            GET A FREE QUOTE
          </a>
        </div>
      )}
    </header>
  );
}
