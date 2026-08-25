const products = [
  { id: '1', name: 'Laptop', sku: 'TECH-001', quantity: 50, price: 999.99 },
  { id: '2', name: 'Mouse', sku: 'TECH-002', quantity: 200, price: 29.99 },
  { id: '3', name: 'Keyboard', sku: 'TECH-003', quantity: 150, price: 79.99 },
];

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (id) {
    const product = products.find(p => p.id === id);
    return product ? new Response(JSON.stringify(product), { status: 200 }) : new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }
  return new Response(JSON.stringify(products), { status: 200 });
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
