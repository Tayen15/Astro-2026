'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import WinnersModal from './WinnersModal';
import { apiHelpers } from '@/src/lib/api';

type CategoryType = 'akademik' | 'olahraga' | 'esports';

interface CompetitionItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  type: string | null;
  hasWinners: boolean;
}

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

const categoryConfig: Record<string, { label: string; color: string; bg: string; border: string; accent: string }> = {
  akademik: { label: 'AKADEMIK', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'bg-emerald-500' },
  olahraga: { label: 'OLAHRAGA', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', accent: 'bg-orange-500' },
  esports: { label: 'ESPORTS', color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200', accent: 'bg-cyan-500' },
};

const CATEGORIES: { label: string; value: CategoryType | 'all' }[] = [
  { label: 'SEMUA', value: 'all' },
  { label: 'AKADEMIK', value: 'akademik' },
  { label: 'OLAHRAGA', value: 'olahraga' },
  { label: 'ESPORTS', value: 'esports' },
];

export default function PengumumanClient({
  competitions,
}: {
  competitions: CompetitionItem[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [modalData, setModalData] = useState<{
    competition: CompetitionItem;
    winners: RegistrationWinner[];
    certHolders: RegistrationWinner[];
    prizes: { label: string; value: string }[];
  } | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return competitions
      .filter((c) => {
        const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
        const matchQ = !q || c.title.toLowerCase().includes(q) || c.tagline?.toLowerCase().includes(q);
        return matchCat && matchQ;
      })
      .sort((a, b) => {
        // Winners first, then by category
        if (a.hasWinners !== b.hasWinners) return a.hasWinners ? -1 : 1;
        const order = ['akademik', 'olahraga', 'esports'];
        return order.indexOf(a.category) - order.indexOf(b.category);
      });
  }, [competitions, selectedCategory, searchQuery]);

  const openModal = async (comp: CompetitionItem) => {
    setModalOpen(comp.id);
    setLoadingModal(true);
    try {
      const json = await apiHelpers.registrations.winners(comp.id);
      setModalData({
        competition: comp,
        winners: json.winners || [],
        certHolders: json.certHolders || [],
        prizes: json.winners?.[0]?.prizes || [],
      });
    } catch {
      toast.error('Gagal memuat data pemenang');
      setModalOpen(null);
    } finally {
      setLoadingModal(false);
    }
  };

  const closeModal = () => {
    setModalOpen(null);
    setModalData(null);
  };

  return (
    <section className="relative min-h-screen pt-24 md:pt-32 pb-20 overflow-hidden bg-gradient-to-b from-sky-100 via-sky-200 to-white text-slate-900">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-300/30 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sky-300/30 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="accent-line" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-masterpiece text-5xl md:text-6xl lg:text-7xl text-slate-900 leading-tight mb-3"
          >
            Pengumuman
            <br />
            <span className="text-astro-cyan">Pemenang</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm md:text-base text-slate-600 max-w-lg mx-auto leading-relaxed"
          >
            Selamat kepada para pemenang di setiap cabang lomba ASTRO 2026!
          </motion.p>
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-10"
        >
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="CARI LOMBA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 text-xs font-bold tracking-wider text-slate-900 placeholder:text-slate-400 uppercase focus:outline-none focus:border-astro-cyan transition-colors"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-astro-cyan text-slate-950 shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {filtered.length} LOMBA DITEMUKAN
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-[10px] font-bold text-astro-cyan hover:text-cyan-600 underline underline-offset-2 cursor-pointer"
            >
              Reset filter
            </button>
          )}
        </motion.div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((comp, index) => {
              const cat = categoryConfig[comp.category] || categoryConfig.akademik;
              const isTeam = comp.type === 'team';

              return (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
                  className="group bg-white border border-slate-200/80 hover:border-astro-cyan/40 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
                  style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                >
                  {/* Corner accent */}
                  <div className="relative">
                    <div
                      className={`absolute -top-[1px] -left-[1px] w-8 h-8 ${cat.accent}`}
                      style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
                    />
                  </div>

                  <div className="p-5 md:p-6 flex flex-col gap-3">
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 ${cat.bg} ${cat.color} ${cat.border} border`}
                        style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                      >
                        {cat.label}
                      </span>
                      <span className={`text-[10px] font-bold tracking-wide ${isTeam ? 'text-blue-600' : 'text-slate-500'}`}>
                        {isTeam ? 'TIM' : 'INDIVIDU'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base md:text-lg font-black text-slate-900 uppercase leading-tight tracking-tight">
                      {comp.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed -mt-1">
                      {comp.tagline}
                    </p>

                    {/* Action */}
                    <div className="mt-2">
                      {comp.hasWinners ? (
                        <button
                          onClick={() => openModal(comp)}
                          disabled={loadingModal && modalOpen === comp.id}
                          className="w-full py-2.5 text-[10px] font-black tracking-[0.1em] uppercase text-slate-950 bg-astro-cyan hover:bg-cyan-400 transition-all duration-200 ease-in-out active:scale-95 cursor-pointer text-center block disabled:opacity-50"
                          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            {loadingModal && modalOpen === comp.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                            Lihat Juara
                          </span>
                        </button>
                      ) : (
                        <div
                          className="w-full py-2.5 text-[10px] font-bold tracking-[0.1em] uppercase text-slate-400 bg-slate-50 border border-slate-100 text-center"
                          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                        >
                          Belum Ada
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-base font-black text-slate-700 uppercase tracking-wider">Tidak Ditemukan</p>
            <p className="text-sm text-slate-500 mt-1">Coba kata kunci atau filter lain.</p>
          </motion.div>
        )}

        {/* Modal */}
        {modalOpen && modalData && !loadingModal && (
          <WinnersModal
            isOpen={true}
            onClose={closeModal}
            competitionTitle={modalData.competition.title}
            category={modalData.competition.category}
            type={modalData.competition.type}
            winners={modalData.winners}
            certHolders={modalData.certHolders}
            prizes={modalData.prizes}
          />
        )}
      </div>
    </section>
  );
}
