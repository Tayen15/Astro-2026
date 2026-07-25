'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { Winner } from '@/data/announcementData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  competitionTitle: string;
  category: string;
  type: string | null;
  winners: {
    first: Winner[];
    second: Winner[];
    third: Winner[];
  };
  prizes: {
    first?: string | null;
    second?: string | null;
    third?: string | null;
  };
}

export default function WinnersModal({ isOpen, onClose, competitionTitle, category, type, winners, prizes }: Props) {
  const isTeam = type === 'team';

  // For team competitions show only the first entry (team name)
  const firstWinners = isTeam ? winners.first.slice(0, 1) : winners.first;
  const secondWinners = isTeam ? winners.second.slice(0, 1) : winners.second;
  const thirdWinners = isTeam ? winners.third.slice(0, 1) : winners.third;

  const categoryColor =
    category === 'akademik' ? 'bg-emerald-500' :
    category === 'olahraga' ? 'bg-orange-500' : 'bg-cyan-500';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Top accent bar */}
            <div className={`h-1 w-full ${categoryColor}`} />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>

            <div className="p-6 md:p-8 pb-6">
              {/* ── Header ── */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  {isTeam ? 'TIM' : 'INDIVIDU'}
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                  {competitionTitle}
                </h2>
              </div>

              {/* ── Podium Area ── */}
              <div className="relative w-full max-w-[500px] mx-auto mb-6">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="/assets/Tangga-Juara.png"
                    alt="Podium Juara"
                    fill
                    className="object-contain"
                    priority
                  />

                  {/* Juara 1 - highest step */}
                  <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[70%] text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-lg md:text-2xl mb-0.5">🏆</span>
                      {firstWinners.map((w, i) => (
                        <span key={i} className="text-sm md:text-base font-black text-slate-900 drop-shadow-sm leading-tight">
                          {w.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Juara 2 - left step */}
                  <div className="absolute bottom-[22%] left-[5%] w-[28%] text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-base md:text-lg mb-0.5">🥈</span>
                      {secondWinners.map((w, i) => (
                        <span key={i} className="text-[11px] md:text-sm font-bold text-slate-800 leading-tight">
                          {w.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Juara 3 - right step */}
                  <div className="absolute bottom-[22%] right-[5%] w-[28%] text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-base md:text-lg mb-0.5">🥉</span>
                      {thirdWinners.map((w, i) => (
                        <span key={i} className="text-[11px] md:text-sm font-bold text-amber-900 leading-tight">
                          {w.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Prize Details — per row ── */}
              {(prizes.first || prizes.second || prizes.third) && (
                <div className="border-t border-slate-100 pt-5 mt-2 space-y-2.5">
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider text-center mb-3">Hadiah</h3>

                  {prizes.first && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <span className="text-lg">🥇</span>
                      <span className="text-sm font-bold text-amber-900">{prizes.first}</span>
                    </div>
                  )}
                  {prizes.second && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-lg">🥈</span>
                      <span className="text-sm font-bold text-slate-700">{prizes.second}</span>
                    </div>
                  )}
                  {prizes.third && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-amber-50/50 border border-amber-100/50 rounded-xl">
                      <span className="text-lg">🥉</span>
                      <span className="text-sm font-bold text-amber-800">{prizes.third}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
