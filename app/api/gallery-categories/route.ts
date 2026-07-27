import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { galleryCategories } from '@/src/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(galleryCategories).orderBy(asc(galleryCategories.id));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/gallery-categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'name dan slug wajib diisi' }, { status: 400 });
    }
    const [item] = await db.insert(galleryCategories).values({
      name: body.name,
      slug: body.slug,
    }).returning();
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Nama atau slug sudah digunakan' }, { status: 409 });
    }
    console.error('POST /api/gallery-categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id || !body.name || !body.slug) {
      return NextResponse.json({ error: 'id, name, dan slug wajib diisi' }, { status: 400 });
    }
    const [item] = await db.update(galleryCategories).set({
      name: body.name,
      slug: body.slug,
    }).where(eq(galleryCategories.id, Number(body.id))).returning();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: item });
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Nama atau slug sudah digunakan' }, { status: 409 });
    }
    console.error('PUT /api/gallery-categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id diperlukan' }, { status: 400 });
    const [item] = await db.delete(galleryCategories).where(eq(galleryCategories.id, Number(id))).returning();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/gallery-categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
