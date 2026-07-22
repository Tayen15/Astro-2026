import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { registrations, competitions } from '@/src/db/schema';
import { eq, desc, sql, ilike } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || '';
    const lombaFilter = searchParams.get('lomba') || '';

    const conditions = [];
    if (search) {
      conditions.push(
        sql`(${registrations.fullName} ILIKE ${'%' + search + '%'} OR ${registrations.teamName} ILIKE ${'%' + search + '%'} OR ${registrations.email} ILIKE ${'%' + search + '%'})`,
      );
    }
    if (statusFilter) {
      conditions.push(eq(registrations.paymentStatus, statusFilter));
    }
    if (lombaFilter) {
      conditions.push(eq(registrations.competitionId, lombaFilter));
    }

    const where = conditions.length > 0 ? sql`${conditions.reduce((a, b) => sql`${a} AND ${b}`)}` : undefined;

    const data = await db
      .select({
        id: registrations.id,
        type: registrations.type,
        fullName: registrations.fullName,
        teamName: registrations.teamName,
        email: registrations.email,
        institution: registrations.institution,
        paymentStatus: registrations.paymentStatus,
        paymentAmount: registrations.paymentAmount,
        paymentReference: registrations.paymentReference,
        createdAt: registrations.createdAt,
        competitionName: competitions.title,
      })
      .from(registrations)
      .innerJoin(competitions, eq(registrations.competitionId, competitions.id))
      .where(where)
      .orderBy(desc(registrations.createdAt));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/registrations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate reference
    const ref = `INV/ASTRO-2026/${Date.now().toString().slice(-8)}`;

    const [reg] = await db
      .insert(registrations)
      .values({
        competitionId: body.competitionId,
        type: body.type,
        fullName: body.fullName || null,
        identityNumber: body.identityNumber || null,
        teamName: body.teamName || null,
        leaderName: body.leaderName || null,
        leaderIdentity: body.leaderIdentity || null,
        members: body.members || null,
        institution: body.institution,
        email: body.email,
        whatsapp: body.whatsapp,
        paymentStatus: 'pending',
        paymentMethod: body.paymentMethod || null,
        paymentAmount: body.paymentAmount || 0,
        paymentReference: ref,
      })
      .returning();

    return NextResponse.json({ data: reg }, { status: 201 });
  } catch (error) {
    console.error('POST /api/registrations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
