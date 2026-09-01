'use client';

import { useState } from 'react';
import type { Invoice, CreateInvoiceInput } from '@qwik/erm/financial';
import { createInvoice } from '@qwik/erm/financial';

interface Props {
  initialData?: Invoice[];
}

export function FinancialDashboard({ initialData = [] }: Props) {
  const [invoices] = useState<Invoice[]>(initialData);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Manage corporate invoices and billing statuses</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-semibold text-slate-800 text-sm">Recent Invoices</div>
        <div className="divide-y divide-slate-100">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                  INV
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{invoice.id}</div>
                  <div className="text-xs text-slate-400">Due: {invoice.dueDate || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-bold text-slate-900 text-sm">${invoice.amount.toFixed(2)}</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    invoice.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : invoice.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CreateInvoiceForm({ onSuccess }: { onSuccess?: (invoice: Invoice) => void }) {
  const [formData, setFormData] = useState<CreateInvoiceInput>({
    customerId: '',
    amount: 0,
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const invoice = await createInvoice(formData);
      onSuccess?.(invoice);
      setFormData({ customerId: '', amount: 0, dueDate: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-lg space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Create New Invoice</h3>
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Customer ID</label>
        <input
          type="text"
          placeholder="e.g. CUST-1001"
          value={formData.customerId}
          onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
          <input
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>
    </form>
  );
}
