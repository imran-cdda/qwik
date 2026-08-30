import { Hono } from 'hono';

const customers = [
  { id: '1', name: 'Acme Corp', email: 'contact@acme.com', phone: '555-0100', company: 'Acme Corp' },
  { id: '2', name: 'Tech Inc', email: 'info@techinc.com', phone: '555-0200', company: 'Tech Inc' },
];

export const customersRoute = new Hono();

customersRoute.get('/', (c) => {
  const id = c.req.query('id');
  if (id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) {
      return c.json({ error: 'Not found' }, 404);
    }
    return c.json(customer);
  }
  return c.json(customers);
});

customersRoute.post('/', async (c) => {
  const body = await c.req.json();
  const newCustomer = { id: String(Date.now()), ...body };
  return c.json(newCustomer, 201);
});

customersRoute.put('/', async (c) => {
  const id = c.req.query('id');
  if (!id) {
    return c.json({ error: 'ID required' }, 400);
  }
  const body = await c.req.json();
  return c.json({ id, ...body });
});

customersRoute.delete('/', (c) => {
  const id = c.req.query('id');
  if (!id) {
    return c.json({ error: 'ID required' }, 400);
  }
  return c.json({ success: true });
});
