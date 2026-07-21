'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Eye, Target, Sparkles, Award, ShieldCheck, Users } from 'lucide-react';

export default function AboutSection() {
  const reduce = useReducedMotion();

  const keyFeatures = [
    {
      icon: Sparkles,
      title: 'Multi-Disiplin Lomba',
      desc: 'Menggabungkan kategori akademik, olahraga, dan esports secara seimbang.',
    },
    {
      icon: Award,
      title: 'Hadiah Fantastis',
      desc: 'Penghargaan resmi dan dana pembinaan bernilai jutaan rupiah untuk para pemenang.',
    },
    {
      icon: ShieldCheck,
      title: 'Juri Profesional',
      desc: 'Sistem penilaian yang objektif, transparan, dan terpercaya oleh para ahli.',
    },
    {
      icon: Users,
      title: 'Komunitas Pelajar',
      desc: 'Membangun jaringan relasi dan persahabatan positif antar peserta.',
    },
  ];

  const misiList = [
    'Menyelenggarakan kompetisi berkualitas tinggi yang adil, menantang, dan profesional.',
    'Mendorong kolaborasi lintas bakat antara sains, olahraga, dan esports.',
    'Mengembangkan karakter yang tangguh, berjiwa sportif, dan berorientasi pada prestasi.',
  ];

  return (
    <section id="about" className="relative py-20 md:py-28 overflow-hidden border-b border-slate-200/65">
      {/* Background — seamless transition from Hero's sky fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/80 via-white to-white -z-10" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/2 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/2 blur-[120px] rounded-full pointer-events-none" />

      {/* ─── FLOATING BLOB ROUND IMAGES (like Hero) ─── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={112}
          height={112}
          className="absolute top-[8%] right-[12%] w-28 h-28 md:w-40 md:h-40 object-contain pointer-events-none select-none z-10"
        />
      </motion.div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={96}
          height={96}
          className="absolute top-[35%] left-[2%] w-24 h-24 md:w-36 md:h-36 object-contain pointer-events-none select-none z-10"
        />
      </motion.div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={64}
          height={64}
          className="absolute top-[55%] right-[3%] w-16 h-16 md:w-24 md:h-24 object-contain pointer-events-none select-none z-10"
        />
      </motion.div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={80}
          height={80}
          className="absolute bottom-[10%] left-[10%] w-20 h-20 md:w-32 md:h-32 object-contain pointer-events-none select-none z-10"
        />
      </motion.div>

      <div className="relative z-30 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Title & Key Features */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
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
                className="text-sm md:text-base text-slate-650 mt-6 leading-relaxed font-normal"
              >
                ASTRO 2026 adalah ajang kompetisi dan kreativitas tahunan terbesar yang dirancang khusus untuk mewadahi minat, bakat, serta potensi generasi muda. Kami menyatukan tiga pilar utama yaitu kompetisi akademik, ketangkasan olahraga, dan ketajaman esports di bawah satu payung sportivitas yang kokoh.
              </motion.p>
            </div>

            {/* Key Features Grid */}
            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {keyFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={reduce ? false : { opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                    className="flex flex-col gap-2.5 p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-250 border border-transparent hover:border-slate-100"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200/40 flex items-center justify-center text-astro-cyan flex-shrink-0">
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

          {/* Right Column: Visi & Misi Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visi Card */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="p-6 md:p-8 bg-slate-50 border border-slate-200/60 rounded-2xl relative overflow-hidden group hover:border-cyan-500/35 transition-colors duration-200"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl rounded-full" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/10">
                  <Eye className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black tracking-[0.15em] text-slate-900 uppercase">VISI KAMI</h3>
              </div>
              <p className="text-sm text-slate-655 leading-relaxed font-medium">
                Menjadi wadah kolaboratif terbesar bagi generasi muda untuk mengeksplorasi potensi terbaik, menyatukan sportivitas kompetisi, kreativitas tanpa batas, dan keunggulan akademik.
              </p>
            </motion.div>

            {/* Misi Card */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] as const }}
              className="p-6 md:p-8 bg-slate-50 border border-slate-200/60 rounded-2xl relative overflow-hidden group hover:border-cyan-500/35 transition-colors duration-200"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl rounded-full" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/10">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black tracking-[0.15em] text-slate-900 uppercase">MISI KAMI</h3>
              </div>
              <ul className="space-y-4">
                {misiList.map((misi, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-55 border border-cyan-100 flex items-center justify-center text-[10px] font-bold text-cyan-600 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-655 leading-relaxed font-medium">{misi}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
