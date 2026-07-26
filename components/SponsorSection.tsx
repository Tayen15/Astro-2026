'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';

interface SponsorItem {
  id: number;
  name: string;
  tier: string;
  website: string | null;
}

interface MediaPartnerItem {
  id: number;
  name: string;
  website: string | null;
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

const fontStyleMap: Record<string, string> = {
  'Telkom Indonesia': 'font-bold tracking-tight',
  Gojek: 'font-black tracking-tighter',
  'Bank Mandiri': 'font-bold',
  Lazada: 'font-black italic',
  Shopee: 'font-black',
  Kompas: 'font-bold',
  Detik: 'font-black',
  'Tribun News': 'font-bold italic',
  'Vice Indonesia': 'font-black',
  'Whiteboard Journal': 'font-bold',
  Pinhome: 'font-black',
};

const defaultFont = 'font-bold';

const MotionImage = motion.create(Image);

export default function SponsorSection() {
  const reduce = useReducedMotion();
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [mediaPartners, setMediaPartners] = useState<MediaPartnerItem[]>([]);

  useEffect(() => {
    fetch('/api/sponsors')
      .then(r => r.json())
      .then(json => setSponsors(json.data || []))
      .catch(() => {});
    fetch('/api/media-partners')
      .then(r => r.json())
      .then(json => setMediaPartners(json.data || []))
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-slate-50 via-sky-200 to-sky-300">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/3 blur-[150px] rounded-full pointer-events-none" />
      {/* Decorative strokes */}
      <div className="absolute top-[12%] left-[4%] w-[40px] h-px bg-slate-300/20 skew-x-[-12deg] pointer-events-none" />
      <div className="absolute top-[12%] left-[calc(4%+60px)] w-[20px] h-px bg-slate-300/10 skew-x-[-12deg] pointer-events-none" />
      <div className="absolute top-[8%] right-[10%] w-[60px] h-px bg-slate-300/20 skew-x-[12deg] pointer-events-none" />
      <div className="absolute top-[20%] right-[4%] w-[30px] h-px bg-slate-300/15 skew-x-[12deg] pointer-events-none" />
      <div className="absolute bottom-[15%] left-[6%] w-[50px] h-px bg-slate-300/15 skew-x-[-12deg] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[3%] w-[25px] h-px bg-slate-300/10 skew-x-[-12deg] pointer-events-none" />
      <div className="absolute bottom-[25%] right-[5%] w-[40px] h-px bg-slate-300/15 skew-x-[12deg] pointer-events-none" />
      <div className="absolute bottom-[35%] right-[8%] w-[20px] h-px bg-slate-300/10 skew-x-[12deg] pointer-events-none" />
      <div className="absolute top-[45%] left-[2%] w-[35px] h-px bg-slate-300/10 skew-x-[-12deg] pointer-events-none" />

      {/* Floating Cloud Decorations */}
      <MotionImage src="/assets/awan1.png" alt="" width={160} height={120}
        animate={reduce ? undefined : { x: [0, 18, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[6%] left-[3%] w-20 h-auto md:w-32 md:h-auto object-contain pointer-events-none select-none z-0 opacity-40" />
      <MotionImage src="/assets/awan2.png" alt="" width={200} height={140}
        animate={reduce ? undefined : { x: [0, -14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[12%] right-[2%] w-24 h-auto md:w-40 md:h-auto object-contain pointer-events-none select-none z-0 opacity-35" />
      <MotionImage src="/assets/awan1.png" alt="" width={140} height={100}
        animate={reduce ? undefined : { x: [0, 15, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[18%] left-[1%] w-16 h-auto md:w-28 md:h-auto object-contain pointer-events-none select-none z-0 opacity-30" />
      <MotionImage src="/assets/awan2.png" alt="" width={160} height={120}
        animate={reduce ? undefined : { x: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[8%] right-[4%] w-20 h-auto md:w-32 md:h-auto object-contain pointer-events-none select-none z-0 opacity-30" />

      {/* Floating Blobs */}
      <motion.div animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
        <Image src="/assets/blob-round.png" alt="" width={80} height={80}
          className="absolute top-[20%] left-[5%] w-10 h-10 md:w-16 md:h-16 object-contain pointer-events-none select-none z-0 opacity-25" />
      </motion.div>
      <motion.div animate={reduce ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
        <Image src="/assets/blob-round.png" alt="" width={64} height={64}
          className="absolute bottom-[25%] right-[6%] w-8 h-8 md:w-14 md:h-14 object-contain pointer-events-none select-none z-0 opacity-25" />
      </motion.div>
      <motion.div animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <Image src="/assets/blob-round.png" alt="" width={96} height={96}
          className="absolute top-[55%] left-[8%] w-12 h-12 md:w-20 md:h-20 object-contain pointer-events-none select-none z-0 opacity-20" />
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
        {sponsors.length > 0 && (
          <div className="max-w-5xl mx-auto mb-20">
            <motion.div
              variants={reduce ? undefined : stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5"
            >
              {sponsors.map(s => (
                <motion.div key={s.id} variants={reduce ? undefined : fadeUp} className="w-full">
                  <LogoCard name={s.name} website={s.website}
                    font={fontStyleMap[s.name] || defaultFont} />
                </motion.div>
              ))}
              {sponsors.length < 8 && Array.from({ length: Math.min(8 - sponsors.length, 4) }).map((_, i) => (
                <motion.div key={`sp-empty-${i}`} variants={reduce ? undefined : fadeUp}
                  className="h-24 md:h-28 bg-white/10 border border-sky-200/10 pointer-events-none"
                  style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }} />
              ))}
            </motion.div>
          </div>
        )}

        {/* ─── Media Partner Grid 4 Kolom ─── */}
        {mediaPartners.length > 0 && (
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
              {mediaPartners.map(m => (
                <motion.div key={m.id} variants={reduce ? undefined : fadeUp} className="w-full">
                  <LogoCard name={m.name} website={m.website}
                    font={fontStyleMap[m.name] || defaultFont} />
                </motion.div>
              ))}
              {mediaPartners.length < 8 && Array.from({ length: Math.min(8 - mediaPartners.length, 4) }).map((_, i) => (
                <motion.div key={`mp-empty-${i}`} variants={reduce ? undefined : fadeUp}
                  className="h-24 md:h-28 bg-white/10 border border-sky-200/10 pointer-events-none"
                  style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }} />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Card with Noise Texture ─── */
function LogoCard({ name, website, font }: { name: string; website: string | null; font: string }) {
  const content = (
    <div className="relative w-full h-24 md:h-28 bg-white/75 backdrop-blur-[6px] border border-slate-200/60 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden group"
      style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
    >
      {/* Top angular corner accent */}
      <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-sky-300/60"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }} />

      <span className={`relative z-10 text-slate-700 ${font} text-sm md:text-base select-none group-hover:scale-105 transition-all duration-300`}>
        {name}
      </span>
    </div>
  );

  if (website) {
    return (
      <a href={website} target="_blank" rel="noopener noreferrer" className="block w-full cursor-pointer" title={name}>
        {content}
      </a>
    );
  }
  return <div className="w-full">{content}</div>;
}
