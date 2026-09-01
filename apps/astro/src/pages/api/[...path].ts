import type { APIRoute } from 'astro';
import { createProxyHandler } from '@qwik/monorepo/shared';

// BE server URL - server-side only, never reaches the browser
const BE_URL = import.meta.env.APP_BASE_URL || 'http://localhost:3001';

export const ALL: APIRoute = (ctx) => createProxyHandler(BE_URL)(ctx.request, { path: ctx.params.path as string | string[] });
