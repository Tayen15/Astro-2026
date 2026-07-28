'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Users, Award, Target, Sparkles, ArrowRight, Monitor, Mic2, Trophy, Handshake, Camera, Group } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MotionImage = motion.create(Image);

const journeyData = [
  {
    year: '2023',
    theme: 'First Step to The Stars',
    participants: 150,
    universities: 8,
    competitions: 4,
    achievement: 'Pertama kali diselenggarakan dengan 4 cabang lomba',
    description:
      'ASTRO 2023 merupakan edisi perdana yang menandai langkah awal perjalanan besar. Diselenggarakan dengan 4 cabang lomba utama yang diikuti oleh 150+ peserta dari 8 universitas di Indonesia. Meskipun masih sederhana, antusiasme peserta menjadi fondasi kuat untuk pengembangan ASTRO di tahun-tahun berikutnya.',
    color: 'from-cyan-500 to-sky-500',
    highlights: [
      '4 cabang lomba pertama',
      '150+ peserta dari 8 universitas',
      'Acara perdana yang sukses',
      'Mendapatkan apresiasi dari universitas',
    ],
    docs: [
      { label: 'Peserta coding competition', icon: Monitor },
      { label: 'Session seminar teknologi', icon: Mic2 },
      { label: 'Foto bersama pemenang', icon: Trophy },
    ],
  },
  {
    year: '2024',
    theme: 'Rising to The Stars',
    participants: 320,
    universities: 15,
    competitions: 6,
    achievement: 'Bertambah 2 cabang lomba baru, menjangkau 15 universitas',
    description:
      'ASTRO 2024 mengalami pertumbuhan signifikan dengan bertambahnya 2 cabang lomba baru, menjangkau lebih dari 15 universitas, dan diikuti oleh 320+ peserta. Kolaborasi dengan berbagai pihak mulai terbangun, menjadikan ASTRO sebagai event yang dinantikan oleh mahasiswa teknologi di Indonesia.',
    color: 'from-sky-500 to-indigo-500',
    highlights: [
      '6 cabang lomba ( +2 baru )',
      '320+ peserta dari 15 universitas',
      'Kolaborasi dengan sponsor',
      'Liputan media yang lebih luas',
    ],
    docs: [
      { label: 'Presentasi finalis', icon: Monitor },
      { label: 'Persiapan panitia', icon: Handshake },
      { label: 'Sesi foto bersama', icon: Camera },
    ],
  },
  {
    year: '2025',
    theme: 'Beyond The Stars',
    participants: 500,
    universities: 25,
    competitions: 8,
    achievement: 'Skala nasional dengan 8 cabang lomba dan 25+ universitas',
    description:
      'ASTRO 2025 mencapai skala nasional dengan 8 cabang lomba dan partisipasi dari 25+ universitas seluruh Indonesia. Dengan 500+ peserta, acara ini menjadi platform kompetisi teknologi yang diperhitungkan. Inovasi dalam penyelenggaraan dan pengalaman peserta terus ditingkatkan.',
    color: 'from-indigo-500 to-purple-500',
    highlights: [
      '8 cabang lomba nasional',
      '500+ peserta nasional',
      '25+ universitas se-Indonesia',
      'Pengalaman peserta premium',
    ],
    docs: [
      { label: 'Interaksi peserta', icon: Group },
      { label: 'Dokumentasi tim', icon: Camera },
      { label: 'Moment awarding', icon: Trophy },
    ],
  },
  {
    year: '2026',
    theme: 'Where Innovation Meets The Stars',
    participants: 0,
    universities: 0,
    competitions: 10,
    achievement: 'Edisi terbesar dengan inovasi dan dampak yang lebih luas',
    description:
      'ASTRO 2026 hadir sebagai edisi terbesar dengan konsep yang lebih inovatif, menjangkau lebih banyak peserta, dan memberikan dampak yang lebih luas bagi ekosistem teknologi dan kreativitas nasional. Coming soon — persiapkan dirimu untuk menjadi bagian dari sejarah!',
    color: 'from-purple-500 to-pink-500',
    highlights: [
      '10+ cabang lomba',
      'Konsep acara baru',
      'Dampak yang lebih luas',
      'Inovasi tanpa batas',
    ],
    docs: [
      { label: 'Coming soon — persiapkan dirimu!', icon: Sparkles },
    ],
  },
];

/* ─── Icon map per label for docs ─── */
const iconMap: Record<string, typeof Monitor> = {
  'Peserta coding competition': Monitor,
  'Session seminar teknologi': Mic2,
  'Foto bersama pemenang': Trophy,
  'Presentasi finalis': Monitor,
  'Persiapan panitia': Handshake,
  'Sesi foto bersama': Camera,
  'Interaksi peserta': Group,
  'Dokumentasi tim': Camera,
  'Moment awarding': Trophy,
  'Coming soon': Sparkles,
};

export default function JourneyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const reduce = useReducedMotion();

  const data = useMemo(() => journeyData.find((j) => j.year === id), [id]);

  if (!data) {
    notFound();
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ═══ HERO BANNER ═══ */}
      <section className={`relative pt-28 pb-28 md:pt-36 md:pb-36 bg-gradient-to-br ${data.color} overflow-hidden`}>
        {/* Radial glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-[10%] w-[40%] h-[50%] bg-white/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 -right-[10%] w-[40%] h-[50%] bg-white/10 blur-[100px] rounded-full" />
        </div>

        {/* Floating clouds */}
        <MotionImage
          src="/assets/awan1.png" alt="" width={180} height={120}
          animate={reduce ? undefined : { x: [0, 18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[6%] left-[2%] w-28 h-auto md:w-48 md:h-auto object-contain pointer-events-none select-none z-0 opacity-30"
        />
        <MotionImage
          src="/assets/awan2.png" alt="" width={220} height={150}
          animate={reduce ? undefined : { x: [0, -16, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] -right-4 w-32 h-auto md:w-56 md:h-auto object-contain pointer-events-none select-none z-0 opacity-25"
        />
        <MotionImage
          src="/assets/awan1.png" alt="" width={140} height={100}
          animate={reduce ? undefined : { x: [0, 14, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[10%] left-[4%] w-20 h-auto md:w-36 md:h-auto object-contain pointer-events-none select-none z-0 opacity-20"
        />

        {/* Floating blobs */}
        <MotionImage
          src="/assets/blob-round.png" alt="" width={80} height={80}
          animate={reduce ? undefined : { y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] right-[15%] w-12 h-12 md:w-20 md:h-20 object-contain pointer-events-none select-none z-0 opacity-25"
        />
        <MotionImage
          src="/assets/blob-round.png" alt="" width={64} height={64}
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-[15%] right-[6%] w-10 h-10 md:w-16 md:h-16 object-contain pointer-events-none select-none z-0 opacity-20"
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            {/* Back */}
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-[11px] font-bold uppercase tracking-wider mb-10 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Journey
            </Link>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end">
              {/* Title */}
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/90 bg-white/15 border border-white/25 backdrop-blur-sm mb-5"
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                >
                  ASTRO {data.year}
                </span>
                <h1 className="font-masterpiece text-4xl md:text-6xl lg:text-7xl text-white leading-[0.95] drop-shadow-lg">
                  {data.theme}
                </h1>
              </div>

              {/* Stats row */}
              <div className="lg:col-span-4 flex gap-3 flex-wrap">
                {data.participants > 0 && (
                  <div className="flex-1 min-w-[100px] bg-white/10 backdrop-blur-sm border border-white/15 p-4 text-center"
                    style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                  >
                    <div className="text-2xl md:text-3xl font-black text-white font-space-grotesk">{data.participants}+</div>
                    <div className="text-[9px] font-bold text-white/60 uppercase tracking-wider mt-1">Peserta</div>
                  </div>
                )}
                {data.universities > 0 && (
                  <div className="flex-1 min-w-[100px] bg-white/10 backdrop-blur-sm border border-white/15 p-4 text-center"
                    style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                  >
                    <div className="text-2xl md:text-3xl font-black text-white font-space-grotesk">{data.universities}+</div>
                    <div className="text-[9px] font-bold text-white/60 uppercase tracking-wider mt-1">Universitas</div>
                  </div>
                )}
                <div className="flex-1 min-w-[100px] bg-white/10 backdrop-blur-sm border border-white/15 p-4 text-center"
                  style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                >
                  <div className="text-2xl md:text-3xl font-black text-white font-space-grotesk">{data.competitions}</div>
                  <div className="text-[9px] font-bold text-white/60 uppercase tracking-wider mt-1">Cabang Lomba</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ═══ CONTENT ═══ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left — Description & Highlights */}
            <div className="lg:col-span-7">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="w-16 h-[3px] bg-astro-cyan mb-5" />
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[0.95] mb-6">
                  Tentang ASTRO
                  <br />
                  <span className="text-astro-cyan">{data.year}</span>
                </h2>

                <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-10 max-w-2xl">
                  {data.description}
                </p>

                <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-astro-cyan mb-5">Highlights</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {data.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 border border-slate-200/60 px-4 py-3"
                      style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                    >
                      <span className="w-5 h-5 rounded-full bg-astro-cyan/10 text-astro-cyan flex items-center justify-center shrink-0">
                        <Target className="w-3 h-3" />
                      </span>
                      {h}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — Sidebar achievement card */}
            <div className="lg:col-span-5">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="sticky top-28"
              >
                <div className="bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-100/80 p-8"
                  style={{ clipPath: 'polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%)' }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-astro-cyan flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Pencapaian</h3>
                  </div>

                  {/* Achievement block */}
                  <div className="bg-white/80 border border-cyan-100/80 p-5 mb-5"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                  >
                    <div className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm font-bold text-slate-900">{data.achievement}</p>
                    </div>
                  </div>

                  {/* Mini stats grid */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white/80 border border-cyan-100/70 p-4 text-center"
                      style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                    >
                      <Users className="w-4 h-4 text-astro-cyan mx-auto mb-1" />
                      <p className="text-lg font-black text-slate-900">{data.participants > 0 ? data.participants.toLocaleString() : '-'}</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Peserta</p>
                    </div>
                    <div className="bg-white/80 border border-cyan-100/70 p-4 text-center"
                      style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                    >
                      <Award className="w-4 h-4 text-astro-cyan mx-auto mb-1" />
                      <p className="text-lg font-black text-slate-900">{data.universities > 0 ? `${data.universities}+` : '-'}</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Universitas</p>
                    </div>
                    <div className="bg-white/80 border border-cyan-100/70 p-4 text-center"
                      style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                    >
                      <Target className="w-4 h-4 text-astro-cyan mx-auto mb-1" />
                      <p className="text-lg font-black text-slate-900">{data.competitions}</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Lomba</p>
                    </div>
                  </div>

                  {/* Navigation between years */}
                  <div className="flex justify-between items-center pt-5 border-t border-cyan-200/60">
                    {parseInt(data.year) > 2023 ? (
                      <Link
                        href={`/profile/journey/${String(parseInt(data.year) - 1)}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-astro-cyan transition-colors group"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        {parseInt(data.year) - 1}
                      </Link>
                    ) : <div />}
                    {parseInt(data.year) < 2026 ? (
                      <Link
                        href={`/profile/journey/${String(parseInt(data.year) + 1)}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-astro-cyan transition-colors group"
                      >
                        {parseInt(data.year) + 1}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    ) : <div />}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ═══ Documentation Gallery ═══ */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-20 md:mt-28"
          >
            <div className="text-center mb-12">
              <div className="w-16 h-[3px] bg-astro-cyan mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-2">
                Dokumentasi
              </h2>
              <p className="text-sm text-slate-500 font-light">Momen-momen berharga selama perjalanan ASTRO {data.year}</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {data.docs.map((doc, i) => {
                const DocIcon = doc.icon || (iconMap[doc.label] || Monitor);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={reduce ? {} : { y: -6 }}
                    className="group relative overflow-hidden aspect-[4/3] flex flex-col items-center justify-center cursor-pointer border border-slate-200/80 hover:border-astro-cyan/30 bg-gradient-to-br from-slate-50 to-cyan-50/30"
                    style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
                  >
                    <div className="w-14 h-14 rounded-full bg-white border border-slate-200/80 group-hover:border-astro-cyan/40 flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/10 group-hover:scale-110">
                      <DocIcon className="w-6 h-6 text-slate-400 group-hover:text-astro-cyan transition-colors duration-300" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center px-6">
                      {doc.label}
                    </p>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[9px] font-black text-astro-cyan uppercase tracking-wider bg-white/90 px-3 py-1.5"
                          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                        >
                          Lihat
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
