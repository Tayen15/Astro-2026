'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/src/db/supabase/client';
import { Loader2, Check, Save } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser(u);
        setEmail(u.email || '');
      }
      setLoading(false);
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Password baru dan konfirmasi tidak cocok');
      setMessageType('error');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password minimal 6 karakter');
      setMessageType('error');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    // Re-authenticate first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: currentPassword,
    });

    if (signInError) {
      setMessage('Password saat ini salah');
      setMessageType('error');
      setSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(error.message);
      setMessageType('error');
    } else {
      setMessage('Password berhasil diubah!');
      setMessageType('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setSaving(false);
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      data: { email_updated: true },
    });

    // For email change, Supabase sends a confirmation email
    const { error: emailError } = await supabase.auth.updateUser({
      email: email,
    });

    if (emailError) {
      setMessage(emailError.message);
      setMessageType('error');
    } else {
      setMessage('Email berhasil diubah!');
      setMessageType('success');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-astro-cyan" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Profil</h1>
        <p className="text-sm text-slate-500 font-light mt-1">
          Kelola akun dan password Anda
        </p>
      </div>

      {message && (
        <div
          className={`p-3 text-xs font-medium ${
            messageType === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
        >
          {messageType === 'success' ? <Check className="w-3.5 h-3.5 inline mr-1" /> : null}
          {message}
        </div>
      )}

      {/* Email */}
      <div className="bg-white border border-slate-200 relative"
        style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
      >
        <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan"
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        />
        <div className="p-6 space-y-5">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            Email
          </h2>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Email Saat Ini
            </span>
            <p className="text-sm font-medium text-slate-900 mt-0.5">{user?.email || '—'}</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-slate-200 relative"
        style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
      >
        <div className="p-6 space-y-5">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            Ubah Password
          </h2>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em]">
                Password Saat Ini
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-astro-cyan transition-colors"
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em]">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-astro-cyan transition-colors"
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em]">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-astro-cyan transition-colors"
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-astro-cyan hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Password Baru
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
