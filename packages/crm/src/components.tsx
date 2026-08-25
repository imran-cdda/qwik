'use client';

import { useState } from 'react';
import type { Customer, CreateCustomerInput } from '@qwik/crm/actions';
import { createCustomer } from '@qwik/crm/actions';

interface Props {
  initialData?: Customer[];
}

export function CustomerList({ initialData = [] }: Props) {
  const [customers] = useState<Customer[]>(initialData);

  return (
    <div className="customer-list">
      <h2>Customer Management</h2>
      <div className="customer-grid">
        {customers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <h3>{customer.name}</h3>
            <p>{customer.company}</p>
            <p>{customer.email}</p>
            <p>{customer.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreateCustomerForm({ onSuccess }: { onSuccess?: (c: Customer) => void }) {
  const [formData, setFormData] = useState<CreateCustomerInput>({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const customer = await createCustomer(formData);
      onSuccess?.(customer);
      setFormData({ name: '', email: '', phone: '', company: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
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
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <input
        type="text"
        placeholder="Company"
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Customer'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
