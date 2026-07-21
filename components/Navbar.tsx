'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Menu, X, ChevronDown, Globe, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const NAV_LINKS = [
  { label: 'BERANDA', href: '#home' },
  { label: 'TENTANG', href: '#about' },
  { label: 'LOMBA', href: '#competitions' },
  { label: 'TIMELINE', href: '#timeline' },
  { label: 'FAQ', href: '#faq' },
] as const;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const scrollTo = (href: string) => {
    setIsMobileOpen(false);
    if (pathname === '/') {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      router.push('/' + href);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 h-14 md:h-16 flex items-center justify-between border-b ${
          isScrolled
            ? 'bg-white border-slate-200/80 shadow-sm shadow-slate-100/50'
            : 'bg-white/95 backdrop-blur-md border-slate-200/60'
        }`}
      >
      {/* Left: Brand block with slanted/trapezoidal container */}
      <div className="flex items-center h-full">
        <div
          className="flex items-center bg-slate-50 h-full pl-4 md:pl-8 pr-12 text-slate-900 relative transition-colors duration-200"
          style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%)' }}
        >
          {/* Brand 1 (Riot Games style) */}
          <button
            onClick={() => scrollTo('#home')}
            className="flex items-center gap-1.5 text-slate-700 hover:text-cyan-600 transition-colors duration-200 cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-astro-cyan transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase">ASTRO</span>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </button>

          {/* Vertical Divider */}
          <div className="w-[1px] h-5 bg-slate-200 mx-3" />

          {/* Brand 2 (Valorant style) */}
          <button
            onClick={() => scrollTo('#home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            {/* Custom geometric star logo representing ASTRO event in Valorant style */}
            <svg
              className="w-[18px] h-[18px] text-astro-cyan fill-current transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 100 100"
            >
              <path d="M50 5 L85 85 L50 65 L15 85 Z" />
            </svg>
            <span className="text-[11px] md:text-xs font-black tracking-widest text-slate-900 uppercase group-hover:text-cyan-600 transition-colors duration-200">
              ASTRO 26
            </span>
          </button>
        </div>
      </div>

      {/* Middle: Desktop Navigation links */}
      <div className="hidden md:flex items-center h-full">
        {NAV_LINKS.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            className="px-4 text-[10.5px] font-bold tracking-[0.15em] text-slate-650 hover:text-slate-950 transition-all duration-200 cursor-pointer h-full flex items-center relative group"
          >
            {link.label}
            {/* Cyan bottom accent indicator line, active on hover */}
            <span className="absolute bottom-0 inset-x-4 h-[2px] bg-[#06B6D4] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-in-out" />
          </button>
        ))}
      </div>

      {/* Right: Actions (Search, Globe, CTA, Mobile) */}
      <div className="flex items-center gap-2 md:gap-3 pr-4 md:pr-8 h-full">
        {/* Search */}
        <button
          className="p-2 text-slate-500 hover:text-slate-850 transition-colors duration-200 cursor-pointer hidden sm:block"
          aria-label="Cari"
        >
          <Search className="w-[18px] h-[18px]" />
        </button>

        {/* Language selector */}
        <button
          className="p-2 text-slate-500 hover:text-slate-850 transition-colors duration-200 cursor-pointer hidden sm:block"
          aria-label="Pilih Bahasa"
        >
          <Globe className="w-[18px] h-[18px]" />
        </button>

        {/* CTA (Play Now / Register style) */}
        <button
          onClick={() => scrollTo('#competitions')}
          className="px-4 py-2 md:px-5 md:py-2 bg-astro-cyan hover:bg-cyan-400 text-slate-950 hover:text-slate-950 font-black text-[10px] md:text-[11px] tracking-wider uppercase rounded transition-all duration-200 ease-in-out cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
        >
          DAFTAR SEKARANG
        </button>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
          aria-label="Menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute top-0 right-0 h-full w-64 bg-white border-l border-slate-200 flex flex-col"
            >
              {/* Close Button Header */}
              <div className="flex items-center justify-end p-4 border-b border-slate-100">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors duration-200 cursor-pointer"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-1 p-6 overflow-y-auto flex-grow">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="px-4 py-3 text-xs font-bold tracking-[0.15em] text-left text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all duration-200 cursor-pointer flex items-center justify-between group"
                  >
                    {link.label}
                    <span className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full scale-0 group-hover:scale-100 transition-transform duration-200 ease-in-out" />
                  </button>
                ))}
                <hr className="my-4 border-slate-100" />
                <button
                  onClick={() => scrollTo('#competitions')}
                  className="px-4 py-3 bg-astro-cyan hover:bg-cyan-400 text-slate-950 hover:text-slate-950 font-black text-xs tracking-wider uppercase text-center rounded transition-all duration-200 cursor-pointer"
                >
                  DAFTAR SEKARANG
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
