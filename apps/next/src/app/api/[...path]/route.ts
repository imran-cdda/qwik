import { type NextRequest } from 'next/server';
import { createProxyHandler } from '@qwik/monorepo/shared';

// BE server URL - server-side only, never exposed to the browser
const BE_URL = process.env.APP_BASE_URL || 'http://localhost:3001';
const ENCRYPTION_KEY = process.env.PROXY_ENCRYPTION_KEY;

const proxy = createProxyHandler({ baseUrl: BE_URL, encryptionKey: ENCRYPTION_KEY });

const handler = async (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) => {
  const { path } = await params;
  return proxy(req, { path });
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
