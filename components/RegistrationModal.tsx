'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Loader2, CheckCircle2, MessageCircle, Copy, Check, Trophy } from 'lucide-react';
import type { Competition } from '@/types/astro';

interface Props {
  competition: Competition | null;
  onClose: () => void;
}

const bankInfo = {
  bankName: 'Bank Central Asia (BCA)',
  accountNumber: '1234567890',
  accountHolder: 'Panitia ASTRO 2026',
};

export default function RegistrationModal({ competition, onClose }: Props) {
  const reduce = useReducedMotion();
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = competition ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [competition]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (competition) {
      setFormData({
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
      setErrors({});
      setIsSuccess(false);
      setLoading(false);
      setCopied(false);
    }
  }, [competition]);

  if (!competition) return null;

  const isTeam = competition.id !== 'science-olympiad' && competition.id !== 'fifa-championship';

  const validate = () => {
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppLink = () => {
    const phone = competition.contactPerson.whatsapp;
    const name = competition.contactPerson.name;
    let message = '';

    if (isTeam) {
      message = `Halo ${name}, saya ingin mengonfirmasi pembayaran pendaftaran ASTRO 2026 untuk lomba: *${competition.title}*.

Detail Pendaftaran:
- Nama Tim: ${formData.teamName}
- Asal Sekolah/Instansi: ${formData.institution}
- Nama Ketua: ${formData.leaderName}
- Email Ketua: ${formData.email}
- Nomor WhatsApp: ${formData.whatsapp}
- Anggota Tim: ${formData.members}

Terima kasih.`;
    } else {
      message = `Halo ${name}, saya ingin mengonfirmasi pembayaran pendaftaran ASTRO 2026 untuk lomba: *${competition.title}*.

Detail Pendaftaran:
- Nama Lengkap: ${formData.fullName}
- Asal Sekolah/Instansi: ${formData.institution}
- Email: ${formData.email}
- Nomor WhatsApp: ${formData.whatsapp}

Terima kasih.`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <AnimatePresence>
      {competition && (
        <motion.div
          key="registration-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-2xl z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all duration-200 cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                    Pendaftaran
                  </h2>
                  <p className="text-sm text-slate-500 font-bold mt-1 text-astro-cyan uppercase tracking-wider">
                    {competition.title} ({isTeam ? 'Kategori Tim' : 'Kategori Individu'})
                  </p>
                </div>

                <div className="space-y-4">
                  {isTeam ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Nama Tim
                        </label>
                        <input
                          type="text"
                          value={formData.teamName}
                          onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                          className={`w-full px-4 py-2.5 bg-slate-50 border ${
                            errors.teamName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-astro-cyan'
                          } text-slate-850 text-sm focus:outline-none focus:bg-white transition-colors`}
                          placeholder="Masukkan nama tim Anda"
                          disabled={loading}
                        />
                        {errors.teamName && (
                          <span className="text-[11px] text-red-500 font-medium mt-1 block">
                            {errors.teamName}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Sekolah / Instansi
                        </label>
                        <input
                          type="text"
                          value={formData.institution}
                          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                          className={`w-full px-4 py-2.5 bg-slate-50 border ${
                            errors.institution ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-astro-cyan'
                          } text-slate-850 text-sm focus:outline-none focus:bg-white transition-colors`}
                          placeholder="Asal sekolah atau instansi"
                          disabled={loading}
                        />
                        {errors.institution && (
                          <span className="text-[11px] text-red-500 font-medium mt-1 block">
                            {errors.institution}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Nama Ketua Tim
                        </label>
                        <input
                          type="text"
                          value={formData.leaderName}
                          onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                          className={`w-full px-4 py-2.5 bg-slate-50 border ${
                            errors.leaderName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-astro-cyan'
                          } text-slate-850 text-sm focus:outline-none focus:bg-white transition-colors`}
                          placeholder="Nama lengkap ketua tim"
                          disabled={loading}
                        />
                        {errors.leaderName && (
                          <span className="text-[11px] text-red-500 font-medium mt-1 block">
                            {errors.leaderName}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Nomor Identitas Ketua (NISN / KTP / Kartu Pelajar)
                        </label>
                        <input
                          type="text"
                          value={formData.leaderIdentity}
                          onChange={(e) => setFormData({ ...formData, leaderIdentity: e.target.value })}
                          className={`w-full px-4 py-2.5 bg-slate-50 border ${
                            errors.leaderIdentity ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-astro-cyan'
                          } text-slate-850 text-sm focus:outline-none focus:bg-white transition-colors`}
                          placeholder="Nomor identitas ketua"
                          disabled={loading}
                        />
                        {errors.leaderIdentity && (
                          <span className="text-[11px] text-red-500 font-medium mt-1 block">
                            {errors.leaderIdentity}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className={`w-full px-4 py-2.5 bg-slate-50 border ${
                            errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-astro-cyan'
                          } text-slate-850 text-sm focus:outline-none focus:bg-white transition-colors`}
                          placeholder="Nama lengkap pendaftar"
                          disabled={loading}
                        />
                        {errors.fullName && (
                          <span className="text-[11px] text-red-500 font-medium mt-1 block">
                            {errors.fullName}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Nomor Identitas (NISN / KTP / Kartu Pelajar)
                        </label>
                        <input
                          type="text"
                          value={formData.identityNumber}
                          onChange={(e) => setFormData({ ...formData, identityNumber: e.target.value })}
                          className={`w-full px-4 py-2.5 bg-slate-50 border ${
                            errors.identityNumber ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-astro-cyan'
                          } text-slate-850 text-sm focus:outline-none focus:bg-white transition-colors`}
                          placeholder="Nomor identitas pendaftar"
                          disabled={loading}
                        />
                        {errors.identityNumber && (
                          <span className="text-[11px] text-red-500 font-medium mt-1 block">
                            {errors.identityNumber}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Sekolah / Instansi
                        </label>
                        <input
                          type="text"
                          value={formData.institution}
                          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                          className={`w-full px-4 py-2.5 bg-slate-50 border ${
                            errors.institution ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-astro-cyan'
                          } text-slate-850 text-sm focus:outline-none focus:bg-white transition-colors`}
                          placeholder="Asal sekolah atau instansi"
                          disabled={loading}
                        />
                        {errors.institution && (
                          <span className="text-[11px] text-red-500 font-medium mt-1 block">
                            {errors.institution}
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Alamat Email {isTeam && 'Ketua'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-2.5 bg-slate-50 border ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-astro-cyan'
                      } text-slate-850 text-sm focus:outline-none focus:bg-white transition-colors`}
                      placeholder="contoh@email.com"
                      disabled={loading}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-red-500 font-medium mt-1 block">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nomor WhatsApp {isTeam && 'Ketua'}
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className={`w-full px-4 py-2.5 bg-slate-50 border ${
                        errors.whatsapp ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-astro-cyan'
                      } text-slate-850 text-sm focus:outline-none focus:bg-white transition-colors`}
                      placeholder="Contoh: 62812XXXXXXXX atau 0812XXXXXXXX"
                      disabled={loading}
                    />
                    {errors.whatsapp && (
                      <span className="text-[11px] text-red-500 font-medium mt-1 block">
                        {errors.whatsapp}
                      </span>
                    )}
                  </div>

                  {isTeam && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Nama Anggota Tim (Tuliskan nama semua anggota lainnya)
                      </label>
                      <textarea
                        value={formData.members}
                        onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                        className={`w-full px-4 py-2.5 bg-slate-50 border ${
                          errors.members ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-astro-cyan'
                        } text-slate-855 text-sm focus:outline-none focus:bg-white transition-colors min-h-[80px] resize-y`}
                        placeholder="Contoh: Anggota 1: John Doe, Anggota 2: Jane Smith, dst."
                        disabled={loading}
                      />
                      {errors.members && (
                        <span className="text-[11px] text-red-500 font-medium mt-1 block">
                          {errors.members}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-bold rounded-xl text-base transition-all duration-200 ease-in-out cursor-pointer active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:shadow-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memproses Pendaftaran...
                      </>
                    ) : (
                      `Daftar Sekarang - Rp ${competition.fee.toLocaleString('id-ID')}`
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 md:p-8 space-y-6 text-center">
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                    Pendaftaran Berhasil!
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 max-w-sm">
                    Terima kasih telah mendaftar di *{competition.title}*. Silakan selesaikan pembayaran Anda untuk mengamankan slot kompetisi.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-left space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Instruksi Pembayaran Bank Transfer
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Bank Penerima</div>
                      <div className="text-slate-900 font-bold">{bankInfo.bankName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Atas Nama</div>
                      <div className="text-slate-900 font-bold">{bankInfo.accountHolder}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-xs text-slate-500 font-medium">Nomor Rekening</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-base text-slate-900 font-mono font-bold tracking-wider">
                          {bankInfo.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-55 hover:border-slate-300 text-slate-500 transition-all duration-200 cursor-pointer"
                          aria-label="Salin nomor rekening"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        {copied && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded">
                            Tersalin
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Jumlah Transfer</div>
                      <div className="text-base text-cyan-600 font-bold">
                        Rp {competition.fee.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed text-left">
                  <span className="font-bold text-slate-700">Penting:</span> Simpan bukti transfer Anda. Setelah melakukan pembayaran, Anda wajib melakukan konfirmasi dengan mengirimkan bukti transfer ke Contact Person melalui WhatsApp menggunakan tombol di bawah ini.
                </div>

                <div className="pt-2">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-base transition-all duration-200 ease-in-out cursor-pointer active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Konfirmasi Pembayaran (WhatsApp)
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
