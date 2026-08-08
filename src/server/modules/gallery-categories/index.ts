import { Elysia, t, status } from 'elysia';
import { authPlugin } from '@/src/server/plugins/auth';
import { db } from '@/src/db';
import { galleryCategories } from '@/src/db/schema';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export const galleryCategoriesModule = new Elysia({ prefix: '/gallery-categories' })
  .use(authPlugin)
  .get('/', () => db.select().from(galleryCategories).orderBy(asc(galleryCategories.id)))
  .post('/', async ({ body }) => {
    const [item] = await db
      .insert(galleryCategories)
      .values({ name: body.name, slug: body.slug })
      .returning();
    return status(201, item);
  }, {
    body: categorySchema,
    admin: true,
  })
  .put('/:id', async ({ params, body }) => {
    const updates: { name?: string; slug?: string } = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.slug !== undefined) updates.slug = body.slug;

    const [item] = await db
      .update(galleryCategories)
      .set(updates)
      .where(eq(galleryCategories.id, Number(params.id)))
      .returning();
    if (!item) return status(404, { error: 'Not found' });
    return item;
  }, {
    params: t.Object({ id: t.String() }),
    body: categorySchema.partial(),
    admin: true,
  })
  .delete('/:id', async ({ params }) => {
    const [item] = await db
      .delete(galleryCategories)
      .where(eq(galleryCategories.id, Number(params.id)))
      .returning();
    if (!item) return status(404, { error: 'Not found' });
    return { success: true };
  }, {
    params: t.Object({ id: t.String() }),
    admin: true,
  });
