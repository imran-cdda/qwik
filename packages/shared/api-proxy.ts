/**
 * Framework-agnostic API proxy handler with E2E encryption.
 * - Decrypts incoming request body
 * - Encrypts outgoing response body
 * Works with Astro, Next.js, Remix, or any framework.
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

export interface ProxyHandlerConfig {
  baseUrl: string;
  /**
   * Secret key for encrypting/decrypting.
   * Format: base64-encoded 256-bit key
   */
  encryptionKey?: string;
}

/**
 * Normalizes path to string format.
 */
function normalizePath(path: string | string[]): string {
  if (Array.isArray(path)) {
    return path.join('/');
  }
  return path;
}

/**
 * Derives an AES-256-GCM key from a base64-encoded secret.
 */
async function deriveKey(base64Secret: string): Promise<CryptoKey> {
  const secret = Uint8Array.from(atob(base64Secret), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'raw',
    secret,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Decrypts a JWE token using AES-256-GCM.
 * Format: iv.ciphertext.tag (base64)
 */
async function decryptJwe(token: string, key: CryptoKey): Promise<string> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload format');
  }

  const [ivBase64, ciphertext, tag] = parts;
  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));
  const encryptedData = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
  const authTag = Uint8Array.from(atob(tag), (c) => c.charCodeAt(0));

  // Combine ciphertext and auth tag (GCM expects tag at end)
  const combined = new Uint8Array(encryptedData.length + authTag.length);
  combined.set(encryptedData);
  combined.set(authTag, encryptedData.length);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    combined
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Converts Uint8Array to base64 string safely.
 */
function toBase64(arr: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

/**
 * Encrypts data as a JWE token using AES-256-GCM.
 * Format: iv.ciphertext.tag (base64)
 */
async function encryptJwe(plaintext: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // AES-GCM with 128-bit auth tag
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    data
  );

  // Extract ciphertext and tag (last 16 bytes)
  const encryptedArray = new Uint8Array(encrypted);
  const ciphertext = encryptedArray.slice(0, -16);
  const tag = encryptedArray.slice(-16);

  return `${toBase64(iv)}.${toBase64(ciphertext)}.${toBase64(tag)}`;
}

/**
 * Reads the full body from a ReadableStream.
 */
async function readBody(body: ReadableStream | null): Promise<Uint8Array> {
  if (!body) return new Uint8Array(0);
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLength += value.length;
  }

  const fullBody = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    fullBody.set(chunk, offset);
    offset += chunk.length;
  }
  return fullBody;
}

/**
 * Framework-agnostic proxy handler factory.
 *
 * Usage:
 *   const handler = createProxyHandler({ baseUrl: BE_URL, encryptionKey: KEY });
 *   export const POST = (req, { params }) => handler(req, params);
 *
 * Client should:
 *   - Encrypt body with encryptJwe() before sending
 *   - Decrypt response body with decryptJwe() after receiving
 */
export function createProxyHandler(config: ProxyHandlerConfig) {
  const { baseUrl, encryptionKey } = config;

  return async function proxyHandler(
    request: ProxyRequest,
    params: ProxyParams
  ): Promise<Response> {
    const path = normalizePath(params.path);
    const targetUrl = `${baseUrl}/api/${path}`;

    // Forward query string
    const url = new URL(request.url);
    const fullTarget = url.search ? `${targetUrl}${url.search}` : targetUrl;

    const headers = new Headers(request.headers);
    headers.delete('host');

    let body = request.body;

    // Decrypt request body if encrypted
    if (body && encryptionKey) {
      try {
        const rawBody = await readBody(body);
        const bodyString = new TextDecoder().decode(rawBody);

        if (bodyString.includes('.')) {
          // Likely encrypted - decrypt
          const cryptoKey = await deriveKey(encryptionKey);
          const decrypted = await decryptJwe(bodyString, cryptoKey);
          body = new ReadableStream({
            start(controller) {
              controller.enqueue(new TextEncoder().encode(decrypted));
              controller.close();
            },
          });
          headers.set('content-type', 'application/json');
          // Remove content-length since body size changed after decryption
          headers.delete('content-length');
        }
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to decrypt request' }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        });
      }
    }

    // Forward to BE
    const upstreamRes = await fetch(fullTarget, {
      method: request.method,
      headers,
      body,
      duplex: 'half',
    } as RequestInit);

    // Encrypt response body if encryption is enabled
    if (encryptionKey) {
      try {
        const responseBody = await upstreamRes.text();
        const cryptoKey = await deriveKey(encryptionKey);
        const encryptedResponse = await encryptJwe(responseBody, cryptoKey);

        return new Response(new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(encryptedResponse));
            controller.close();
          },
        }), {
          status: upstreamRes.status,
          statusText: upstreamRes.statusText,
          headers: {
            'content-type': 'text/plain',
            'content-length': String(new TextEncoder().encode(encryptedResponse).length),
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to encrypt response' }), {
          status: 500,
          headers: { 'content-type': 'application/json' },
        });
      }
    }

    // No encryption - return plain response
    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: upstreamRes.headers,
    });
  };
}

export { encryptJwe, decryptJwe };
