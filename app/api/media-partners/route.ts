import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { mediaPartners } from '@/src/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(mediaPartners).orderBy(asc(mediaPartners.sortOrder));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/media-partners error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name && !body.logo) {
      return NextResponse.json({ error: 'nama atau logo wajib diisi' }, { status: 400 });
    }
    const [item] = await db.insert(mediaPartners).values({
      name: body.name || '',
      website: body.website || null,
      logo: body.logo || null,
      sortOrder: body.sortOrder || 0,
    }).returning();
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    console.error('POST /api/media-partners error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
