'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, ExternalLink, Users, Sparkles, ShieldCheck, Award } from 'lucide-react';
import { COMMITTEE_DIVISIONS } from '@/data/committeeData';
import { CommitteeDivision } from '@/types/committee';

const MotionImage = motion.create(Image);

export default function CommitteeSection() {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = COMMITTEE_DIVISIONS.length;
  const currentDivision: CommitteeDivision = COMMITTEE_DIVISIONS[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 text-slate-900">
      {/* Ambient Sky Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] bg-cyan-300/40 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-300/40 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* ─── FLOATING DECORATIVE CLOUDS (Matching AboutSection / HeroSection) ─── */}
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

      {/* ─── FLOATING BLOB ROUND IMAGES ─── */}
      <MotionImage
        src="/assets/blob-round.png"
        alt=""
        width={112}
        height={112}
        animate={reduce ? undefined : { y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] right-[8%] w-14 h-14 md:w-28 md:h-28 object-contain pointer-events-none select-none z-0 opacity-80"
      />
      <MotionImage
        src="/assets/blob-round.png"
        alt=""
        width={96}
        height={96}
        animate={reduce ? undefined : { y: [0, 15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[12%] left-[6%] w-12 h-12 md:w-24 md:h-24 object-contain pointer-events-none select-none z-0 opacity-80"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header (Identical accent-line & masterpiece typography) ── */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-3">
            <div className="accent-line" />
          </div>
          <h2 className="font-masterpiece text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-tight mb-3">
            Our <span className="text-astro-cyan">Committee</span>
          </h2>
          <p className="text-sm md:text-base text-slate-700 font-bold max-w-xl mx-auto leading-relaxed">
            Tim panitia penggerak ASTRO 2026. Pilih divisi untuk melihat koordinator dan jajaran staf di setiap bidang.
          </p>
        </div>

        {/* ── Frosted Glass Division Navigation Tabs ── */}
        <div className="mb-10 flex justify-center">
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-3 pt-1 px-2 no-scrollbar max-w-full">
            {COMMITTEE_DIVISIONS.map((div, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={div.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`px-4 md:px-5 py-2.5 text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer select-none whitespace-nowrap backdrop-blur-xl ${isActive
                      ? 'bg-astro-cyan text-slate-950 shadow-lg shadow-cyan-500/30 scale-105 z-10 border border-cyan-200'
                      : 'bg-white/40 text-slate-800 border border-white/80 hover:bg-white/70 hover:text-slate-950 shadow-sm'
                    }`}
                  style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-slate-950' : 'bg-sky-600'}`} />
                    <span>{div.name.split(' ')[0]}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 ${isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-white/50 text-slate-800'
                      }`}
                      style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                    >
                      {div.staffCount}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active Division Header Info ── */}
        <div className="text-center mb-8 min-h-[60px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDivision.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              <div
                className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 px-4 py-1 mb-2 shadow-sm"
                style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
              >
                <ShieldCheck className="w-4 h-4 text-cyan-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  {currentDivision.name}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 bg-astro-cyan text-slate-950">
                  {currentDivision.staffCount} ANGGOTA
                </span>
              </div>

              <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <span>{currentDivision.leader.name}</span>
                <span
                  className="text-xs font-extrabold px-3 py-1 bg-amber-400 text-slate-950 shadow-sm"
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                >
                  {currentDivision.leader.role}
                </span>
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── PARALLELOGRAM 3D COVERFLOW CAROUSEL (High-End Frosted Glassmorphism Cards) ── */}
        <div
          ref={containerRef}
          className="relative h-[440px] md:h-[510px] flex items-center justify-center perspective-[1200px] overflow-visible py-4"
        >
          {COMMITTEE_DIVISIONS.map((division, idx) => {
            let offset = idx - activeIndex;
            if (offset < -Math.floor(total / 2)) offset += total;
            if (offset > Math.floor(total / 2)) offset -= total;

            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            // 3D placement parameters
            const rotateY = offset * -22;
            const translateX = offset * 210;
            const translateZ = -Math.abs(offset) * 150;
            const scale = isActive ? 1.05 : Math.max(0.75, 1 - Math.abs(offset) * 0.15);
            const opacity = isActive ? 1 : Math.max(0.5, 0.95 - Math.abs(offset) * 0.25);
            const zIndex = 30 - Math.abs(offset) * 10;

            return (
              <motion.div
                key={division.id}
                onClick={() => setActiveIndex(idx)}
                initial={false}
                animate={{
                  rotateY: rotateY,
                  x: translateX,
                  z: translateZ,
                  scale: scale,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute cursor-pointer select-none"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* ── FROSTED GLASS PARALLELOGRAM CARD (Glassmorphism & Refraction Sheen) ── */}
                <div
                  className={`group relative w-[250px] sm:w-[290px] md:w-[325px] h-[380px] md:h-[455px] backdrop-blur-2xl transition-all duration-500 flex flex-col justify-between p-4 md:p-5 rounded-3xl overflow-hidden ${isActive
                      ? 'bg-white/60 border-2 border-white shadow-[0_20px_50px_rgba(6,182,212,0.3)] ring-2 ring-astro-cyan/80'
                      : 'bg-white/40 border border-white/70 hover:bg-white/55 hover:border-white shadow-lg'
                    }`}
                  style={{ clipPath: 'polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%)' }}
                >
                  {/* Glass Refraction Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/35 to-transparent pointer-events-none" />

                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between z-10 mb-2 relative">
                    <span
                      className="text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 bg-white/80 backdrop-blur-md text-cyan-800 border border-white"
                      style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                    >
                      {division.slug.toUpperCase()}
                    </span>
                    <span
                      className="text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 bg-amber-400/90 backdrop-blur-md text-slate-950 border border-amber-300 flex items-center gap-1 shadow-sm"
                      style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                    >
                      <Users className="w-3 h-3 text-slate-950" />
                      {division.members.length} Panitia
                    </span>
                  </div>

                  {/* Center: Photo of Division Head in Parallelogram Frame */}
                  <div
                    className="relative flex-1 w-full overflow-hidden bg-slate-900 border border-white/60 my-1 group-hover:border-astro-cyan transition-colors rounded-xl"
                    style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
                  >
                    <Image
                      src={division.leader.image}
                      alt={division.leader.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 290px, 325px"
                      priority={isActive}
                    />

                    {/* Gradient Overlay for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                    {/* Photo Info Overlay at Bottom */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="text-base md:text-lg font-black text-white leading-tight">
                        {division.leader.name}
                      </h4>
                      <p className="text-[11px] text-slate-200 font-semibold">
                        {division.leader.role}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Area */}
                  <div className="mt-2 pt-2 border-t border-white/30 relative z-10">
                    {isActive ? (
                      <Link
                        href={`/panitia?division=${division.slug}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-astro-cyan hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95"
                        style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                      >
                        <span>Lihat Anggota Divisi</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => setActiveIndex(idx)}
                        className="w-full py-2 text-[10px] font-bold tracking-[0.1em] uppercase text-slate-800 bg-white/50 hover:bg-white/80 hover:text-slate-950 border border-white/80 transition-all text-center"
                        style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                      >
                        Pilih Divisi
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── PARALLELOGRAM NAVIGATION CONTROLS (Glassmorphic Buttons) ── */}
        <div className="flex items-center justify-center gap-5 mt-6">
          {/* Previous Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Panitia Sebelumnya"
            className="px-5 py-2.5 bg-white/60 backdrop-blur-xl border border-white/80 text-slate-800 hover:text-slate-950 hover:bg-white flex items-center justify-center shadow-md transition-all duration-200 active:scale-95 cursor-pointer group"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
          >
            <span className="flex items-center gap-1 font-bold text-xs uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>PREV</span>
            </span>
          </button>

          {/* Division Indicator Pills */}
          <div className="flex items-center gap-2">
            {COMMITTEE_DIVISIONS.map((div, i) => (
              <button
                key={div.id}
                onClick={() => setActiveIndex(i)}
                className={`h-2.5 transition-all duration-300 cursor-pointer ${i === activeIndex
                    ? 'w-8 bg-astro-cyan shadow-md'
                    : 'w-2.5 bg-white/60 hover:bg-white'
                  }`}
                style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                title={div.name}
              />
            ))}
          </div>

          {/* Next Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Panitia Selanjutnya"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black flex items-center justify-center shadow-md transition-all duration-200 active:scale-95 cursor-pointer group"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
          >
            <span className="flex items-center gap-1 text-xs uppercase tracking-wider">
              <span>NEXT</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>

       

      </div>
    </section>
  );
}
