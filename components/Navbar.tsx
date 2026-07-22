'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
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
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 h-16 md:h-[72px] flex items-center justify-between ${
          isScrolled
            ? 'bg-white/60 backdrop-blur-xl shadow-lg shadow-black/5 mx-4 md:mx-8 mt-3 rounded-xl border border-white/30'
            : 'bg-transparent mx-0 mt-0 rounded-none border-transparent'
        }`}
      >
        {/* Left: Logo */}
        <div className="flex items-center h-full pl-4 md:pl-6">
          <button
            onClick={() => scrollTo('#home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Image
              src="/assets/logo-astro.png"
              alt="ASTRO Logo"
              width={44}
              height={44}
              className="h-9 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className={`text-sm md:text-base font-masterpiece tracking-wide transition-colors duration-300 ${
              isScrolled ? 'text-slate-800' : 'text-white'
            }`}>
              ASTRO 2026
            </span>
          </button>
        </div>

        {/* Middle: Desktop Navigation links */}
        <div className="hidden md:flex items-center h-full gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className={`px-4 text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer h-10 flex items-center relative group rounded-lg ${
                isScrolled
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right: CTA + Mobile */}
        <div className="flex items-center gap-2 pr-4 md:pr-6 h-full">
          <button
            onClick={() => scrollTo('#competitions')}
            className={`px-5 py-2 text-[11px] font-black tracking-wider uppercase rounded-lg transition-all duration-200 cursor-pointer ${
              isScrolled
                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md hover:shadow-lg'
                : 'bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30'
            }`}
          >
            Daftar
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 cursor-pointer ${
              isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
            }`}
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute top-0 right-0 h-full w-72 bg-white/90 backdrop-blur-xl border-l border-white/30 flex flex-col rounded-l-2xl"
            >
              {/* Close Button Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <Image
                  src="/assets/logo-astro.png"
                  alt="ASTRO Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors duration-200 cursor-pointer"
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
                    className="px-5 py-3.5 text-sm font-bold tracking-[0.15em] text-left text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between group"
                  >
                    {link.label}
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-sm scale-0 group-hover:scale-100 transition-transform duration-200" />
                  </button>
                ))}
                <hr className="my-4 border-slate-200" />
                <button
                  onClick={() => scrollTo('#competitions')}
                  className="px-5 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-black text-sm tracking-wider uppercase text-center rounded-xl transition-all duration-200 cursor-pointer shadow-md"
                >
                  Daftar Sekarang
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
