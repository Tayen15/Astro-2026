'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { Users } from 'lucide-react';
import { COMMITTEE_DIVISIONS } from '@/data/committeeData';
import { CommitteeMember } from '@/types/committee';

const MotionImage = motion.create(Image);

export default function CommitteeSection() {
  const reduce = useReducedMotion();
  const [activeDivision, setActiveDivision] = useState<string>(COMMITTEE_DIVISIONS[0].slug);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const allMembers: (CommitteeMember & { divisionName: string; slug: string })[] = COMMITTEE_DIVISIONS.flatMap((div) =>
    div.members.map((m) => ({ ...m, divisionName: div.name, slug: div.slug }))
  );

  const filteredMembers = allMembers.filter((m) => m.slug === activeDivision);
  const currentDivision = COMMITTEE_DIVISIONS.find((d) => d.slug === activeDivision)!;

  const toggleHover = useCallback((id: string | null) => {
    setHoveredId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-sky-100 via-sky-200 to-sky-100 text-slate-900">
      {/* Ambient Sky Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-cyan-300/30 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-300/40 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Floating Decorative Clouds */}
      <MotionImage
        src="/assets/cloud.png"
        alt=""
        width={320}
        height={220}
        animate={reduce ? undefined : { x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[4%] -left-10 w-72 md:w-96 h-auto opacity-75 pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/cloud.png"
        alt=""
        width={350}
        height={240}
        animate={reduce ? undefined : { x: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[12%] -right-12 w-80 md:w-[420px] h-auto opacity-70 pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/awan1.png"
        alt=""
        width={180}
        height={140}
        animate={reduce ? undefined : { x: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[10%] left-[2%] w-24 md:w-40 h-auto opacity-75 pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/awan2.png"
        alt=""
        width={200}
        height={160}
        animate={reduce ? undefined : { x: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[15%] right-[2%] w-28 md:w-48 h-auto opacity-70 pointer-events-none select-none z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-3">
            <div className="accent-line" />
          </div>
          <h2 className="font-masterpiece text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-tight mb-3">
            Our <span className="text-astro-cyan">Committee</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Tim panitia penggerak ASTRO 2026 yang bekerja keras untuk kesuksesan acara ini.
          </p>
        </div>

        {/* ── Filter Pills ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {COMMITTEE_DIVISIONS.map((div) => {
            const isActive = activeDivision === div.slug;
            return (
              <button
                key={div.id}
                onClick={() => setActiveDivision(div.slug)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-lg shadow-black/5 ring-1 ring-slate-200'
                    : 'bg-white/40 text-slate-600 hover:bg-white/70 hover:text-slate-800 ring-1 ring-transparent'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-astro-cyan' : 'bg-slate-300'}`} />
                {div.name.split(' ')[0]}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-sky-50 text-astro-cyan' : 'bg-white/40 text-slate-400'
                }`}>
                  {div.staffCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Division Label ── */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px bg-slate-200/60 flex-1 max-w-24" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            {currentDivision.name}
          </span>
          <div className="h-px bg-slate-200/60 flex-1 max-w-24" />
        </div>

        {/* ── 3-Column Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredMembers.map((member, index) => {
            const isRevealed = hoveredId === member.id;
            return (
              <motion.div
                key={member.id}
                initial={reduce ? undefined : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
                className="group"
                onMouseEnter={() => setHoveredId(member.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => toggleHover(member.id)}
              >
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-md transition-all duration-300 ring-1 ring-white/80 cursor-pointer">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Always-visible role badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                      member.isLeader
                        ? 'bg-amber-400 text-amber-950 shadow-sm'
                        : 'bg-white/80 text-slate-700 backdrop-blur-sm ring-1 ring-white'
                    }`}>
                      {member.isLeader ? 'Koordinator' : 'Staf'}
                    </span>
                  </div>

                  {/* Overlay on hover/tap */}
                  <AnimatePresence>
                    {isRevealed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent backdrop-blur-[2px]"
                      >
                        <div className="p-4 md:p-5">
                          <h3 className="text-sm md:text-base font-bold text-white leading-tight drop-shadow-sm">
                            {member.name}
                          </h3>
                          <p className="text-xs text-white/80 mt-0.5 font-medium drop-shadow-sm">
                            {member.role}
                          </p>

                          {member.quote && (
                            <p className="text-xs text-white/60 italic mt-2 leading-relaxed line-clamp-2 drop-shadow-sm">
                              &ldquo;{member.quote}&rdquo;
                            </p>
                          )}

                          {(member.instagram || member.linkedin) && (
                            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/20">
                              {member.instagram && (
                                <span className="text-[10px] font-medium text-white/60 truncate">
                                  @{member.instagram}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Total Count ── */}
        <div className="flex justify-center mt-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/50 backdrop-blur-xl rounded-xl ring-1 ring-white/80 shadow-sm">
            <Users className="w-4 h-4 text-astro-cyan" />
            <span className="text-xs font-semibold text-slate-600">
              {filteredMembers.length} Anggota — {currentDivision.name}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
