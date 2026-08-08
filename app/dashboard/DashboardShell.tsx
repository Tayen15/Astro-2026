'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/src/lib/auth-client';
import {
  LayoutDashboard,
  ClipboardList,
  Download,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  HelpCircle,
  Trophy,
  Users,
  Star,
  Calendar,
  ImageIcon,
  Award,
} from 'lucide-react';
import Image from 'next/image';

interface Props {
  children: React.ReactNode;
  role: string;
  userName: string;
  userEmail: string;
}

export default function DashboardShell({ children, role, userName }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    ...(role === 'admin' ? [
      { href: '/dashboard/registrations', label: 'Pendaftaran', icon: ClipboardList },
      { href: '/dashboard/users', label: 'User', icon: Users },
      { href: '/dashboard/competitions', label: 'Kompetisi', icon: Trophy },
      { href: '/dashboard/faq', label: 'FAQ', icon: HelpCircle },
      { href: '/dashboard/sponsor', label: 'Sponsor', icon: Star },
      { href: '/dashboard/journey', label: 'Journey', icon: Calendar },
      { href: '/dashboard/gallery', label: 'Gallery', icon: ImageIcon },
      { href: '/dashboard/committee', label: 'Committee', icon: Users },
      { href: '/dashboard/certificates', label: 'Sertifikat', icon: Award },
      { href: '/dashboard/export', label: 'Export Data', icon: Download },
    ] : []),
    { href: '/dashboard/profile', label: 'Profil', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/assets/logo-astro.png"
                alt="ASTRO"
                width={36}
                height={36}
                className="w-8 h-8 object-contain"
              />
              <span className="font-masterpiece text-lg text-slate-900">
                ASTRO 2026
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-cyan-50 text-astro-cyan border border-cyan-200/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive(item.href) && (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="px-3 py-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50">
              <div className="w-8 h-8 rounded-full bg-astro-cyan text-slate-950 flex items-center justify-center font-black text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 fixed top-0 right-0 left-0 lg:left-64 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 -ml-2 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-astro-cyan transition-colors uppercase tracking-wider font-bold"
          >
            Lihat Website
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
