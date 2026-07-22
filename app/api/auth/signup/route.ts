import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }

    // Check if already exists in public.users
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    // Use Supabase Admin API with service_role key (bypasses rate limit + auto-confirms email)
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
          password,
          email_confirm: true,
          user_metadata: { role: 'participant', name: name || '' },
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.msg || 'Gagal mendaftar' }, { status: 400 });
    }

    // Insert into public.users table
    await db.insert(users).values({
      id: data.id,
      email,
      name: name || email.split('@')[0],
      role: 'participant',
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/auth/signup error:', error);
    return NextResponse.json({
      error: `Gagal mendaftar: ${error?.message || 'Internal server error'}`,
    }, { status: 500 });
  }
}
