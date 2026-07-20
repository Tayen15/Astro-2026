import astroData from '@/data/astro-data.json';
import type { AstroData } from '@/types/astro';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterSection from './RegisterSection';
import { Trophy, CalendarDays, MapPin, DollarSign, Users, ArrowLeft, FileText, MessageCircle } from 'lucide-react';

const data = astroData as AstroData;

interface PageProps {
  params: Promise<{ id: string }>;
}

const categoryConfig = {
  akademik: {
    label: 'AKADEMIK',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accent: 'bg-emerald-500',
    accentLight: 'bg-emerald-500/10',
    dot: 'bg-emerald-500',
    iconBg: 'bg-emerald-50 text-emerald-600',
    iconBorder: 'border-emerald-200',
  },
  olahraga: {
    label: 'OLAHRAGA',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    accent: 'bg-orange-500',
    accentLight: 'bg-orange-500/10',
    dot: 'bg-orange-500',
    iconBg: 'bg-orange-50 text-orange-600',
    iconBorder: 'border-orange-200',
  },
  esports: {
    label: 'ESPORTS',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    accent: 'bg-purple-500',
    accentLight: 'bg-purple-500/10',
    dot: 'bg-purple-500',
    iconBg: 'bg-purple-50 text-purple-600',
    iconBorder: 'border-purple-200',
  },
} as const;

export default async function CompetitionDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const competition = data.competitions.find((c) => c.id === id);

  if (!competition) {
    notFound();
  }

  const cat = categoryConfig[competition.category as keyof typeof categoryConfig] || categoryConfig.akademik;
  const leftSlots = competition.maxSlots - competition.filledSlots;
  const ratio = Math.min((competition.filledSlots / competition.maxSlots) * 100, 100);

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col justify-between bg-white">
        <main className="flex-grow">
          {/* ─── 1. HERO ─── */}
          <section className="relative pt-36 pb-20 md:pt-40 md:pb-28 overflow-hidden">
            {/* Background layers */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
              <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-astro-violet/5 via-astro-cyan/3 to-transparent blur-[120px] rounded-full" />
              <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-astro-violet/3 blur-[140px] rounded-full" />
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)',
                backgroundSize: '80px 80px',
              }} />
              {/* Angular accent lines */}
              <div className="absolute top-[20%] left-0 w-[200px] h-[2px] bg-gradient-to-r from-slate-200/40 to-transparent skew-x-[-12deg]" />
              <div className="absolute top-[30%] right-0 w-[150px] h-[2px] bg-gradient-to-l from-slate-200/30 to-transparent skew-x-[12deg]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Back link */}
              <div className="mb-8">
                <Link
                  href="/#competitions"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-500 hover:text-cyan-600 transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                  Kembali ke Lomba
                </Link>
              </div>

              {/* Category badge */}
              <div className="mb-5">
                <span
                  className={`inline-flex items-center px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase ${cat.bg} ${cat.color} ${cat.border} border`}
                  style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                >
                  {cat.label}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-display text-slate-900 mb-4 max-w-4xl">
                {competition.title}
              </h1>

              {/* Tagline */}
              {competition.tagline && (
                <p className="text-base md:text-lg text-slate-600 font-light max-w-2xl mb-6">
                  {competition.tagline}
                </p>
              )}

              {/* Accent line */}
              <div className="accent-line mb-6" />

              {/* Description */}
              <div className="max-w-3xl text-sm md:text-base text-slate-600 leading-relaxed">
                <p>{competition.description}</p>
              </div>
            </div>

            {/* Diagonal bottom cut */}
            <div className="absolute bottom-0 left-0 right-0 h-20 z-20 pointer-events-none">
              <svg viewBox="0 0 1440 96" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
                <polygon points="0,96 1440,0 1440,96" fill="white" />
              </svg>
            </div>
          </section>

          {/* ─── 2. DETAILS ─── */}
          <section className="bg-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                {/* ── LEFT COLUMN ── */}
                <div className="lg:col-span-7 space-y-12">

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Biaya */}
                    <div
                      className="bg-white border border-slate-200 p-5 flex items-start gap-4 transition-all hover:border-slate-300 group"
                      style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                    >
                      <div className={`p-3 ${cat.iconBg} ${cat.iconBorder} border`}
                        style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                      >
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                          Biaya Pendaftaran
                        </span>
                        <span className="block text-lg font-black text-slate-900 mt-1">
                          Rp {competition.fee.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Jadwal */}
                    <div
                      className="bg-white border border-slate-200 p-5 flex items-start gap-4 transition-all hover:border-slate-300 group"
                      style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                    >
                      <div className={`p-3 ${cat.iconBg} ${cat.iconBorder} border`}
                        style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                      >
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                          Jadwal Pelaksanaan
                        </span>
                        <span className="block text-base font-bold text-slate-900 mt-1 leading-snug">
                          {new Date(competition.scheduleDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Lokasi */}
                    <div
                      className="bg-white border border-slate-200 p-5 flex items-start gap-4 transition-all hover:border-slate-300 group"
                      style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                    >
                      <div className={`p-3 ${cat.iconBg} ${cat.iconBorder} border`}
                        style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                      >
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                          Lokasi Venue
                        </span>
                        <span className="block text-base font-bold text-slate-900 mt-1 leading-snug">
                          {competition.location}
                        </span>
                      </div>
                    </div>

                    {/* Kuota */}
                    <div
                      className="bg-white border border-slate-200 p-5 flex items-start gap-4 transition-all hover:border-slate-300 group"
                      style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                    >
                      <div className={`p-3 ${cat.iconBg} ${cat.iconBorder} border`}
                        style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                      >
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                          Kuota Peserta
                        </span>
                        <span className="block text-base font-bold text-slate-900 mt-1 leading-snug">
                          {competition.filledSlots} / {competition.maxSlots} Terisi
                        </span>
                        {/* Slot bar */}
                        <div className="w-full h-1 bg-slate-100 mt-2">
                          <div
                            className={`h-full ${cat.accent} transition-all duration-700`}
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                        <span className={`block text-[10px] font-bold uppercase tracking-wider mt-1 ${leftSlots <= 5 ? 'text-red-600' : 'text-slate-500'}`}>
                          {leftSlots > 0 ? `Sisa ${leftSlots} slot` : 'Penuh'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Prizes ── */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="accent-line" />
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                        Hadiah Pemenang
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          rank: 'Juara 1',
                          prize: competition.prizes.first,
                          style: 'border-amber-200 bg-amber-50/40',
                          accentLine: 'bg-amber-500',
                          iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
                        },
                        {
                          rank: 'Juara 2',
                          prize: competition.prizes.second,
                          style: 'border-slate-200 bg-slate-50/40',
                          accentLine: 'bg-slate-400',
                          iconColor: 'text-slate-500 bg-slate-50 border-slate-200',
                        },
                        {
                          rank: 'Juara 3',
                          prize: competition.prizes.third,
                          style: 'border-amber-200/60 bg-amber-50/20',
                          accentLine: 'bg-amber-700',
                          iconColor: 'text-amber-800 bg-amber-50 border-amber-200/60',
                        },
                      ].map((item) => (
                        <div
                          key={item.rank}
                          className="bg-white border border-slate-200 p-5 transition-all hover:border-slate-300 group"
                          style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                        >
                          {/* Top accent */}
                          <div className={`h-1 w-8 ${item.accentLine} mb-4`}
                            style={{ clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }}
                          />
                          <div className="flex items-center gap-3">
                            <div className={`p-2 border ${item.iconColor}`}
                              style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                            >
                              <Trophy className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">{item.rank}</div>
                              <div className="text-sm font-black text-slate-900 mt-0.5">{item.prize}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: Rules ── */}
                <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-slate-200 lg:pl-10">
                  <div className="flex items-center gap-3">
                    <div className="accent-line" />
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                      Peraturan Lomba
                    </h2>
                  </div>

                  <ul className="space-y-4">
                    {competition.rulesSummary.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-sm md:text-base">
                        <span
                          className={`flex-shrink-0 w-7 h-7 text-xs flex items-center justify-center font-black ${cat.iconBg} ${cat.iconBorder} border`}
                          style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="leading-relaxed text-slate-600">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 3. CTA ─── */}
          <section className="relative bg-slate-50 border-t border-slate-200 py-16 md:py-20 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-astro-cyan/3 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
              <div className="max-w-xl mx-auto space-y-4">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                  Siap untuk Berkompetisi?
                </h2>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed font-light">
                  Daftarkan tim Anda sekarang sebelum kuota penuh. Pastikan Anda telah membaca dan memahami rulebook perlombaan.
                </p>
                {/* Accent line centered */}
                <div className="flex justify-center">
                  <div className="accent-line" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <RegisterSection competition={competition} />

                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center max-w-md">
                  <a
                    href={competition.rulebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3.5 border border-slate-300 hover:border-astro-cyan text-slate-700 hover:text-cyan-700 hover:bg-white font-bold text-xs tracking-wider uppercase transition-all duration-200 w-full sm:w-1/2 cursor-pointer"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                  >
                    <FileText className="w-4 h-4" /> Baca Rulebook
                  </a>
                  <a
                    href={`https://wa.me/${competition.contactPerson.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3.5 border border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 hover:bg-white font-bold text-xs tracking-wider uppercase transition-all duration-200 w-full sm:w-1/2 cursor-pointer"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                  >
                    <MessageCircle className="w-4 h-4" /> Hubungi CP
                  </a>
                </div>
              </div>
            </div>

            {/* Diagonal transition */}
            <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
              <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
                <polygon points="0,64 1440,0 1440,64" fill="white" />
              </svg>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
