import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { competitions } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const [updated] = await db
      .update(competitions)
      .set({
        title: body.title,
        category: body.category,
        tagline: body.tagline,
        description: body.description,
        fee: body.fee,
        maxSlots: body.maxSlots,
        filledSlots: body.filledSlots ?? 0,
        scheduleDate: body.scheduleDate ? new Date(body.scheduleDate) : undefined,
        location: body.location,
        prizesFirst: body.prizesFirst,
        prizesSecond: body.prizesSecond,
        prizesThird: body.prizesThird,
        rulesSummary: body.rulesSummary,
        rulebookUrl: body.rulebookUrl,
        contactName: body.contactName,
        contactWhatsapp: body.contactWhatsapp,
      })
      .where(eq(competitions.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('PUT /api/competitions/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
