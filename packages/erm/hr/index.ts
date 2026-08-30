// ERM - HR API functions
import type { Employee, CreateEmployeeInput } from '@qwik/monorepo/shared';
import { createApiClient } from '@qwik/monorepo/shared';

const api = createApiClient();

export async function getEmployees(): Promise<Employee[]> {
  return api.get<Employee[]>('/api/erm/hr');
}

export async function getEmployeeById(id: string): Promise<Employee> {
  return api.get<Employee>(`/api/erm/hr?id=${id}`);
}

export async function createEmployee(input: CreateEmployeeInput): Promise<Employee> {
  return api.post<Employee>('/api/erm/hr', input);
}

export async function updateEmployee(id: string, input: Partial<CreateEmployeeInput>): Promise<Employee> {
  return api.put<Employee>(`/api/erm/hr?id=${id}`, input);
}

export async function deleteEmployee(id: string): Promise<void> {
  return api.delete<void>(`/api/erm/hr?id=${id}`);
}

export type { Employee, CreateEmployeeInput };
