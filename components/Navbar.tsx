'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, X, LogIn, ChevronDown, LogOut, LayoutDashboard, User, Search,
  Trophy, Building2
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/src/db/supabase/client';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isProfilePage = pathname.startsWith('/profile') || pathname.startsWith('/panitia');

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Check login state and role
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      if (user) {
        fetch('/api/auth/me')
          .then((res) => res.json())
          .then((data) => {
            if (data.data?.role) setUserRole(data.data.role);
          })
          .catch(() => {});
      }
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollTo = (href: string) => {
    setIsMobileOpen(false);
    
    // Full route (starts with /) → navigate directly
    if (href.startsWith('/')) {
      router.push(href);
      return;
    }

    // Hash anchor → scroll on current page or navigate first
    if (href.startsWith('#')) {
      const targetId = href;
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // If on another page, navigate back to target page with anchor
        const basePath = isProfilePage ? '/profile' : '/';
        router.push(basePath + href);
      }
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.replace('/login');
  };

  const handleDaftar = () => {
    if (isLoggedIn) {
      scrollTo(isProfilePage ? '/#competitions' : '#competitions');
    } else {
      router.push('/login');
    }
  };

  // Section links specific to Company Profile page vs Competition Home page
  const sectionLinks = isProfilePage
    ? [
        { label: 'JOURNEY', href: '#journey' },
        { label: 'GALLERY', href: '#gallery' },
        { label: 'MEDIA', href: '#social' },
        { label: 'PENGUMUMAN', href: '/pengumuman' },
        { label: 'PANITIA', href: '/panitia' },
      ]
    : [
        { label: 'KOMPETISI', href: '#competitions' },
        { label: 'PENGUMUMAN', href: '/pengumuman' },
        { label: 'TIMELINE', href: '#timeline' },
        { label: 'FAQ', href: '#faq' },
      ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 h-16 md:h-[72px] flex items-center justify-between ${
          isScrolled
            ? 'bg-white/70 backdrop-blur-xl shadow-lg shadow-black/5 mx-4 md:mx-8 mt-3 rounded-xl border border-white/40'
            : 'bg-transparent mx-0 mt-0 rounded-none border-transparent'
        }`}
      >
        {/* Left: Logo */}
        <div className="flex items-center h-full pl-4 md:pl-6">
          <button
            onClick={() => scrollTo(isProfilePage ? '/profile' : '#home')}
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
              isScrolled ? 'text-slate-900' : 'text-slate-900 md:text-white'
            }`}>
              ASTRO 2026
            </span>
          </button>
        </div>

        {/* Middle: Desktop Navigation Links + 1 Single Blue Portal Switcher Pill */}
        <div className="hidden md:flex items-center h-full gap-2">
          
          {/* ── SECTION ANCHOR LINKS (Dynamically rendered based on active page) ── */}
          <div className="flex items-center gap-1 mx-1">
            {sectionLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={`px-3.5 text-[11px] font-extrabold tracking-[0.12em] uppercase transition-all duration-200 cursor-pointer h-9 flex items-center relative group rounded-lg ${
                  isScrolled
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/60'
                    : 'text-slate-800 md:text-white/90 hover:text-slate-950 md:hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* ── 1 SINGLE BLUE PORTAL SWITCHER BUTTON ──
              - Jika di Company Profile -> Tampil tombol biru "PORTAL LOMBA"
              - Jika di Halaman Lomba -> Tampil tombol biru "COMPANY PROFILE"
          */}
          {isProfilePage ? (
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-md hover:shadow-cyan-500/30 active:scale-95 bg-astro-cyan hover:bg-cyan-400 text-slate-950 border border-cyan-300"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              title="Ke Halaman Utama Portal Lomba ASTRO"
            >
              <Trophy className="w-3.5 h-3.5 text-slate-950" />
              <span>PORTAL LOMBA</span>
            </button>
          ) : (
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-md hover:shadow-cyan-500/30 active:scale-95 bg-astro-cyan hover:bg-cyan-400 text-slate-950 border border-cyan-300"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              title="Ke Halaman Company Profile ASTRO"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-950" />
              <span>COMPANY PROFILE</span>
            </button>
          )}

        </div>

        {/* Right: CTA + Mobile */}
        <div className="flex items-center gap-2 pr-4 md:pr-6 h-full">
          {isLoggedIn ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                  isScrolled
                    ? 'text-slate-700 hover:text-slate-950'
                    : 'text-slate-800 md:text-white/80 hover:text-slate-950 md:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Akun <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-xl rounded-xl border border-slate-200 shadow-xl overflow-hidden"
                  >
                    <button
                      onClick={() => { router.push('/cek-pendaftaran'); setIsDropdownOpen(false); }}
                      className="flex items-center gap-2.5 w-full px-4 py-3 text-xs font-semibold tracking-wider uppercase text-slate-700 hover:text-slate-950 hover:bg-sky-50 transition-all duration-200 cursor-pointer text-left"
                    >
                      <Search className="w-3.5 h-3.5" /> Cek Pendaftaran
                    </button>
                    {userRole === 'admin' && (
                      <>
                        <hr className="border-slate-100" />
                        <button
                          onClick={() => { router.push('/dashboard'); setIsDropdownOpen(false); }}
                          className="flex items-center gap-2.5 w-full px-4 py-3 text-xs font-semibold tracking-wider uppercase text-slate-700 hover:text-slate-950 hover:bg-sky-50 transition-all duration-200 cursor-pointer text-left"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                        </button>
                      </>
                    )}
                    <hr className="border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-3 text-xs font-semibold tracking-wider uppercase text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className={`hidden md:flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                isScrolled
                  ? 'text-slate-700 hover:text-slate-950'
                  : 'text-slate-800 md:text-white/80 hover:text-slate-950 md:hover:text-white'
              }`}
            >
              <LogIn className="w-3 h-3" /> Masuk
            </button>
          )}

          <button
            onClick={handleDaftar}
            className="px-5 py-2 text-[11px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer bg-astro-cyan hover:bg-cyan-400 text-slate-950 shadow-md active:scale-95"
            style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
          >
            Daftar
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 cursor-pointer ${
              isScrolled ? 'text-slate-800' : 'text-slate-900 md:text-white'
            }`}
            aria-label="Menu Navigasi"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
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
              className="absolute top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-2xl border-l border-slate-200 flex flex-col shadow-2xl"
            >
              {/* Close Button Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/logo-astro.png"
                    alt="ASTRO Logo"
                    width={32}
                    height={32}
                    className="h-8 w-auto object-contain"
                  />
                  <span className="font-masterpiece text-xs text-slate-900">ASTRO 2026</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4 p-6 overflow-y-auto flex-grow">
                {/* ── 1 SINGLE BLUE PORTAL SWITCHER BUTTON FOR MOBILE ── */}
                <div className="pb-3 border-b border-slate-100">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">Pindah Web Portal</p>
                  
                  {isProfilePage ? (
                    <button
                      onClick={() => { router.push('/'); setIsMobileOpen(false); }}
                      className="w-full py-3 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-between bg-astro-cyan hover:bg-cyan-400 text-slate-950 shadow-md transition-all"
                      style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                    >
                      <span className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-slate-950" /> Ke Portal Lomba Acara
                      </span>
                      <span className="text-[10px] font-black text-slate-950">↗</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { router.push('/profile'); setIsMobileOpen(false); }}
                      className="w-full py-3 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-between bg-astro-cyan hover:bg-cyan-400 text-slate-950 shadow-md transition-all"
                      style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                    >
                      <span className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-950" /> Ke Company Profile
                      </span>
                      <span className="text-[10px] font-black text-slate-950">↗</span>
                    </button>
                  )}
                </div>

                {/* ── SECTION LINKS FOR MOBILE ── */}
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">Navigasi Halaman</p>
                  {sectionLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => scrollTo(link.href)}
                      className="px-4 py-3 text-xs font-extrabold tracking-wider text-left text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group"
                    >
                      <span>{link.label}</span>
                      <span className="w-1.5 h-1.5 bg-sky-500 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>

                <div className="mt-auto">
                  <hr className="mb-4 border-slate-100" />
                  <div className="bg-slate-50/80 rounded-xl p-2 space-y-0.5">
                    {isLoggedIn ? (
                      <>
                        <button
                          onClick={() => { router.push('/cek-pendaftaran'); setIsMobileOpen(false); }}
                          className="flex items-center gap-3 w-full px-3.5 py-3 text-xs font-bold tracking-wider text-left text-slate-700 hover:text-sky-700 hover:bg-white rounded-lg transition-all"
                        >
                          <Search className="w-4 h-4 text-slate-400" />
                          Cek Pendaftaran
                        </button>
                        {userRole === 'admin' && (
                          <button
                            onClick={() => { router.push('/dashboard'); setIsMobileOpen(false); }}
                            className="flex items-center gap-3 w-full px-3.5 py-3 text-xs font-bold tracking-wider text-left text-slate-700 hover:text-sky-700 hover:bg-white rounded-lg transition-all"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                            Dashboard
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            const supabase = createClient();
                            await supabase.auth.signOut();
                            setIsMobileOpen(false);
                            router.replace('/login');
                          }}
                          className="flex items-center gap-3 w-full px-3.5 py-3 text-xs font-bold tracking-wider text-left text-red-600 hover:text-red-700 hover:bg-white rounded-lg transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => { router.push('/login'); setIsMobileOpen(false); }}
                        className="flex items-center gap-3 w-full px-3.5 py-3 text-xs font-bold tracking-wider text-left text-slate-700 hover:text-sky-700 hover:bg-white rounded-lg transition-all"
                      >
                        <LogIn className="w-4 h-4 text-slate-400" />
                        Masuk
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleDaftar}
                    className="mt-3 w-full px-5 py-3.5 bg-astro-cyan text-slate-950 font-black text-xs tracking-wider uppercase text-center rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Daftar Sekarang
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
