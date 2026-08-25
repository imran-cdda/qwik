const employees = [
  { id: '1', name: 'John Doe', email: 'john@company.com', department: 'Engineering', position: 'Developer', hireDate: '2023-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', department: 'Marketing', position: 'Manager', hireDate: '2022-06-01' },
];

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (id) {
    const emp = employees.find(e => e.id === id);
    return emp ? new Response(JSON.stringify(emp), { status: 200 }) : new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }
  return new Response(JSON.stringify(employees), { status: 200 });
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
