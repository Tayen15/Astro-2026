import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { committeeMembers } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [item] = await db.select().from(committeeMembers).where(eq(committeeMembers.id, Number(id)));
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('GET /api/committee/[id] error:', error);
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
    const [item] = await db.update(committeeMembers).set({
      name: body.name,
      role: body.role,
      division: body.division,
      divisionName: body.divisionName || body.division,
      image: body.image,
      isLeader: body.isLeader || '0',
      quote: body.quote || null,
      instagram: body.instagram || null,
      linkedin: body.linkedin || null,
      sortOrder: body.sortOrder || 0,
    }).where(eq(committeeMembers.id, Number(id))).returning();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('PUT /api/committee/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [item] = await db.delete(committeeMembers).where(eq(committeeMembers.id, Number(id))).returning();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/committee/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
