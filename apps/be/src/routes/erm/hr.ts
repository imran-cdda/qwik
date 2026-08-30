import { Hono } from 'hono';

const employees = [
  { id: '1', name: 'John Doe', email: 'john@company.com', department: 'Engineering', position: 'Developer', hireDate: '2023-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', department: 'Marketing', position: 'Manager', hireDate: '2022-06-01' },
];

export const hrRoute = new Hono();

hrRoute.get('/', (c) => {
  const id = c.req.query('id');
  if (id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) {
      return c.json({ error: 'Not found' }, 404);
    }
    return c.json(emp);
  }
  return c.json(employees);
});

hrRoute.post('/', async (c) => {
  const body = await c.req.json();
  const newEmployee = { id: String(Date.now()), ...body };
  return c.json(newEmployee, 201);
});

hrRoute.put('/', async (c) => {
  const id = c.req.query('id');
  if (!id) {
    return c.json({ error: 'ID required' }, 400);
  }
  const body = await c.req.json();
  return c.json({ id, ...body });
});

hrRoute.delete('/', (c) => {
  const id = c.req.query('id');
  if (!id) {
    return c.json({ error: 'ID required' }, 400);
  }
  return c.json({ success: true });
});
