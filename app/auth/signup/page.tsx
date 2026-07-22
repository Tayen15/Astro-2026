'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/src/db/supabase/client';
import { motion } from 'motion/react';
import { Loader2, UserPlus, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: 'participant' },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage('Pendaftaran berhasil! Silakan cek email untuk verifikasi.');
    setLoading(false);
  };

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

            <h1 className="text-xl md:text-2xl font-black text-slate-900 text-center uppercase tracking-tight mb-1">
              Daftar Akun
            </h1>
            <p className="text-sm text-slate-500 text-center font-light mb-8">
              Buat akun untuk melacak pendaftaran
            </p>

            {message && (
              <div className="bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-medium p-3 mb-5 text-center"
                style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
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
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Daftar
              </button>
            </form>

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
