const customers = [
  { id: '1', name: 'Acme Corp', email: 'contact@acme.com', phone: '555-0100', company: 'Acme Corporation' },
  { id: '2', name: 'TechStart Inc', email: 'info@techstart.io', phone: '555-0101', company: 'TechStart Inc' },
];

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (id) {
    const customer = customers.find(c => c.id === id);
    return customer ? new Response(JSON.stringify(customer), { status: 200 }) : new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }
  return new Response(JSON.stringify(customers), { status: 200 });
}

export async function POST({ request }: { request: Request }) {
  const body = await request.json();
  return new Response(JSON.stringify({ id: String(Date.now()), ...body }), { status: 201 });
}

export async function PUT({ request }: { request: Request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return new Response(JSON.stringify({ error: 'ID required' }), { status: 400 });
  const body = await request.json();
  return new Response(JSON.stringify({ id, ...body }), { status: 200 });
}

export async function DELETE({ request }: { request: Request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return new Response(JSON.stringify({ error: 'ID required' }), { status: 400 });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
