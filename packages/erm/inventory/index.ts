// ERM - Inventory API functions
import type { Product, CreateProductInput } from '@qwik/shared';
import { createApiClient } from '@qwik/shared';

const api = createApiClient();

export async function getProducts(): Promise<Product[]> {
  return api.get<Product[]>('/api/erm/inventory');
}

export async function getProductById(id: string): Promise<Product> {
  return api.get<Product>(`/api/erm/inventory?id=${id}`);
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  return api.post<Product>('/api/erm/inventory', input);
}

export async function updateProduct(id: string, input: Partial<CreateProductInput>): Promise<Product> {
  return api.put<Product>(`/api/erm/inventory?id=${id}`, input);
}

export async function deleteProduct(id: string): Promise<void> {
  return api.delete<void>(`/api/erm/inventory?id=${id}`);
}

export async function updateStock(id: string, quantity: number): Promise<Product> {
  return api.post<Product>(`/api/erm/inventory/stock?id=${id}`, { quantity });
}

export type { Product, CreateProductInput };
