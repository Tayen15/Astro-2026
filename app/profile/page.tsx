'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import {
  ArrowDown, ExternalLink, ArrowRight, Calendar,
  Globe, Mail, MessageCircle, Users, Star, MapPin,
  Sparkles, Award, ShieldCheck, Eye, Target, X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommitteeSection from '@/components/CommitteeSection';
import EventGallerySection from '@/components/EventGallerySection';
import SocialMediaSection from '@/components/SocialMediaSection';
import ProfileHero from '@/components/ProfileHero';

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
  { year: '2023', theme: 'First Step to The Stars', participants: 150, universities: 8, competitions: 4, achievement: 'Pertama kali diselenggarakan dengan 4 cabang lomba', description: 'ASTRO 2023 merupakan edisi perdana yang menandai langkah awal perjalanan besar. Diselenggarakan dengan 4 cabang lomba utama yang diikuti oleh 150+ peserta dari 8 universitas di Indonesia.', highlights: ['4 cabang lomba pertama', '150+ peserta dari 8 universitas', 'Acara perdana yang sukses', 'Mendapatkan apresiasi dari universitas'] },
  { year: '2024', theme: 'Rising to The Stars', participants: 320, universities: 15, competitions: 6, achievement: 'Bertambah 2 cabang lomba baru, menjangkau 15 universitas', description: 'ASTRO 2024 mengalami pertumbuhan signifikan dengan bertambahnya 2 cabang lomba baru, menjangkau lebih dari 15 universitas, dan diikuti oleh 320+ peserta.', highlights: ['6 cabang lomba (+2 baru)', '320+ peserta dari 15 universitas', 'Kolaborasi dengan sponsor', 'Liputan media yang lebih luas'] },
  { year: '2025', theme: 'Beyond The Stars', participants: 500, universities: 25, competitions: 8, achievement: 'Skala nasional dengan 8 cabang lomba dan 25+ universitas', description: 'ASTRO 2025 mencapai skala nasional dengan 8 cabang lomba dan partisipasi dari 25+ universitas seluruh Indonesia. Dengan 500+ peserta, acara ini menjadi platform kompetisi teknologi yang diperhitungkan.', highlights: ['8 cabang lomba nasional', '500+ peserta nasional', '25+ universitas se-Indonesia', 'Pengalaman peserta premium'] },
  { year: '2026', theme: 'Where Innovation Meets The Stars', participants: 0, universities: 0, competitions: 10, achievement: 'Edisi terbesar dengan inovasi dan dampak yang lebih luas', description: 'ASTRO 2026 hadir sebagai edisi terbesar dengan konsep yang lebih inovatif, menjangkau lebih banyak peserta, dan memberikan dampak yang lebih luas.', highlights: ['10+ cabang lomba', 'Konsep acara baru', 'Dampak yang lebih luas', 'Inovasi tanpa batas'] },
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
  const [showAllJourney, setShowAllJourney] = useState(false);
  const [activeJourneyYear, setActiveJourneyYear] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ════════════ 1. HERO — CINEMATIC SPLIT ════════════ */}
      <ProfileHero />

      {/* ════════════ 2. ABOUT ASTRO ════════════ */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-sky-100 via-sky-200 to-sky-200 overflow-hidden">
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

      {/* ════════════ 4. ASTRO JOURNEY — CINEMATIC BENTO ════════════ */}
      <section id="journey" className="relative py-28 md:py-36 overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-sky-200">
        {/* Ambient radial glow */}
        <div className="absolute top-1/3 -left-[20%] w-[40%] h-[50%] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -right-[10%] w-[30%] h-[40%] bg-sky-500/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Floating clouds */}
        <MotionImage
          src="/assets/awan1.png"
          alt=""
          width={200}
          height={140}
          animate={reduce ? undefined : { x: [0, 18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[6%] left-[2%] w-28 h-auto md:w-52 md:h-auto object-contain pointer-events-none select-none z-0 opacity-30"
        />
        <MotionImage
          src="/assets/awan2.png"
          alt=""
          width={240}
          height={160}
          animate={reduce ? undefined : { x: [0, -18, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[18%] -right-4 w-32 h-auto md:w-56 md:h-auto object-contain pointer-events-none select-none z-0 opacity-25"
        />
        <MotionImage
          src="/assets/awan1.png"
          alt=""
          width={160}
          height={110}
          animate={reduce ? undefined : { x: [0, 12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[15%] left-[4%] w-20 h-auto md:w-40 md:h-auto object-contain pointer-events-none select-none z-0 opacity-20"
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          {/* Section Header — centered */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20 md:mb-28"
          >
            <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-slate-400 mb-4 block">
              Milestones
            </span>
            <h2 className="font-masterpiece text-5xl md:text-7xl lg:text-8xl text-slate-900 leading-[0.9] mb-5">
              ASTRO
              <br />
              <span className="text-astro-cyan">Journey</span>
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-light max-w-lg mx-auto">
              Setiap tahun adalah babak baru dalam perjalanan menuju inovasi tanpa batas.
            </p>
          </motion.div>

          {/* Journey Grid — bento style alternating */}
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-12 md:gap-6 lg:gap-8">
            {journey.map((j, idx) => {
              const isFuture = idx === journey.length - 1;
              const isLarge = idx % 2 === 0;

              return (
                <motion.div
                  key={j.year}
                  initial={reduce ? false : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`${isLarge ? 'md:col-span-7' : 'md:col-span-5'} ${idx === 2 ? 'md:col-start-1' : ''} ${idx === 3 ? 'md:col-start-8' : ''}`}
                >
                  <button
                    onClick={() => { setShowAllJourney(true); setActiveJourneyYear(j.year); }}
                    className="block h-full w-full text-left group"
                  >
                    <div className={`relative h-full bg-white border border-slate-200/80 hover:border-astro-cyan/30 p-8 md:p-10 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 overflow-hidden cursor-pointer ${
                      isFuture ? 'border-astro-cyan/20 bg-gradient-to-br from-white to-cyan-50/30' : ''
                    }`}
                      style={{ clipPath: isLarge ? 'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)' : 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
                    >
                      {/* Year watermark */}
                      <div className="absolute -top-4 -right-2 text-[clamp(5rem,10vw,9rem)] font-black text-slate-900/[0.03] leading-none pointer-events-none select-none">
                        {j.year}
                      </div>

                      {/* Year badge */}
                      <div className="flex items-center gap-3 mb-6">
                        <span className={`inline-flex items-center justify-center px-4 h-10 text-base font-black tracking-tight ${
                          isFuture ? 'bg-astro-cyan text-white shadow-md shadow-cyan-500/20' : 'bg-slate-100 text-slate-700 group-hover:bg-astro-cyan group-hover:text-white'
                        } transition-colors duration-300`}
                          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                        >
                          {j.year}
                        </span>
                        {isFuture && (
                          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1"
                            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                          >
                            Latest Edition
                          </span>
                        )}
                      </div>

                      {/* Theme */}
                      <h3 className={`font-bold text-slate-900 leading-tight mb-4 ${
                        isLarge ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
                      }`}>
                        {j.theme}
                      </h3>

                      {/* Achievement */}
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6 max-w-lg">
                        {j.achievement}
                      </p>

                      {/* Stats + CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <Users className="w-3.5 h-3.5 text-astro-cyan" />
                          {j.participants > 0 ? `${j.participants.toLocaleString()}+ Peserta` : 'Coming Soon'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-astro-cyan group-hover:gap-2.5 transition-all duration-300">
                          <span>Lihat Detail</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>

                      {/* Corner accent */}
                      <div className={`absolute top-0 ${isLarge ? 'right-0' : 'left-0'} w-12 h-1 bg-gradient-to-r from-astro-cyan to-transparent opacity-60`} />
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* View All Trigger Button */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mt-12 md:mt-16"
          >
            <button
              onClick={() => setShowAllJourney(true)}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-slate-900 text-white font-bold text-xs tracking-wider uppercase transition-all duration-200 hover:bg-slate-800 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer"
              style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
            >
              <Calendar className="w-4 h-4" />
              <span>Lihat Semua Perjalanan</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══ JOURNEY FULL OVERLAY ═══ */}
      <AnimatePresence>
        {showAllJourney && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm py-10 px-4"
            onClick={() => setShowAllJourney(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl bg-white shadow-2xl relative overflow-hidden rounded-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setShowAllJourney(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>

              {/* Overlay header */}
              <div className="bg-gradient-to-br from-sky-500 via-cyan-500 to-sky-600 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[60px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 blur-[80px] rounded-full" />
                <h2 className="font-masterpiece text-3xl md:text-5xl text-white leading-tight relative z-10">
                  ASTRO <span className="text-cyan-200">Journey</span>
                </h2>
                <p className="text-white/70 text-sm mt-2 max-w-lg relative z-10">
                  Jelajahi setiap babak perjalanan ASTRO dari awal hingga sekarang.
                </p>
              </div>

              {/* Overlay content — all journeys full details */}
              <div className="p-6 md:p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                {journey.map((j, idx) => {
                  const isActive = activeJourneyYear === j.year;
                  return (
                    <motion.div
                      key={j.year}
                      initial={isActive ? { opacity: 0, y: 20 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.4 }}
                      className={`border-l-4 pl-5 md:pl-8 py-4 transition-all duration-300 ${
                        isActive ? 'border-astro-cyan bg-cyan-50/30 -ml-2 pl-7 md:pl-10 pr-4 md:pr-8 rounded-r-xl' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`inline-flex items-center justify-center w-12 h-8 text-sm font-black tracking-tight ${
                          j.year === '2026' ? 'bg-astro-cyan text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                        >
                          {j.year}
                        </span>
                        <span className="text-sm font-bold text-slate-800">{j.theme}</span>
                        {j.year === '2026' && (
                          <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5"
                            style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                          >
                            Latest
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed mb-4 max-w-3xl">
                        {j.description}
                      </p>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {j.highlights.map((h, i) => (
                          <span key={i} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1"
                            style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                          >
                            {h}
                          </span>
                        ))}
                      </div>

                      {/* Stats row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-astro-cyan" />
                          {j.participants > 0 ? `${j.participants}+` : '-'} Peserta
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-astro-cyan" />
                          {j.universities > 0 ? `${j.universities}+` : '-'} Universitas
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-astro-cyan" />
                          {j.competitions} Cabang Lomba
                        </span>
                        <a
                          href={`/profile/journey/${j.year}`}
                          className="inline-flex items-center gap-1 text-astro-cyan font-bold hover:gap-1.5 transition-all ml-auto"
                        >
                          Detail <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
