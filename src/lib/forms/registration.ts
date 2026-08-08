import { z } from 'zod';

/** Individual-registration personal fields (also used for PATCH self-service). */
export const registrationFormSchema = z.object({
  fullName: z.string().optional(),
  identityNumber: z.string().optional(),
  teamName: z.string().optional(),
  leaderName: z.string().optional(),
  leaderIdentity: z.string().optional(),
  members: z.string().optional(),
  institution: z.string().min(1, 'Nama sekolah/instansi wajib diisi'),
  email: z.email('Format email tidak valid'),
  whatsapp: z
    .string()
    .min(9, 'Nomor WhatsApp tidak valid (minimal 9 digit)'),
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

/** Build the registration request body for a given competition type. */
export function toRegistrationBody(
  values: RegistrationFormValues,
  competitionId: string,
  type: 'team' | 'individual',
) {
  return {
    competitionId,
    type,
    fullName: values.fullName || null,
    identityNumber: values.identityNumber || null,
    teamName: values.teamName || null,
    leaderName: values.leaderName || null,
    leaderIdentity: values.leaderIdentity || null,
    members: values.members || null,
    institution: values.institution,
    email: values.email,
    whatsapp: values.whatsapp,
  };
}
