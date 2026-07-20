'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import type { EventConfig } from '@/types/astro';
import CountdownTimer from './CountdownTimer';

interface Props {
  eventConfig: EventConfig;
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function HeroSection({ eventConfig }: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        {/* Top glow */}
        <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-astro-violet/5 via-astro-cyan/3 to-transparent blur-[120px] rounded-full" />
        {/* Side accents */}
        <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-astro-violet/3 blur-[140px] rounded-full" />
        <div className="absolute bottom-[20%] -left-[5%] w-[400px] h-[400px] bg-astro-cyan/3 blur-[100px] rounded-full" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        {/* Angular accent lines - VALORANT style */}
        <div className="absolute top-[15%] left-0 w-[200px] h-[2px] bg-gradient-to-r from-slate-200/40 to-transparent skew-x-[-12deg]" />
        <div className="absolute top-[25%] right-0 w-[150px] h-[2px] bg-gradient-to-l from-slate-200/30 to-transparent skew-x-[12deg]" />
        <div className="absolute bottom-[30%] left-[5%] w-[100px] h-[1px] bg-gradient-to-r from-slate-200/20 to-transparent skew-x-[-12deg]" />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center"
        variants={reduce ? undefined : stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow - small label above title */}
        <motion.div variants={fadeUp} className="mb-4 md:mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-cyan-200 bg-cyan-50 text-cyan-700 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-glow-pulse" />
            Pendaftaran Dibuka
          </span>
        </motion.div>

        {/* MASSIVE Title - VALORANT style */}
        <motion.h1 variants={fadeUp} className="text-massive text-white mb-4 md:mb-6">
          <span className="block bg-gradient-to-r from-slate-950 via-slate-800 to-cyan-600 bg-clip-text text-transparent">
            ASTRO
          </span>
          <span className="block text-astro-cyan" style={{ WebkitTextStroke: '2px rgba(6,182,212,0.4)' }}>
            2026
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          className="text-base sm:text-lg md:text-xl text-slate-600 font-light mb-2 tracking-wide"
        >
          {eventConfig.tagline}
        </motion.p>

        {/* Accent line */}
        <motion.div variants={fadeUp} className="flex justify-center mb-8 md:mb-10">
          <div className="accent-line-wide" />
        </motion.div>

        {/* Countdown */}
        <motion.div variants={fadeUp} className="mb-8 md:mb-10">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-600 mb-3 font-bold">
            Pendaftaran Ditutup Dalam
          </p>
          <CountdownTimer deadline={eventConfig.registrationDeadline} />
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => document.querySelector('#competitions')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-3.5 bg-astro-cyan hover:bg-cyan-400 text-slate-950 font-black text-sm tracking-wider uppercase transition-all duration-200 ease-in-out active:scale-95 cursor-pointer"
            style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
          >
            <span className="relative z-10">Lihat Lomba & Daftar</span>
          </button>
          <a
            href={eventConfig.generalJuknisUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 border border-slate-300 hover:border-astro-cyan text-slate-700 hover:text-cyan-655 hover:bg-slate-50/50 font-bold text-sm tracking-wider uppercase transition-all duration-200 ease-in-out cursor-pointer"
            style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
          >
            Unduh Juknis
          </a>
        </motion.div>
      </motion.div>

      {/* Diagonal bottom cut - VALORANT style */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 96" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
          <polygon points="0,96 1440,0 1440,96" fill="var(--color-surface-dark)" />
        </svg>
      </div>
    </section>
  );
}
