'use client';

import { api } from '@/src/lib/eden';
import type { RegistrationFormValues } from '@/src/lib/forms/registration';
import { toRegistrationBody } from '@/src/lib/forms/registration';

/** Extract a user-facing message from an Eden error (any shape). */
function errorMessage(
  error: { value?: unknown } | undefined,
  fallback: string,
): string {
  if (!error) return fallback;
  const v = error.value as { error?: string; message?: string } | undefined;
  return v?.error ?? v?.message ?? fallback;
}

/**
 * Registration API helpers via the typed Eden client (ky-backed).
 * `data`/`error` are inferred from the Elysia `App` type.
 */
export function useRegistrationApi() {
  async function create(
    competitionId: string,
    type: 'team' | 'individual',
    values: RegistrationFormValues,
  ) {
    const res = await api.registrations.post({
      ...toRegistrationBody(values, competitionId, type),
    });
    if (res.error) throw new Error(errorMessage(res.error, 'Gagal mendaftar'));
    return res.data;
  }

  async function update(
    registrationId: string,
    values: RegistrationFormValues,
  ) {
    const res = await api.registrations({ id: registrationId }).patch({
      ...values,
    });
    if (res.error) throw new Error(errorMessage(res.error, 'Gagal memperbarui'));
    return res.data;
  }

  async function get(registrationId: string) {
    const res = await api.registrations({ id: registrationId }).get();
    if (res.error) return null;
    return res.data;
  }

  return { create, update, get };
}
