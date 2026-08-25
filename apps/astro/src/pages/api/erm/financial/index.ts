const invoices = [
  { id: '1', customerId: 'c1', amount: 1000, status: 'paid', dueDate: '2024-01-15', description: 'Website development' },
  { id: '2', customerId: 'c2', amount: 2500, status: 'pending', dueDate: '2024-02-01', description: 'Marketing campaign' },
  { id: '3', customerId: 'c3', amount: 750, status: 'overdue', dueDate: '2023-12-20', description: 'Logo design' },
  { id: '4', customerId: 'c4', amount: 3200, status: 'paid', dueDate: '2024-01-30', description: 'SEO services' },
  { id: '5', customerId: 'c5', amount: 1800, status: 'pending', dueDate: '2024-02-15', description: 'Social media management' },
];

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (id) {
    const invoice = invoices.find(i => i.id === id);
    return invoice ? new Response(JSON.stringify(invoice), { status: 200 }) : new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }
  return new Response(JSON.stringify(invoices), { status: 200 });
}

export async function POST({ request }: { request: Request }) {
  const body = await request.json();
  const newInvoice = { id: String(Date.now()), ...body };
  return new Response(JSON.stringify(newInvoice), { status: 201 });
}
