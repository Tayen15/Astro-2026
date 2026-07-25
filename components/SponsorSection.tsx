'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import type { Sponsor, MediaPartner } from '@/data/sponsorData';

interface Props {
  sponsors: Sponsor[];
  mediaPartners: MediaPartner[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const sponsorConfig: Record<string, { name: string; font: string }> = {
  'Telkom Indonesia': { name: 'Telkom', font: 'font-bold tracking-tight' },
  Gojek: { name: 'Gojek', font: 'font-black tracking-tighter' },
  'Bank Mandiri': { name: 'Mandiri', font: 'font-bold' },
  Lazada: { name: 'Lazada', font: 'font-black italic' },
  Shopee: { name: 'Shopee', font: 'font-black' },
  'Astro Pay': { name: 'Astro Pay', font: 'font-black' },
  'Star Network': { name: 'StarNet', font: 'font-bold italic' },
  'Quantum Code': { name: 'QCode', font: 'font-bold' },
};
const defaultCfg = { name: 'Mitra', font: 'font-bold' };

const mediaPartnerConfig: Record<string, { name: string; font: string }> = {
  Kompas: { name: 'Kompas', font: 'font-bold' },
  Detik: { name: 'Detik', font: 'font-black' },
  'Tribun News': { name: 'Tribun', font: 'font-bold italic' },
  'Vice Indonesia': { name: 'Vice', font: 'font-black' },
  'Whiteboard Journal': { name: 'WBJ', font: 'font-bold' },
  Pinhome: { name: 'Pinhome', font: 'font-black' },
};

const MotionImage = motion.create(Image);

export default function SponsorSection({ sponsors, mediaPartners }: Props) {
  const reduce = useReducedMotion();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-slate-50 via-sky-100 to-white">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/3 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] left-0 w-[200px] h-[2px] bg-gradient-to-r from-sky-200/40 to-transparent skew-x-[-12deg] pointer-events-none" />
      <div className="absolute bottom-[20%] right-0 w-[150px] h-[2px] bg-gradient-to-l from-sky-200/30 to-transparent skew-x-[12deg] pointer-events-none" />

      {/* Floating Cloud Decorations */}
      <MotionImage
        src="/assets/awan1.png"
        alt=""
        width={160}
        height={120}
        animate={reduce ? undefined : { x: [0, 18, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[6%] left-[3%] w-20 h-auto md:w-32 md:h-auto object-contain pointer-events-none select-none z-0 opacity-40"
      />
      <MotionImage
        src="/assets/awan2.png"
        alt=""
        width={200}
        height={140}
        animate={reduce ? undefined : { x: [0, -14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[12%] right-[2%] w-24 h-auto md:w-40 md:h-auto object-contain pointer-events-none select-none z-0 opacity-35"
      />
      <MotionImage
        src="/assets/awan1.png"
        alt=""
        width={140}
        height={100}
        animate={reduce ? undefined : { x: [0, 15, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[18%] left-[1%] w-16 h-auto md:w-28 md:h-auto object-contain pointer-events-none select-none z-0 opacity-30"
      />
      <MotionImage
        src="/assets/awan2.png"
        alt=""
        width={160}
        height={120}
        animate={reduce ? undefined : { x: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[8%] right-[4%] w-20 h-auto md:w-32 md:h-auto object-contain pointer-events-none select-none z-0 opacity-30"
      />

      {/* Floating Blobs */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={80}
          height={80}
          className="absolute top-[20%] left-[5%] w-10 h-10 md:w-16 md:h-16 object-contain pointer-events-none select-none z-0 opacity-25"
        />
      </motion.div>
      <motion.div
        animate={reduce ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={64}
          height={64}
          className="absolute bottom-[25%] right-[6%] w-8 h-8 md:w-14 md:h-14 object-contain pointer-events-none select-none z-0 opacity-25"
        />
      </motion.div>
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={96}
          height={96}
          className="absolute top-[55%] left-[8%] w-12 h-12 md:w-20 md:h-20 object-contain pointer-events-none select-none z-0 opacity-20"
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Header ─── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-3">
            <div className="w-[60px] h-[4px] bg-gradient-to-r from-sky-400 to-slate-900 skew-x-[-12deg]" />
          </div>
          <h2 className="font-masterpiece text-5xl md:text-6xl lg:text-7xl text-slate-900 mb-3 leading-tight">
            Didukung <span className="text-sky-500">oleh</span>
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-light max-w-md mx-auto leading-relaxed">
            Terima kasih kepada para mitra yang telah mendukung terselenggaranya ASTRO 2026.
          </p>
        </motion.div>

        {/* ─── Sponsor Grid 4 Kolom ─── */}
        <div className="max-w-5xl mx-auto mb-20">
          <motion.div
            variants={reduce ? undefined : stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5"
          >
            {sponsors.map((s, i) => {
              const cfg = sponsorConfig[s.name] || { ...defaultCfg, name: s.name };
              return (
                <motion.div key={s.name} variants={reduce ? undefined : fadeUp} className="w-full">
                  <LogoCard sponsor={s} cfg={cfg} />
                </motion.div>
              );
            })}
            {sponsors.length < 8 && Array.from({ length: Math.min(8 - sponsors.length, 4) }).map((_, i) => (
              <motion.div key={`sp-empty-${i}`} variants={reduce ? undefined : fadeUp}
                className="h-24 md:h-28 bg-white/10 border border-sky-200/10 rounded-xl md:rounded-2xl pointer-events-none" />
            ))}
          </motion.div>
        </div>

        {/* ─── Media Partner Grid 4 Kolom ─── */}
        <div className="max-w-5xl mx-auto">
          <div className="relative mb-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sky-200/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-sky-100 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Media Partner
              </span>
            </div>
          </div>

          <motion.div
            variants={reduce ? undefined : stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5"
          >
            {mediaPartners.map((m, i) => {
              const cfg = mediaPartnerConfig[m.name] || { ...defaultCfg, name: m.name };
              return (
                <motion.div key={m.name} variants={reduce ? undefined : fadeUp} className="w-full">
                  <LogoCard sponsor={m} cfg={cfg} />
                </motion.div>
              );
            })}
            {mediaPartners.length < 8 && Array.from({ length: Math.min(8 - mediaPartners.length, 4) }).map((_, i) => (
              <motion.div key={`mp-empty-${i}`} variants={reduce ? undefined : fadeUp}
                className="h-24 md:h-28 bg-white/10 border border-sky-200/10 rounded-xl md:rounded-2xl pointer-events-none" />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Card with Noise Texture & Netral Warna ─── */
function LogoCard({
  sponsor,
  cfg,
}: {
  sponsor: Sponsor | { name: string; website?: string };
  cfg: { name: string; font: string };
}) {
  const hasWebsite = 'website' in sponsor && sponsor.website;

  const content = (
    <div className="relative w-full h-24 md:h-28 bg-white/75 backdrop-blur-[6px] border border-slate-200/60 rounded-xl md:rounded-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden group">
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Brand Name Text — netral slate */}
      <span className={`relative z-10 text-slate-700 ${cfg.font} text-sm md:text-base select-none group-hover:scale-105 transition-all duration-300`}>
        {cfg.name}
      </span>
    </div>
  );

  if (hasWebsite) {
    return (
      <a href={sponsor.website!} target="_blank" rel="noopener noreferrer" className="block w-full cursor-pointer" title={sponsor.name}>
        {content}
      </a>
    );
  }
  return <div className="w-full">{content}</div>;
}
