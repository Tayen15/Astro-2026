'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/src/lib/auth-client';
import { motion } from 'motion/react';
import { Loader2, ArrowLeft, Mail, KeyRound, CheckCircle2, Clock } from 'lucide-react';

type Step = 'form' | 'otp' | 'success';

export default function SignupPage() {
  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Better Auth: signUp.email with sendVerificationOnSignUp sends the OTP email
      const { error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (signUpError) {
        setError(signUpError.message || 'Gagal mengirim OTP');
        setLoading(false);
        return;
      }

      setStep('otp');
      setMessage('Kode OTP telah dikirim ke email Anda.');
      startCooldown();
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    }
    setLoading(false);
  };

  const startCooldown = () => {
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: resendError } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification',
      });

      if (resendError) {
        setError(resendError.message || 'Gagal mengirim ulang OTP');
      } else {
        setMessage('Kode OTP baru telah dikirim.');
        startCooldown();
      }
    } catch {
      setError('Terjadi kesalahan.');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Masukkan 6 digit kode OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: verifyError } = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });

      if (verifyError) {
        setError(verifyError.message || 'Kode OTP tidak valid');
        setLoading(false);
        return;
      }

      setStep('success');
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Terjadi kesalahan.');
    }
    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
  };

  // ─── SUCCESS ───
  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100">
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 p-8 md:p-10 text-center"
            style={{ clipPath: 'polygon(24px 0, 100% 0, calc(100% - 24px) 100%, 0 100%)' }}
          >
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Pendaftaran Berhasil!</h2>
            <p className="text-sm text-slate-600 mb-6">Silakan login dengan akun baru Anda.</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-astro-cyan text-slate-950 font-black text-xs tracking-wider uppercase hover:bg-cyan-400 transition-all"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              Login Sekarang
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100">
      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 md:p-10"
            style={{ clipPath: 'polygon(24px 0, 100% 0, calc(100% - 24px) 100%, 0 100%)' }}
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-cyan-600 uppercase tracking-wider transition-colors mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali
            </Link>

            {/* ─── Step Form ─── */}
            {step === 'form' && (
              <>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 text-center uppercase tracking-tight mb-1">
                  Daftar Akun
                </h1>
                <p className="text-sm text-slate-500 text-center font-light mb-8">
                  Buat akun untuk melacak pendaftaran
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium p-3 mb-5 text-center"
                    style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em]">Nama Lengkap</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-astro-cyan"
                      style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em]">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-astro-cyan"
                      style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em]">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-astro-cyan"
                      style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full px-8 py-3.5 bg-astro-cyan hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-black text-sm tracking-wider uppercase transition-all cursor-pointer disabled:cursor-not-allowed"
                    style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
                    ) : (
                      <><Mail className="w-4 h-4" /> Kirim Kode OTP</>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ─── Step OTP ─── */}
            {step === 'otp' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-cyan-50 border border-cyan-200 rounded-full flex items-center justify-center">
                    <KeyRound className="w-7 h-7 text-astro-cyan" />
                  </div>
                </div>

                <h1 className="text-xl md:text-2xl font-black text-slate-900 text-center uppercase tracking-tight mb-1">
                  Verifikasi OTP
                </h1>
                <p className="text-sm text-slate-500 text-center font-light mb-2">
                  Masukkan kode yang dikirim ke
                </p>
                <p className="text-sm font-bold text-slate-900 text-center mb-6">{email}</p>

                {message && (
                  <div className="bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-medium p-3 mb-5 text-center"
                    style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                  >
                    {message}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium p-3 mb-5 text-center"
                    style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                  >
                    {error}
                  </div>
                )}

                <div className="flex justify-center gap-2 md:gap-3 mb-6" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 h-12 md:w-12 md:h-14 text-center text-lg font-black bg-white border-2 border-slate-200 focus:border-astro-cyan focus:outline-none transition-colors rounded-lg"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.join('').length !== 6}
                  className="flex items-center justify-center gap-2 w-full px-8 py-3.5 bg-astro-cyan hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-black text-sm tracking-wider uppercase transition-all cursor-pointer disabled:cursor-not-allowed"
                  style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Memverifikasi...</>
                  ) : (
                    <>Verifikasi & Daftar</>
                  )}
                </button>

                <div className="text-center mt-5">
                  <button
                    onClick={handleResendOTP}
                    disabled={loading || cooldown > 0}
                    className="text-xs font-bold text-slate-500 hover:text-astro-cyan uppercase tracking-wider transition-colors cursor-pointer disabled:text-slate-300 disabled:cursor-not-allowed"
                  >
                    {cooldown > 0 ? (
                      <span className="flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" /> Kirim ulang ({cooldown}s)
                      </span>
                    ) : (
                      'Kirim ulang OTP'
                    )}
                  </button>
                </div>
              </>
            )}

            <p className="text-xs text-slate-500 text-center mt-5">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-astro-cyan font-bold hover:underline">Masuk</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
