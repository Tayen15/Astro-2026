'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/src/db/supabase/client';
import Navbar from '@/components/Navbar';

const MotionImage = motion.create(Image);

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Menunggu Pembayaran', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  detecting: { label: 'Diverifikasi', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: AlertCircle },
  paid: { label: 'Disetujui ✓', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  failed: { label: 'Gagal', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

export default function CekPendaftaranPage() {
  const [registrations, setRegistrations] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const reduce = useReducedMotion();

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.email) {
        setLoading(false);
        setError('Anda belum login. Silakan login terlebih dahulu.');
        return;
      }

      setIsLoggedIn(true);
      setUserEmail(user.email);

      try {
        const res = await fetch(`/api/registrations?userId=${encodeURIComponent(user.id)}&search=${encodeURIComponent(user.email)}`);
        const json = await res.json();
        setRegistrations(json.data || []);
      } catch {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-white overflow-hidden relative">
      {/* Navbar */}
      <Navbar />

      {/* ─── FLOATING BLOBS ─── */}
      <MotionImage
        src="/assets/blob-round.png" alt=""
        width={112} height={112}
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[8%] right-[6%] w-20 h-20 md:w-28 md:h-28 object-contain pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/blob-round.png" alt=""
        width={96} height={96}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[35%] left-[3%] w-16 h-16 md:w-24 md:h-24 object-contain pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/blob-round.png" alt=""
        width={72} height={72}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[55%] right-[3%] w-12 h-12 md:w-20 md:h-20 object-contain pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/blob-round.png" alt=""
        width={88} height={88}
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[12%] left-[4%] w-14 h-14 md:w-22 md:h-22 object-contain pointer-events-none select-none z-0"
      />

      {/* ─── CLOUDS ─── */}
      <MotionImage
        src="/assets/awan1.png" alt=""
        width={160} height={120}
        animate={{ x: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] left-[2%] w-16 h-auto md:w-36 md:h-auto object-contain pointer-events-none select-none z-0 opacity-30"
      />
      <MotionImage
        src="/assets/awan2.png" alt=""
        width={200} height={140}
        animate={{ x: [0, -12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[28%] right-[3%] w-20 h-auto md:w-44 md:h-auto object-contain pointer-events-none select-none z-0 opacity-25"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-36 pb-20 md:pt-40 md:pb-28">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <div className="accent-line" />
          </div>
          <h1 className="font-masterpiece text-4xl md:text-5xl text-slate-900 leading-tight mb-3">
            Cek <span className="text-astro-cyan">Pendaftaran</span>
          </h1>
          {userEmail && (
            <p className="text-sm text-slate-600 font-light">
              Status pendaftaran untuk <strong>{userEmail}</strong>
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-astro-cyan" />
          </div>
        )}

        {/* Not logged in */}
        {!loading && !isLoggedIn && (
          <div className="bg-white border border-slate-200 p-8 text-center relative"
            style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
          >
            <LogIn className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 mb-4">Silakan login untuk melihat status pendaftaran Anda.</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-astro-cyan text-slate-950 font-black text-xs tracking-wider uppercase transition-all hover:bg-cyan-400"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              <LogIn className="w-4 h-4" /> Masuk
            </Link>
          </div>
        )}

        {/* Error */}
        {error && isLoggedIn && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 mb-6 text-center"
            style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            {error}
          </div>
        )}

        {/* Has no registrations */}
        {!loading && isLoggedIn && registrations && registrations.length === 0 && (
          <div className="bg-white border border-slate-200 p-8 text-center relative"
            style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
          >
            <p className="text-sm text-slate-500 mb-4">Belum ada pendaftaran untuk akun ini.</p>
            <Link
              href="/#competitions"
              className="text-xs font-bold text-astro-cyan hover:underline uppercase tracking-wider"
            >
              Lihat Lomba →
            </Link>
          </div>
        )}

        {/* Results */}
        {registrations && registrations.length > 0 && (
          <div className="space-y-4">
            {registrations.map((reg: any) => {
              const cfg = statusConfig[reg.paymentStatus] || statusConfig.pending;
              const Icon = cfg.icon;
              return (
                <div key={reg.id}
                  className="bg-white border border-slate-200 relative"
                  style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
                >
                  <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
                  />
                  <div className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">
                          {reg.competitionName}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {reg.type === 'team' ? reg.teamName : reg.fullName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{reg.email}</p>
                        {reg.paymentReference && (
                          <p className="text-xs font-mono text-slate-400 mt-1">
                            Ref: {reg.paymentReference}
                          </p>
                        )}
                      </div>
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border ${cfg.color}`}
                        style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                      >
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back link + Logout */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link href="/" className="text-xs font-bold text-slate-500 hover:text-astro-cyan uppercase tracking-wider transition-colors">
            ← Kembali ke Beranda
          </Link>
          {isLoggedIn && (
            <button onClick={handleLogout}
              className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-wider transition-colors cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
