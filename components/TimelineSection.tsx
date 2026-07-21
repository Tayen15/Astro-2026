'use client';

import Image from 'next/image';
import { Fragment } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CalendarDays } from 'lucide-react';
import type { TimelineItem } from '@/types/astro';

interface Props {
  timeline: TimelineItem[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function TimelineSection({ timeline }: Props) {
  const reduce = useReducedMotion();

  return (
    <section id="timeline" className="relative py-20 md:py-28 overflow-x-hidden">
      {/* Background — starts white (connects Competition), gently introduces sky toward bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-sky-50 to-sky-100 -z-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/3 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[15%] left-0 w-[200px] h-[2px] bg-gradient-to-r from-slate-200/40 to-transparent skew-x-[-12deg] pointer-events-none" />
      <div className="absolute bottom-[20%] right-0 w-[150px] h-[2px] bg-gradient-to-l from-slate-200/30 to-transparent skew-x-[12deg] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14 md:mb-16"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-3">
            <div className="accent-line" />
          </div>
          <h2 className="font-masterpiece text-5xl md:text-6xl lg:text-7xl text-slate-900 mb-3 leading-tight">
            Timeline <span className="text-astro-cyan">Event</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-light leading-relaxed">
            Catat tanggal penting ASTRO 2026 agar tidak terlewat!
          </p>
        </motion.div>

        {/* ─── TIMELINE ─── */}
        <div className="relative">
          {/* ── Vertical Line (absolute, straight for perfect alignment) ── */}
          {/* Desktop: Centered horizontally at exactly 50% */}
          <div
            className="absolute top-0 bottom-0 w-[3px] z-0 hidden md:block left-1/2 -translate-x-1/2"
            style={{
              background: 'linear-gradient(to bottom, #06B6D4, #0f172a, #e2e8f0)',
            }}
          />
          {/* Mobile: Centered horizontally at the center of the first 52px column (26px) */}
          <div
            className="absolute top-0 bottom-0 w-[3px] z-0 md:hidden left-[26px] -translate-x-1/2"
            style={{
              background: 'linear-gradient(to bottom, #06B6D4, #0f172a, #e2e8f0)',
            }}
          />

          {/* ── Mobile Layout ── */}
          <div className="md:hidden">
            <div className="grid grid-cols-[52px_1fr] gap-x-3 gap-y-12">
              {timeline.map((item, idx) => (
                <Fragment key={`mobile-${idx}`}>
                  {/* Diamond node */}
                  <motion.div
                    custom={idx}
                    variants={reduce ? undefined : itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex justify-center items-start pt-5 z-10"
                  >
                    <div
                      className="w-5 h-5 bg-cyan-500 ring-4 ring-cyan-500/20"
                      style={{ clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}
                    />
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    custom={idx}
                    variants={reduce ? undefined : itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <CardContent item={item} align="left" />
                  </motion.div>
                </Fragment>
              ))}
            </div>
          </div>

          {/* ── Desktop Layout ── */}
          <div className="hidden md:block">
            <div className="grid grid-cols-[1fr_52px_1fr] gap-x-6">
              {timeline.map((item, idx) => (
                <Fragment key={`desktop-${idx}`}>
                  {/* Column 1: Card for even items, empty for odd */}
                  <motion.div
                    custom={idx}
                    variants={reduce ? undefined : itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    {idx % 2 === 0 ? (
                      <div className="flex justify-end">
                        <CardContent item={item} align="right" />
                      </div>
                    ) : (
                      <div />
                    )}
                  </motion.div>

                  {/* Column 2: Diamond node */}
                  <motion.div
                    custom={idx}
                    variants={reduce ? undefined : itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex justify-center items-start pt-5 z-10"
                  >
                    <div
                      className="w-5 h-5 bg-cyan-500 ring-4 ring-cyan-500/20"
                      style={{ clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}
                    />
                  </motion.div>

                  {/* Column 3: Card for odd items, empty for even */}
                  <motion.div
                    custom={idx}
                    variants={reduce ? undefined : itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    {idx % 2 !== 0 ? (
                      <CardContent item={item} align="left" />
                    ) : (
                      <div />
                    )}
                  </motion.div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── DECORATIVE BLOBS (behind content) ─── */}
      <Image
        src="/assets/blob-round.png"
        alt=""
        width={112}
        height={112}
        className="absolute top-[8%] right-[12%] w-28 h-28 md:w-40 md:h-40 object-contain pointer-events-none select-none z-0"
      />
      <Image
        src="/assets/blob-round.png"
        alt=""
        width={96}
        height={96}
        className="absolute top-[35%] left-[2%] w-24 h-24 md:w-36 md:h-36 object-contain pointer-events-none select-none z-0"
      />
      <Image
        src="/assets/blob-round.png"
        alt=""
        width={64}
        height={64}
        className="absolute top-[55%] right-[3%] w-16 h-16 md:w-24 md:h-24 object-contain pointer-events-none select-none z-0"
      />
      <Image
        src="/assets/blob-round.png"
        alt=""
        width={80}
        height={80}
        className="absolute bottom-[10%] left-[10%] w-20 h-20 md:w-32 md:h-32 object-contain pointer-events-none select-none z-0"
      />

      {/* Train image — slide down from top, behind content */}
      <motion.div
        initial={reduce ? false : { y: -350, opacity: 0 }}
        whileInView={{ y: 200, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-[-8%] top-[0%] w-[80%] max-w-[950px] pointer-events-none select-none z-0"
      >
        <Image
          src="/assets/train-subway.png"
          alt="Train Subway ASTRO 2026"
          width={3606}
          height={870}
          className="w-full h-auto"
          priority
        />
      </motion.div>

      {/* Diagonal bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
          <polygon points="0,64 1440,0 1440,64" fill="white" />
        </svg>
      </div>
    </section>
  );
}

/* ── Card Content Sub-component ── */
function CardContent({ item, align }: { item: TimelineItem; align: 'left' | 'right' }) {
  return (
    <div
      className={`bg-white border border-slate-200 hover:border-cyan-500/40 transition-all duration-200 w-full max-w-md relative ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
      style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
    >
      <div
        className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-cyan-500"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />

      <div className="p-5 md:p-6">
        {/* Date badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${
            align === 'right' ? 'float-right ml-auto' : ''
          } bg-cyan-50 border-cyan-200 text-cyan-700`}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        >
          <CalendarDays className="w-3 h-3" />
          {item.date}
        </div>

        <div className="clear-both" />

        <h3
          className={`text-base md:text-lg font-black text-slate-900 uppercase tracking-tight mt-3 mb-1 ${
            align === 'right' ? 'text-right' : 'text-left'
          }`}
        >
          {item.title}
        </h3>

        {/* Accent line */}
        <div
          className={`w-6 h-[2px] bg-cyan-500 mb-2 ${
            align === 'right' ? 'ml-auto' : 'mr-auto'
          }`}
          style={{ clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }}
        />

        <p
          className={`text-sm text-slate-600 leading-relaxed ${
            align === 'right' ? 'text-right' : 'text-left'
          }`}
        >
          {item.desc}
        </p>
      </div>
    </div>
  );
}
