'use client';

import { useState, useCallback } from 'react';
import { Loader2, ChevronRight } from 'lucide-react';
import type { Competition } from '@/types/astro';

interface Props {
  competition: Competition;
  isTeam: boolean;
  formData: {
    fullName: string;
    teamName: string;
    institution: string;
    identityNumber: string;
    leaderName: string;
    leaderIdentity: string;
    email: string;
    whatsapp: string;
    members: string;
  };
  setFormData: (data: any) => void;
  onContinue: () => void;
}

export default function FormStep({ competition, isTeam, formData, setFormData, onContinue }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (isTeam) {
      if (!formData.teamName.trim()) newErrors.teamName = 'Nama tim wajib diisi';
      if (!formData.leaderName.trim()) newErrors.leaderName = 'Nama ketua wajib diisi';
      if (!formData.leaderIdentity.trim()) newErrors.leaderIdentity = 'Nomor identitas ketua wajib diisi';
      if (!formData.members.trim()) newErrors.members = 'Nama-nama anggota wajib diisi';
    } else {
      if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
      if (!formData.identityNumber.trim()) newErrors.identityNumber = 'Nomor identitas wajib diisi';
    }

    if (!formData.institution.trim()) newErrors.institution = 'Nama sekolah/instansi wajib diisi';

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    } else if (formData.whatsapp.trim().length < 9) {
      newErrors.whatsapp = 'Nomor WhatsApp tidak valid (minimal 9 digit)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isTeam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onContinue();
    }, 1500);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev: typeof formData) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-white border text-sm focus:outline-none focus:bg-white transition-colors ${
      errors[field]
        ? 'border-red-500 focus:border-red-500'
        : 'border-slate-200 focus:border-astro-cyan'
    }`;

  const labelClass = 'block text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em] mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section title */}
      <div>
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
          Data Pendaftaran
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-light">
          Isi data dengan benar untuk pendaftaran lomba <strong>{competition.title}</strong>.
        </p>
      </div>

      <div className="bg-white border border-slate-200"
        style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
      >
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-astro-cyan to-astro-violet" />

        <div className="p-6 md:p-8 space-y-5">
          {isTeam ? (
            <>
              {/* Nama Tim */}
              <div className="space-y-1.5">
                <label className={labelClass}>Nama Tim</label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => updateField('teamName', e.target.value)}
                  className={inputClass('teamName')}
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                  placeholder="Masukkan nama tim Anda"
                />
                {errors.teamName && (
                  <span className="text-[11px] text-red-500 font-medium">{errors.teamName}</span>
                )}
              </div>

              {/* Sekolah / Instansi */}
              <div className="space-y-1.5">
                <label className={labelClass}>Sekolah / Instansi</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => updateField('institution', e.target.value)}
                  className={inputClass('institution')}
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                  placeholder="Asal sekolah atau instansi"
                />
                {errors.institution && (
                  <span className="text-[11px] text-red-500 font-medium">{errors.institution}</span>
                )}
              </div>

              {/* Nama Ketua */}
              <div className="space-y-1.5">
                <label className={labelClass}>Nama Ketua Tim</label>
                <input
                  type="text"
                  value={formData.leaderName}
                  onChange={(e) => updateField('leaderName', e.target.value)}
                  className={inputClass('leaderName')}
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                  placeholder="Nama lengkap ketua tim"
                />
                {errors.leaderName && (
                  <span className="text-[11px] text-red-500 font-medium">{errors.leaderName}</span>
                )}
              </div>

              {/* Identitas Ketua */}
              <div className="space-y-1.5">
                <label className={labelClass}>Nomor Identitas Ketua (NISN / KTP / Kartu Pelajar)</label>
                <input
                  type="text"
                  value={formData.leaderIdentity}
                  onChange={(e) => updateField('leaderIdentity', e.target.value)}
                  className={inputClass('leaderIdentity')}
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                  placeholder="Nomor identitas ketua"
                />
                {errors.leaderIdentity && (
                  <span className="text-[11px] text-red-500 font-medium">{errors.leaderIdentity}</span>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className={labelClass}>Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className={inputClass('fullName')}
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                  placeholder="Nama lengkap pendaftar"
                />
                {errors.fullName && (
                  <span className="text-[11px] text-red-500 font-medium">{errors.fullName}</span>
                )}
              </div>

              {/* Nomor Identitas */}
              <div className="space-y-1.5">
                <label className={labelClass}>Nomor Identitas (NISN / KTP / Kartu Pelajar)</label>
                <input
                  type="text"
                  value={formData.identityNumber}
                  onChange={(e) => updateField('identityNumber', e.target.value)}
                  className={inputClass('identityNumber')}
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                  placeholder="Nomor identitas pendaftar"
                />
                {errors.identityNumber && (
                  <span className="text-[11px] text-red-500 font-medium">{errors.identityNumber}</span>
                )}
              </div>

              {/* Sekolah / Instansi */}
              <div className="space-y-1.5">
                <label className={labelClass}>Sekolah / Instansi</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => updateField('institution', e.target.value)}
                  className={inputClass('institution')}
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                  placeholder="Asal sekolah atau instansi"
                />
                {errors.institution && (
                  <span className="text-[11px] text-red-500 font-medium">{errors.institution}</span>
                )}
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className={labelClass}>Alamat Email {isTeam && 'Ketua'}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={inputClass('email')}
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              placeholder="contoh@email.com"
            />
            {errors.email && (
              <span className="text-[11px] text-red-500 font-medium">{errors.email}</span>
            )}
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label className={labelClass}>Nomor WhatsApp {isTeam && 'Ketua'}</label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => updateField('whatsapp', e.target.value)}
              className={inputClass('whatsapp')}
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              placeholder="Contoh: 62812XXXXXXXX atau 0812XXXXXXXX"
            />
            {errors.whatsapp && (
              <span className="text-[11px] text-red-500 font-medium">{errors.whatsapp}</span>
            )}
          </div>

          {/* Anggota Tim (team only) */}
          {isTeam && (
            <div className="space-y-1.5">
              <label className={labelClass}>Nama Anggota Tim (Tuliskan nama semua anggota lainnya)</label>
              <textarea
                value={formData.members}
                onChange={(e) => updateField('members', e.target.value)}
                className={inputClass('members')}
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                placeholder="Contoh: Anggota 1: John Doe, Anggota 2: Jane Smith, dst."
                rows={3}
              />
              {errors.members && (
                <span className="text-[11px] text-red-500 font-medium">{errors.members}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-astro-cyan hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-black text-sm tracking-wider uppercase transition-all duration-200 ease-in-out active:scale-95 cursor-pointer disabled:cursor-not-allowed"
        style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Memproses Pendaftaran...
          </>
        ) : (
          <>
            Lanjut ke Pembayaran
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
