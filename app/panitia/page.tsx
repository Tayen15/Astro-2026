'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Users, Search, ArrowLeft, ShieldCheck, Award, Sparkles,
  ChevronRight, CheckCircle2, Star, X, Quote
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMMITTEE_DIVISIONS } from '@/data/committeeData';
import { CommitteeMember, CommitteeDivision } from '@/types/committee';

const MotionImage = motion.create(Image);

function PanitiaContent() {
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();
  const initialDivisionParam = searchParams.get('division') || 'all';

  const [selectedDivision, setSelectedDivision] = useState<string>(initialDivisionParam);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalMember, setActiveModalMember] = useState<CommitteeMember | null>(null);

  useEffect(() => {
    const div = searchParams.get('division');
    if (div) {
      setSelectedDivision(div);
    }
  }, [searchParams]);

  // Filter divisions based on selection and search
  const filteredDivisions = COMMITTEE_DIVISIONS.filter((division) => {
    if (selectedDivision !== 'all' && division.slug !== selectedDivision) {
      return false;
    }

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const hasMatchingMember = division.members.some(
      (m) => m.name.toLowerCase().includes(query) || m.role.toLowerCase().includes(query)
    );
    const hasMatchingDivision =
      division.name.toLowerCase().includes(query) || division.shortDesc.toLowerCase().includes(query);

    return hasMatchingMember || hasMatchingDivision;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      {/* ════════════ 1. HERO HEADER (Sky Theme & Floating Clouds/Blobs) ════════════ */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 text-slate-900 overflow-hidden">
        {/* Floating Clouds */}
        <MotionImage
          src="/assets/cloud.png"
          alt=""
          width={320}
          height={220}
          animate={reduce ? undefined : { x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[8%] -left-10 w-72 md:w-96 h-auto opacity-75 pointer-events-none select-none z-0"
        />
        <MotionImage
          src="/assets/cloud.png"
          alt=""
          width={350}
          height={240}
          animate={reduce ? undefined : { x: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] -right-12 w-80 md:w-[420px] h-auto opacity-70 pointer-events-none select-none z-0"
        />
        <MotionImage
          src="/assets/blob-round.png"
          alt=""
          width={112}
          height={112}
          animate={reduce ? undefined : { y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[12%] right-[10%] w-16 h-16 md:w-28 md:h-28 object-contain pointer-events-none select-none z-0 opacity-80"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Navigation Back Link */}
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-xs font-black text-slate-700 hover:text-slate-950 transition-colors mb-6 uppercase tracking-wider bg-white/70 backdrop-blur-md border border-white px-4 py-2 shadow-sm"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
            >
              <ArrowLeft className="w-4 h-4 text-sky-600" /> Kembali ke Company Profile
            </Link>

            <span 
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/80 backdrop-blur-md border border-white text-slate-900 text-xs font-black uppercase tracking-widest mb-4 shadow-sm"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
            >
              <Users className="w-3.5 h-3.5 text-astro-cyan" /> ASTRO 2026 ORGANIZING COMMITTEE
            </span>

            <h1 className="font-masterpiece text-4xl sm:text-5xl md:text-6xl text-slate-900 leading-tight mb-4">
              Struktur <span className="text-astro-cyan">Panitia & Staf</span>
            </h1>

            <p className="text-sm md:text-base text-slate-700 font-bold leading-relaxed mb-8 max-w-xl">
              Mengenal lebih dekat jajaran pengurus harian, koordinator divisi, dan anggota staf panitia di balik pergelaran ASTRO 2026.
            </p>

            {/* Search Input Box with Frosted Glass & Parallelogram ClipPath */}
            <div className="w-full max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
              <input
                type="text"
                placeholder="Cari nama panitia atau jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/80 backdrop-blur-xl border border-white text-slate-900 text-xs md:text-sm font-semibold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-astro-cyan shadow-lg"
                style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ 2. DIVISION FILTER TABS ════════════ */}
      <section className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedDivision('all')}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer backdrop-blur-md ${
                selectedDivision === 'all'
                  ? 'bg-astro-cyan text-slate-950 shadow-md border border-cyan-200'
                  : 'bg-white/60 text-slate-700 border border-white/80 hover:bg-white hover:text-slate-950'
              }`}
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              Semua Divisi ({COMMITTEE_DIVISIONS.reduce((acc, d) => acc + d.members.length, 0)})
            </button>

            {COMMITTEE_DIVISIONS.map((division) => (
              <button
                key={division.id}
                onClick={() => setSelectedDivision(division.slug)}
                className={`px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer backdrop-blur-md ${
                  selectedDivision === division.slug
                    ? 'bg-astro-cyan text-slate-950 shadow-md border border-cyan-200'
                    : 'bg-white/60 text-slate-700 border border-white/80 hover:bg-white hover:text-slate-950'
                }`}
                style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
              >
                {division.name} ({division.members.length})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 3. COMMITTEE MEMBERS LIST BY DIVISION ════════════ */}
      <main className="flex-grow py-12 md:py-20 bg-gradient-to-b from-sky-50/60 via-white to-sky-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {filteredDivisions.length === 0 ? (
            <div 
              className="text-center py-16 bg-white/70 backdrop-blur-xl border border-white p-8 shadow-md"
              style={{ clipPath: 'polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%)' }}
            >
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800">Panitia Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 mt-1">Coba kata kunci pencarian lain atau pilih divisi yang berbeda.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDivision('all');
                }}
                className="mt-4 px-6 py-2.5 bg-astro-cyan text-slate-950 font-black text-xs uppercase tracking-wider"
                style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredDivisions.map((division) => {
              const members = searchQuery.trim()
                ? division.members.filter(
                    (m) =>
                      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      m.role.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                : division.members;

              if (members.length === 0) return null;

              const leader = members.find((m) => m.isLeader) || members[0];
              const staffMembers = members.filter((m) => m.id !== leader.id);

              return (
                <div key={division.id} className="scroll-mt-32">
                  {/* Division Header Banner */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200/80 pb-4 mb-8 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="accent-line" />
                        <span className="text-xs font-black text-astro-cyan uppercase tracking-widest">
                          DIVISI {division.slug.toUpperCase()}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                        {division.name}
                      </h2>
                      <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl">
                        {division.fullDesc}
                      </p>
                    </div>

                    <span 
                      className="self-start md:self-auto px-3.5 py-1.5 bg-white/80 border border-white text-cyan-800 text-xs font-bold shadow-xs"
                      style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                    >
                      Total: {division.members.length} Panitia & Staf
                    </span>
                  </div>

                  {/* Division Leader Feature Card (Frosted Glassmorphism) */}
                  {leader && (
                    <div className="mb-8">
                      <div 
                        className="relative bg-white/60 backdrop-blur-2xl border-2 border-white/80 p-6 md:p-8 text-slate-900 shadow-[0_20px_50px_rgba(14,165,233,0.15)] overflow-hidden"
                        style={{ clipPath: 'polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%)' }}
                      >
                        {/* Glass Sheen Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/40 to-transparent pointer-events-none" />

                        <div className="grid md:grid-cols-12 gap-6 items-center relative z-10">
                          {/* Leader Portrait Image in Parallelogram Frame with Dual Motion */}
                          <div className="md:col-span-4 lg:col-span-3">
                            <div 
                              className="relative aspect-[3/4] overflow-hidden border-2 border-white shadow-xl bg-slate-900 group"
                              style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
                            >
                              <Image
                                src={leader.image}
                                alt={leader.name}
                                fill
                                className="object-cover transition-all duration-500 ease-out group-hover:scale-115 group-hover:rotate-1 group-hover:brightness-105"
                                sizes="(max-width: 768px) 100vw, 240px"
                              />
                              <div 
                                className="absolute top-2.5 left-2.5 bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-3 py-1 shadow-sm z-10"
                                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                              >
                                Koordinator Divisi
                              </div>

                              {/* Hover Action Ribbon */}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                                <span className="text-[10px] font-black uppercase text-astro-cyan bg-slate-950/90 px-3 py-1 rounded-sm tracking-wider flex items-center gap-1">
                                  <span>Detail Profil</span>
                                  <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Leader Profile Bio */}
                          <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-center">
                            <div 
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 border border-white text-cyan-800 text-xs font-bold uppercase tracking-wider mb-2 w-fit shadow-xs"
                              style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                            >
                              <Award className="w-3.5 h-3.5 text-cyan-600" /> {division.name}
                            </div>

                            <h3 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                              {leader.name}
                            </h3>
                            <p className="text-xs md:text-sm font-bold text-sky-800 uppercase tracking-wider mt-1 mb-3">
                              {leader.role} ASTRO 2026
                            </p>

                            {/* Anti-Slop Bespoke Glass Quote Badge Container */}
                            {leader.quote && (
                              <div 
                                className="relative my-3 p-4 md:p-5 bg-white/70 backdrop-blur-md border border-white/90 shadow-xs"
                                style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                              >
                                <div className="flex items-start gap-3">
                                  <div 
                                    className="w-7 h-7 bg-astro-cyan text-slate-950 flex items-center justify-center shrink-0 font-black text-xs shadow-xs mt-0.5"
                                    style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                                  >
                                    <Quote className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                                  </div>
                                  <div>
                                    <p className="text-xs md:text-sm font-semibold text-slate-800 italic leading-relaxed">
                                      &ldquo;{leader.quote}&rdquo;
                                    </p>
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-800 mt-1 block">
                                      — Pesan & Visi Koordinator
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-2">
                              <button
                                onClick={() => setActiveModalMember(leader)}
                                className="px-6 py-3 bg-astro-cyan hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
                                style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                              >
                                Detail Profil
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Staff Members Grid with Frosted Glass Cards & Dual Motion Hover */}
                  {staffMembers.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">
                        Anggota Staf Divisi {division.name}
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {staffMembers.map((member) => (
                          <motion.div
                            key={member.id}
                            whileHover={{ y: -6, scale: 1.02 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            onClick={() => setActiveModalMember(member)}
                            className="bg-white/60 backdrop-blur-xl border border-white/80 overflow-hidden shadow-md hover:shadow-2xl hover:border-white hover:bg-white/80 transition-all duration-300 cursor-pointer group flex flex-col justify-between p-3 relative"
                            style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
                          >
                            {/* Photo Container with Gerakan 1 (Image Zoom, Tilt, & Brightness Boost) */}
                            <div 
                              className="relative aspect-[4/5] bg-slate-900 overflow-hidden border border-white/60 mb-3 rounded-lg"
                              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                            >
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover group-hover:scale-115 group-hover:rotate-2 group-hover:brightness-105 transition-all duration-500 ease-out"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />

                              {/* Gradient Dark Overlay on Hover */}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-40 group-hover:opacity-85 transition-opacity duration-300" />

                              {/* Gerakan 2: Slide-up Parallelogram Action Badge on Hover */}
                              <div className="absolute bottom-2 left-2 right-2 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                                <div 
                                  className="w-full py-1.5 bg-astro-cyan text-slate-950 font-black text-[10px] uppercase tracking-wider text-center flex items-center justify-center gap-1 shadow-md"
                                  style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                                >
                                  <span>Lihat Profil</span>
                                  <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                </div>
                              </div>
                            </div>

                            {/* Card Bottom Details */}
                            <div className="text-center flex-grow flex flex-col justify-between pt-1">
                              <div>
                                <h5 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-cyan-700 transition-colors">
                                  {member.name}
                                </h5>
                                <p className="text-[10px] sm:text-xs text-slate-600 font-bold mt-0.5 uppercase tracking-wider group-hover:text-slate-900 transition-colors">
                                  {member.role}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* ════════════ 4. COMMITTEE MEMBER DETAIL MODAL (Frosted Glassmorphism Modal) ════════════ */}
      <AnimatePresence>
        {activeModalMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalMember(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white/90 backdrop-blur-2xl shadow-2xl overflow-hidden z-10 border-2 border-white"
              style={{ clipPath: 'polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%)' }}
            >
              <div className="relative aspect-[16/9] bg-slate-900">
                <Image
                  src={activeModalMember.image}
                  alt={activeModalMember.name}
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <button
                  onClick={() => setActiveModalMember(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span 
                    className="px-2.5 py-1 bg-astro-cyan text-slate-950 text-[10px] font-black uppercase tracking-wider inline-block mb-1"
                    style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                  >
                    {activeModalMember.divisionName}
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    {activeModalMember.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-semibold">
                    {activeModalMember.role}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4 text-xs md:text-sm text-slate-700">
                {activeModalMember.quote && (
                  <div>
                    <h6 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-1">
                      Pesan & Motto:
                    </h6>
                    <div 
                      className="italic text-slate-800 bg-white/70 backdrop-blur-md p-3.5 border border-white flex items-start gap-2.5 shadow-xs"
                      style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                    >
                      <Quote className="w-4 h-4 text-cyan-600 shrink-0 fill-cyan-600 mt-0.5" />
                      <span>&ldquo;{activeModalMember.quote}&rdquo;</span>
                    </div>
                  </div>
                )}

                <div>
                  <h6 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-1">
                    Status Kepanitiaan:
                  </h6>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Terverifikasi Panitia Resmi ASTRO 2026</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setActiveModalMember(null)}
                    className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-md"
                    style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function PanitiaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-sky-300 text-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-astro-cyan"></div>
      </div>
    }>
      <PanitiaContent />
    </Suspense>
  );
}
