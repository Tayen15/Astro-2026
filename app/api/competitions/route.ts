import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { competitions } from '@/src/db/schema';
import { asc, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db
      .select()
      .from(competitions)
      .orderBy(desc(competitions.createdAt));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/competitions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const [comp] = await db
      .insert(competitions)
      .values({
        id: body.id,
        title: body.title,
        category: body.category,
        tagline: body.tagline || '',
        description: body.description || '',
        fee: parseInt(body.fee) || 0,
        maxSlots: parseInt(body.maxSlots) || 0,
        filledSlots: parseInt(body.filledSlots) ?? 0,
        scheduleDate: body.scheduleDate ? new Date(body.scheduleDate) : null,
        location: body.location || '',
        prizesFirst: body.prizesFirst || '',
        prizesSecond: body.prizesSecond || '',
        prizesThird: body.prizesThird || '',
        rulesSummary: body.rulesSummary || [],
        rulebookUrl: body.rulebookUrl || '',
        contactName: body.contactName || '',
        contactWhatsapp: body.contactWhatsapp || '',
        type: body.type || 'individual',
        maxTeamMembers: body.maxTeamMembers || 1,
        minTeamMembers: body.minTeamMembers || 1,
        membersRequired: body.membersRequired || 'optional',
      })
      .returning();

    return NextResponse.json({ data: comp }, { status: 201 });
  } catch (error) {
    console.error('POST /api/competitions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
