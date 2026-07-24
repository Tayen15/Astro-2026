'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Users, Calendar, Star, Award, ArrowRight, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
      { label: 'Peserta coding competition', emoji: '💻' },
      { label: 'Session seminar teknologi', emoji: '🎤' },
      { label: 'Foto bersama pemenang', emoji: '🏆' },
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
      { label: 'Presentasi finalis', emoji: '📊' },
      { label: 'Persiapan panitia', emoji: '🤝' },
      { label: 'Sesi foto bersama', emoji: '📸' },
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
      { label: 'Interaksi peserta', emoji: '🗣️' },
      { label: 'Dokumentasi tim', emoji: '👥' },
      { label: 'Moment awarding', emoji: '🎉' },
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
      { label: 'Coming soon — persiapkan dirimu!', emoji: '🚀' },
    ],
  },
];

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
      <section className={`relative pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-br ${data.color} overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Profile
            </Link>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-wider mb-4 border border-white/20">
                  <Calendar className="w-3 h-3" /> ASTRO {data.year}
                </div>
                <h1 className="font-masterpiece text-4xl md:text-6xl lg:text-7xl text-white leading-tight drop-shadow-lg">
                  {data.theme}
                </h1>
              </div>

              <div className="flex gap-4 shrink-0">
                {data.participants > 0 ? (
                  <div className="text-center bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 border border-white/20">
                    <div className="text-2xl font-black text-white">{data.participants}+</div>
                    <div className="text-[9px] font-bold text-white/70 uppercase tracking-wider">Peserta</div>
                  </div>
                ) : null}
                {data.universities > 0 ? (
                  <div className="text-center bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 border border-white/20">
                    <div className="text-2xl font-black text-white">{data.universities}+</div>
                    <div className="text-[9px] font-bold text-white/70 uppercase tracking-wider">Universitas</div>
                  </div>
                ) : null}
                <div className="text-center bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 border border-white/20">
                  <div className="text-2xl font-black text-white">{data.competitions}</div>
                  <div className="text-[9px] font-bold text-white/70 uppercase tracking-wider">Cabang Lomba</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ═══ CONTENT ═══ */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left — Description & Highlights */}
            <div className="lg:col-span-7">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="accent-line mb-3" />
                <h2 className="font-masterpiece text-3xl md:text-4xl text-slate-900 leading-tight mb-6">
                  Tentang <br />
                  <span className="text-astro-cyan">ASTRO {data.year}</span>
                </h2>

                <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-8">
                  {data.description}
                </p>

                <h3 className="text-xs font-black text-astro-cyan uppercase tracking-[0.2em] mb-4">Highlights</h3>
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {data.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
                    >
                      <Star className="w-4 h-4 text-astro-cyan shrink-0" fill="currentColor" />
                      {h}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — Stats & Achievement */}
            <div className="lg:col-span-5">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-2xl border border-sky-100 p-6 md:p-8 sticky top-24"
              >
                <div className="flex items-center gap-3 mb-5">
                  <Award className="w-6 h-6 text-astro-cyan" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Pencapaian</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/80 rounded-xl p-4 border border-sky-100">
                    <p className="text-sm font-black text-slate-900">{data.achievement}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/80 rounded-xl p-4 border border-sky-100 text-center">
                      <Users className="w-4 h-4 text-astro-cyan mx-auto mb-1" />
                      <p className="text-lg font-black text-slate-900">
                        {data.participants > 0 ? data.participants.toLocaleString() : '—'}
                      </p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Peserta</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 border border-sky-100 text-center">
                      <MapPin className="w-4 h-4 text-astro-cyan mx-auto mb-1" />
                      <p className="text-lg font-black text-slate-900">
                        {data.universities > 0 ? `${data.universities}+` : '—'}
                      </p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Universitas</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-sky-200/60">
                  <div className="flex justify-between items-center">
                    <div>
                      {parseInt(data.year) > 2023 ? (
                        <Link
                          href={`/profile/journey/${String(parseInt(data.year) - 1)}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-astro-cyan transition-colors"
                        >
                          <ArrowLeft className="w-3 h-3" /> {parseInt(data.year) - 1}
                        </Link>
                      ) : null}
                    </div>
                    <div>
                      {parseInt(data.year) < 2026 ? (
                        <Link
                          href={`/profile/journey/${String(parseInt(data.year) + 1)}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-astro-cyan transition-colors"
                        >
                          {parseInt(data.year) + 1} <ArrowRight className="w-3 h-3" />
                        </Link>
                      ) : null}
                    </div>
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
            className="mt-16 md:mt-20"
          >
            <div className="text-center mb-10">
              <div className="accent-line mx-auto mb-4" />
              <h2 className="font-masterpiece text-3xl md:text-4xl text-slate-900 leading-tight mb-2">
                Dokumentasi <span className="text-astro-cyan">ASTRO {data.year}</span>
              </h2>
              <p className="text-sm text-slate-500">Momen-momen berharga selama perjalanan ASTRO</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.docs.map((doc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={reduce ? {} : { y: -6 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-sky-50 border border-slate-200/60 aspect-[4/3] flex flex-col items-center justify-center cursor-pointer"
                >
                  <span className="text-5xl mb-3 opacity-60 group-hover:scale-110 transition-transform duration-300">
                    {doc.emoji}
                  </span>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider text-center px-4">
                    {doc.label}
                  </p>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/30 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-black text-astro-cyan uppercase tracking-wider bg-white/80 px-3 py-1.5 rounded-full">
                        Klik untuk lihat
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
