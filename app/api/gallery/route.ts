import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { galleryPhotos } from '@/src/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(galleryPhotos).orderBy(asc(galleryPhotos.sortOrder));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/gallery error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ error: 'title dan imageUrl wajib diisi' }, { status: 400 });
    }
    const [item] = await db.insert(galleryPhotos).values({
      title: body.title,
      category: body.category || 'Competition',
      imageUrl: body.imageUrl,
      year: body.year || 'ASTRO 2025',
      likesCount: body.likesCount || 0,
      sortOrder: body.sortOrder || 0,
    }).returning();
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    console.error('POST /api/gallery error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
