'use client';

import { useState } from 'react';
import type { Employee, CreateEmployeeInput } from '@qwik/erm/hr';
import { createEmployee } from '@qwik/erm/hr';

interface Props {
  initialData?: Employee[];
}

export function EmployeeList({ initialData = [] }: Props) {
  const [employees] = useState<Employee[]>(initialData);

  return (
    <div className="employee-list">
      <h2>Human Resources</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CreateEmployeeForm({ onSuccess }: { onSuccess?: (emp: Employee) => void }) {
  const [formData, setFormData] = useState<CreateEmployeeInput>({
    name: '',
    email: '',
    department: '',
    position: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const emp = await createEmployee(formData);
      onSuccess?.(emp);
      setFormData({ name: '', email: '', department: '', position: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Department"
        value={formData.department}
        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Position"
        value={formData.position}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Employee'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
