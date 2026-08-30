'use client';

import { useState } from 'react';
import type { Product, CreateProductInput } from '@qwik/monorepo/erm/inventory';
import { createProduct } from '@qwik/monorepo/erm/inventory';

interface Props {
  initialData?: Product[];
}

export function InventoryDashboard({ initialData = [] }: Props) {
  const [products] = useState<Product[]>(initialData);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Management</h2>
        <p className="text-slate-500 text-sm mt-1">Track and update warehouse stock levels</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900 text-lg">{product.name}</h3>
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                  {product.sku}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">${product.price.toFixed(2)}</div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-500">Stock Quantity</span>
              <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                product.quantity > 10
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {product.quantity} units
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreateProductForm({ onSuccess }: { onSuccess?: (p: Product) => void }) {
  const [formData, setFormData] = useState<CreateProductInput>({
    name: '',
    sku: '',
    quantity: 0,
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const product = await createProduct(formData);
      onSuccess?.(product);
      setFormData({ name: '', sku: '', quantity: 0, price: 0 });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-lg space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Add New Product</h3>
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
        <input
          type="text"
          placeholder="e.g. Wireless Mouse"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
        <input
          type="text"
          placeholder="e.g. PRD-001"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
          <input
            type="number"
            placeholder="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
          <input
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
}
