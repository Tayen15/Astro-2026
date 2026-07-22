'use client';

import astroData from '@/data/astro-data.json';
import type { AstroData } from '@/types/astro';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterSection from './RegisterSection';
import {
  Trophy,
  CalendarDays,
  MapPin,
  DollarSign,
  Users,
  ArrowLeft,
  FileText,
  MessageCircle,
} from 'lucide-react';

const data = astroData as AstroData;
const MotionImage = motion.create(Image);

const categoryConfig = {
  akademik: {
    label: 'AKADEMIK',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accent: 'bg-emerald-500',
    accentLight: 'bg-emerald-500/10',
    dot: 'bg-emerald-500',
    iconBg: 'bg-emerald-50 text-emerald-600',
    iconBorder: 'border-emerald-200',
  },
  olahraga: {
    label: 'OLAHRAGA',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    accent: 'bg-orange-500',
    accentLight: 'bg-orange-500/10',
    dot: 'bg-orange-500',
    iconBg: 'bg-orange-50 text-orange-600',
    iconBorder: 'border-orange-200',
  },
  esports: {
    label: 'ESPORTS',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    accent: 'bg-cyan-500',
    accentLight: 'bg-cyan-500/10',
    dot: 'bg-cyan-500',
    iconBg: 'bg-cyan-50 text-cyan-600',
    iconBorder: 'border-cyan-200',
  },
} as const;

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const fadeUpLight = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function CompetitionDetailPage() {
  const reduce = useReducedMotion();
  const params = useParams();
  const id = params.id as string;
  const competition = data.competitions.find((c) => c.id === id);

  if (!competition) {
    notFound();
  }

  const cat =
    categoryConfig[competition.category as keyof typeof categoryConfig] ||
    categoryConfig.akademik;
  const leftSlots = competition.maxSlots - competition.filledSlots;
  const ratio = Math.min(
    (competition.filledSlots / competition.maxSlots) * 100,
    100,
  );

  /* ─── Floating blobs — reusable preset ─── */
  const blobs = [
    { src: '/assets/blob-round.png', w: 112, h: 112, className: 'absolute top-[6%] -left-[2%] w-14 h-14 md:w-28 md:h-28 object-contain pointer-events-none select-none z-0', dur: 7, delay: 0 },
    { src: '/assets/blob-round.png', w: 96, h: 96, className: 'absolute top-[12%] -right-[2%] w-12 h-12 md:w-24 md:h-24 object-contain pointer-events-none select-none z-0', dur: 9, delay: 0.15 },
    { src: '/assets/blob-round.png', w: 80, h: 80, className: 'absolute bottom-[18%] left-[4%] w-10 h-10 md:w-20 md:h-20 object-contain pointer-events-none select-none z-0', dur: 6, delay: 0.3 },
    { src: '/assets/blob-round.png', w: 128, h: 128, className: 'absolute bottom-[8%] right-[3%] w-16 h-16 md:w-32 md:h-32 object-contain pointer-events-none select-none z-0', dur: 10, delay: 0.1 },
  ];

  const infoCards = [
    {
      icon: DollarSign,
      label: 'Biaya Pendaftaran',
      value: `Rp ${competition.fee.toLocaleString('id-ID')}`,
    },
    {
      icon: CalendarDays,
      label: 'Jadwal Pelaksanaan',
      value: new Date(competition.scheduleDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    },
    {
      icon: MapPin,
      label: 'Lokasi Venue',
      value: competition.location,
    },
    {
      icon: Users,
      label: 'Kuota Peserta',
      value: `${competition.filledSlots} / ${competition.maxSlots} Terisi`,
      sub: leftSlots > 0 ? `Sisa ${leftSlots} slot` : 'Penuh',
      isLow: leftSlots <= 5,
      ratio,
    },
  ];

  const prizes = [
    {
      rank: 'Juara 1',
      prize: competition.prizes.first,
      style: 'border-amber-200 bg-amber-50/40',
      accentLine: 'bg-amber-500',
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      rank: 'Juara 2',
      prize: competition.prizes.second,
      style: 'border-slate-200 bg-slate-50/40',
      accentLine: 'bg-slate-400',
      iconColor: 'text-slate-500 bg-slate-50 border-slate-200',
    },
    {
      rank: 'Juara 3',
      prize: competition.prizes.third,
      style: 'border-amber-200/60 bg-amber-50/20',
      accentLine: 'bg-amber-700',
      iconColor: 'text-amber-800 bg-amber-50 border-amber-200/60',
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col justify-between bg-white">
        <main className="flex-grow">
          {/* ════════════════════════════════════════
              1. HERO
              ════════════════════════════════════════ */}
          <section className="relative min-h-[80svh] flex flex-col justify-center pt-36 pb-20 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 md:pt-40 md:pb-28 overflow-hidden">

            {/* ─── FLOATING BLOBS ─── */}
            {blobs.map((b, i) => (
              <MotionImage
                key={`blob-hero-${i}`}
                src={b.src}
                alt=""
                width={b.w}
                height={b.h}
                animate={reduce ? undefined : { y: [0, -14, 0] }}
                transition={{
                  duration: b.dur,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: b.delay,
                }}
                className={b.className}
              />
            ))}

            {/* ─── FLOATING CLOUDS ─── */}
            <MotionImage
              src="/assets/awan1.png"
              alt=""
              width={160}
              height={120}
              animate={reduce ? undefined : { x: [0, 15, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[10%] left-[2%] w-16 h-auto md:w-40 md:h-auto object-contain pointer-events-none select-none z-0 opacity-40"
            />
            <MotionImage
              src="/assets/awan2.png"
              alt=""
              width={200}
              height={140}
              animate={reduce ? undefined : { x: [0, -12, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[30%] right-[3%] w-20 h-auto md:w-48 md:h-auto object-contain pointer-events-none select-none z-0 opacity-35"
            />

            {/* ─── HERO CONTENT ─── */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="w-full lg:w-3/4">
                {/* Back link */}
                <motion.div
                  variants={reduce ? undefined : fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <Link
                    href="/#competitions"
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-500 hover:text-cyan-600 transition-colors group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                    Kembali ke Lomba
                  </Link>
                </motion.div>

                {/* Category badge */}
                <motion.div
                  variants={reduce ? undefined : fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 }}
                  className="mb-5"
                >
                  <span
                    className={`inline-flex items-center px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase ${cat.bg} ${cat.color} ${cat.border} border`}
                    style={{
                      clipPath:
                        'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
                    }}
                  >
                    {cat.label}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={reduce ? undefined : fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-display mb-4 bg-gradient-to-r from-sky-900 via-cyan-800 to-slate-800 bg-clip-text text-transparent"
                >
                  {competition.title}
                </motion.h1>

                {/* Tagline */}
                {competition.tagline && (
                  <motion.p
                    variants={reduce ? undefined : fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-base md:text-lg text-slate-700 font-light mb-6"
                  >
                    {competition.tagline}
                  </motion.p>
                )}

                {/* Accent line */}
                <motion.div
                  variants={reduce ? undefined : fadeUpLight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="accent-line mb-6"
                />

                {/* Description */}
                <motion.div
                  variants={reduce ? undefined : fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                  className="text-sm md:text-base text-slate-600 leading-relaxed"
                >
                  <p>{competition.description}</p>
                </motion.div>
              </div>
            </div>

          </section>

          {/* ════════════════════════════════════════
              2. DETAILS
              ════════════════════════════════════════ */}
          <section className="relative bg-gradient-to-b from-sky-100 via-sky-50 to-white py-12 md:py-16 overflow-hidden">
            {/* Subtle floating blobs in details section */}
            <MotionImage
              src="/assets/blob-round.png"
              alt=""
              width={80}
              height={80}
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[8%] -left-[1%] w-10 h-10 md:w-20 md:h-20 object-contain pointer-events-none select-none z-0 opacity-30"
            />
            <MotionImage
              src="/assets/blob-round.png"
              alt=""
              width={96}
              height={96}
              animate={reduce ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[20%] -right-[1%] w-12 h-12 md:w-24 md:h-24 object-contain pointer-events-none select-none z-0 opacity-30"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                {/* ── LEFT COLUMN ── */}
                <div className="lg:col-span-7 space-y-12">
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {infoCards.map((card, idx) => (
                      <motion.div
                        key={card.label}
                        initial={
                          reduce ? false : { opacity: 0, y: 24 }
                        }
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: idx * 0.08,
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1] as const,
                        }}
                        className="bg-white border border-slate-200 p-5 flex items-start gap-4 transition-all hover:border-slate-300 group"
                        style={{
                          clipPath:
                            'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
                        }}
                      >
                        <div
                          className={`p-3 ${cat.iconBg} ${cat.iconBorder} border`}
                          style={{
                            clipPath:
                              'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)',
                          }}
                        >
                          <card.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                            {card.label}
                          </span>
                          <span className="block text-lg font-black text-slate-900 mt-1 truncate">
                            {card.value}
                          </span>
                          {/* Slot bar + sub text for Kuota card */}
                          {card.sub !== undefined && (
                            <>
                              <div className="w-full h-1 bg-slate-100 mt-2">
                                <div
                                  className={`h-full ${cat.accent} transition-all duration-700`}
                                  style={{ width: `${card.ratio}%` }}
                                />
                              </div>
                              <span
                                className={`block text-[10px] font-bold uppercase tracking-wider mt-1 ${
                                  card.isLow
                                    ? 'text-red-600'
                                    : 'text-slate-500'
                                }`}
                              >
                                {card.sub}
                              </span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* ── Prizes ── */}
                  <div className="space-y-6">
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                      className="flex items-center gap-3"
                    >
                      <div className="accent-line" />
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                        Hadiah Pemenang
                      </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {prizes.map((item, idx) => (
                        <motion.div
                          key={item.rank}
                          initial={
                            reduce ? false : { opacity: 0, y: 20 }
                          }
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: idx * 0.1,
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1] as const,
                          }}
                          className="bg-white border border-slate-200 p-5 transition-all hover:border-slate-300 group"
                          style={{
                            clipPath:
                              'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                          }}
                        >
                          {/* Top accent */}
                          <div
                            className={`h-1 w-8 ${item.accentLine} mb-4`}
                            style={{
                              clipPath:
                                'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)',
                            }}
                          />
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 border ${item.iconColor}`}
                              style={{
                                clipPath:
                                  'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)',
                              }}
                            >
                              <Trophy className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                                {item.rank}
                              </div>
                              <div className="text-sm font-black text-slate-900 mt-0.5">
                                {item.prize}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: Rules ── */}
                <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-slate-200 lg:pl-10">
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                    className="flex items-center gap-3"
                  >
                    <div className="accent-line" />
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                      Peraturan Lomba
                    </h2>
                  </motion.div>

                  <ul className="space-y-4">
                    {competition.rulesSummary.map((rule, idx) => (
                      <motion.li
                        key={idx}
                        initial={reduce ? false : { opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: idx * 0.06,
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1] as const,
                        }}
                        className="flex items-start gap-4 text-sm md:text-base"
                      >
                        <span
                          className={`flex-shrink-0 w-7 h-7 text-xs flex items-center justify-center font-black ${cat.iconBg} ${cat.iconBorder} border`}
                          style={{
                            clipPath:
                              'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)',
                          }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="leading-relaxed text-slate-600">
                          {rule}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════
              3. CTA
              ════════════════════════════════════════ */}
          <section className="relative bg-gradient-to-b from-white via-sky-50 to-slate-50 py-16 md:py-20 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-astro-cyan/3 blur-[120px] rounded-full pointer-events-none" />

            {/* Floating decor in CTA */}
            <MotionImage
              src="/assets/blob-round.png"
              alt=""
              width={100}
              height={100}
              animate={reduce ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[12%] left-[4%] w-14 h-14 md:w-28 md:h-28 object-contain pointer-events-none select-none z-0 opacity-25"
            />
            <MotionImage
              src="/assets/blob-round.png"
              alt=""
              width={120}
              height={120}
              animate={reduce ? undefined : { y: [0, -16, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[8%] right-[3%] w-16 h-16 md:w-32 md:h-32 object-contain pointer-events-none select-none z-0 opacity-25"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="max-w-xl mx-auto space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                  Siap untuk Berkompetisi?
                </h2>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed font-light">
                  Daftarkan tim Anda sekarang sebelum kuota penuh. Pastikan Anda
                  telah membaca dan memahami rulebook perlombaan.
                </p>
                {/* Accent line centered */}
                <div className="flex justify-center">
                  <div className="accent-line" />
                </div>
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="flex flex-col items-center gap-6"
              >
                <RegisterSection competition={competition} />

                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center max-w-md">
                  <a
                    href={competition.rulebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3.5 border border-slate-300 hover:border-astro-cyan text-slate-700 hover:text-cyan-700 hover:bg-white font-bold text-xs tracking-wider uppercase transition-all duration-200 w-full sm:w-1/2 cursor-pointer"
                    style={{
                      clipPath:
                        'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                    }}
                  >
                    <FileText className="w-4 h-4" /> Baca Rulebook
                  </a>
                  <a
                    href={`https://wa.me/${competition.contactPerson.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3.5 border border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 hover:bg-white font-bold text-xs tracking-wider uppercase transition-all duration-200 w-full sm:w-1/2 cursor-pointer"
                    style={{
                      clipPath:
                        'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                    }}
                  >
                    <MessageCircle className="w-4 h-4" /> Hubungi CP
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Diagonal transition */}
            <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
              <svg
                viewBox="0 0 1440 64"
                preserveAspectRatio="none"
                className="w-full h-full"
                aria-hidden="true"
              >
                <polygon points="0,64 1440,0 1440,64" fill="white" />
              </svg>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
