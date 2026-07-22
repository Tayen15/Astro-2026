import { NextResponse } from 'next/server';
import { createClient } from '@/src/db/supabase/server';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [userRecord] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id));

    return NextResponse.json({
      data: {
        id: user.id,
        email: user.email,
        name: userRecord?.name || user.email?.split('@')[0],
        role: userRecord?.role || 'participant',
      },
    });
  } catch (error) {
    console.error('GET /api/auth/me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
