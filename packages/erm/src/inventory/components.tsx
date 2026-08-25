'use client';

import { useState } from 'react';
import type { Product, CreateProductInput } from '@qwik/erm/inventory';
import { createProduct } from '@qwik/erm/inventory';

interface Props {
  initialData?: Product[];
}

export function InventoryDashboard({ initialData = [] }: Props) {
  const [products] = useState<Product[]>(initialData);

  return (
    <div className="inventory-dashboard">
      <h2>Inventory Management</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>SKU: {product.sku}</p>
            <p>Qty: {product.quantity}</p>
            <p>Price: ${product.price}</p>
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
    <form onSubmit={handleSubmit} className="product-form">
      <input
        type="text"
        placeholder="Product Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="SKU"
        value={formData.sku}
        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Product'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
