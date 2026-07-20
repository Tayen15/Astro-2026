'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Search } from 'lucide-react';
import type { Competition, CategoryType } from '@/types/astro';
import CompetitionCard from './CompetitionCard';

interface Props {
  competitions: Competition[];
}

const CATEGORIES: { label: string; value: CategoryType | 'all' }[] = [
  { label: 'SEMUA', value: 'all' },
  { label: 'AKADEMIK', value: 'akademik' },
  { label: 'OLAHRAGA', value: 'olahraga' },
  { label: 'ESPORTS', value: 'esports' },
];

export default function CompetitionSection({ competitions }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const reduce = useReducedMotion();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return competitions.filter((c) => {
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      const matchQ = !q || c.title.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [competitions, selectedCategory, searchQuery]);

  return (
    <section id="competitions" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 -z-10" />
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-astro-cyan/2 blur-[150px] rounded-full -z-10" />

      {/* Diagonal transition */}
      <div className="absolute top-0 left-0 right-0 h-24 -z-10">
        <svg viewBox="0 0 1440 96" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
          <polygon points="1440,0 0,96 1440,96" fill="var(--color-deep-slate)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 md:pt-20 pb-20 md:pb-28">
        {/* Section Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="accent-line mb-3" />
            <h2 className="text-display text-slate-900">
              Pilih<br />
              <span className="text-astro-cyan">Lombamu</span>
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
            Tersedia berbagai cabang lomba seru dari tiga kategori berbeda.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="CARI LOMBA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 text-xs font-bold tracking-wider text-slate-850 placeholder:text-slate-455 uppercase focus:outline-none focus:border-astro-cyan transition-colors"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-astro-cyan text-slate-950 shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-slate-50'
                }`}
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${selectedCategory}-${searchQuery}`}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.map((c, i) => (
                <CompetitionCard key={c.id} competition={c} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border border-slate-200 bg-white shadow-sm"
              style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
            >
              <p className="text-slate-600 text-lg font-black uppercase tracking-wider">Tidak Ditemukan</p>
              <p className="text-slate-450 text-sm mt-1">Coba kata kunci atau filter lain.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
