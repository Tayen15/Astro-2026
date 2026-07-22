import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { faqs } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const [updated] = await db
      .update(faqs)
      .set({
        question: body.question,
        answer: body.answer,
        sortOrder: body.sortOrder,
      })
      .where(eq(faqs.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('PUT /api/faqs/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await db.delete(faqs).where(eq(faqs.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/faqs/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
