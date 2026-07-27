import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { journeys } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [item] = await db.select().from(journeys).where(eq(journeys.id, id));
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('GET /api/journeys/[id] error:', error);
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
    const [item] = await db.update(journeys).set({
      theme: body.theme,
      participants: body.participants || 0,
      universities: body.universities || 0,
      competitionsCount: body.competitionsCount || 0,
      achievement: body.achievement || null,
      description: body.description || null,
      highlights: body.highlights || [],
      sortOrder: body.sortOrder || 0,
    }).where(eq(journeys.id, id)).returning();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('PUT /api/journeys/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [item] = await db.delete(journeys).where(eq(journeys.id, id)).returning();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/journeys/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
