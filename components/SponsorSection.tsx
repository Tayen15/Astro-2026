'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';

const MotionImage = motion.create(Image);

interface SponsorItem {
  id: number;
  name: string;
  tier?: string;
  website?: string | null;
  logo?: string | null;
}

interface MediaPartnerItem {
  id: number;
  name: string;
  website?: string | null;
  logo?: string | null;
}

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

  // All sponsors shown equally, no tier grouping

  return (
    <section className="relative py-24 md:py-32 overflow-hidden text-slate-900 select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-sky-200 to-sky-300 -z-10" />

      {/* Floating decors */}
      <MotionImage
        src="/assets/awan1.png" alt="" width={160} height={120}
        animate={reduce ? undefined : { x: [0, 18, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[6%] left-[3%] w-20 h-auto md:w-36 md:h-auto object-contain pointer-events-none select-none z-0 opacity-40"
      />
      <MotionImage
        src="/assets/awan2.png" alt="" width={200} height={140}
        animate={reduce ? undefined : { x: [0, -14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[12%] right-[2%] w-24 h-auto md:w-44 md:h-auto object-contain pointer-events-none select-none z-0 opacity-35"
      />
      <MotionImage
        src="/assets/blob-round.png" alt="" width={80} height={80}
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[30%] left-[5%] w-10 h-10 md:w-16 md:h-16 object-contain pointer-events-none select-none z-0 opacity-25"
      />
      <MotionImage
        src="/assets/blob-round.png" alt="" width={96} height={96}
        animate={reduce ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[20%] right-[5%] w-12 h-12 md:w-20 md:h-20 object-contain pointer-events-none select-none z-0 opacity-25"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 md:mb-16"
        >
          <div className="flex justify-center mb-3">
            <div className="w-[60px] h-[4px] bg-gradient-to-r from-sky-400 to-slate-900 skew-x-[-12deg]" />
          </div>
          <h2 className="font-masterpiece text-5xl md:text-6xl lg:text-7xl text-slate-900 mb-3 leading-tight">
            Didukung <span className="text-sky-500">Oleh</span>
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] md:tracking-[0.35em] text-slate-500 uppercase">
            TRUSTED BY TEAMS FROM AROUND THE WORLD
          </p>
        </motion.div>

        {/* Sponsors */}
        {sponsors.length > 0 ? (
          <div className="mb-14 md:mb-16">
            <div className="flex justify-center mb-8">
              <span className="bg-white/80 backdrop-blur-md px-5 py-1.5 border border-sky-300/60 rounded-full text-[11px] sm:text-xs font-bold text-sky-800 uppercase tracking-[0.2em] shadow-sm">
                Sponsor Resmi
              </span>
            </div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 max-w-6xl mx-auto px-4"
            >
              {sponsors.map((brand) => (
                <BrandItem key={brand.id} brand={brand} />
              ))}
            </motion.div>
          </div>
        ) : (
          <p className="text-center text-slate-400 text-sm italic mb-12">Belum ada sponsor.</p>
        )}

        {/* Media Partners */}
        {mediaPartners.length > 0 && (
          <>
            <div className="relative max-w-4xl mx-auto my-14 md:my-18">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sky-300/60" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-sky-200/90 backdrop-blur-md px-5 py-1.5 text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-[0.25em] rounded-full border border-sky-300/70 shadow-sm">
                  Media Partner
                </span>
              </div>
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14 max-w-5xl mx-auto px-4"
            >
              {mediaPartners.map((brand) => (
                <BrandItem key={brand.id} brand={brand} />
              ))}
            </motion.div>
          </>
        )}

        {/* Arc divider */}
        <div className="relative max-w-5xl mx-auto mt-16 md:mt-24 px-2">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[85%] h-32 md:h-44 bg-gradient-to-t from-sky-400/40 via-cyan-400/20 to-transparent blur-2xl rounded-t-[100%] pointer-events-none" />
          <svg viewBox="0 0 1200 100" className="w-full h-auto overflow-visible pointer-events-none relative z-10" preserveAspectRatio="none">
            <defs>
              <linearGradient id="thinArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                <stop offset="20%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="80%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 0 90 Q 600 0 1200 90" fill="none" stroke="url(#thinArcGrad)" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function BrandItem({ brand }: { brand: { name: string; website?: string | null; logo?: string | null } }) {
  const content = (
    <div className="opacity-85 hover:opacity-100 hover:scale-105 transition-all duration-300 transform-gpu cursor-pointer flex items-center justify-center text-slate-900">
      {brand.logo && (
        <div className="relative w-20 h-10 md:w-16 md:h-14">
          <Image
            src={brand.logo}
            alt={brand.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 96px, 128px"
          />
        </div>
      )}
      {brand.name && (
        <span className="font-bold text-lg md:text-xl text-slate-900 tracking-tight">{brand.name}</span>
      )}
    </div>
  );

  // Normalize URL: add https:// if no protocol
  const websiteUrl = brand.website
    ? (brand.website.startsWith('http://') || brand.website.startsWith('https://')
      ? brand.website
      : `https://${brand.website}`)
    : null;

  if (websiteUrl) {
    return (
      <a href={websiteUrl} target="_blank" rel="noopener noreferrer" title={brand.name} className="group focus:outline-none">
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}
