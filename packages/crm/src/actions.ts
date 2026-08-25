// CRM API functions
import type { Customer, CreateCustomerInput } from '@qwik/shared';

const API_BASE = '/api/crm';

export async function getCustomers(): Promise<Customer[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function getCustomerById(id: string): Promise<Customer> {
  const res = await fetch(`${API_BASE}?id=${id}`);
  if (!res.ok) throw new Error('Failed to fetch customer');
  return res.json();
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create customer');
  return res.json();
}

export async function updateCustomer(id: string, input: Partial<CreateCustomerInput>): Promise<Customer> {
  const res = await fetch(`${API_BASE}?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update customer');
  return res.json();
}

export async function deleteCustomer(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete customer');
}

export type { Customer, CreateCustomerInput };
