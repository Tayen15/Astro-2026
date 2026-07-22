'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/src/db/supabase/client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { LogIn, Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? 'Email atau password salah'
        : authError.message
      );
      setLoading(false);
      return;
    }

    // Check role from users table
    let isAdmin = false;
    try {
      const meRes = await fetch('/api/auth/me');
      const meJson = await meRes.json();
      isAdmin = meJson.data?.role === 'admin';
    } catch {}

    if (isAdmin) {
      router.replace('/dashboard');
    } else {
      router.replace('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100">
      {/* Floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={120}
          height={120}
          className="absolute top-[10%] -left-[2%] w-20 h-20 md:w-32 md:h-32 object-contain opacity-30"
        />
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={80}
          height={80}
          className="absolute top-[30%] -right-[2%] w-14 h-14 md:w-24 md:h-24 object-contain opacity-30"
        />
        <Image
          src="/assets/blob-round.png"
          alt=""
          width={100}
          height={100}
          className="absolute bottom-[20%] left-[5%] w-16 h-16 md:w-28 md:h-28 object-contain opacity-30"
        />
      </div>

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
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/assets/logo-astro.png"
                alt="ASTRO"
                width={64}
                height={64}
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-900 text-center uppercase tracking-tight mb-1">
              Dashboard ASTRO
            </h1>
            <p className="text-sm text-slate-500 text-center font-light mb-8">
              Masuk untuk mengelola pendaftaran
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium p-3 mb-5 text-center"
                style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@astro2026.id"
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-astro-cyan transition-colors"
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-11 bg-white border border-slate-200 text-sm focus:outline-none focus:border-astro-cyan transition-colors"
                    style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full px-8 py-3.5 bg-astro-cyan hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-black text-sm tracking-wider uppercase transition-all duration-200 ease-in-out active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
                style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Masuk
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-5">
              Belum punya akun?{' '}
              <Link href="/auth/signup" className="text-astro-cyan font-bold hover:underline">Daftar di sini</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
