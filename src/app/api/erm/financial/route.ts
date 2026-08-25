import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production, this connects to real external API
const invoices = [
  { id: '1', customerId: 'c1', amount: 1000, status: 'paid', dueDate: '2024-01-15', createdAt: '2024-01-01' },
  { id: '2', customerId: 'c2', amount: 2500, status: 'pending', dueDate: '2024-02-15', createdAt: '2024-01-15' },
  { id: '3', customerId: 'c3', amount: 750, status: 'overdue', dueDate: '2023-12-01', createdAt: '2023-11-15' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(invoice);
  }

  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newInvoice = {
    id: String(Date.now()),
    customerId: body.customerId,
    amount: body.amount,
    status: 'draft',
    dueDate: body.dueDate,
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json(newInvoice, { status: 201 });
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
