import { NextRequest, NextResponse } from 'next/server';

const products = [
  { id: '1', name: 'Widget A', sku: 'WA-001', quantity: 100, price: 29.99 },
  { id: '2', name: 'Widget B', sku: 'WB-002', quantity: 50, price: 49.99 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const product = products.find(p => p.id === id);
    return product ? NextResponse.json(product) : NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(products);
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
