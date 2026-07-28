'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Heart, FileText, ExternalLink, Users, Medal, Download, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertItem {
  name: string;
  url: string;
}

interface RegistrationWinner {
  id: string;
  type: string;
  fullName: string | null;
  teamName: string | null;
  leaderName: string | null;
  email: string;
  winnerRank: string | null;
  certificates: CertItem[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  competitionTitle: string;
  category: string;
  type: string | null;
  winners: RegistrationWinner[];
  certHolders: RegistrationWinner[];
}

function CertModal({
  allCerts,
  onClose,
}: {
  allCerts: { name: string; certs: CertItem[]; rank?: string }[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 25 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[210] max-h-[80vh] overflow-y-auto"
      >
        <button onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-all cursor-pointer">
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Sertifikat</h3>
              <p className="text-[11px] text-slate-500">Unduh sertifikat peserta lomba ini.</p>
            </div>
          </div>

          <div className="space-y-3">
            {allCerts.map((group, gi) => (
              <div key={gi}>
                {group.rank && (
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    {group.rank}
                  </div>
                )}
                <div className="text-xs font-bold text-slate-800 mb-1.5">{group.name}</div>
                <div className="space-y-1.5 pl-2">
                  {group.certs.map((c, ci) => (
                    <a key={ci} href={c.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-astro-cyan hover:bg-cyan-50/30 transition-all rounded-xl group/cert"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-slate-400 group-hover/cert:text-astro-cyan flex-shrink-0" />
                        <span className="text-[12px] font-bold text-slate-700 group-hover/cert:text-slate-900 truncate">
                          {c.name}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/cert:text-astro-cyan flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {allCerts.length === 0 && (
            <div className="text-center py-10 text-sm text-slate-400 italic">
              Belum ada sertifikat yang diupload.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function WinnersModal({
  isOpen,
  onClose,
  competitionTitle,
  category,
  winners,
  certHolders,
}: Props) {
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        zIndex: 200,
      });

      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) { clearInterval(interval); return; }
        const particleCount = 40 * (timeLeft / duration);

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#2563eb', '#3b82f6', '#f59e0b', '#06b6d4', '#ec4899', '#ffffff'],
          zIndex: 200,
        });
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#2563eb', '#3b82f6', '#f59e0b', '#06b6d4', '#ec4899', '#ffffff'],
          zIndex: 200,
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const grouped = {
    '1': winners.filter((w) => w.winnerRank === '1'),
    '2': winners.filter((w) => w.winnerRank === '2'),
    '3': winners.filter((w) => w.winnerRank === '3'),
  };

  const getWinnerName = (w: RegistrationWinner) =>
    w.fullName || w.teamName || w.leaderName || 'Peserta';

  const categoryFormatted =
    category === 'akademik' ? 'Akademik & Sains' :
    category === 'olahraga' ? 'Olahraga' :
    category === 'esports' ? 'Esports & Gaming' : category;

  // Collect all certificates for the cert modal
  const allCertGroups = [
    ...(grouped['1'].length > 0 ? [{ name: 'Juara 1', certs: grouped['1'].flatMap((w) => w.certificates || []), rank: '🥇 Juara 1' }] : []),
    ...(grouped['2'].length > 0 ? [{ name: 'Juara 2', certs: grouped['2'].flatMap((w) => w.certificates || []), rank: '🥈 Juara 2' }] : []),
    ...(grouped['3'].length > 0 ? [{ name: 'Juara 3', certs: grouped['3'].flatMap((w) => w.certificates || []), rank: '🥉 Juara 3' }] : []),
    ...certHolders.map((ch) => ({
      name: getWinnerName(ch),
      certs: ch.certificates || [],
      rank: undefined as string | undefined,
    })),
  ].filter((g) => g.certs.length > 0);

  const totalCerts = allCertGroups.reduce((sum, g) => sum + g.certs.length, 0);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pt-20 sm:pt-24 pb-8 px-4 sm:px-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-slate-950/65 backdrop-blur-md"
              onClick={onClose}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 25 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden z-[105] my-auto border border-slate-100 flex flex-col max-h-[calc(100vh-120px)] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-30 w-9 h-9 flex items-center justify-center bg-slate-100/90 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-full transition-all cursor-pointer shadow-sm"
                aria-label="Tutup modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8 md:p-10 relative bg-gradient-to-b from-blue-50/50 via-white to-white">

                {/* Header & Trophy */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                  <div className="flex-1 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-full text-xs font-black uppercase tracking-wider mb-3">
                      <span className="text-sm">📢</span> PENGUMUMAN JUARA
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                      Selamat kepada <br className="hidden sm:inline" />
                      <span className="text-blue-600">Para Pemenang!</span>
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-2.5 max-w-xl leading-relaxed">
                      Terima kasih kepada seluruh peserta yang telah berpartisipasi dan menunjukkan karya terbaiknya.
                    </p>
                  </div>
                  <div className="relative flex-shrink-0 flex items-center justify-center pt-2 md:pt-0">
                    <div className="absolute w-44 h-44 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52">
                      <Image src="/assets/piala.png" alt="Piala Pemenang" fill className="object-contain drop-shadow-xl" priority />
                    </div>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/40 border border-blue-100/60 rounded-2xl p-3.5 md:p-4 mb-8">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nama Lomba</span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-800 truncate block">{competitionTitle}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Medal className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kategori</span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-800 truncate block">{categoryFormatted}</span>
                    </div>
                  </div>
                </div>

                {/* Podium Cards — No certificate links inside */}
                {winners.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-end mb-6 pt-4">
                    {/* Juara 2 */}
                    {grouped['2'].length > 0 && (
                      <div className="relative bg-slate-50/70 border border-blue-100/80 rounded-2xl pt-10 pb-5 px-4 text-center flex flex-col justify-between h-full min-h-[180px] shadow-xs">
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 drop-shadow-md">
                          <Image src="/assets/medali2.png" alt="Medali Juara 2" fill className="object-contain" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Juara 2</span>
                          {grouped['2'].map((w, i) => (
                            <h3 key={w.id} className="text-base sm:text-lg font-black text-slate-900 leading-snug">{getWinnerName(w)}</h3>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Juara 1 */}
                    {grouped['1'].length > 0 && (
                      <div className="relative bg-gradient-to-b from-amber-50/80 to-amber-100/40 border-2 border-amber-300 rounded-2xl pt-11 pb-6 px-4 text-center flex flex-col justify-between h-full min-h-[200px] shadow-md ring-4 ring-amber-400/10 md:-translate-y-1">
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-16 h-16 drop-shadow-lg">
                          <Image src="/assets/medali1.png" alt="Medali Juara 1" fill className="object-contain" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-amber-700 uppercase tracking-widest block mb-1">Juara 1</span>
                          {grouped['1'].map((w, i) => (
                            <h3 key={w.id} className="text-lg sm:text-xl font-black text-slate-900 leading-snug">{getWinnerName(w)}</h3>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Juara 3 */}
                    {grouped['3'].length > 0 && (
                      <div className="relative bg-orange-50/30 border border-orange-200/80 rounded-2xl pt-10 pb-5 px-4 text-center flex flex-col justify-between h-full min-h-[180px] shadow-xs">
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 drop-shadow-md">
                          <Image src="/assets/medali3.png" alt="Medali Juara 3" fill className="object-contain" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-amber-900/70 uppercase tracking-wider block mb-1">Juara 3</span>
                          {grouped['3'].map((w, i) => (
                            <h3 key={w.id} className="text-base sm:text-lg font-black text-slate-900 leading-snug">{getWinnerName(w)}</h3>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tombol Dapatkan Sertifikat — di paling bawah */}
                {totalCerts > 0 && (
                  <div className="pt-4 pb-2 border-t border-slate-200">
                    <button
                      onClick={() => setShowCertModal(true)}
                      className="w-full group flex items-center justify-between px-6 py-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-200/60 hover:border-cyan-300 rounded-xl transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                          <Download className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-black text-slate-900 uppercase tracking-tight block">Dapatkan Sertifikat</span>
                          <span className="text-[11px] text-slate-500">{totalCerts} sertifikat tersedia</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-astro-cyan group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center pt-4 text-xs sm:text-sm font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                  <Heart className="w-4 h-4 text-blue-500 fill-blue-500" />
                  <span>Teruslah berkarya dan sampai jumpa di kompetisi berikutnya!</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sub-modal Sertifikat */}
      <AnimatePresence>
        {showCertModal && (
          <CertModal
            allCerts={allCertGroups}
            onClose={() => setShowCertModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
