import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { committeeMembers } from '@/src/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(committeeMembers).orderBy(asc(committeeMembers.sortOrder));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/committee error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.role || !body.division || !body.image) {
      return NextResponse.json({ error: 'name, role, division, dan image wajib diisi' }, { status: 400 });
    }
    const [item] = await db.insert(committeeMembers).values({
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
    }).returning();
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    console.error('POST /api/committee error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
