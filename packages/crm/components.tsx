'use client';

import { useState } from 'react';
import type { Customer, CreateCustomerInput } from '@qwik/monorepo/crm/actions';
import { createCustomer } from '@qwik/monorepo/crm/actions';

interface Props {
  initialData?: Customer[];
}

export function CustomerList({ initialData = [] }: Props) {
  const [customers] = useState<Customer[]>(initialData);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Management</h2>
        <p className="text-slate-500 text-sm mt-1">Manage client records and contact information</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">{customer.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">{customer.company || 'Individual'}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-slate-400">Email:</span>
                  <span className="text-slate-700">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-slate-400">Phone:</span>
                    <span className="text-slate-700">{customer.phone}</span>
                  </div>
                )}
              </div>
            </div>
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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-lg space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Add New Customer</h3>
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
        <input
          type="text"
          placeholder="e.g. Acme Corp / John Smith"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="e.g. contact@acme.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="tel"
            placeholder="e.g. +1 555-0199"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
          <input
            type="text"
            placeholder="e.g. Acme Inc."
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Adding...' : 'Add Customer'}
      </button>
    </form>
  );
}
