'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Users, FileText, Radio } from 'lucide-react';

const MotionImage = motion.create(Image);

// Instagram Camera Outline Icon for Watermark
const InstagramOutlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Blue Verified Badge SVG Icon
const VerifiedBadgeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

export default function SocialMediaSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-sky-100 via-sky-200 to-sky-400 text-slate-900">
      
      {/* ── Background Mesh Glows ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[850px] bg-cyan-200/40 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* ── Floating Background Clouds & Blobs ── */}
      <MotionImage
        src="/assets/cloud.png"
        alt=""
        width={320}
        height={210}
        animate={reduce ? undefined : { x: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[4%] -left-10 w-72 md:w-96 h-auto opacity-70 pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/cloud.png"
        alt=""
        width={340}
        height={230}
        animate={reduce ? undefined : { x: [0, -15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] -right-12 w-80 md:w-[420px] h-auto opacity-65 pointer-events-none select-none z-0"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. HEADER TITLE & TOP ACCOUNT PILL ── */}
        <div className="text-center mb-8 flex flex-col items-center">
          
          {/* Main Title: ASTRO Instagram Hub */}
          <h2 className="font-masterpiece text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-4">
            <span className="text-slate-900">ASTRO </span>
            <span className="text-astro-cyan italic">Instagram Hub</span>
          </h2>

          {/* Top Pill Badge: @astrosttnf | OFFICIAL ACCOUNT */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-50/90 border border-cyan-200/80 rounded-full shadow-xs text-xs font-bold"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-900 font-extrabold">@astrosttnf</span>
            <span className="text-slate-300">|</span>
            <span className="text-cyan-700 font-extrabold uppercase text-[10px] tracking-wider">
              OFFICIAL ACCOUNT
            </span>
          </motion.div>

        </div>

        {/* ── 2. TABLET SHOWCASE AREA (W-FULL MAX-W-4XL EQUAL TO CARD WIDTH) ── */}
        <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
          
          {/* Circular Cyan Glow Aura behind Tablet */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[600px] md:w-[750px] h-[420px] sm:h-[600px] md:h-[750px] bg-cyan-300/45 rounded-full blur-[100px] pointer-events-none z-0" />

          {/* Tablet Image Mockup (IG-Tablet.png) - Width matched to card max-w-4xl */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full"
          >
            <MotionImage
              src="/assets/IG-Tablet.png"
              alt="ASTRO Instagram Showcase Tablet"
              width={896}
              height={1040}
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-auto object-contain drop-shadow-[0_25px_50px_rgba(6,182,212,0.3)] mx-auto"
              priority
            />
          </motion.div>

          {/* Bottom Gradient Overlay (Smoothly fading out bottom half of tablet) */}
          <div className="absolute bottom-0 left-0 right-0 h-56 sm:h-80 md:h-[420px] bg-gradient-to-t from-sky-400 via-sky-400/85 to-transparent z-10 pointer-events-none" />
        </div>

        {/* ── 3. BOTTOM OVERLAPPING WHITE CARD (Equal width max-w-4xl, raised 50% over tablet) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 -mt-48 sm:-mt-72 md:-mt-96 lg:-mt-[420px] max-w-4xl mx-auto"
        >
          {/* Main Clean White Rounded Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-slate-100/90 relative overflow-hidden">
            
            {/* Top Right Instagram Outline & Verified Badge Decoration */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 opacity-80 pointer-events-none flex items-center justify-center">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-cyan-100">
                <InstagramOutlineIcon className="w-full h-full text-cyan-100 stroke-[1.2]" />
                <div className="absolute -top-1 -right-1 text-blue-500">
                  <VerifiedBadgeIcon className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Header Pill */}
            <span 
              className="px-3 py-1 bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-[10px] font-extrabold uppercase tracking-wider inline-block mb-3 rounded-md"
            >
              INSTAGRAM OFFICIAL ASTRO
            </span>

            {/* Heading */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-snug mb-3 max-w-2xl">
              Pusat Informasi & Komunitas Digital <span className="text-astro-cyan">ASTRO</span>
            </h3>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed mb-8 max-w-2xl">
              Akun Instagram resmi ASTRO 2026 (<span className="text-cyan-700 font-extrabold">@astrosttnf</span>) menyajikan update kegiatan, informasi pendaftaran, siaran langsung webinar teknologi, hingga selebrasi momen penganugerahan pemenang secara real-time.
            </p>

            {/* ── 3 BOTTOM STAT CARDS GRID ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
              
              {/* Stat Card 1: Followers (Light Sky Blue Card) */}
              <a 
                href="https://instagram.com/astrosttnf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-50/80 hover:bg-sky-100/90 border border-sky-100/90 p-4 rounded-2xl flex items-center gap-3.5 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    FOLLOWERS
                  </p>
                  <p className="text-xl font-black text-slate-900 leading-tight">
                    1,318
                  </p>
                  <p className="text-[10px] font-extrabold text-emerald-600 mt-0.5">
                    +149.6% Pertumbuhan
                  </p>
                </div>
              </a>

              {/* Stat Card 2: Posts (Light Mint Green Card) */}
              <a 
                href="https://instagram.com/astrosttnf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-100/90 p-4 rounded-2xl flex items-center gap-3.5 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    POSTS
                  </p>
                  <p className="text-xl font-black text-slate-900 leading-tight">
                    315
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                    Update Terbaru & Terkini
                  </p>
                </div>
              </a>

              {/* Stat Card 3: Accounts Reached (Light Lavender Purple Card) */}
              <a 
                href="https://instagram.com/astrosttnf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-50/80 hover:bg-purple-100/90 border border-purple-100/90 p-4 rounded-2xl flex items-center gap-3.5 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Radio className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    ACCOUNTS REACHED
                  </p>
                  <p className="text-xl font-black text-slate-900 leading-tight">
                    38,321
                  </p>
                  <p className="text-[10px] font-extrabold text-emerald-600 mt-0.5">
                    +149.6% Pertumbuhan
                  </p>
                </div>
              </a>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
