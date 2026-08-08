import { treaty } from '@elysiajs/eden';
import ky from 'ky';
import type { App } from '@/src/server';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

/**
 * End-to-end type-safe API client.
 *
 * - `ky` handles HTTP (credentials, JSON, retries, timeouts) and is used as
 *   Eden's fetcher so every call is typed against the Elysia `App`.
 * - `import type { App }` keeps server code out of the client bundle.
 */
export const api = treaty<App>(baseUrl, {
  fetcher: ky,
  fetch: {
    credentials: 'include',
  },
}).api;

export { ky };
