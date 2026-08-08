'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle, LogIn, X, Building2, Phone, Mail, User, CalendarDays, Coins, FileText, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/src/lib/auth-client';
import { apiHelpers } from '@/src/lib/api';
import Navbar from '@/components/Navbar';

const MotionImage = motion.create(Image);

interface RegDetail {
  id: string;
  type: string;
  fullName: string | null;
  identityNumber: string | null;
  teamName: string | null;
  leaderName: string | null;
  leaderIdentity: string | null;
  members: string | null;
  institution: string;
  email: string;
  whatsapp: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentAmount: number;
  paymentReference: string | null;
  createdAt: string;
  updatedAt: string;
  competitionName: string;
  competitionId: string;
  competitionCategory: string;
  competitionFee: number;
}

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
  const [selectedReg, setSelectedReg] = useState<RegDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data: session } = await authClient.getSession();
      const user = session?.user;

      if (!user?.email) {
        setLoading(false);
        setError('Anda belum login. Silakan login terlebih dahulu.');
        return;
      }

      setIsLoggedIn(true);
      setUserEmail(user.email);

      try {
        // Fetch by both userId and email to cover all cases
        const [byEmail, byUser] = await Promise.all([
          apiHelpers.registrations.list({ search: user.email, pageSize: 100 }),
          user.id
            ? apiHelpers.registrations.list({ userId: user.id, pageSize: 100 })
            : Promise.resolve(null),
        ]);

        const emailList = Array.isArray(byEmail) ? byEmail : (byEmail as any)?.data ?? [];
        let combined = emailList;

        if (byUser) {
          const userList = Array.isArray(byUser) ? byUser : (byUser as any)?.data ?? [];
          // Merge and deduplicate by id
          const ids = new Set(combined.map((r: any) => r.id));
          for (const reg of userList) {
            if (!ids.has(reg.id)) {
              combined.push(reg);
              ids.add(reg.id);
            }
          }
        }

        setRegistrations(combined);
      } catch {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const fetchDetail = async (id: string) => {
    setDetailLoading(true);
    setDetailError('');
    setSelectedReg(null);
    try {
      const reg = await apiHelpers.registrations.get(id);
      if (!reg) throw new Error('Data tidak ditemukan');
      const regItem = registrations?.find((r: any) => r.id === id);
      const detail: RegDetail = {
        ...(reg as unknown as RegDetail),
        competitionName: regItem?.competitionName || '',
        competitionId: regItem?.competitionId || '',
        competitionCategory: '',
        competitionFee: 0,
      };
      setSelectedReg(detail);
    } catch {
      setDetailError('Gagal memuat detail pendaftaran.');
    }
    setDetailLoading(false);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-white overflow-hidden relative">
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
          <h1 className="font-masterpiece text-4xl md:text-5xl leading-tight mb-3 bg-gradient-to-b from-slate-800 via-slate-900 to-black bg-clip-text text-transparent">
            Cek Pendaftaran
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
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1 truncate">
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
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border ${cfg.color}`}
                          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                        >
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {reg.paymentStatus === 'pending' && (
                            <button
                              onClick={() => router.push(`/register/${reg.competitionId}?regId=${reg.id}`)}
                              className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-500 uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              <CreditCard className="w-3 h-3" /> Bayar
                            </button>
                          )}
                          <button
                            onClick={() => fetchDetail(reg.id)}
                            className="flex items-center gap-1 text-[10px] font-bold text-astro-cyan hover:text-cyan-600 uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3" /> Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back link + Logout */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link href="/" className="text-xs font-bold text-slate-600 hover:text-white uppercase tracking-wider transition-colors">
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

      {/* Detail Modal */}
      <AnimatePresence>
        {(selectedReg || detailLoading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end md:items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setSelectedReg(null); setDetailError(''); }} />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full md:max-w-lg max-h-[90vh] bg-white rounded-t-2xl md:rounded-2xl overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between p-5 z-10">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Detail Pendaftaran</h2>
                <button
                  onClick={() => { setSelectedReg(null); setDetailError(''); }}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5">
                {detailLoading && (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-astro-cyan" />
                  </div>
                )}

                {detailError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 text-center"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                  >
                    {detailError}
                  </div>
                )}

                {selectedReg && !detailLoading && (
                  <div className="space-y-5">
                    {/* Competition Name */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lomba</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{selectedReg.competitionName}</p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {(() => {
                        const cfg = statusConfig[selectedReg.paymentStatus] || statusConfig.pending;
                        const StatusIcon = cfg.icon;
                        return (
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border ${cfg.color}`}
                            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        );
                      })()}
                    </div>

                    <hr className="border-slate-100" />

                    {/* Identity */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {selectedReg.type === 'team' ? 'Data Tim' : 'Data Peserta'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedReg.type === 'team' ? (
                          <>
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Tim</span>
                              <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedReg.teamName}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ketua Tim</span>
                              <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedReg.leaderName}</p>
                            </div>
                            {selectedReg.members && (
                              <div className="sm:col-span-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Anggota</span>
                                <p className="text-sm text-slate-700 mt-0.5 whitespace-pre-line">{selectedReg.members}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</span>
                              <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedReg.fullName}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">No. Identitas</span>
                              <p className="text-sm text-slate-700 mt-0.5">{selectedReg.identityNumber}</p>
                            </div>
                          </>
                        )}
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> Instansi
                          </span>
                          <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedReg.institution}</p>
                        </div>
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Contact */}
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">Kontak</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900">{selectedReg.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900">{selectedReg.whatsapp}</span>
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Payment */}
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5" /> Pembayaran
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Referensi</span>
                        <span className="text-xs font-mono font-bold text-slate-900">{selectedReg.paymentReference || '—'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Biaya</span>
                        <span className="text-base font-black text-astro-cyan">
                          Rp {selectedReg.paymentAmount.toLocaleString('id-ID')}
                        </span>
                      </div>
                      {selectedReg.paymentMethod && (
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Metode</span>
                          <span className="text-sm text-slate-900 capitalize">{selectedReg.paymentMethod}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" /> Didaftarkan
                        </span>
                        <span className="text-xs text-slate-600">
                          {selectedReg.createdAt ? new Date(selectedReg.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </span>
                      </div>
                    </div>

                    {/* CTA for pending */}
                    {selectedReg.paymentStatus === 'pending' && (
                      <div className="pt-2">
                        <button
                          onClick={() => { setSelectedReg(null); router.push(`/register/${selectedReg.competitionId}?regId=${selectedReg.id}`); }}
                          className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs tracking-wider uppercase transition-all cursor-pointer"
                          style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                        >
                          <CreditCard className="w-4 h-4" /> Lanjutkan Pembayaran
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
