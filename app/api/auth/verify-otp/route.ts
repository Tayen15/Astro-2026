import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { otpCodes, users } from '@/src/db/schema';
import { eq, and, gt, isNull } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email dan kode OTP wajib diisi' }, { status: 400 });
    }

    // Find valid OTP
    const [otp] = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          eq(otpCodes.code, code),
          isNull(otpCodes.usedAt),
          gt(otpCodes.expiresAt, new Date()),
        ),
      );

    if (!otp) {
      return NextResponse.json({ error: 'Kode OTP tidak valid atau sudah kadaluarsa' }, { status: 400 });
    }

    // Mark OTP as used
    await db
      .update(otpCodes)
      .set({ usedAt: new Date() })
      .where(eq(otpCodes.id, otp.id));

    // Register user in Supabase Auth
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
        body: JSON.stringify({
          email,
          password: otp.password,
          email_confirm: true,
          user_metadata: { role: 'participant', name: otp.name || '' },
        }),
      },
    );

    const authData = await res.json();

    if (!res.ok) {
      // Revert OTP usage
      await db
        .update(otpCodes)
        .set({ usedAt: null })
        .where(eq(otpCodes.id, otp.id));

      return NextResponse.json({ error: authData.msg || 'Gagal membuat akun' }, { status: 400 });
    }

    // Insert into public.users table
    await db.insert(users).values({
      id: authData.id,
      email,
      name: otp.name || email.split('@')[0],
      role: 'participant',
    });

    return NextResponse.json({ success: true, message: 'Akun berhasil dibuat!' });
  } catch (error: any) {
    console.error('POST /api/auth/verify-otp error:', error);
    return NextResponse.json({ error: `Gagal: ${error?.message || 'Internal server error'}` }, { status: 500 });
  }
}
