import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { otpCodes } from '@/src/db/schema';
import { eq, and, gt, isNull } from 'drizzle-orm';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    // Check if email already registered
    const { users } = await import('@/src/db/schema');
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    // Invalidate any previous unused OTPs for this email
    await db
      .update(otpCodes)
      .set({ usedAt: new Date() })
      .where(
        and(
          eq(otpCodes.email, email),
          isNull(otpCodes.usedAt),
          gt(otpCodes.expiresAt, new Date()),
        ),
      );

    // Generate new OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.insert(otpCodes).values({
      email,
      code,
      name: name || null,
      password,
      expiresAt,
    });

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'ASTRO 2026 <noreply@mailer.kta.blue>',
      to: email,
      subject: 'Kode OTP Pendaftaran ASTRO 2026',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f8fafc; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://abhshprulipnmetfumrt.supabase.co/storage/v1/object/public/assets/logo-astro.png" alt="ASTRO" style="height: 48px;" />
          </div>
          <h1 style="font-size: 20px; font-weight: 900; color: #0f172a; text-align: center; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 8px;">
            Kode OTP Pendaftaran
          </h1>
          <p style="font-size: 14px; color: #64748b; text-align: center; margin-bottom: 24px;">
            Gunakan kode berikut untuk melanjutkan pendaftaran akun ASTRO 2026
          </p>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; margin-bottom: 8px;">Kode OTP</p>
            <p style="font-size: 36px; font-weight: 900; color: #06b6d4; letter-spacing: 8px; margin: 0; font-family: monospace;">${code}</p>
          </div>
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            Kode ini berlaku selama <strong style="color: #64748b;">10 menit</strong>. Jangan bagikan kode ini kepada siapa pun.
          </p>
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 16px;">
            Jika Anda tidak melakukan pendaftaran, abaikan email ini.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #cbd5e1; text-align: center;">
            ASTRO 2026 — Ajang Lomba Pelajar Tingkat Nasional
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json({ error: 'Gagal mengirim email OTP' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Kode OTP telah dikirim ke email Anda' });
  } catch (error: any) {
    console.error('POST /api/auth/send-otp error:', error);
    return NextResponse.json({ error: `Gagal: ${error?.message || 'Internal server error'}` }, { status: 500 });
  }
}
