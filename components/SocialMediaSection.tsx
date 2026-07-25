'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const MotionImage = motion.create(Image);

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function SocialMediaSection() {
  const reduce = useReducedMotion();

  // Pure clean neutral sky studio background matching adjacent sections
  const bgSkyColor = '#e0f2fe';

  return (
    <section 
      className="relative min-h-screen w-full overflow-hidden text-slate-900 py-16 md:py-24 font-sans bg-sky-100"
    >
      {/* ── Subtle Sky Ambient Glow ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-300/20 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* ── Subtle Sky Cloud Wisps ── */}
      <MotionImage
        src="/assets/awan1.png"
        alt=""
        width={200}
        height={130}
        animate={reduce ? undefined : { x: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[8%] left-[2%] w-24 md:w-44 h-auto opacity-[0.18] pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/awan2.png"
        alt=""
        width={220}
        height={140}
        animate={reduce ? undefined : { x: [0, -15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[14%] right-[2%] w-28 md:w-52 h-auto opacity-[0.15] pointer-events-none select-none z-0"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* ── 1. HEADLINE AREA ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-semibold text-slate-700 tracking-wide border border-slate-200 shadow-sm">
              <InstagramIcon className="w-3.5 h-3.5 text-slate-800" />
              @astrosttnf
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-masterpiece text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-slate-900 tracking-tight leading-tight font-extrabold"
          >
            Lebih Dekat. Lebih Seru.<br />
            <span className="text-sky-600 font-normal italic">Lebih ASTRO.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-xs sm:text-sm md:text-base text-slate-600 font-medium tracking-wide"
          >
            Official Media Hub & Interactive Feed ASTRO 2026
          </motion.p>
        </div>

        {/* ── 2. PRODUCT IMAGE (Aligned exactly to the width of the spec grid) ── */}
        <div className="relative w-full max-w-7xl mb-12 md:mb-16 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full flex justify-center items-center"
          >
            {/* Tablet Image Showcase — Spans 100% width of container */}
            <MotionImage
              src="/assets/IG-Tablet.png"
              alt="ASTRO Instagram Hub Showcase"
              width={1700}
              height={1200}
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-auto object-contain select-none z-0"
              style={{
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 96%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 96%)',
              }}
              priority
            />
          </motion.div>
        </div>

        {/* ── 3. SPEC GRID (Shares exact container alignment) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-6xl grid md:grid-cols-2 gap-x-14 gap-y-10 border-t border-slate-300/60 pt-12 md:pt-16 z-20"
        >
          {/* Spec Item 1 */}
          <div className="flex flex-col gap-2 border-b border-slate-300/40 pb-8 md:border-b-0 md:pb-0">
            <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
              Highlights & Dokumentasi Eksklusif
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
              Liputan penuh seluruh cabang kompetisi, momen terbaik di panggung utama, dan galeri kegiatan ASTRO 2026.
            </p>
          </div>

          {/* Spec Item 2 */}
          <div className="flex flex-col gap-2 border-b border-slate-300/40 pb-8 md:border-b-0 md:pb-0">
            <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
              Update Real-Time Pendaftaran
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
              Informasi kuota perlombaan, jadwal pengumuman, dan konsultasi cepat langsung melalui DM panitia.
            </p>
          </div>

          {/* Spec Item 3 */}
          <div className="flex flex-col gap-2 border-b border-slate-300/40 pb-8 md:border-b-0 md:pb-0">
            <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
              Jaringan Komunitas Pelajar
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
              Menghubungkan ratusan inovator muda dari universitas dan sekolah terbaik di seluruh Indonesia.
            </p>
          </div>

          {/* Spec Item 4 */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
              Rilis Pers & Aset Visual Resmi
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
              Akses cepat ke materi publikasi, logo resmi, dan press kit terverifikasi untuk mitra media.
            </p>
          </div>
        </motion.div>

        {/* ── 4. BOTTOM ACTION CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 md:mt-16 text-center z-20"
        >
          <a
            href="https://instagram.com/astrosttnf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all duration-300 active:scale-95"
          >
            <span>Ikuti @astrosttnf di Instagram</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
