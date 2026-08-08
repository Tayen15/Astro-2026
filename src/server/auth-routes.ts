import { Elysia, status } from 'elysia';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const checkEmailSchema = z.object({
  email: z.string().email(),
});

/**
 * Public pre-signup email check.
 *
 * Better Auth deliberately returns a synthetic success response for an email
 * that already exists when `requireEmailVerification` is enabled (anti-user
 * enumeration). The signup page would otherwise proceed to the OTP step even
 * though the account already exists. This endpoint lets the client detect that
 * case before calling `signUp.email`.
 *
 * We return a neutral `{ available }` boolean (200) so an attacker cannot tell
 * apart "email already registered" from "invalid email" by response code.
 */
export const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/check-email', async ({ body }) => {
    const parsed = checkEmailSchema.safeParse(body);
    if (!parsed.success) {
      return status(400, { available: false, error: 'Email tidak valid' });
    }

    const email = parsed.data.email.toLowerCase();
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return { available: !existing };
  }, {
    body: checkEmailSchema,
  });