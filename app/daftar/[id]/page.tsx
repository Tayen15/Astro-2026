'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FormStep from './FormStep';
import PaymentStep from './PaymentStep';
import { ArrowLeft, Trophy, Loader2 } from 'lucide-react';
import Image from 'next/image';

const MotionImage = motion.create(Image);

interface CompetitionData {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  fee: number;
  maxSlots: number;
  filledSlots: number;
  scheduleDate: string;
  location: string;
  prizes: { first: string; second: string; third: string };
  rulesSummary: string[];
  rulebookUrl: string;
  registrationUrl?: string;
  contactPerson: { name: string; whatsapp: string };
  type?: string;
  maxTeamMembers?: number;
  minTeamMembers?: number;
}

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
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    accent: 'bg-cyan-500',
    iconBg: 'bg-cyan-50 text-cyan-600',
    iconBorder: 'border-cyan-200',
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [competition, setCompetition] = useState<CompetitionData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
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
    params.then(async (p) => {
      setResolvedId(p.id);
      try {
        // Check if there's a regId query param (continue payment flow)
        const regId = new URLSearchParams(window.location.search).get('regId');

        const [compRes] = await Promise.all([
          fetch(`/api/competitions/${p.id}`),
        ]);
        const compJson = await compRes.json();
        if (!compJson.data) {
          setNotFound(true);
          setFetching(false);
          return;
        }

        const c = compJson.data;
        setCompetition({
          id: c.id,
          title: c.title,
          category: c.category,
          tagline: c.tagline || '',
          description: c.description || '',
          fee: c.fee,
          maxSlots: c.maxSlots,
          filledSlots: c.filledSlots,
          scheduleDate: c.scheduleDate?.toISOString?.() || c.scheduleDate || '',
          location: c.location || '',
          prizes: { first: c.prizesFirst || '', second: c.prizesSecond || '', third: c.prizesThird || '' },
          rulesSummary: c.rulesSummary || [],
          rulebookUrl: c.rulebookUrl || '',
          registrationUrl: '',
          contactPerson: { name: c.contactName || '', whatsapp: c.contactWhatsapp || '' },
          type: c.type || 'individual',
          maxTeamMembers: c.maxTeamMembers || 1,
          minTeamMembers: c.minTeamMembers || 1,
        });

        // If regId provided, fetch existing registration data
        if (regId) {
          const regRes = await fetch(`/api/registrations/${regId}`);
          const regJson = await regRes.json();
          if (regJson.data) {
            const r = regJson.data;
            setRegistrationId(r.id);
            setPaymentReference(r.paymentReference);
            setFormData({
              fullName: r.fullName || '',
              teamName: r.teamName || '',
              institution: r.institution || '',
              identityNumber: r.identityNumber || '',
              leaderName: r.leaderName || '',
              leaderIdentity: r.leaderIdentity || '',
              email: r.email || '',
              whatsapp: r.whatsapp || '',
              members: r.members || '',
            });
            setStep(1); // Stay on form step with pre-filled data
          }
        }
      } catch {
        setNotFound(true);
      }
      setFetching(false);
    });
  }, [params]);

  if (fetching || !resolvedId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-astro-cyan" />
      </div>
    );
  }

  if (notFound || !competition) {
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
  const isTeam = competition.type === 'team';

  const handleFormSubmit = (regId: string, ref: string) => {
    setRegistrationId(regId);
    setPaymentReference(ref);
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
          <section className="relative pt-36 pb-14 md:pt-40 md:pb-18 overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100">
            {/* ─── SKY BACKGROUND ─── */}
            <div className="absolute inset-0 -z-10 " />

            {/* ─── FLOATING BLOBS ─── */}
            {[
              { src: '/assets/blob-round.png', w: 80, h: 80, className: 'absolute top-[6%] -left-[2%] w-12 h-12 md:w-28 md:h-28 object-contain pointer-events-none select-none z-0', dur: 7, delay: 0 },
              { src: '/assets/blob-round.png', w: 72, h: 72, className: 'absolute top-[12%] -right-[2%] w-10 h-10 md:w-24 md:h-24 object-contain pointer-events-none select-none z-0', dur: 9, delay: 0.15 },
              { src: '/assets/blob-round.png', w: 64, h: 64, className: 'absolute bottom-[18%] left-[4%] w-8 h-8 md:w-20 md:h-20 object-contain pointer-events-none select-none z-0', dur: 6, delay: 0.3 },
              { src: '/assets/blob-round.png', w: 96, h: 96, className: 'absolute bottom-[8%] right-[3%] w-12 h-12 md:w-32 md:h-32 object-contain pointer-events-none select-none z-0', dur: 10, delay: 0.1 },
            ].map((b, i) => (
              <MotionImage
                key={`blob-${i}`}
                src={b.src}
                alt=""
                width={b.w}
                height={b.h}
                animate={reduce ? undefined : { y: [0, -14, 0] }}
                transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
                className={b.className}
              />
            ))}

            {/* ─── FLOATING CLOUDS ─── */}
            <MotionImage
              src="/assets/awan1.png"
              alt=""
              width={160}
              height={120}
              animate={reduce ? undefined : { x: [0, 15, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[10%] left-[2%] w-16 h-auto md:w-40 md:h-auto object-contain pointer-events-none select-none z-0 opacity-40"
            />
            <MotionImage
              src="/assets/awan2.png"
              alt=""
              width={200}
              height={140}
              animate={reduce ? undefined : { x: [0, -12, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[30%] right-[3%] w-20 h-auto md:w-48 md:h-auto object-contain pointer-events-none select-none z-0 opacity-35"
            />

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
                className="text-xl md:text-3xl font-black uppercase tracking-tight mb-2 bg-gradient-to-r from-sky-900 via-cyan-800 to-slate-800 bg-clip-text text-transparent"
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

          </section>

          {/* ─── CONTENT ─── */}
          <section className="relative bg-gradient-to-b from-sky-100 via-sky-50 to-white pb-20 md:pb-28 overflow-hidden">
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
                      competition={competition as any}
                      isTeam={isTeam}
                      formData={formData}
                      setFormData={setFormData}
                      onContinue={handleFormSubmit}
                      existingRegId={registrationId}
                      existingRef={paymentReference}
                      maxTeamMembers={competition.maxTeamMembers || 5}
                      minTeamMembers={competition.minTeamMembers || 1}
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
                      competition={competition as any}
                      formData={formData}
                      isTeam={isTeam}
                      registrationId={registrationId || ''}
                      paymentReference={paymentReference || ''}
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
