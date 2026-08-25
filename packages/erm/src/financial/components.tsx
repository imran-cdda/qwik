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
    <div className="financial-dashboard">
      <h2>Financial Dashboard</h2>
      <div className="invoice-list">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="invoice-card">
            <span>{invoice.id}</span>
            <span>${invoice.amount}</span>
            <span className={`status-${invoice.status}`}>{invoice.status}</span>
          </div>
        ))}
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
    <form onSubmit={handleSubmit} className="invoice-form">
      <input
        type="text"
        placeholder="Customer ID"
        value={formData.customerId}
        onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
        required
      />
      <input
        type="date"
        value={formData.dueDate}
        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
