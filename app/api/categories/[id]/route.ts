import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { categories, competitions } from '@/src/db/schema';
import { eq, count } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const [updated] = await db
      .update(categories)
      .set({
        label: body.label,
        color: body.color,
        sortOrder: body.sortOrder,
      })
      .where(eq(categories.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('PUT /api/categories/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Check if any competitions use this category
    const [used] = await db
      .select({ count: count() })
      .from(competitions)
      .where(eq(competitions.category, id));

    if (used && Number(used.count) > 0) {
      return NextResponse.json({
        error: `Tidak bisa menghapus: ${used.count} lomba masih menggunakan kategori ini`,
      }, { status: 400 });
    }

    await db.delete(categories).where(eq(categories.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/categories/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
