// Shared types used across all packages
export { createApiClient } from './api-client';
export type { ApiClientConfig } from './api-client';
export { createProxyHandler, encryptJwe, decryptJwe } from './api-proxy';
export type { ProxyParams, ProxyRequest, ProxyHandlerConfig } from './api-proxy';

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

// ERM - Financial
export interface Invoice {
  id: string;
  customerId: string;
  amount: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
}

export interface CreateInvoiceInput {
  customerId: string;
  amount: number;
  dueDate: string;
}

// ERM - HR
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  department: string;
  position: string;
}

// ERM - Inventory
export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

// CRM
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone: string;
  company: string;
}
