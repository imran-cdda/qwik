# Backend Patterns

## API Routes (Host-specific)

Each host has its own API routes:
- Astro: `apps/astro/src/pages/api/*`
- Next.js: `apps/next/src/app/api/*`

## Astro API Routes

### Basic Endpoint
```typescript
// apps/astro/src/pages/api/users.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(JSON.stringify({ users: [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### With Request Handling
```typescript
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    // Process data
    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

## API Client (Server-side)

All API calls from packages must use `createApiClient()` from `@qwik/monorepo/shared`:
```typescript
import { createApiClient } from '@qwik/monorepo/shared';

const api = createApiClient({
  baseUrl: process.env.APP_BASE_URL || 'http://localhost:4321',
  apiKey: process.env.API_KEY,
});

// Then use: api.get('/api/erm/financial')
```

## Error Handling

- Return appropriate HTTP status codes
- Include error messages in response body
- Log errors server-side without exposing details to client

## Data Validation

- Validate all input using a schema library (Zod, Valibot)
- Never trust client-side validation alone
- Return 400 Bad Request for validation errors
