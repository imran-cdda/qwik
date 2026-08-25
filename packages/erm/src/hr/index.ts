// ERM - HR API functions
import type { Employee, CreateEmployeeInput } from '@qwik/shared';

const API_BASE = '/api/erm/hr';

export async function getEmployees(): Promise<Employee[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
}

export async function getEmployeeById(id: string): Promise<Employee> {
  const res = await fetch(`${API_BASE}?id=${id}`);
  if (!res.ok) throw new Error('Failed to fetch employee');
  return res.json();
}

export async function createEmployee(input: CreateEmployeeInput): Promise<Employee> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create employee');
  return res.json();
}

export async function updateEmployee(id: string, input: Partial<CreateEmployeeInput>): Promise<Employee> {
  const res = await fetch(`${API_BASE}?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update employee');
  return res.json();
}

export async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete employee');
}

export type { Employee, CreateEmployeeInput };
