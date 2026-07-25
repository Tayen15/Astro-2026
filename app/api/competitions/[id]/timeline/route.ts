import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { competitionTimeline } from '@/src/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const items = await db
      .select()
      .from(competitionTimeline)
      .where(eq(competitionTimeline.competitionId, id))
      .orderBy(asc(competitionTimeline.sortOrder), asc(competitionTimeline.createdAt));

    return NextResponse.json({ data: items });
  } catch (error) {
    console.error('GET /api/competitions/[id]/timeline error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: competitionId } = await params;
    const body = await request.json();

    if (!body.title || !body.date || !body.desc) {
      return NextResponse.json(
        { error: 'title, date, dan desc wajib diisi' },
        { status: 400 },
      );
    }

    // Get current max sortOrder
    const existing = await db
      .select()
      .from(competitionTimeline)
      .where(eq(competitionTimeline.competitionId, competitionId))
      .orderBy(asc(competitionTimeline.sortOrder));

    const nextOrder = existing.length > 0
      ? (existing[existing.length - 1].sortOrder ?? 0) + 1
      : 0;

    const [item] = await db
      .insert(competitionTimeline)
      .values({
        competitionId,
        date: body.date,
        title: body.title,
        desc: body.desc,
        sortOrder: body.sortOrder ?? nextOrder,
      })
      .returning();

    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    console.error('POST /api/competitions/[id]/timeline error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
