import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { registrations } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/src/db/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const [reg] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, id));

    if (!reg) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: reg });
  } catch (error) {
    console.error('GET /api/registrations/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const [updated] = await db
      .update(registrations)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(registrations.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('PATCH /api/registrations/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
