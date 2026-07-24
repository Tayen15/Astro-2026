'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import {
  ArrowDown, ExternalLink, ArrowRight, Calendar,
  Globe, Mail, MessageCircle, Users, Star, MapPin,
  Sparkles, Award, ShieldCheck, Eye, Target,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommitteeSection from '@/components/CommitteeSection';
import EventGallerySection from '@/components/EventGallerySection';
import SocialMediaSection from '@/components/SocialMediaSection';

const MotionImage = motion.create(Image);

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ─── Counter ─── */
function Counter({ end, suffix = '', duration = 2200 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const inc = end / (duration / 16);
    const t = setInterval(() => {
      start += inc;
      if (start >= end) { setCount(end); clearInterval(t); } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [inView, end, duration]);
  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
}

/* ─── Glass Card ─── */
function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg shadow-black/5 ${className}`}>{children}</div>;
}

/* ─── Blobs & clouds ─── */
const blobs = [
  { src: '/assets/blob-round.png', w: 140, h: 140, className: 'absolute top-[5%] -left-[2%] w-20 h-20 md:w-36 md:h-36 object-contain pointer-events-none select-none z-0', dur: 7 },
  { src: '/assets/blob-round.png', w: 100, h: 100, className: 'absolute top-[10%] -right-[3%] w-14 h-14 md:w-28 md:h-28 object-contain pointer-events-none select-none z-0', dur: 9 },
  { src: '/assets/blob-round.png', w: 90, h: 90, className: 'absolute bottom-[20%] left-[3%] w-12 h-12 md:w-24 md:h-24 object-contain pointer-events-none select-none z-0', dur: 6 },
  { src: '/assets/blob-round.png', w: 160, h: 160, className: 'absolute bottom-[5%] -right-[2%] w-24 h-24 md:w-40 md:h-40 object-contain pointer-events-none select-none z-0', dur: 10 },
];
const clouds = [
  { src: '/assets/awan1.png', w: 200, h: 140, className: 'absolute top-[8%] left-[3%] w-20 h-auto md:w-44 md:h-auto object-contain pointer-events-none select-none z-0 opacity-30', dur: 10 },
  { src: '/assets/awan2.png', w: 240, h: 160, className: 'absolute top-[25%] right-[2%] w-24 h-auto md:w-52 md:h-auto object-contain pointer-events-none select-none z-0 opacity-25', dur: 12 },
];

/* ─── Journey ─── */
const journey = [
  { year: '2023', theme: 'First Step to The Stars', participants: 150, achievement: 'Pertama kali diselenggarakan dengan 4 cabang lomba' },
  { year: '2024', theme: 'Rising to The Stars', participants: 320, achievement: 'Bertambah 2 cabang lomba baru, menjangkau 15 universitas' },
  { year: '2025', theme: 'Beyond The Stars', participants: 500, achievement: 'Skala nasional dengan 8 cabang lomba dan 25+ universitas' },
  { year: '2026', theme: 'Where Innovation Meets The Stars', participants: 0, achievement: 'Edisi terbesar dengan inovasi dan dampak yang lebih luas' },
];

/* ─── Categories ─── */
const categories = [
  { name: 'Web Development', icon: '🖥️', desc: 'Bangun aplikasi web inovatif' },
  { name: 'UI/UX Design', icon: '🎨', desc: 'Ciptakan pengalaman digital' },
  { name: 'Mobile Development', icon: '📱', desc: 'Kembangkan aplikasi mobile' },
  { name: 'Data Science', icon: '📊', desc: 'Analisis data untuk solusi nyata' },
  { name: 'Cyber Security', icon: '🔐', desc: 'Uji keamanan sistem' },
];





/* ─── Committee ─── */
const committees = [
  { name: 'Ahmad Fauzi', role: 'Ketua Pelaksana' },
  { name: 'Siti Nurhaliza', role: 'Wakil Ketua' },
  { name: 'Rizky Pratama', role: 'Koor. Sponsorship' },
  { name: 'Dinda Permata', role: 'Koor. Humas' },
  { name: 'Bagas Wicaksono', role: 'Koor. Media' },
];

export default function ProfilePage() {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ════════════ 1. HERO — STATIC ════════════ */}
      <section className="relative h-screen flex flex-col justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 z-10" />
        </div>

        {/* Floating blobs */}
        {blobs.map((b, i) => (
          <MotionImage key={`bh-${i}`} src={b.src} alt="" width={b.w} height={b.h}
            animate={reduce ? undefined : { y: [0, -16 + (i % 3) * 4, 0], rotate: [0, i % 2 === 0 ? 5 : -5, 0] }}
            transition={{ duration: b.dur + 2, repeat: Infinity, ease: 'easeInOut' }} className={b.className} />
        ))}
        {clouds.map((c, i) => (
          <MotionImage key={`ch-${i}`} src={c.src} alt="" width={c.w} height={c.h}
            animate={reduce ? undefined : { x: [0, i === 0 ? 20 : -20, 0] }}
            transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut' }} className={c.className} />
        ))}

        {/* Content */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/30 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Star className="w-3 h-3" fill="currentColor" /> INNOVATION
          </motion.div>

          {/* Title */}
          <h1 className="font-masterpiece text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-4 drop-shadow-lg">
            THE NEXT <br />
            <span className="bg-gradient-to-r from-astro-cyan via-cyan-300 to-sky-200 bg-clip-text text-transparent">GENERATION</span>
          </h1>

          {/* Tagline */}
          <p className="text-sm md:text-base text-white/60 font-light max-w-xl mx-auto mb-2">
            A yearly technology competition that brings together innovators, creators, and technology enthusiasts to explore ideas beyond boundaries.
          </p>

          {/* CTA Buttons — parallelogram style */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="#about-event"
              className="group flex items-center gap-2 px-8 py-3.5 bg-astro-cyan text-slate-950 font-black text-xs tracking-wider uppercase skew-x-[-8deg] transition-all duration-200 hover:bg-cyan-400 hover:shadow-[0_12px_40px_rgba(0,188,212,0.4)] hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="block skew-x-[8deg] flex items-center gap-2"><ArrowDown className="w-4 h-4" /> Explore Now</span>
            </a>
            <a href="#contact"
              className="group flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold text-xs tracking-wider uppercase skew-x-[-8deg] transition-all duration-200 hover:bg-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="block skew-x-[8deg]">Contact Us</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* ════════════ 2. ABOUT ASTRO ════════════ */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 overflow-hidden">
        {/* Floating blobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
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
          initial={{ opacity: 0, y: 20 }}
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
          initial={{ opacity: 0, y: 20 }}
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
          initial={{ opacity: 0, y: 20 }}
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

        {/* Earth decorative */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
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

        {/* Awan decorative */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
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
          initial={{ opacity: 0, x: 60 }}
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
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* ── Left Column: Title, Desc, Key Features ── */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full">
              <div>
                <motion.div
                  initial={reduce ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="accent-line mb-3" />
                  <h2 className="font-masterpiece text-5xl md:text-6xl lg:text-7xl text-slate-900 leading-tight">
                    Tentang <br />
                    <span className="text-astro-cyan">ASTRO 2026</span>
                  </h2>
                </motion.div>

                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-sm md:text-base text-slate-650 mt-6 leading-relaxed font-normal max-w-2xl"
                >
                  ASTRO 2026 adalah ajang kompetisi dan kreativitas tahunan terbesar yang dirancang khusus untuk mewadahi minat, bakat, serta potensi generasi muda. Kami menyatukan tiga pilar utama yaitu kompetisi akademik, ketangkasan olahraga, dan ketajaman esports di bawah satu payung sportivitas yang kokoh.
                </motion.p>
              </div>

              {/* Key Features Grid */}
              <div className="mt-14 grid sm:grid-cols-2 gap-8 max-w-xl">
                {[
                  { icon: Sparkles, title: 'Multi-Disiplin Lomba', desc: 'Menggabungkan kategori akademik, olahraga, dan esports secara seimbang.' },
                  { icon: Award, title: 'Hadiah Fantastis', desc: 'Penghargaan resmi dan dana pembinaan bernilai jutaan rupiah untuk para pemenang.' },
                  { icon: ShieldCheck, title: 'Juri Profesional', desc: 'Sistem penilaian yang objektif, transparan, dan terpercaya oleh para ahli.' },
                  { icon: Users, title: 'Komunitas Pelajar', desc: 'Membangun jaringan relasi dan persahabatan positif antar peserta.' },
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={reduce ? false : { opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                      className="flex flex-col gap-3"
                    >
                      <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200/40 flex items-center justify-center text-astro-cyan flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{feature.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{feature.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ── Right Column: Visi & Misi Cards ── */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Visi Kami */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-astro-cyan flex items-center justify-center shrink-0">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Visi Kami</h3>
                  </div>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                    Menjadi wadah kolaboratif terbesar bagi generasi muda untuk mengeksplorasi potensi terbaik, menyatukan sportivitas kompetisi, kreativitas tanpa batas, dan keunggulan akademik.
                  </p>
                </div>
              </motion.div>

              {/* Misi Kami */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-astro-cyan flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Misi Kami</h3>
                  </div>
                  <ol className="space-y-4">
                    {[
                      'Menyelenggarakan kompetisi berkualitas tinggi yang adil, menantang, dan profesional.',
                      'Mendorong kolaborasi lintas bakat antara sains, olahraga, dan esports.',
                      'Mengembangkan karakter yang tangguh, berjiwa sportif, dan berorientasi pada prestasi.',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm text-slate-600 leading-relaxed">
                        <span className="w-6 h-6 rounded-full bg-astro-cyan/10 text-astro-cyan text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════ 4. ASTRO JOURNEY — ANCIENT PARCHMENT MAP ════════════ */}
      <section id="journey" className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-sky-200 via-amber-950/20 to-sky-300">
        {/* Floating bubbles */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full text-amber-900/80 text-[10px] font-black uppercase tracking-wider mb-4">
              <MapPin className="w-3 h-3" fill="currentColor" /> Ancient Route
            </div>
            <h2 className="font-masterpiece text-4xl md:text-5xl lg:text-6xl text-amber-900 drop-shadow-lg leading-tight mb-3">
              ASTRO <span className="text-amber-700">Journey</span>
            </h2>
            <p className="text-sm text-amber-800/60 max-w-xl mx-auto">
              Jejak perjalanan ASTRO dari masa ke masa. Klik setiap titik untuk melihat cerita dan dokumentasi lengkapnya.
            </p>
          </motion.div>

          {/* ── PARCHMENT MAP ── */}
          <div className="relative max-w-5xl mx-auto">
            {/* Parchment paper background — the map itself */}
            <div className="absolute inset-0 -m-3 md:-m-4 overflow-hidden pointer-events-none z-0">
              {/* Base parchment */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #fcd34d 60%, #fbbf24 100%)',
                opacity: 0.35,
              }} />
              {/* Paper texture overlay */}
              <div className="absolute inset-0 opacity-[0.12]" style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120,70,20,0.05) 2px, rgba(120,70,20,0.05) 3px),
                  repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(120,70,20,0.04) 3px, rgba(120,70,20,0.04) 4px)
                `,
              }} />
              {/* Age spots / staining */}
              <div className="absolute top-[10%] left-[5%] w-40 h-40 rounded-full bg-amber-600/10 blur-2xl" />
              <div className="absolute bottom-[15%] right-[8%] w-48 h-48 rounded-full bg-amber-700/10 blur-2xl" />
              <div className="absolute top-[50%] left-[40%] w-32 h-32 rounded-full bg-amber-600/8 blur-2xl" />
              {/* Burn / torn edge top */}
              <div className="absolute -top-1 left-0 right-0 h-6" style={{
                background: 'linear-gradient(180deg, rgba(180,100,30,0.3) 0%, transparent 100%)',
              }} />
              {/* Burn / torn edge bottom */}
              <div className="absolute -bottom-1 left-0 right-0 h-6" style={{
                background: 'linear-gradient(0deg, rgba(180,100,30,0.3) 0%, transparent 100%)',
              }} />
              {/* Fold lines — horizontal creases */}
              <div className="absolute top-1/3 left-0 right-0 h-px bg-amber-700/15" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-amber-700/15" />
              {/* Fold line — vertical center */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-amber-700/10" />
              {/* Torn edge decorations — irregular edges */}
              <div className="absolute top-0 left-0 right-0 h-2" style={{
                background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 8px, rgba(180,100,30,0.15) 8px, rgba(180,100,30,0.15) 10px, transparent 10px, transparent 18px)',
              }} />
              <div className="absolute bottom-0 left-0 right-0 h-2" style={{
                background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 5px, rgba(180,100,30,0.12) 5px, rgba(180,100,30,0.12) 7px, transparent 7px, transparent 15px)',
              }} />
              <div className="absolute top-0 left-0 bottom-0 w-2" style={{
                background: 'repeating-linear-gradient(180deg, transparent 0px, transparent 6px, rgba(180,100,30,0.12) 6px, rgba(180,100,30,0.12) 8px, transparent 8px, transparent 14px)',
              }} />
              <div className="absolute top-0 right-0 bottom-0 w-2" style={{
                background: 'repeating-linear-gradient(180deg, transparent 0px, transparent 7px, rgba(180,100,30,0.1) 7px, rgba(180,100,30,0.1) 9px, transparent 9px, transparent 16px)',
              }} />
            </div>

            {/* ── Glassmorphism wrapper over parchment ── */}
            <div className="relative bg-white/20 backdrop-blur-[2px] border border-white/40 shadow-2xl z-10" style={{ clipPath: 'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)' }}>

              {/* Decorative corner ornaments */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-700/30 z-20 pointer-events-none" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-700/30 z-20 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-700/30 z-20 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-700/30 z-20 pointer-events-none" />

              {/* Compass rose decoration */}
              <div className="absolute top-6 right-8 z-20 pointer-events-none opacity-30 hidden md:block">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 2L26 20L24 24L22 20L24 2Z" fill="#92400e" />
                  <path d="M24 46L22 28L24 24L26 28L24 46Z" fill="#92400e" />
                  <path d="M2 24L20 22L24 24L20 26L2 24Z" fill="#92400e" />
                  <path d="M46 24L28 26L24 24L28 22L46 24Z" fill="#92400e" />
                  <circle cx="24" cy="24" r="3" fill="none" stroke="#92400e" strokeWidth="1.5" />
                  <circle cx="24" cy="24" r="8" fill="none" stroke="#92400e" strokeWidth="0.5" opacity="0.5" />
                </svg>
              </div>

              {/* Title banner on map */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:block">
                <div className="px-5 py-1.5 bg-amber-800/20 backdrop-blur border border-amber-700/30" style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                  <span className="text-[10px] font-black text-amber-900/60 uppercase tracking-[0.3em]">The Astro Chronicles</span>
                </div>
              </div>

              {/* Map content */}
              <div className="relative p-6 md:p-8 lg:p-12 z-10">
                {/* Connecting route — old trade route style */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="xMidYMid meet">
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.5, ease: 'easeInOut' }}
                    d={journey.map((_, i) => {
                      const x = i % 2 === 0 ? 140 : 660;
                      const y = 90 + i * 170;
                      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                    className="drop-shadow-[0_0_4px_rgba(217,119,6,0.2)]"
                  />
                  {/* Route dots */}
                  {journey.map((_, i) => {
                    const x = i % 2 === 0 ? 140 : 660;
                    const y = 90 + i * 170;
                    return (
                      <motion.circle
                        key={`rd-${i}`}
                        cx={x} cy={y}
                        r="5"
                        fill="#d97706"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 + 1, duration: 0.3 }}
                        className="drop-shadow-[0_0_6px_rgba(217,119,6,0.4)]"
                      />
                    );
                  })}
                </svg>

                {/* Journey items */}
                {journey.map((j, idx) => {
                  const isLeft = idx % 2 === 0;
                  return (
                    <motion.a
                      key={j.year}
                      href={`/profile/journey/${j.year}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative flex flex-col md:flex-row items-start gap-5 md:gap-8 mb-10 md:mb-16 last:mb-0 group cursor-pointer z-10 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    >
                      {/* Parallelogram Marker */}
                      <div className="relative shrink-0 flex items-start justify-center w-full md:w-24 pt-1">
                        <div className={`hidden md:block absolute top-0 ${isLeft ? 'left-12' : 'right-12'} w-0.5 h-full bg-gradient-to-b from-amber-600/40 via-amber-600/15 to-transparent -z-10`} />
                        <div
                          className="relative w-24 h-10 bg-gradient-to-r from-amber-700 to-amber-800 border-2 border-amber-500/60 flex items-center justify-center text-amber-100 text-xs font-black shadow-lg shadow-amber-900/30 z-10"
                          style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                        >
                          {j.year}
                        </div>
                      </div>

                      {/* Parallelogram Card — glassmorphism */}
                      <div className="flex-1 w-full min-w-0">
                        <div
                          className="relative bg-white/30 backdrop-blur-xl border border-white/50 shadow-xl hover:bg-white/40 hover:border-white/70 transition-all duration-300"
                          style={{ clipPath: 'polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%)' }}
                        >
                          {/* Aged accent stripe */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-transparent opacity-70" />
                          {/* Glass shine */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

                          <div className="p-5 md:p-6 relative">
                            <div className="flex flex-wrap items-center gap-2.5 mb-2">
                              <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider">{j.theme}</span>
                              <span className="text-[9px] font-bold text-amber-800/50 uppercase tracking-wider flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {j.participants > 0 ? `${j.participants.toLocaleString()}+` : 'Coming Soon'}
                              </span>
                            </div>
                            <p className="text-xs md:text-sm text-amber-900/70 leading-relaxed mb-4 max-w-lg">
                              {j.achievement}
                            </p>
                            {/* CTA parallelogram */}
                            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-700/70 border border-amber-500/40 text-amber-50 text-[9px] font-black uppercase tracking-wider transition-all duration-200 hover:bg-amber-600 hover:-translate-y-0.5 skew-x-[-8deg] shadow-lg shadow-amber-900/20">
                              <span className="block skew-x-[8deg] flex items-center gap-1">
                                Buka Peta <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.a>
                  );
                })}

                {/* Bottom indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="relative z-10 text-center mt-6 pt-4"
                >
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md border border-white/40 text-amber-900/60 text-[10px] font-bold uppercase tracking-widest hover:bg-white/30 hover:text-amber-900/80 transition-all duration-200 skew-x-[-8deg]">
                    <span className="block skew-x-[8deg] flex items-center gap-1.5">
                      <ArrowDown className="w-3 h-3" /> Lanjutkan Perjalanan
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ 5. EVENT GALLERY ════════════ */}
      <EventGallerySection />

      {/* ════════════ 6. SOCIAL MEDIA ════════════ */}
      <SocialMediaSection />


      {/* ════════════ 9. COMMITTEE ════════════ */}
      <CommitteeSection />

     
      <Footer />
    </div>
  );
}
