import { Elysia, t, status } from 'elysia';
import { authPlugin } from '@/src/server/plugins/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * File upload (admin) — writes to public/uploads and returns a public URL.
 * NOTE: local-fs storage is not durable on Vercel; Supabase Storage swap
 * is a tracked follow-up (Phase D7 of the hardening plan).
 */
export const uploadModule = new Elysia({ prefix: '/upload' })
  .use(authPlugin)
  .post('/', async ({ body }) => {
    const file = body.file;

    if (!file) return status(400, { error: 'File tidak ditemukan' });

    if (file.size > MAX_FILE_SIZE) {
      return status(400, { error: 'File terlalu besar (maksimal 10MB)' });
    }

    const allowedTypes = ['image/', 'application/pdf'];
    const isValid = allowedTypes.some(
      (t) => file.type.startsWith(t) || file.name.toLowerCase().endsWith('.pdf'),
    );
    if (!isValid) {
      return status(400, { error: 'Hanya file gambar (PNG/JPG) dan PDF yang diizinkan' });
    }

    const ext = file.name.split('.').pop() || 'png';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    return { url: `/uploads/${filename}` };
  }, {
    body: t.Object({
      file: t.File({ maxSize: MAX_FILE_SIZE }),
    }),
    admin: true,
  });
