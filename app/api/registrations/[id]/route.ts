import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { competitions, registrations } from '@/src/db/schema';
import { eq, sql } from 'drizzle-orm';
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

    // Get current registration before update (to check status changes)
    const [current] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, id));

    if (!current) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const [updated] = await db
      .update(registrations)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(registrations.id, id))
      .returning();

    // Auto-update filledSlots when paymentStatus changes to/from 'paid'
    if (body.paymentStatus && body.paymentStatus !== current.paymentStatus) {
      const wasPaid = current.paymentStatus === 'paid';
      const nowPaid = body.paymentStatus === 'paid';
      const isTeam = current.type === 'team';
      const delta = isTeam ? 1 : 1; // Each approved registration = 1 slot

      if (!wasPaid && nowPaid) {
        // Just approved -> increment filledSlots
        await db
          .update(competitions)
          .set({
            filledSlots: sql`${competitions.filledSlots} + ${delta}`,
          })
          .where(eq(competitions.id, current.competitionId));
      } else if (wasPaid && !nowPaid) {
        // Un-approved -> decrement filledSlots (min 0)
        await db
          .update(competitions)
          .set({
            filledSlots: sql`GREATEST(${competitions.filledSlots} - ${delta}, 0)`,
          })
          .where(eq(competitions.id, current.competitionId));
      }
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('PATCH /api/registrations/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
