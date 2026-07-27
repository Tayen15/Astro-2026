import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { journeys } from '@/src/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(journeys).orderBy(asc(journeys.sortOrder));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/journeys error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id || !body.theme) {
      return NextResponse.json({ error: 'id dan theme wajib diisi' }, { status: 400 });
    }
    const [item] = await db.insert(journeys).values({
      id: body.id,
      theme: body.theme,
      participants: body.participants || 0,
      universities: body.universities || 0,
      competitionsCount: body.competitionsCount || 0,
      achievement: body.achievement || null,
      description: body.description || null,
      highlights: body.highlights || [],
      sortOrder: body.sortOrder || 0,
    }).returning();
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    console.error('POST /api/journeys error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
