// ERM - Financial actions - calls external API directly (server-side)
import { createApiClient } from '@qwik/monorepo/shared';
import type { Invoice, CreateInvoiceInput } from '@qwik/monorepo/shared';

export type { Invoice, CreateInvoiceInput };

const api = createApiClient({
  baseUrl: process.env.APP_BASE_URL || 'http://localhost:4321',
  apiKey: process.env.API_KEY || '',
});

export async function getInvoices(): Promise<Invoice[]> {
  return api.get<Invoice[]>('/api/erm/financial');
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  return api.get<Invoice>(`/api/erm/financial?id=${id}`);
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  return api.post<Invoice>('/api/erm/financial', input);
}

export async function updateInvoice(id: string, input: Partial<CreateInvoiceInput>): Promise<Invoice> {
  return api.put<Invoice>(`/api/erm/financial?id=${id}`, input);
}

export async function deleteInvoice(id: string): Promise<void> {
  return api.delete<void>(`/api/erm/financial?id=${id}`);
}

export async function markInvoiceAsPaid(id: string): Promise<Invoice> {
  return api.post<Invoice>(`/api/erm/financial/pay?id=${id}`, {});
}
