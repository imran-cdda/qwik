export interface ApiClientConfig {
  baseUrl: string;
  apiKey: string;
}

// Server-side only API client - API key never exposed to client
export function createApiClient(config: ApiClientConfig) {
  const { baseUrl, apiKey } = config;

  async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let url = endpoint;
    if (!endpoint.startsWith('http')) {
      // Construct absolute URL for server-side calls
      const protocol = process.env.NEXT_PUBLIC_APP_URL?.startsWith('https') ? 'https' : 'http';
      const host = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 'localhost:3000';
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
