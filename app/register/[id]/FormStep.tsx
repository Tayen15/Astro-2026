'use client';

import { useForm } from '@tanstack/react-form';
import { Loader2, ChevronRight } from 'lucide-react';
import type { Competition } from '@/types/astro';
import { useRegistrationApi } from '@/src/lib/hooks/use-registration';
import { registrationFormSchema, type RegistrationFormValues } from '@/src/lib/forms/registration';

interface Props {
  competition: Competition;
  isTeam: boolean;
  formData: RegistrationFormValues;
  setFormData: (data: any) => void;
  onContinue: (registrationId: string, reference: string) => void;
  existingRegId?: string | null;
  existingRef?: string | null;
  maxTeamMembers?: number;
  minTeamMembers?: number;
}

export default function FormStep({
  competition,
  isTeam,
  formData,
  setFormData,
  onContinue,
  existingRegId,
  existingRef,
  maxTeamMembers = 5,
  minTeamMembers = 1,
}: Props) {
  const { create, update } = useRegistrationApi();

  const form = useForm({
    defaultValues: formData as RegistrationFormValues,
    validators: {
      onChange: registrationFormSchema,
      onSubmit: registrationFormSchema,
    },
    onSubmit: async ({ value }) => {
      setFormData(value);

      if (existingRegId) {
        const reg = await update(existingRegId, value);
        if (reg) onContinue(existingRegId, existingRef || '');
      } else {
        const reg = await create(competition.id, isTeam ? 'team' : 'individual', value);
        if (reg) onContinue(reg.id, reg.paymentReference ?? '');
      }
    },
  });

  const labelClass = 'block text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em] mb-1.5';

  const renderField = (
    name: keyof RegistrationFormValues,
    label: string,
    type: string,
    placeholder: string,
    opts?: { sanitize?: (v: string) => string; className?: string },
  ) => (
    <form.Field
      name={name}
      children={(field) => {
        const err = field.state.meta.errors?.[0] as { message?: string } | undefined;
        return (
          <div className="space-y-1.5">
            <label className={labelClass}>{label}</label>
            <input
              type={type}
              value={field.state.value ?? ''}
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(
                  opts?.sanitize ? opts.sanitize(e.target.value) : e.target.value,
                )
              }
              className={`w-full px-4 py-3 bg-white border text-sm focus:outline-none focus:bg-white transition-colors ${
                err ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-astro-cyan'
              }`}
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              placeholder={placeholder}
            />
            {err ? (
              <span className="text-[11px] text-red-500 font-medium">{err.message ?? 'Field wajib diisi'}</span>
            ) : null}
          </div>
        );
      }}
    />
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      {/* Section title */}
      <div>
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
          Data Pendaftaran
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-light">
          Isi data dengan benar untuk pendaftaran lomba <strong>{competition.title}</strong>.
        </p>
      </div>

      <div className="bg-white border border-slate-200 relative"
        style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
      >
        <div
          className="absolute -top-px -left-px w-8 h-8 bg-astro-cyan"
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        />

        <div className="p-6 md:p-8 space-y-5">
          {isTeam ? (
            <>
              {renderField('teamName', 'Nama Tim', 'text', 'Masukkan nama tim Anda')}
              {renderField('leaderName', 'Nama Ketua Tim', 'text', 'Nama lengkap ketua tim')}
              {renderField('leaderIdentity', 'Nomor Identitas Ketua (NISN / KTP / Kartu Pelajar)', 'text', 'Nomor identitas ketua', { sanitize: (v) => v.replace(/\D/g, '') })}
            </>
          ) : (
            <>
              {renderField('fullName', 'Nama Lengkap', 'text', 'Nama lengkap pendaftar')}
              {renderField('identityNumber', 'Nomor Identitas (NISN / KTP / Kartu Pelajar)', 'text', 'Nomor identitas pendaftar', { sanitize: (v) => v.replace(/\D/g, '') })}
            </>
          )}

          {renderField('institution', 'Sekolah / Instansi', 'text', 'Asal sekolah atau instansi')}

          {renderField('email', `Alamat Email${isTeam ? ' Ketua' : ''}`, 'email', 'contoh@email.com')}

          {renderField('whatsapp', `Nomor WhatsApp${isTeam ? ' Ketua' : ''}`, 'tel', '62812XXXXXXXX', { sanitize: (v) => v.replace(/\D/g, '') })}

          {/* Anggota Tim (team only) */}
          {isTeam && (
            <div className="space-y-3">
              <label className={labelClass}>
                Anggota Tim (Min. {minTeamMembers})
              </label>
              {Array.from({ length: maxTeamMembers }, (_, i) => (
                <form.Field
                  key={i}
                  name="members"
                  children={(field) => {
                    const arr = (field.state.value ?? '').split('\n').filter(Boolean);
                    return (
                      <input
                        type="text"
                        value={arr[i] || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          arr[i] = e.target.value;
                          field.handleChange(arr.filter(Boolean).join('\n'));
                        }}
                        className="w-full px-4 py-3 bg-white border text-sm focus:outline-none focus:bg-white transition-colors border-slate-200 focus:border-astro-cyan"
                        style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                        placeholder={`Anggota ${i + 1}${i < minTeamMembers ? ' (wajib)' : ' (opsional)'}`}
                      />
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit button */}
      <form.Subscribe
        selector={(s) => ({ isSubmitting: s.isSubmitting })}
        children={({ isSubmitting }) => (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-astro-cyan hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-black text-sm tracking-wider uppercase transition-all duration-200 ease-in-out active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
          >
            {isSubmitting ? (
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
        )}
      />
    </form>
  );
}
