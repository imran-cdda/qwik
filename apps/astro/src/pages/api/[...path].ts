import type { APIRoute } from 'astro';

// BE server URL - server-side only, never reaches the browser
const BE_URL = import.meta.env.APP_BASE_URL || 'http://localhost:3001';

export const ALL: APIRoute = async ({ request, params }) => {
  const path = params.path ?? '';
  const targetUrl = `${BE_URL}/api/${path}`;

  // Forward query string from the original request
  const { search } = new URL(request.url);
  const fullTarget = search ? `${targetUrl}${search}` : targetUrl;

  const headers = new Headers(request.headers);
  // Remove host so the BE sees its own host
  headers.delete('host');

  const upstreamRes = await fetch(fullTarget, {
    method: request.method,
    headers,
    body: request.body,
    duplex: 'half',
  } as RequestInit);

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers: upstreamRes.headers,
  });
};