import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { galleryPhotos } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [item] = await db.select().from(galleryPhotos).where(eq(galleryPhotos.id, Number(id)));
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('GET /api/gallery/[id] error:', error);
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
    const [item] = await db.update(galleryPhotos).set({
      title: body.title,
      category: body.category,
      imageUrl: body.imageUrl,
      year: body.year,
      likesCount: body.likesCount || 0,
      sortOrder: body.sortOrder || 0,
    }).where(eq(galleryPhotos.id, Number(id))).returning();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('PUT /api/gallery/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [item] = await db.delete(galleryPhotos).where(eq(galleryPhotos.id, Number(id))).returning();
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/gallery/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
