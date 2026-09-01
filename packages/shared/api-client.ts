export interface ApiClientConfig {
  baseUrl?: string;
  apiKey?: string;
  /**
   * Encryption key for E2E encryption (base64-encoded 256-bit key).
   * When provided, requests are encrypted and responses are decrypted.
   */
  encryptionKey?: string;
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

  // Proper base64 decoding with padding
  const pad = (s: string) => s + '='.repeat((4 - s.length % 4) % 4);
  const fromBase64 = (s: string) => Uint8Array.from(atob(pad(s)), (c) => c.charCodeAt(0));

  const iv = fromBase64(ivBase64);
  const encryptedData = fromBase64(ciphertext);
  const authTag = fromBase64(tag);

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

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    data
  );

  const encryptedArray = new Uint8Array(encrypted);
  const ciphertext = encryptedArray.slice(0, -16);
  const tag = encryptedArray.slice(-16);

  return `${toBase64(iv)}.${toBase64(ciphertext)}.${toBase64(tag)}`;
}

// Server-side only API client - API key never exposed to client
export function createApiClient(config: ApiClientConfig = {}) {
  const { apiKey } = config;
  // Read encryption key from config or environment variable
  const encryptionKey = config.encryptionKey ||
    (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.NEXT_PUBLIC_ENCRYPTION_KEY) ||
    (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_ENCRYPTION_KEY : undefined);

  let cryptoKey: Promise<CryptoKey> | null = null;

  if (encryptionKey) {
    cryptoKey = deriveKey(encryptionKey);
  }

  async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let url = endpoint;
    if (!endpoint.startsWith('http')) {
      // Route API calls through the FE app's own /api/* proxy layer.
      // Each FE exposes /api/** routes that forward to the BE server.
      // Priority: Astro PUBLIC_APP_URL > Next.js NEXT_PUBLIC_APP_URL > Astro default.
      // NOTE: APP_BASE_URL is intentionally excluded here — it is used by the
      // proxy handlers themselves to reach the BE, not by api-client.
      const baseUrl =
        (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.PUBLIC_APP_URL) ||
        (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_APP_URL : undefined) ||
        'http://localhost:4321'; // Astro default; Next.js overrides via NEXT_PUBLIC_APP_URL
      const protocol = baseUrl.startsWith('https') ? 'https' : 'http';
      const host = baseUrl.replace(/^https?:\/\//, '');
      url = `${protocol}://${host}${endpoint}`;
    }

    // Encrypt body if encryption key is provided
    let body: BodyInit | null = options.body ?? null;
    let contentType = 'application/json';

    if (body && encryptionKey && cryptoKey) {
      const bodyStr = typeof body === 'string' ? body : await new Response(body).text();
      const encrypted = await encryptJwe(bodyStr, await cryptoKey);
      body = encrypted;
      contentType = 'text/plain';
    }

    const response = await fetch(url, {
      ...options,
      body,
      headers: {
        'Content-Type': contentType,
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
        ...options.headers,
      },
    });

    // Decrypt response if encryption key is provided
    if (encryptionKey && response.ok && cryptoKey) {
      const responseText = await response.text();
      if (responseText.includes('.')) {
        try {
          const decrypted = await decryptJwe(responseText, await cryptoKey);
          return JSON.parse(decrypted);
        } catch {
          // Response might not be encrypted (e.g., GET requests)
          return JSON.parse(responseText);
        }
      }
      return JSON.parse(responseText);
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  return {
    get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, data: unknown) =>
      request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: <T>(endpoint: string, data: unknown) =>
      request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
  };
}
