import { NextRequest, NextResponse } from 'next/server';

const customers = [
  { id: '1', name: 'Acme Corp', email: 'contact@acme.com', phone: '555-0100', company: 'Acme Corp' },
  { id: '2', name: 'Tech Inc', email: 'info@techinc.com', phone: '555-0200', company: 'Tech Inc' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const customer = customers.find(c => c.id === id);
    return customer ? NextResponse.json(customer) : NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(customers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ id: String(Date.now()), ...body }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const body = await request.json();
  return NextResponse.json({ id, ...body });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  return NextResponse.json({ success: true });
}
