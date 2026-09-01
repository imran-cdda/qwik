import type { APIRoute } from 'astro';
import { createProxyHandler } from '@qwik/monorepo/shared';

// BE server URL - server-side only, never reaches the browser
const BE_URL = import.meta.env.APP_BASE_URL || 'http://localhost:3001';
const ENCRYPTION_KEY = import.meta.env.PROXY_ENCRYPTION_KEY;

export const ALL: APIRoute = (ctx) => createProxyHandler({ baseUrl: BE_URL, encryptionKey: ENCRYPTION_KEY })(ctx.request, { path: ctx.params.path as string | string[] });
