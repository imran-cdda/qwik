// CRM API functions
import type { Customer, CreateCustomerInput } from '@qwik/shared';
import { createApiClient } from '@qwik/shared';

const api = createApiClient();

export async function getCustomers(): Promise<Customer[]> {
  return api.get<Customer[]>('/api/crm');
}

export async function getCustomerById(id: string): Promise<Customer> {
  return api.get<Customer>(`/api/crm?id=${id}`);
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  return api.post<Customer>('/api/crm', input);
}

export async function updateCustomer(id: string, input: Partial<CreateCustomerInput>): Promise<Customer> {
  return api.put<Customer>(`/api/crm?id=${id}`, input);
}

export async function deleteCustomer(id: string): Promise<void> {
  return api.delete<void>(`/api/crm?id=${id}`);
}

export type { Customer, CreateCustomerInput };
