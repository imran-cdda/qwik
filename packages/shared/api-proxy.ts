/**
 * Framework-agnostic API proxy handler.
 * Works with Astro, Next.js, Remix, or any framework that follows the pattern:
 *   - Receives a request and params
 *   - Forwards it to the BE server
 *
 * Astro: params.path is a string (e.g., "erm/financial")
 * Next.js: params.path is string[] (e.g., ["erm", "financial"])
 */

export interface ProxyParams {
  path: string | string[];
}

export interface ProxyRequest {
  method: string;
  url: string;
  headers: Headers;
  body: ReadableStream | null;
}

/**
 * Normalizes path to string format.
 * Astro: string
 * Next.js: string[]
 */
function normalizePath(path: string | string[]): string {
  if (Array.isArray(path)) {
    return path.join('/');
  }
  return path;
}

/**
 * Creates the target URL for the BE server.
 */
function createProxyUrl(path: string, baseUrl: string): string {
  const targetUrl = `${baseUrl}/api/${path}`;

  // Forward query string
  const url = new URL(targetUrl);
  return url.toString();
}

/**
 * Framework-agnostic proxy handler factory.
 * Accepts framework-specific { request, params } and returns a Response.
 *
 * Usage:
 *   // Astro
 *   export const ALL: APIRoute = ({ request, params }) => createProxyHandler(BE_URL)({ request, params });
 *
 *   // Next.js
 *   const handler = createProxyHandler(BE_URL);
 *   export const GET = (req, { params }) => handler(req, params);
 */
export function createProxyHandler(baseUrl: string) {
  return function proxyHandler(
    request: ProxyRequest,
    params: ProxyParams
  ): Response {
    const path = normalizePath(params.path);
    const targetUrl = createProxyUrl(path, baseUrl);

    const headers = new Headers(request.headers);
    // Remove host so the BE sees its own host
    headers.delete('host');

    // Use Promise-based fetch for streaming body
    return fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.body,
      duplex: 'half',
    } as RequestInit) as unknown as Response;
  };
}
