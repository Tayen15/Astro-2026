import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { competitions, registrations } from '@/src/db/schema';
import { count, eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const perCompetition = await db
      .select({
        name: competitions.title,
        category: competitions.category,
        count: count(),
      })
      .from(registrations)
      .innerJoin(competitions, eq(registrations.competitionId, competitions.id))
      .groupBy(competitions.id, competitions.title, competitions.category);

    const statusRows = await db
      .select({
        status: registrations.paymentStatus,
        count: count(),
      })
      .from(registrations)
      .groupBy(registrations.paymentStatus);

    const STATUS_COLORS: Record<string, string> = {
      pending: '#f59e0b',
      detecting: '#3b82f6',
      paid: '#10b981',
      failed: '#ef4444',
    };

    const statusDistribution = statusRows.map((r) => ({
      name: r.status,
      value: Number(r.count),
      color: STATUS_COLORS[r.status] || '#94a3b8',
    }));

    return NextResponse.json({ perCompetition, statusDistribution });
  } catch (error) {
    console.error('GET /api/registrations/stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
