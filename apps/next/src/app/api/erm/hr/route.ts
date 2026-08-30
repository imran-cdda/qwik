import { NextRequest, NextResponse } from 'next/server';

const employees = [
  { id: '1', name: 'John Doe', email: 'john@company.com', department: 'Engineering', position: 'Developer', hireDate: '2023-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', department: 'Marketing', position: 'Manager', hireDate: '2022-06-01' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const emp = employees.find(e => e.id === id);
    return emp ? NextResponse.json(emp) : NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(employees);
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
