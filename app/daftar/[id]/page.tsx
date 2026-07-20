'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import astroData from '@/data/astro-data.json';
import type { AstroData, Competition } from '@/types/astro';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FormStep from './FormStep';
import PaymentStep from './PaymentStep';
import { ArrowLeft, Trophy } from 'lucide-react';

const data = astroData as AstroData;

const categoryConfig: Record<string, {
  label: string;
  color: string;
  bg: string;
  border: string;
  accent: string;
  iconBg: string;
  iconBorder: string;
}> = {
  akademik: {
    label: 'AKADEMIK',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accent: 'bg-emerald-500',
    iconBg: 'bg-emerald-50 text-emerald-600',
    iconBorder: 'border-emerald-200',
  },
  olahraga: {
    label: 'OLAHRAGA',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    accent: 'bg-orange-500',
    iconBg: 'bg-orange-50 text-orange-600',
    iconBorder: 'border-orange-200',
  },
  esports: {
    label: 'ESPORTS',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    accent: 'bg-purple-500',
    iconBg: 'bg-purple-50 text-purple-600',
    iconBorder: 'border-purple-200',
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RegistrationPage({ params }: PageProps) {
  const router = useRouter();
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    teamName: '',
    institution: '',
    identityNumber: '',
    leaderName: '',
    leaderIdentity: '',
    email: '',
    whatsapp: '',
    members: '',
  });

  useEffect(() => {
    params.then((p) => setResolvedId(p.id));
  }, [params]);

  if (!resolvedId) return null;

  const competition = data.competitions.find((c) => c.id === resolvedId);

  if (!competition) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center space-y-4">
            <h1 className="text-display text-slate-900">404</h1>
            <p className="text-slate-500">Lomba tidak ditemukan.</p>
            <Link
              href="/#competitions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-astro-cyan text-slate-950 font-black text-xs tracking-wider uppercase transition-all duration-200"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Lomba
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const cat = categoryConfig[competition.category] || categoryConfig.akademik;
  const isTeam = competition.id !== 'science-olympiad' && competition.id !== 'fifa-championship';

  const handleFormSubmit = () => {
    setStep(2);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const stepVariants = {
    enter: { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.25, ease: 'easeIn' as const } },
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col justify-between bg-white">
        <main className="flex-grow">
          {/* ─── HEADER ─── */}
          <section className="relative pt-36 pb-14 md:pt-40 md:pb-18 overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
              <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-astro-violet/5 via-astro-cyan/3 to-transparent blur-[120px] rounded-full" />
              <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-astro-violet/3 blur-[140px] rounded-full" />
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)',
                backgroundSize: '80px 80px',
              }} />
              <div className="absolute top-[20%] left-0 w-[200px] h-[2px] bg-gradient-to-r from-slate-200/40 to-transparent skew-x-[-12deg]" />
              <div className="absolute top-[30%] right-0 w-[150px] h-[2px] bg-gradient-to-l from-slate-200/30 to-transparent skew-x-[12deg]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Back link */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-6"
              >
                <Link
                  href={`/lomba/${competition.id}`}
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-500 hover:text-cyan-600 transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                  Kembali ke Detail Lomba
                </Link>
              </motion.div>

              {/* Category badge */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-4"
              >
                <span
                  className={`inline-flex items-center px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase ${cat.bg} ${cat.color} ${cat.border} border`}
                  style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                >
                  {cat.label}
                </span>
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tight mb-2"
              >
                Pendaftaran {competition.title}
              </motion.h1>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="accent-line mb-4"
              />

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-sm text-slate-600 font-light flex items-center gap-1.5"
              >
                <Trophy className="w-4 h-4 text-astro-cyan" />
                Biaya Pendaftaran:{' '}
                <span className="font-bold text-slate-900">Rp {competition.fee.toLocaleString('id-ID')}</span>
                <span className="text-slate-300 mx-1">|</span>
                {isTeam ? 'Kategori Tim' : 'Kategori Individu'}
              </motion.p>

              {/* ─── STEP INDICATOR ─── */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mt-8 flex items-center gap-0"
              >
                {/* Step 1 */}
                <div className="flex items-center">
                  <motion.div
                    animate={step === 1 ? { scale: 1.05 } : { scale: 1 }}
                    className={`flex items-center justify-center w-10 h-10 ${
                      step === 1 ? 'bg-astro-cyan text-slate-950' : 'bg-slate-100 text-slate-500'
                    } font-black text-sm transition-all duration-300`}
                    style={{ clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}
                  >
                    1
                  </motion.div>
                  <span className={`ml-2 text-[10px] font-bold uppercase tracking-wider ${
                    step === 1 ? 'text-astro-cyan' : 'text-slate-400'
                  }`}>
                    Form
                  </span>
                </div>

                {/* Connector line */}
                <div className="w-12 md:w-20 h-[2px] mx-3 relative">
                  <div className="absolute inset-0 bg-slate-200" />
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-astro-cyan"
                    initial={{ width: '0%' }}
                    animate={{ width: step === 2 ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                {/* Step 2 */}
                <div className="flex items-center">
                  <motion.div
                    animate={step === 2 ? { scale: 1.05 } : { scale: 1 }}
                    className={`flex items-center justify-center w-10 h-10 ${
                      step === 2 ? 'bg-astro-cyan text-slate-950' : 'bg-slate-100 text-slate-500'
                    } font-black text-sm transition-all duration-300`}
                    style={{ clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}
                  >
                    2
                  </motion.div>
                  <span className={`ml-2 text-[10px] font-bold uppercase tracking-wider ${
                    step === 2 ? 'text-astro-cyan' : 'text-slate-400'
                  }`}>
                    Bayar
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Diagonal bottom cut */}
            <div className="absolute bottom-0 left-0 right-0 h-16 z-20 pointer-events-none">
              <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
                <polygon points="0,64 1440,0 1440,64" fill="white" />
              </svg>
            </div>
          </section>

          {/* ─── CONTENT ─── */}
          <section className="bg-white pb-20 md:pb-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="form-step"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <FormStep
                      competition={competition}
                      isTeam={isTeam}
                      formData={formData}
                      setFormData={setFormData}
                      onContinue={handleFormSubmit}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="payment-step"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <PaymentStep
                      competition={competition}
                      formData={formData}
                      isTeam={isTeam}
                      onBack={() => setStep(1)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
