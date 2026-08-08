import { Elysia, t, status } from 'elysia';
import { authPlugin } from '@/src/server/plugins/auth';
import { db } from '@/src/db';
import { committeeMembers } from '@/src/db/schema';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';

const memberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  division: z.string().min(1),
  divisionName: z.string().optional(),
  image: z.string().min(1),
  isLeader: z.boolean().optional().default(false),
  quote: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),
  sortOrder: z.number().int().optional().default(0),
});

/** Public list + admin mutations. (Renamed from /committee → /committee-members.) */
export const committeeMembersModule = new Elysia({ prefix: '/committee-members' })
  .use(authPlugin)
  .get('/', () => db.select().from(committeeMembers).orderBy(asc(committeeMembers.sortOrder)))
  .post('/', async ({ body }) => {
    const [item] = await db
      .insert(committeeMembers)
      .values({
        name: body.name,
        role: body.role,
        division: body.division,
        divisionName: body.divisionName || body.division,
        image: body.image,
        isLeader: body.isLeader ? '1' : '0',
        quote: body.quote ?? null,
        instagram: body.instagram ?? null,
        linkedin: body.linkedin ?? null,
        sortOrder: body.sortOrder,
      })
      .returning();
    return status(201, item);
  }, {
    body: memberSchema,
    admin: true,
  })
  .put('/:id', async ({ params, body }) => {
    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.role !== undefined) updates.role = body.role;
    if (body.division !== undefined) updates.division = body.division;
    if (body.divisionName !== undefined) updates.divisionName = body.divisionName;
    if (body.image !== undefined) updates.image = body.image;
    if (body.isLeader !== undefined) updates.isLeader = body.isLeader ? '1' : '0';
    if (body.quote !== undefined) updates.quote = body.quote ?? null;
    if (body.instagram !== undefined) updates.instagram = body.instagram ?? null;
    if (body.linkedin !== undefined) updates.linkedin = body.linkedin ?? null;
    if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;

    const [item] = await db
      .update(committeeMembers)
      .set(updates)
      .where(eq(committeeMembers.id, Number(params.id)))
      .returning();
    if (!item) return status(404, { error: 'Not found' });
    return item;
  }, {
    params: t.Object({ id: t.String() }),
    body: memberSchema.partial(),
    admin: true,
  })
  .delete('/:id', async ({ params }) => {
    const [item] = await db
      .delete(committeeMembers)
      .where(eq(committeeMembers.id, Number(params.id)))
      .returning();
    if (!item) return status(404, { error: 'Not found' });
    return { success: true };
  }, {
    params: t.Object({ id: t.String() }),
    admin: true,
  });
