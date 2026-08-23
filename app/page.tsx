'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Send,
  AlertCircle,
  ChevronDown,
  Search,
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
];

export default function Home() {
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    serviceRequired: 'Professional Package',
    budget: 'Professional – ₹7,999',
    message: '',
    website_url: '', // Honeypot field
  });
  const [countryCode, setCountryCode] = useState('+91');
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  const filteredCountries = COUNTRY_CODES.filter(
    (c) =>
      c.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccess(null);
    setFormError(null);

    const fullPhonePayload = `${countryCode} ${formData.phone}`.trim();

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: fullPhonePayload,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormSuccess(data.message || "Thanks! Your enquiry has been received. I'll get back to you soon.");
        setFormData({
          name: '',
          businessName: '',
          email: '',
          phone: '',
          serviceRequired: 'Professional Package',
          budget: 'Professional – ₹7,999',
          message: '',
          website_url: '',
        });
      } else {
        setFormError(data.error || 'Failed to submit enquiry. Please check your fields.');
      }
    } catch (err) {
      setFormError('Network error. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-32 pb-24">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-[#00ff88]/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-[#00ff88]" />
            Bespoke Full-Stack Web Development Agency
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Architecting <span className="emerald-text-gradient">High-Impact</span> Digital
            Experiences
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            I craft ultra-responsive web applications, luxury e-commerce platforms, and custom 3D web systems for forward-thinking brands and businesses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/work" className="btn-emerald w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2">
              View Selected Work <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#contact" className="btn-outline-emerald w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2">
              Get A Free Quote
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl mx-auto border-t border-[#00ff88]/15">
            <div>
              <div className="text-3xl font-extrabold text-[#00ff88]">100%</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Custom Codebase</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#00ff88]">3D & WebGL</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Advanced UI Systems</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-3xl font-extrabold text-[#00ff88]">Secure</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Enterprise Architecture</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">
            Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Core Web Development <span className="emerald-text-gradient">Services</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4 hover:border-[#00ff88]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00ff88]">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Custom Web Apps</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Full-stack Next.js and Node.js applications engineered for high performance, security, and scalable growth.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 hover:border-[#00ff88]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00ff88]">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Luxury E-Commerce</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Interactive 3D product visualizers, smooth checkout flows, and bespoke online storefronts.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 hover:border-[#00ff88]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00ff88]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">3D & Interactive UI</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Three.js, WebGL shader effects, and smooth micro-animations that captivate users immediately.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 hover:border-[#00ff88]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00ff88]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">APIs & Security</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Robust PostgreSQL / Supabase backend architectures, authentication systems, and automated pipelines.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">
            Investment
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Transparent Pricing <span className="emerald-text-gradient">Packages</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Package */}
          <div className="glass-panel p-8 rounded-2xl space-y-6 border-slate-800 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40 mb-2">
                  🟢 Basic
                </div>
                <h3 className="text-xl font-bold text-white">Basic Website</h3>
                <p className="text-xs text-slate-400 mt-1">Professional business presence</p>
                <div className="text-3xl font-extrabold text-[#00ff88] mt-4">₹3,999</div>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 5 Custom Pages
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> WhatsApp Integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Google Maps Integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Contact Form & Basic SEO
                </li>
              </ul>
            </div>
            <a href="#contact" className="btn-outline-emerald block w-full text-center py-3 rounded-xl text-xs font-bold">
              Select Basic (₹3,999)
            </a>
          </div>

          {/* Professional Package */}
          <div className="glass-panel p-8 rounded-2xl space-y-6 border-[#00ff88]/40 shadow-[0_0_30px_rgba(0,255,136,0.15)] relative flex flex-col justify-between">
            <div className="absolute -top-3 right-6 bg-[#00ff88] text-black font-extrabold text-[10px] uppercase px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="space-y-6">
              <div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-sky-950 text-sky-400 border border-sky-800/40 mb-2">
                  🔵 Professional
                </div>
                <h3 className="text-xl font-bold text-white">Professional Web App</h3>
                <p className="text-xs text-slate-400 mt-1">Full database & admin control</p>
                <div className="text-3xl font-extrabold text-[#00ff88] mt-4">₹7,999</div>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2 font-semibold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-[#00ff88] shrink-0" /> Everything in Basic +
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> PostgreSQL/Supabase Database
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Owner Admin Panel & Enquiries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Booking & Review System
                </li>
              </ul>
            </div>
            <a href="#contact" className="btn-emerald block w-full text-center py-3 rounded-xl text-xs font-bold">
              Select Professional (₹7,999)
            </a>
          </div>

          {/* Premium Package */}
          <div className="glass-panel p-8 rounded-2xl space-y-6 border-purple-500/30 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800/40 mb-2">
                  🟣 Premium
                </div>
                <h3 className="text-xl font-bold text-white">Premium Suite</h3>
                <p className="text-xs text-slate-400 mt-1">Advanced platform & payments</p>
                <div className="text-3xl font-extrabold text-[#00ff88] mt-4">₹12,999</div>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2 font-semibold text-purple-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Everything in Professional +
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Payment Gateway Integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Advanced Booking & Analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> NFC/QR Reviews & Custom Features
                </li>
              </ul>
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/30 text-[11px] text-purple-200 space-y-1">
                <div>✨ Add-on: <strong>3D Animation (+₹1,900)</strong></div>
                <div className="text-slate-400 text-[10px]">Domain & Hosting: charged extra</div>
              </div>
            </div>
            <a href="#contact" className="btn-outline-emerald block w-full text-center py-3 rounded-xl text-xs font-bold">
              Select Premium (₹12,999)
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">
              About MKB Digital
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Crafting Digital Products with <span className="emerald-text-gradient">Precision & Artistry</span>
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              I am Bharath Kumar, founder and lead developer at MKB DIGITAL. I specialize in turning ambitious business visions into high-performing, secure, and visually stunning web systems.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every project is engineered from scratch without bloated templates. From database RLS security to 3D shader interactions, I personally build and deliver end-to-end digital solutions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 border-[#00ff88]/20 bg-emerald-950/20">
            <h3 className="font-bold text-white text-lg">Engineering Standards</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-emerald-900/50 pb-2">
                <span className="text-slate-400">Primary Stack</span>
                <span className="text-emerald-400 font-mono">Next.js, TypeScript, Tailwind</span>
              </div>
              <div className="flex justify-between border-b border-emerald-900/50 pb-2">
                <span className="text-slate-400">Database Engine</span>
                <span className="text-emerald-400 font-mono">PostgreSQL / Supabase & Prisma</span>
              </div>
              <div className="flex justify-between border-b border-emerald-900/50 pb-2">
                <span className="text-slate-400">Security Standard</span>
                <span className="text-emerald-400 font-mono">Server Auth, Zod & RLS Policies</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">3D Graphics</span>
                <span className="text-emerald-400 font-mono">Three.js & WebGL Shaders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT / ENQUIRY FORM */}
      <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">
            Let's Build Together
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Get Your <span className="emerald-text-gradient">Free Quote</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Fill in your project requirements below. I will personally review your request and get back to you within 24 hours.
          </p>
        </div>

        {formSuccess ? (
          <div className="glass-panel p-8 rounded-2xl text-center space-y-4 border-emerald-500/50 bg-emerald-950/30">
            <div className="w-16 h-16 bg-[#00ff88]/20 text-[#00ff88] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Enquiry Received!</h3>
            <p className="text-emerald-300 text-sm max-w-md mx-auto">{formSuccess}</p>
            <button
              onClick={() => setFormSuccess(null)}
              className="btn-outline-emerald px-6 py-2 rounded-lg text-xs font-bold mt-4"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="glass-panel p-8 sm:p-10 rounded-2xl space-y-6">
            {formError && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                {formError}
              </div>
            )}

            {/* Honeypot field (hidden from human visitors) */}
            <input
              type="text"
              name="website_url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bharath Kumar M."
                  value={formData.name}
                  onChange={(e) => {
                    const filtered = e.target.value.replace(/[^a-zA-Z\s\.]/g, '');
                    setFormData({ ...formData, name: filtered });
                  }}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Business / Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Ventures"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Phone / WhatsApp Number * (10 Digits)
                </label>
                <div className="flex gap-2 relative" ref={countryDropdownRef}>
                  {/* Country Code Selection Slot */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="h-full px-3 py-3 rounded-xl glass-input text-sm font-semibold flex items-center gap-1.5 hover:border-[#00ff88] transition-colors bg-[#080f0b] text-white min-w-[105px] justify-between"
                    >
                      <span className="text-base">{selectedCountry.flag}</span>
                      <span className="font-mono text-emerald-400">{selectedCountry.code}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                          isCountryDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Interactive Searchable Dropdown Menu */}
                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-72 max-h-64 bg-[#0a120d] border border-[#00ff88]/30 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col backdrop-blur-xl">
                        {/* Search Input Slot */}
                        <div className="p-2 border-b border-white/10 sticky top-0 bg-[#0a120d] z-10 flex items-center gap-2">
                          <Search className="w-4 h-4 text-emerald-400 ml-2" />
                          <input
                            type="text"
                            placeholder="Type country or code..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none py-1"
                            autoFocus
                          />
                        </div>

                        {/* Country Code Options List */}
                        <div className="overflow-y-auto flex-1 divide-y divide-white/5">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((c) => (
                              <button
                                key={`${c.code}-${c.country}`}
                                type="button"
                                onClick={() => {
                                  setCountryCode(c.code);
                                  setIsCountryDropdownOpen(false);
                                  setCountrySearch('');
                                }}
                                className={`w-full px-3 py-2.5 text-left text-xs flex items-center justify-between hover:bg-[#00ff88]/15 transition-colors ${
                                  c.code === countryCode
                                    ? 'bg-[#00ff88]/10 text-[#00ff88] font-bold'
                                    : 'text-slate-200'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="text-base">{c.flag}</span>
                                  <span className="truncate max-w-[140px]">{c.country}</span>
                                </span>
                                <span className="font-mono text-emerald-400 font-semibold">
                                  {c.code}
                                </span>
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-xs text-slate-400">
                              No matching country found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 10-Digit Mobile Phone Slot */}
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile (e.g. 9876543210)"
                    value={formData.phone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: digitsOnly });
                    }}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono tracking-wider"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Service Required *
                </label>
                <select
                  value={formData.serviceRequired}
                  onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm bg-[#080f0b]"
                >
                  <option value="Essential Website">Essential Website</option>
                  <option value="Custom Web Application">Custom Web Application</option>
                  <option value="Luxury E-Commerce">Luxury E-Commerce</option>
                  <option value="3D Interactive Experience">3D Interactive Experience</option>
                  <option value="Enterprise Solution">Enterprise Solution</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Project Budget
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm bg-[#080f0b]"
                >
                  <option value="Basic – ₹3,999">Basic Package – ₹3,999</option>
                  <option value="Professional – ₹7,999">Professional Package – ₹7,999</option>
                  <option value="Premium – ₹12,999">Premium Package – ₹12,999</option>
                  <option value="Premium + 3D Animation (₹14,899)">Premium + 3D Animation (₹14,899)</option>
                  <option value="Custom Scope (₹15,000+)">Custom Scope (₹15,000+)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Project Details & Requirements (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Describe your goals, key features, or timeline (optional)..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={formSubmitting}
              className="btn-emerald w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-base"
            >
              {formSubmitting ? (
                <>Processing Request...</>
              ) : (
                <>
                  GET MY FREE QUOTE <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
