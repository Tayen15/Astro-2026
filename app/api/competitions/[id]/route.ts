import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { competitions, registrations } from '@/src/db/schema';
import { eq, count } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const [comp] = await db
      .select()
      .from(competitions)
      .where(eq(competitions.id, id));

    if (!comp) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: comp });
  } catch (error) {
    console.error('GET /api/competitions/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedData: any = {};
    if (body.title !== undefined) updatedData.title = body.title;
    if (body.category !== undefined) updatedData.category = body.category;
    if (body.tagline !== undefined) updatedData.tagline = body.tagline;
    if (body.description !== undefined) updatedData.description = body.description;
    if (body.fee !== undefined) updatedData.fee = body.isFree ? 0 : (body.fee || 0);
    if (body.maxSlots !== undefined) updatedData.maxSlots = body.maxSlots;
    if (body.filledSlots !== undefined) updatedData.filledSlots = body.filledSlots ?? 0;
    if (body.scheduleDate !== undefined) updatedData.scheduleDate = body.scheduleDate ? new Date(body.scheduleDate) : null;
    if (body.location !== undefined) updatedData.location = body.location;
    if (body.prizesFirst !== undefined) updatedData.prizesFirst = body.prizesFirst;
    if (body.prizesSecond !== undefined) updatedData.prizesSecond = body.prizesSecond;
    if (body.prizesThird !== undefined) updatedData.prizesThird = body.prizesThird;
    if (body.prizes !== undefined) updatedData.prizes = body.prizes;
    if (body.rulesSummary !== undefined) updatedData.rulesSummary = body.rulesSummary;
    if (body.rulebookUrl !== undefined) updatedData.rulebookUrl = body.rulebookUrl;
    if (body.contactName !== undefined) updatedData.contactName = body.contactName;
    if (body.contactWhatsapp !== undefined) updatedData.contactWhatsapp = body.contactWhatsapp;
    if (body.type !== undefined) updatedData.type = body.type || 'individual';
    if (body.maxTeamMembers !== undefined) updatedData.maxTeamMembers = body.maxTeamMembers || 1;
    if (body.minTeamMembers !== undefined) updatedData.minTeamMembers = body.minTeamMembers || 1;
    if (body.isFree !== undefined) updatedData.isFree = body.isFree ? '1' : '0';
    if (body.origin !== undefined) updatedData.origin = body.origin || 'internal';
    if (body.certificateEnabled !== undefined) updatedData.certificateEnabled = body.certificateEnabled ? '1' : '0';
    if (body.certificateType !== undefined) updatedData.certificateType = body.certificateType;
    if (body.certificateTemplate !== undefined) updatedData.certificateTemplate = body.certificateTemplate;
    if (body.isActive !== undefined) updatedData.isActive = body.isActive ? '1' : '0';

    const [updated] = await db
      .update(competitions)
      .set(updatedData)
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Check if any registrations exist
    const [regCount] = await db
      .select({ total: count() })
      .from(registrations)
      .where(eq(registrations.competitionId, id));

    if (regCount && Number(regCount.total) > 0) {
      return NextResponse.json({
        error: `Tidak bisa dihapus: ${regCount.total} pendaftar masih terdaftar di lomba ini. Nonaktifkan saja.`,
      }, { status: 400 });
    }

    await db.delete(competitions).where(eq(competitions.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/competitions/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
