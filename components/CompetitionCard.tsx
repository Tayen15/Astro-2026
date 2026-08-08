'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Users, Coins, CalendarDays, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Competition, CategoryType } from '@/types/astro';

const categoryConfig: Record<CategoryType, { color: string; bg: string; border: string; label: string }> = {
  akademik: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'AKADEMIK' },
  olahraga: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', label: 'OLAHRAGA' },
  esports: { color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200', label: 'ESPORTS' },
};

function toIdr(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

interface Props {
  competition: Competition;
  index: number;
}

export default function CompetitionCard({ competition, index }: Props) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const cat = categoryConfig[competition.category] || categoryConfig.akademik;
  const ratio = Math.min((competition.filledSlots / competition.maxSlots) * 100, 100);
  const left = competition.maxSlots - competition.filledSlots;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] as const }}
      whileHover={reduce ? {} : { y: -4 }}
      className="group bg-white border border-slate-200/80 hover:border-astro-cyan/40 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
      style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
    >
      {/* Top angular corner accent per category — torn-corner notch */}
      <div className="relative">
        <div
          className={`absolute -top-[1px] -left-[1px] w-8 h-8 ${
            competition.category === 'akademik' ? 'bg-emerald-500' : competition.category === 'olahraga' ? 'bg-orange-500' : 'bg-cyan-500'
          }`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        />
      </div>

      <div className="p-5 md:p-6 flex flex-col gap-3">
        {/* Top row: badge + slots */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex flex-wrap items-center gap-1">
            <span className={`text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 ${cat.bg} ${cat.color} ${cat.border} border`}
              style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
            >
              {cat.label}
            </span>
            <span className="text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200"
              style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
            >
              {competition.origin === 'external' ? 'Eksternal' : 'Internal'}
            </span>
          </div>
          <span className={`text-[10px] font-bold tracking-wide flex-shrink-0 ${left <= 5 ? 'text-red-650' : 'text-slate-550'}`}>
            {left > 0 ? `SISA ${left} SLOT` : 'PENUH'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg font-black text-slate-900 uppercase leading-tight tracking-tight">
          {competition.title}
        </h3>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed -mt-1">
          {competition.tagline}
        </p>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mt-1">
          <span className="flex items-center gap-1.5">
            <Coins className="w-3 h-3 text-cyan-600" />
            {toIdr(competition.fee)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-cyan-600" />
            {competition.location}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-3 h-3 text-cyan-600" />
            {formatDate(competition.scheduleDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-cyan-600" />
            {competition.filledSlots}/{competition.maxSlots}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${ratio}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            className={`h-full rounded-full ${competition.category === 'akademik' ? 'bg-emerald-500' : competition.category === 'olahraga' ? 'bg-orange-500' : 'bg-cyan-500'}`}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-1">
          <Link
            href={`/competitions/${competition.id}`}
            className="flex-1 py-2.5 text-[10px] font-bold tracking-[0.1em] uppercase text-slate-655 border border-slate-200 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 ease-in-out cursor-pointer text-center block"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
          >
            Detail
          </Link>
          <button
            onClick={() => router.push(`/register/${competition.id}`)}
            className="flex-1 py-2.5 text-[10px] font-black tracking-[0.1em] uppercase text-slate-950 bg-astro-cyan hover:bg-cyan-400 text-center transition-all duration-200 ease-in-out active:scale-95 cursor-pointer"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
          >
            Daftar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
