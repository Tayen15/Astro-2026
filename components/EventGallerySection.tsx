'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Camera, X, ChevronLeft, ChevronRight, Heart, Share2, ZoomIn } from 'lucide-react';

const MotionImage = motion.create(Image);

interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Competition' | 'Seminar' | 'Awarding' | 'Behind The Scene';
  imageUrl: string;
  year: 'ASTRO 2025' | 'ASTRO 2024' | 'ASTRO 2023';
  likesCount: number;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'p1',
    title: 'Finalis CTF Challenge Demonstrasi',
    category: 'Competition',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=85',
    year: 'ASTRO 2025',
    likesCount: 142,
  },
  {
    id: 'p2',
    title: 'Sesi Penyerahan Trofi Juara',
    category: 'Awarding',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=85',
    year: 'ASTRO 2025',
    likesCount: 289,
  },
  {
    id: 'p3',
    title: 'Keynote Speaker Tech Seminar',
    category: 'Seminar',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=85',
    year: 'ASTRO 2025',
    likesCount: 98,
  },
  {
    id: 'p4',
    title: 'Dokumentasi Crew & Perlengkapan',
    category: 'Behind The Scene',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=85',
    year: 'ASTRO 2025',
    likesCount: 210,
  },
  {
    id: 'p5',
    title: 'Turnamen MLBB Grand Finals Stage',
    category: 'Competition',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=85',
    year: 'ASTRO 2024',
    likesCount: 355,
  },
  {
    id: 'p6',
    title: 'Workshop AI & Future Innovation',
    category: 'Seminar',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=85',
    year: 'ASTRO 2024',
    likesCount: 176,
  },
  {
    id: 'p7',
    title: 'Pertandingan Futsal Ketangkasan',
    category: 'Competition',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=85',
    year: 'ASTRO 2024',
    likesCount: 194,
  },
  {
    id: 'p8',
    title: 'Selebrasi Pemenang Juara Umum',
    category: 'Awarding',
    imageUrl: 'https://images.unsplash.com/photo-1567942712661-82b9b407abbf?w=1200&q=85',
    year: 'ASTRO 2023',
    likesCount: 412,
  },
];

const CATEGORIES = ['ALL', 'Competition', 'Seminar', 'Awarding', 'Behind The Scene'] as const;

export default function EventGallerySection() {
  const reduce = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);

  const filteredPhotos = activeCategory === 'ALL'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === activeCategory);

  // Duplicated arrays for seamless continuous infinite marquee sliding
  const marqueeRow1 = [...filteredPhotos, ...filteredPhotos, ...filteredPhotos];
  const marqueeRow2 = [...filteredPhotos.slice().reverse(), ...filteredPhotos.slice().reverse(), ...filteredPhotos.slice().reverse()];

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev === 0 ? filteredPhotos.length - 1 : (prev as number) - 1));
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev === filteredPhotos.length - 1 ? 0 : (prev as number) + 1));
  };

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedPhotos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex]);

  return (
    <section id="gallery" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-sky-100 text-slate-900">
      {/* ─── SKY BACKGROUND GLOWS ─── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-cyan-300/25 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ─── FLOATING DECORATIVE CLOUDS & BLOBS ─── */}
      <MotionImage
        src="/assets/cloud.png"
        alt=""
        width={320}
        height={220}
        animate={reduce ? undefined : { x: [0, 20, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[6%] -left-12 w-72 md:w-96 h-auto opacity-75 pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/cloud.png"
        alt=""
        width={350}
        height={240}
        animate={reduce ? undefined : { x: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[14%] -right-16 w-80 md:w-[420px] h-auto opacity-70 pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/blob-round.png"
        alt=""
        width={112}
        height={112}
        animate={reduce ? undefined : { y: [0, -18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] right-[12%] w-16 h-16 md:w-28 md:h-28 object-contain pointer-events-none select-none z-0 opacity-80"
      />

      <div className="relative z-10 w-full">
        
        {/* ── Section Header ── */}
        <div className="text-center mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="flex justify-center mb-3">
            <div className="accent-line" />
          </div>
          <h2 className="font-masterpiece text-4xl sm:text-5xl md:text-6xl text-slate-900 leading-tight tracking-tight mb-3">
            EVENT <span className="text-astro-cyan">GALLERY</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-700 font-bold max-w-xl mx-auto leading-relaxed mb-6">
            Kumpulan momen berharga, dokumentasi keseruan lomba, seminar, dan perayaan kemenangan ASTRO dari masa ke masa.
          </p>

          {/* ── Frosted Glass Category Filter Pills ── */}
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 pt-1 px-2 no-scrollbar max-w-full">
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 md:px-5 py-2 text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer select-none whitespace-nowrap backdrop-blur-xl ${
                    isActive
                      ? 'bg-astro-cyan text-slate-950 shadow-md border border-cyan-200 scale-105 z-10'
                      : 'bg-white/40 text-slate-800 border border-white/80 hover:bg-white/70 hover:text-slate-950 shadow-sm'
                  }`}
                  style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                >
                  <div className="flex items-center gap-2">
                    <Camera className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-cyan-700'}`} />
                    <span>{cat}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            NARROW EDGE GRADIENT MASKS + RELAXED SLOW MARQUEE SPEED
           ════════════════════════════════════════════════════════════ */}
        <div 
          className="relative w-full overflow-hidden py-4"
          onMouseEnter={() => setIsMarqueeHovered(true)}
          onMouseLeave={() => setIsMarqueeHovered(false)}
        >
          {/* ── NARROW LEFT FADE OVERLAY MASK (Hanya di Ujung Luar) ── */}
          <div 
            className="absolute top-0 bottom-0 left-0 w-12 sm:w-16 md:w-24 bg-gradient-to-r from-sky-100 via-sky-100/60 to-transparent z-30 pointer-events-none"
          />

          {/* ── NARROW RIGHT FADE OVERLAY MASK (Hanya di Ujung Luar) ── */}
          <div 
            className="absolute top-0 bottom-0 right-0 w-12 sm:w-16 md:w-24 bg-gradient-to-l from-sky-100 via-sky-100/60 to-transparent z-30 pointer-events-none"
          />

          <div className="space-y-6">
            {/* ── Marquee Row 1 - Slow Smooth Slide Left (Duration 90s) ── */}
            <div className="relative w-full overflow-hidden flex">
              <motion.div
                animate={isMarqueeHovered ? false : { x: ['0%', '-50%'] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 90,
                    ease: 'linear',
                  },
                }}
                className="flex items-center gap-6 shrink-0"
              >
                {marqueeRow1.map((photo, idx) => (
                  <div
                    key={`r1-${photo.id}-${idx}`}
                    onClick={() => setSelectedPhotoIndex(idx % filteredPhotos.length)}
                    className="group relative w-[280px] sm:w-[330px] md:w-[380px] aspect-[4/3] shrink-0 bg-white/50 backdrop-blur-2xl border-2 border-white/80 shadow-md hover:shadow-2xl hover:border-white transition-all duration-500 cursor-pointer overflow-hidden p-3"
                    style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
                  >
                    {/* Glass Refraction Highlight */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/35 to-transparent pointer-events-none z-10" />

                    <div 
                      className="relative w-full h-full overflow-hidden bg-slate-900 border border-white/60 group-hover:border-astro-cyan transition-colors"
                      style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                    >
                      <Image
                        src={photo.imageUrl}
                        alt={photo.title}
                        fill
                        className="object-cover transition-all duration-700 ease-out group-hover:scale-115 group-hover:rotate-1 group-hover:brightness-105"
                        sizes="380px"
                      />

                      {/* Dark Gradient Legibility Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                      {/* Year Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
                        <span 
                          className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-astro-cyan text-slate-950 shadow-md"
                          style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                        >
                          {photo.year}
                        </span>
                      </div>

                      {/* Photo Title Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 text-white z-20">
                        <h4 className="text-sm md:text-base font-black text-white group-hover:text-astro-cyan transition-colors leading-tight">
                          {photo.title}
                        </h4>
                        <p className="text-[11px] text-slate-300 font-semibold mt-0.5 opacity-80">
                          {photo.category}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Marquee Row 2 - Slow Smooth Slide Right (Duration 100s) ── */}
            <div className="relative w-full overflow-hidden flex">
              <motion.div
                animate={isMarqueeHovered ? false : { x: ['-50%', '0%'] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 100,
                    ease: 'linear',
                  },
                }}
                className="flex items-center gap-6 shrink-0"
              >
                {marqueeRow2.map((photo, idx) => (
                  <div
                    key={`r2-${photo.id}-${idx}`}
                    onClick={() => setSelectedPhotoIndex(idx % filteredPhotos.length)}
                    className="group relative w-[280px] sm:w-[330px] md:w-[380px] aspect-[4/3] shrink-0 bg-white/50 backdrop-blur-2xl border-2 border-white/80 shadow-md hover:shadow-2xl hover:border-white transition-all duration-500 cursor-pointer overflow-hidden p-3"
                    style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
                  >
                    {/* Glass Refraction Highlight */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/35 to-transparent pointer-events-none z-10" />

                    <div 
                      className="relative w-full h-full overflow-hidden bg-slate-900 border border-white/60 group-hover:border-astro-cyan transition-colors"
                      style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                    >
                      <Image
                        src={photo.imageUrl}
                        alt={photo.title}
                        fill
                        className="object-cover transition-all duration-700 ease-out group-hover:scale-115 group-hover:rotate-1 group-hover:brightness-105"
                        sizes="380px"
                      />

                      {/* Dark Gradient Legibility Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                      {/* Year Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
                        <span 
                          className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-astro-cyan text-slate-950 shadow-md"
                          style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                        >
                          {photo.year}
                        </span>
                      </div>

                      {/* Photo Title Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 text-white z-20">
                        <h4 className="text-sm md:text-base font-black text-white group-hover:text-astro-cyan transition-colors leading-tight">
                          {photo.title}
                        </h4>
                        <p className="text-[11px] text-slate-300 font-semibold mt-0.5 opacity-80">
                          {photo.category}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

      </div>

      {/* ════════════════════════════════════════════════════════════
          LIGHTBOX MODAL FOR FULLSCREEN IMAGE VIEW
         ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-950/85 backdrop-blur-2xl"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-white/95 backdrop-blur-2xl border-2 border-white/80 shadow-2xl overflow-hidden p-4 md:p-6 text-slate-900"
              style={{ clipPath: 'polygon(18px 0, 100% 0, calc(100% - 18px) 100%, 0 100%)' }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-3">
                  <span 
                    className="px-3 py-1 bg-astro-cyan text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-sm"
                    style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                  >
                    {filteredPhotos[selectedPhotoIndex].year}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {filteredPhotos[selectedPhotoIndex].category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleLike(filteredPhotos[selectedPhotoIndex].id, e)}
                    className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                      likedPhotos[filteredPhotos[selectedPhotoIndex].id]
                        ? 'bg-rose-500 text-white border-rose-500 scale-110 shadow-md'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedPhotos[filteredPhotos[selectedPhotoIndex].id] ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => setSelectedPhotoIndex(null)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Lightbox Image View */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] bg-slate-200 overflow-hidden border border-slate-200">
                {/* Skeleton shimmer while loading */}
                <div className="absolute inset-0 bg-slate-200 z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_1.2s_ease-in-out_infinite]" />
                </div>

                <Image
                  key={filteredPhotos[selectedPhotoIndex].imageUrl}
                  src={filteredPhotos[selectedPhotoIndex].imageUrl}
                  alt={filteredPhotos[selectedPhotoIndex].title}
                  fill
                  className="object-cover relative z-20"
                  priority
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    const skeleton = img.parentElement?.querySelector('div:first-child');
                    if (skeleton) (skeleton as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Left/Right Lightbox Navigation Arrows */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-slate-950/70 hover:bg-astro-cyan hover:text-slate-950 text-white border border-white/20 transition-all rounded-full shadow-lg cursor-pointer z-30"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-slate-950/70 hover:bg-astro-cyan hover:text-slate-950 text-white border border-white/20 transition-all rounded-full shadow-lg cursor-pointer z-30"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Lightbox Footer Info */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900">
                    {filteredPhotos[selectedPhotoIndex].title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Foto {selectedPhotoIndex + 1} dari {filteredPhotos.length} dokumentasi resmi
                  </p>
                </div>

                <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-3 py-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-astro-cyan" /> HD Documentation
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
