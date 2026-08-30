import { Hono } from 'hono';

const invoices = [
  { id: '1', customerId: 'c1', amount: 1000, status: 'paid', dueDate: '2024-01-15', createdAt: '2024-01-01' },
  { id: '2', customerId: 'c2', amount: 2500, status: 'pending', dueDate: '2024-02-15', createdAt: '2024-01-15' },
  { id: '3', customerId: 'c3', amount: 850, status: 'overdue', dueDate: '2023-12-01', createdAt: '2023-11-15' },
];

export const financialRoute = new Hono();

financialRoute.get('/', (c) => {
  const id = c.req.query('id');
  if (id) {
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) {
      return c.json({ error: 'Not found' }, 404);
    }
    return c.json(invoice);
  }
  return c.json(invoices);
});

financialRoute.post('/', async (c) => {
  const body = await c.req.json();
  const newInvoice = {
    id: String(Date.now()),
    customerId: body.customerId,
    amount: body.amount,
    status: 'draft',
    dueDate: body.dueDate,
    createdAt: new Date().toISOString(),
  };
  return c.json(newInvoice, 201);
});

financialRoute.put('/', async (c) => {
  const id = c.req.query('id');
  if (!id) {
    return c.json({ error: 'ID required' }, 400);
  }
  const body = await c.req.json();
  return c.json({ id, ...body });
});

financialRoute.delete('/', (c) => {
  const id = c.req.query('id');
  if (!id) {
    return c.json({ error: 'ID required' }, 400);
  }
  return c.json({ success: true });
});
