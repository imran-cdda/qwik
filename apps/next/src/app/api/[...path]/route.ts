import { type NextRequest, NextResponse } from 'next/server';

// BE server URL - server-side only, never exposed to the browser
const BE_URL = process.env.APP_BASE_URL || 'http://localhost:3001';

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const targetUrl = `${BE_URL}/api/${path.join('/')}`;

  // Forward query string
  const { search } = new URL(req.url);
  const fullTarget = search ? `${targetUrl}${search}` : targetUrl;

  const headers = new Headers(req.headers);
  // Remove host header so the BE sees its own host
  headers.delete('host');

  const upstreamRes = await fetch(fullTarget, {
    method: req.method,
    headers,
    body: req.body,
    duplex: 'half',
  } as RequestInit);

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers: upstreamRes.headers,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;