# Backend Patterns

## Hono Backend API

All API routes are centralized in the Hono backend at `apps/be/src/routes/`.

### Running the Backend
```bash
bun run dev:be        # Dev server on port 3001
bun run build:be      # Production build
bun run start:be      # Start production
```

### API Endpoints

| Module | Endpoint | Methods |
|--------|----------|---------|
| CRM | `/api/crm` | GET, POST, PUT, DELETE |
| Financial | `/api/erm/financial` | GET, POST, PUT, DELETE |
| HR | `/api/erm/hr` | GET, POST, PUT, DELETE |
| Inventory | `/api/erm/inventory` | GET, POST, PUT, DELETE |

### Hono Route Example
```typescript
// apps/be/src/routes/crm.ts
import { Hono } from 'hono';

export const customersRoute = new Hono();

customersRoute.get('/', (c) => {
  const id = c.req.query('id');
  if (id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) return c.json({ error: 'Not found' }, 404);
    return c.json(customer);
  }
  return c.json(customers);
});
```

## API Client (Server-side)

All API calls from packages must use `createApiClient()` from `@qwik/shared`:
```typescript
import { createApiClient } from '@qwik/shared';

const api = createApiClient({
  baseUrl: process.env.APP_BASE_URL || 'http://localhost:3001',
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
