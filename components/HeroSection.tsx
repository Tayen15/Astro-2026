'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import type { EventConfig } from '@/types/astro';

const MotionImage = motion.create(Image);
import CountdownTimer from './CountdownTimer';

interface Props {
  eventConfig: EventConfig;
}

export default function HeroSection({ eventConfig }: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col items-center justify-start overflow-hidden pt-[18svh] md:pt-[15svh]"
    >
      {/* ─── SKY BACKGROUND ─── */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100" />

      {/* ─── CLOUD IMAGES ─── */}
      {/* Big cloud top-left */}
      <MotionImage
        src="/assets/cloud.png"
        alt=""
        width={288}
        height={200}
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[8%] -left-10 w-72 h-auto opacity-65 pointer-events-none select-none z-0"
      />

      {/* Big cloud top-right */}
      <MotionImage
        src="/assets/cloud.png"
        alt=""
        width={320}
        height={220}
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[15%] -right-16 w-80 h-auto opacity-55 pointer-events-none select-none z-0"
      />

      {/* Small cloud middle-left */}
      <MotionImage
        src="/assets/cloud.png"
        alt=""
        width={192}
        height={140}
        animate={{ x: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[45%] -left-8 w-48 h-auto opacity-45 pointer-events-none select-none z-0"
      />

      {/* Small cloud right */}
      <MotionImage
        src="/assets/cloud.png"
        alt=""
        width={160}
        height={120}
        animate={{ x: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[55%] -right-6 w-40 h-auto opacity-40 pointer-events-none select-none z-0"
      />

      {/* ─── CHROME BLOB SHAPE (static, large, edge-placed) ─── */}
      {/* Chrome blob - top right corner */}
      <Image
        src="/assets/chrome-blob-shape.png"
        alt=""
        width={448}
        height={560}
        sizes="(min-width: 768px) 28rem, 14rem"
        priority
        className="absolute -top-12 -right-12 w-56 h-56 md:w-[28rem] md:h-[28rem] object-contain pointer-events-none select-none z-0"
      />
      {/* Chrome blob - bottom left corner (below the fold on mobile; no priority) */}
      <Image
        src="/assets/chrome-blob-shape.png"
        alt=""
        width={512}
        height={640}
        sizes="(min-width: 768px) 32rem, 16rem"
        className="absolute -bottom-16 -left-16 w-64 h-64 md:w-[32rem] md:h-[32rem] object-contain pointer-events-none select-none z-0"
      />
      {/* Chrome blob - top left corner */}
      <Image
        src="/assets/chrome-blob-shape.png"
        alt=""
        width={352}
        height={440}
        sizes="(min-width: 768px) 22rem, 12rem"
        className="absolute -top-10 -left-10 w-48 h-48 md:w-[22rem] md:h-[22rem] object-contain pointer-events-none select-none z-0"
      />
      {/* Chrome blob - bottom right corner */}
      <Image
        src="/assets/chrome-blob-shape.png"
        alt=""
        width={384}
        height={480}
        sizes="(min-width: 768px) 24rem, 14rem"
        className="absolute -bottom-12 -right-12 w-56 h-56 md:w-[24rem] md:h-[24rem] object-contain pointer-events-none select-none z-0"
      />

      {/* ─── FLOATING BLOB ROUND IMAGES ─── */}
      <MotionImage
        src="/assets/blob-round.png"
        alt=""
        width={112}
        height={112}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] right-[8%] w-28 h-28 md:w-40 md:h-40 object-contain pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/blob-round.png"
        alt=""
        width={96}
        height={96}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[22%] left-[4%] w-24 h-24 md:w-36 md:h-36 object-contain pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/blob-round.png"
        alt=""
        width={64}
        height={64}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[38%] left-[16%] w-16 h-16 md:w-24 md:h-24 object-contain pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/blob-round.png"
        alt=""
        width={112}
        height={112}
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[15%] right-[4%] w-28 h-28 md:w-40 md:h-40 object-contain pointer-events-none select-none z-0"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center animate-hero-rise">
        {/* ─── MAIN TITLE (paints immediately, no JS gate) ─── */}
        <div className="mb-6 md:mb-0 md:-mt-6">
          <h1 className="text-massive mb-0">
            <span
              className="block bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(0,0,0,0.15)]"
              style={{
                textShadow: '0 2px 0 #cbd5e1, 0 4px 0 #94a3b8, 0 6px 0 #64748b, 0 8px 20px rgba(0,0,0,0.3)',
              }}
            >
              ASTRO
            </span>
            <span
              className="block bg-gradient-to-b from-slate-200 via-slate-500 to-slate-800 bg-clip-text text-transparent"
              style={{
                textShadow: '0 2px 0 #e2e8f0, 0 4px 0 #94a3b8, 0 6px 0 #475569, 0 8px 0 #1e293b, 0 12px 30px rgba(0,0,0,0.35)',
              }}
            >
              2026
            </span>
          </h1>

          {/* Tagline - Split Creative */}
          <p className="mt-6 font-masterpiece leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <span className="text-3xl sm:text-4xl md:text-5xl text-white/95 block">
              Where Innovation
            </span>
            <span className="text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 bg-clip-text text-transparent block -mt-1">
              Meets the Stars
            </span>
          </p>
        </div>

        {/* Accent line */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="w-24 h-[3px] bg-white/40 rounded-full" />
        </div>

        {/* Countdown - Glass Dashboard */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-8 md:mb-10"
        >
          <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 mb-4 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
            Pendaftaran Ditutup Dalam
          </p>
          <CountdownTimer deadline={eventConfig.registrationDeadline} />
        </motion.div>

        {/* CTA - Solid Parallelogram Buttons */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={() => document.querySelector('#competitions')?.scrollIntoView({ behavior: 'smooth' })}
            size="lg"
            className="skew-x-[-8deg] rounded-none border-2 border-sky-300 bg-sky-700 px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-[0_8px_30px_rgba(2,132,199,0.4)] hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-[0_12px_40px_rgba(2,132,199,0.5)] active:scale-95"
          >
            <span className="block skew-x-[8deg]">Lihat Lomba & Daftar</span>
          </Button>
          <Button
            asChild
            size="lg"
            className="skew-x-[-8deg] rounded-none border-2 border-slate-400 bg-slate-700 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:bg-slate-600 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] active:scale-95"
          >
            <a href={eventConfig.generalJuknisUrl} target="_blank" rel="noopener noreferrer">
              <span className="block skew-x-[8deg]">Unduh Juknis</span>
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Bottom gradient fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none bg-gradient-to-b from-transparent to-white" />

    </section>
  );
}
