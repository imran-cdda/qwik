import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Hono default port
const PORT = parseInt(process.env.PORT || '3001', 10);

// CRM Routes
import { customersRoute } from './routes/crm';
// ERM - Financial Routes
import { financialRoute } from './routes/erm/financial';
// ERM - HR Routes
import { hrRoute } from './routes/erm/hr';
// ERM - Inventory Routes
import { inventoryRoute } from './routes/erm/inventory';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:4321'],
  credentials: true,
}));

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Mount routes
app.route('/api/crm', customersRoute);
app.route('/api/erm/financial', financialRoute);
app.route('/api/erm/hr', hrRoute);
app.route('/api/erm/inventory', inventoryRoute);

// Error handling
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({ error: err.message || 'Internal Server Error' }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Start server
console.log(`🚀 Hono API server running on http://localhost:${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch,
};
