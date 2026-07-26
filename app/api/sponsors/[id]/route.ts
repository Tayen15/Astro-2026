import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { sponsors } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [item] = await db.update(sponsors).set({
      name: body.name,
      tier: body.tier,
      website: body.website || null,
      sortOrder: body.sortOrder,
    }).where(eq(sponsors.id, Number(id))).returning();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('PUT /api/sponsors/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [item] = await db.delete(sponsors).where(eq(sponsors.id, Number(id))).returning();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/sponsors/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
