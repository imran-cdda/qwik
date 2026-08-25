# Backend Patterns

## Astro API Routes

### Basic Endpoint
```typescript
// src/pages/api/users.ts
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

## Error Handling

- Return appropriate HTTP status codes
- Include error messages in response body
- Log errors server-side without exposing details to client

## Data Validation

- Validate all input using a schema library (Zod, Valibot)
- Never trust client-side validation alone
- Return 400 Bad Request for validation errors
