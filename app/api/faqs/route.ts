import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { faqs } from '@/src/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/faqs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get max sort order
    const [maxOrder] = await db
      .select({ max: faqs.sortOrder })
      .from(faqs)
      .orderBy(asc(faqs.sortOrder))
      .limit(1);

    const nextOrder = (maxOrder?.max ?? -1) + 1;

    const [faq] = await db
      .insert(faqs)
      .values({
        question: body.question,
        answer: body.answer,
        sortOrder: nextOrder,
      })
      .returning();

    return NextResponse.json({ data: faq }, { status: 201 });
  } catch (error) {
    console.error('POST /api/faqs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
