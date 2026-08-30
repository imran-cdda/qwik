export interface ApiClientConfig {
  baseUrl?: string;
  apiKey?: string;
}

// Server-side only API client - API key never exposed to client
export function createApiClient(config: ApiClientConfig = {}) {
  const { apiKey } = config;

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
        process.env.NEXT_PUBLIC_APP_URL ||
        'http://localhost:4321'; // Astro default; Next.js overrides via NEXT_PUBLIC_APP_URL
      const protocol = baseUrl.startsWith('https') ? 'https' : 'http';
      const host = baseUrl.replace(/^https?:\/\//, '');
      url = `${protocol}://${host}${endpoint}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
        ...options.headers,
      },
    });

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
