import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { categories } from '@/src/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(categories).orderBy(asc(categories.sortOrder));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id || !body.label) {
      return NextResponse.json({ error: 'id and label are required' }, { status: 400 });
    }

    const [cat] = await db
      .insert(categories)
      .values({
        id: body.id.toLowerCase().replace(/\s+/g, '-'),
        label: body.label,
        color: body.color || 'text-cyan-700 bg-cyan-50 border-cyan-200',
        sortOrder: body.sortOrder ?? 99,
      })
      .returning();

    return NextResponse.json({ data: cat }, { status: 201 });
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Kategori dengan ID ini sudah ada' }, { status: 409 });
    }
    console.error('POST /api/categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
