import { Hono } from 'hono';

const products = [
  { id: '1', name: 'Widget A', sku: 'WA-001', quantity: 100, price: 29.99 },
  { id: '2', name: 'Widget B', sku: 'WB-002', quantity: 50, price: 49.99 },
];

export const inventoryRoute = new Hono();

inventoryRoute.get('/', (c) => {
  const id = c.req.query('id');
  if (id) {
    const product = products.find(p => p.id === id);
    if (!product) {
      return c.json({ error: 'Not found' }, 404);
    }
    return c.json(product);
  }
  return c.json(products);
});

inventoryRoute.post('/', async (c) => {
  const body = await c.req.json();
  const newProduct = { id: String(Date.now()), ...body };
  return c.json(newProduct, 201);
});

inventoryRoute.put('/', async (c) => {
  const id = c.req.query('id');
  if (!id) {
    return c.json({ error: 'ID required' }, 400);
  }
  const body = await c.req.json();
  return c.json({ id, ...body });
});

inventoryRoute.delete('/', (c) => {
  const id = c.req.query('id');
  if (!id) {
    return c.json({ error: 'ID required' }, 400);
  }
  return c.json({ success: true });
});
