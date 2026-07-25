import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { competitionTimeline } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await params;
    const body = await request.json();

    const [item] = await db
      .update(competitionTimeline)
      .set({
        date: body.date,
        title: body.title,
        desc: body.desc,
        sortOrder: body.sortOrder,
      })
      .where(eq(competitionTimeline.id, Number(itemId)))
      .returning();

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('PUT /api/competitions/[id]/timeline/[itemId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await params;

    const [item] = await db
      .delete(competitionTimeline)
      .where(eq(competitionTimeline.id, Number(itemId)))
      .returning();

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/competitions/[id]/timeline/[itemId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
