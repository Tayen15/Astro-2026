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

    const updatedData: any = {
      title: body.title,
      category: body.category,
      tagline: body.tagline,
      description: body.description,
      fee: body.isFree ? 0 : (body.fee || 0),
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
      type: body.type || 'individual',
      maxTeamMembers: body.maxTeamMembers || 1,
      minTeamMembers: body.minTeamMembers || 1,
      isFree: body.isFree ? '1' : '0',
      origin: body.origin || 'internal',
    };

    // Support isActive toggle
    if (body.isActive !== undefined) {
      updatedData.isActive = body.isActive ? '1' : '0';
    }

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
