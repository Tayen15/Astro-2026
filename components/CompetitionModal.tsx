'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  X,
  Trophy,
  BookOpen,
  Info,
  CalendarDays,
  MapPin,
  DollarSign,
  Users,
  FileText,
  MessageCircle,
} from 'lucide-react';
import type { Competition } from '@/types/astro';

type Tab = 'overview' | 'prizes' | 'rules';

interface Props {
  competition: Competition | null;
  onClose: () => void;
  onRegister: (c: Competition) => void;
}

export default function CompetitionModal({ competition, onClose, onRegister }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = competition ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [competition]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (competition) setActiveTab('overview');
  }, [competition]);

  if (!competition) return null;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <Info className="w-4 h-4" /> },
    { key: 'prizes', label: 'Hadiah', icon: <Trophy className="w-4 h-4" /> },
    { key: 'rules', label: 'Rulebook', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      {competition && (
        <motion.div
          key={competition.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Detail ${competition.title}`}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all duration-200 ease-in-out cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-6 md:p-8 pb-4 border-b border-slate-100">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${
                competition.category === 'akademik'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : competition.category === 'olahraga'
                  ? 'bg-orange-50 border border-orange-200 text-orange-700'
                  : 'bg-purple-50 border border-purple-200 text-purple-700'
              }`}>
                {competition.category === 'akademik' ? 'Akademik' : competition.category === 'olahraga' ? 'Olahraga' : 'Esports'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">{competition.title}</h2>
              <p className="text-slate-500 italic mt-1">{competition.tagline}</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-6 md:px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out border-b-2 cursor-pointer ${
                    activeTab === tab.key
                      ? 'text-cyan-600 border-cyan-600'
                      : 'text-slate-500 border-transparent hover:text-slate-850'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <p className="text-slate-700 leading-relaxed">{competition.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 border border-slate-100/60 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-slate-550 text-xs mb-1">
                          <DollarSign className="w-3.5 h-3.5 text-cyan-600" /> Biaya Pendaftaran
                        </div>
                        <div className="text-slate-900 font-semibold">Rp {competition.fee.toLocaleString('id-ID')}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-100/60 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-slate-550 text-xs mb-1">
                          <CalendarDays className="w-3.5 h-3.5 text-cyan-600" /> Jadwal
                        </div>
                        <div className="text-slate-900 font-semibold">
                          {new Date(competition.scheduleDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-100/60 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-slate-550 text-xs mb-1">
                          <MapPin className="w-3.5 h-3.5 text-cyan-600" /> Lokasi
                        </div>
                        <div className="text-slate-900 font-semibold">{competition.location}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-100/60 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-slate-550 text-xs mb-1">
                          <Users className="w-3.5 h-3.5 text-cyan-600" /> Kuota
                        </div>
                        <div className="text-slate-900 font-semibold">{competition.filledSlots}/{competition.maxSlots} Terisi</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'prizes' && (
                  <motion.div
                    key="prizes"
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {[
                      { rank: 'Juara 1', prize: competition.prizes.first, color: 'text-amber-700 bg-amber-50 border-amber-200' },
                      { rank: 'Juara 2', prize: competition.prizes.second, color: 'text-slate-700 bg-slate-100 border-slate-200' },
                      { rank: 'Juara 3', prize: competition.prizes.third, color: 'text-amber-850 bg-amber-50/80 border-amber-200' },
                    ].map((item) => (
                      <div key={item.rank} className="flex items-center gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <span className={`p-2 rounded-lg border ${item.color}`}>
                          <Trophy className="w-5 h-5" />
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-slate-500">{item.rank}</div>
                          <div className="text-slate-900 font-bold">{item.prize}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'rules' && (
                  <motion.div
                    key="rules"
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <ul className="space-y-2.5">
                      {competition.rulesSummary.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-700">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-50 border border-cyan-200/50 text-cyan-700 text-xs flex items-center justify-center font-bold mt-0.5">
                            {idx + 1}
                          </span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <a href={competition.rulebookUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 hover:border-cyan-500 text-slate-700 hover:text-slate-950 font-medium rounded-xl text-sm transition-all duration-200 ease-in-out hover:bg-slate-50">
                        <FileText className="w-4 h-4" /> Baca Rulebook Lengkap
                      </a>
                      <a href={`https://wa.me/${competition.contactPerson.whatsapp}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-slate-950 font-medium rounded-xl text-sm transition-all duration-200 ease-in-out hover:bg-slate-50">
                        <MessageCircle className="w-4 h-4" /> Hubungi {competition.contactPerson.name}
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <button
                onClick={() => onRegister(competition)}
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-base transition-all duration-200 ease-in-out shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95 cursor-pointer"
              >
                Daftar {competition.title}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
