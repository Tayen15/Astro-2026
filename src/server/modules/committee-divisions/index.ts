import { Elysia, t, status } from 'elysia';
import { authPlugin } from '@/src/server/plugins/auth';
import { db } from '@/src/db';
import { committeeDivisions } from '@/src/db/schema';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';

const divisionSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().nullable().optional(),
  slug: z.string().min(1),
});

export const committeeDivisionsModule = new Elysia({ prefix: '/committee-divisions' })
  .use(authPlugin)
  .get('/', () => db.select().from(committeeDivisions).orderBy(asc(committeeDivisions.id)))
  .post('/', async ({ body }) => {
    const [item] = await db
      .insert(committeeDivisions)
      .values({
        name: body.name,
        shortName: body.shortName ?? null,
        slug: body.slug,
      })
      .returning();
    return status(201, item);
  }, {
    body: divisionSchema,
    admin: true,
  })
  .put('/:id', async ({ params, body }) => {
    const updates: { name?: string; shortName?: string | null; slug?: string } = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.shortName !== undefined) updates.shortName = body.shortName ?? null;
    if (body.slug !== undefined) updates.slug = body.slug;

    const [item] = await db
      .update(committeeDivisions)
      .set(updates)
      .where(eq(committeeDivisions.id, Number(params.id)))
      .returning();
    if (!item) return status(404, { error: 'Not found' });
    return item;
  }, {
    params: t.Object({ id: t.String() }),
    body: divisionSchema.partial(),
    admin: true,
  })
  .delete('/:id', async ({ params }) => {
    const [item] = await db
      .delete(committeeDivisions)
      .where(eq(committeeDivisions.id, Number(params.id)))
      .returning();
    if (!item) return status(404, { error: 'Not found' });
    return { success: true };
  }, {
    params: t.Object({ id: t.String() }),
    admin: true,
  });
