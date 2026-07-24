'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Search } from 'lucide-react';
import type { Competition, CategoryType } from '@/types/astro';
import CompetitionCard from './CompetitionCard';

const MotionImage = motion.create(Image);

interface Props {
  competitions: Competition[];
}

export default function AboutSection({ competitions }: Props) {
  const reduce = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');

  // Derive categories dynamically from competition data
  const categoryMap = useMemo(() => {
    const map = new Map<CategoryType, string>();
    competitions.forEach((c) => {
      if (!map.has(c.category)) {
        // Capitalize label
        const label = c.category.charAt(0).toUpperCase() + c.category.slice(1);
        map.set(c.category, label);
      }
    });
    return map;
  }, [competitions]);

  const CATEGORIES: { label: string; value: CategoryType | 'all' }[] = useMemo(
    () => [
      { label: 'SEMUA', value: 'all' as const },
      ...Array.from(categoryMap.entries()).map(([value, label]) => ({ label, value })),
    ],
    [categoryMap]
  );

  const categoryOrder = useMemo(() => Array.from(categoryMap.keys()), [categoryMap]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return competitions
      .filter((c) => {
        const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
        const matchQ = !q || c.title.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q);
        return matchCat && matchQ;
      })
      .sort((a, b) => {
        const catDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
        if (catDiff !== 0) return catDiff;
        return a.title.localeCompare(b.title);
      });
  }, [competitions, selectedCategory, searchQuery]);

  return (
    <section id="competitions" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background — seamless transition from Hero's sky fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/80 via-white to-white -z-10" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/2 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/2 blur-[120px] rounded-full pointer-events-none" />

      {/* ─── FLOATING BLOB ROUND IMAGES ─── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={112}
          height={112}
          className="absolute top-[2%] right-[2%] w-12 h-12 md:w-40 md:h-40 md:top-[8%] md:right-[12%] object-contain pointer-events-none select-none z-10"
        />
      </motion.div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={96}
          height={96}
          className="absolute top-[30%] left-[1%] w-12 h-12 md:w-36 md:h-36 md:top-[35%] md:left-[2%] object-contain pointer-events-none select-none z-10"
        />
      </motion.div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={64}
          height={64}
          className="absolute top-[60%] right-[1%] w-10 h-10 md:w-24 md:h-24 md:top-[55%] md:right-[3%] object-contain pointer-events-none select-none z-10"
        />
      </motion.div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={80}
          height={80}
          className="absolute bottom-[2%] left-[2%] w-10 h-10 md:w-32 md:h-32 md:bottom-[10%] md:left-[10%] object-contain pointer-events-none select-none z-10"
        />
      </motion.div>

      {/* ─── EARTH DECORATIVE ─── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[5%] right-[5%] md:top-[12%] md:right-[4%] z-10 pointer-events-none select-none"
      >
        <MotionImage
          src="/assets/earth.png"
          alt=""
          width={280}
          height={280}
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-15 h-15 md:w-[280px] md:h-[280px] object-contain"
        />
      </motion.div>

      {/* ─── AWAN DECORATIVE ─── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[32%] left-[1%] md:top-[12%] md:left-[3%] z-10 pointer-events-none select-none"
      >
        <MotionImage
          src="/assets/awan1.png"
          alt=""
          width={160}
          height={160}
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 md:w-[160px] md:h-[160px] object-contain"
        />
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-[8%] right-[1%] md:bottom-[15%] md:right-[3%] z-10 pointer-events-none select-none"
      >
        <MotionImage
          src="/assets/awan2.png"
          alt=""
          width={200}
          height={200}
          animate={{ x: [0, -12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 md:w-[200px] md:h-[200px] object-contain"
        />
      </motion.div>

      <div className="relative z-30 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Pilih Lombamu */}
        <div>
          {/* Title — rata kiri */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="accent-line mb-3" />
              <h2 className="font-masterpiece text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-tight">
                Pilih<br />
                <span className="text-astro-cyan">Lombamu</span>
              </h2>
              <p className="text-sm text-slate-600 mt-2">Tersedia berbagai cabang lomba seru dari tiga kategori berbeda.</p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
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
                <button key={cat.value} onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat.value ? 'bg-astro-cyan text-slate-950 shadow-sm' : 'bg-white border border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Competition Grid */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div key={`${selectedCategory}-${searchQuery}`}
                className="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              >
                {filtered.map((c, i) => (
                  <CompetitionCard key={c.id} competition={c} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 border border-slate-200 bg-white shadow-sm rounded-2xl"
              >
                <p className="text-slate-600 text-base font-black uppercase tracking-wider">Tidak Ditemukan</p>
                <p className="text-slate-450 text-sm mt-1">Coba kata kunci atau filter lain.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
