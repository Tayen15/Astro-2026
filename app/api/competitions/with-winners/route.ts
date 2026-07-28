import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { competitions, registrations } from '@/src/db/schema';
import { eq, sql, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all competitions
    const allComps = await db
      .select({
        id: competitions.id,
        title: competitions.title,
        category: competitions.category,
        tagline: competitions.tagline,
        type: competitions.type,
        origin: competitions.origin,
        isFree: competitions.isFree,
      })
      .from(competitions)
      .orderBy(desc(competitions.createdAt));

    // Get competition IDs that have winners
    const compsWithWinners = await db
      .select({ id: registrations.competitionId })
      .from(registrations)
      .where(eq(registrations.isWinner, '1'))
      .groupBy(registrations.competitionId);

    const winnerIds = new Set(compsWithWinners.map((r) => r.id));

    const data = allComps.map((c) => ({
      ...c,
      hasWinners: winnerIds.has(c.id),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/competitions/with-winners error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
