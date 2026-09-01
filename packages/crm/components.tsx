'use client';

import { useState, useEffect, useRef } from 'react';
import type { Customer, CreateCustomerInput } from '@qwik/crm/actions';
import { createCustomer } from '@qwik/crm/actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  initialData?: Customer[];
}

const EMPTY_FORM: CreateCustomerInput = { name: '', email: '', phone: '', company: '' };

// ─── Create Customer Modal ─────────────────────────────────────────────────────

function CreateCustomerModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (c: Customer) => void;
}) {
  const [formData, setFormData] = useState<CreateCustomerInput>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  // Focus first field when modal opens; reset form when it closes
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 60);
    } else {
      setFormData(EMPTY_FORM);
      setError(null);
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const customer = await createCustomer(formData);
      onCreated(customer);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ccm-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(4px)',
        animation: 'ccmFadeIn 0.18s ease',
      }}
    >
      <style>{`
        @keyframes ccmFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes ccmSlideUp { from { opacity:0;transform:translateY(22px) scale(0.97) } to { opacity:1;transform:translateY(0) scale(1) } }
        @keyframes ccmSpin { to { transform:rotate(360deg) } }
      `}</style>

      <div
        style={{
          background: '#fff', borderRadius: '20px', padding: '32px',
          width: '100%', maxWidth: '480px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18),0 0 0 1px rgba(0,0,0,0.04)',
          animation: 'ccmSlideUp 0.22s cubic-bezier(0.34,1.4,0.64,1)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'24px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
              <div style={{
                width:'36px', height:'36px', borderRadius:'10px',
                background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h2 id="ccm-title" style={{ fontSize:'18px', fontWeight:700, color:'#111827', margin:0 }}>
                New Customer
              </h2>
            </div>
            <p style={{ fontSize:'13px', color:'#6b7280', margin:0 }}>Fill in the details to add a customer record.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background:'#f3f4f6', border:'none', borderRadius:'8px',
              width:'32px', height:'32px', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#6b7280', flexShrink:0, transition:'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            marginBottom:'16px', padding:'10px 14px', borderRadius:'10px',
            background:'#fef2f2', border:'1px solid #fecaca',
            color:'#b91c1c', fontSize:'13px', display:'flex', gap:'8px', alignItems:'flex-start',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0, marginTop:'1px' }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* Name */}
          <div>
            <label htmlFor="ccm-name" style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'6px' }}>
              Full Name <span style={{ color:'#ef4444' }}>*</span>
            </label>
            <input
              id="ccm-name"
              ref={firstInputRef}
              type="text"
              placeholder="e.g. John Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #e5e7eb', borderRadius:'10px', fontSize:'14px', color:'#111827', outline:'none', background:'#fafafa', boxSizing:'border-box' }}
              onFocus={(e) => { e.target.style.borderColor='#6366f1'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.12)'; e.target.style.background='#fff'; }}
              onBlur={(e) => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; e.target.style.background='#fafafa'; }}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="ccm-email" style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'6px' }}>
              Email Address <span style={{ color:'#ef4444' }}>*</span>
            </label>
            <input
              id="ccm-email"
              type="email"
              placeholder="e.g. john@acme.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #e5e7eb', borderRadius:'10px', fontSize:'14px', color:'#111827', outline:'none', background:'#fafafa', boxSizing:'border-box' }}
              onFocus={(e) => { e.target.style.borderColor='#6366f1'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.12)'; e.target.style.background='#fff'; }}
              onBlur={(e) => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; e.target.style.background='#fafafa'; }}
            />
          </div>

          {/* Phone + Company */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label htmlFor="ccm-phone" style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'6px' }}>Phone</label>
              <input
                id="ccm-phone"
                type="tel"
                placeholder="+1 555-0199"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #e5e7eb', borderRadius:'10px', fontSize:'14px', color:'#111827', outline:'none', background:'#fafafa', boxSizing:'border-box' }}
                onFocus={(e) => { e.target.style.borderColor='#6366f1'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.12)'; e.target.style.background='#fff'; }}
                onBlur={(e) => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; e.target.style.background='#fafafa'; }}
              />
            </div>
            <div>
              <label htmlFor="ccm-company" style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'6px' }}>Company</label>
              <input
                id="ccm-company"
                type="text"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #e5e7eb', borderRadius:'10px', fontSize:'14px', color:'#111827', outline:'none', background:'#fafafa', boxSizing:'border-box' }}
                onFocus={(e) => { e.target.style.borderColor='#6366f1'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.12)'; e.target.style.background='#fff'; }}
                onBlur={(e) => { e.target.style.borderColor='#e5e7eb'; e.target.style.boxShadow='none'; e.target.style.background='#fafafa'; }}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ height:'1px', background:'#f3f4f6', margin:'2px 0' }} />

          {/* Actions */}
          <div style={{ display:'flex', gap:'10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex:1, padding:'11px 16px', borderRadius:'10px',
                border:'1.5px solid #e5e7eb', background:'#fff',
                color:'#374151', fontWeight:600, fontSize:'14px',
                cursor:'pointer', transition:'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex:2, padding:'11px 16px', borderRadius:'10px',
                background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#7c3aed)',
                border:'none', color:'#fff',
                fontWeight:700, fontSize:'14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
                transition:'opacity 0.15s',
              }}
            >
              {loading ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation:'ccmSpin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Create Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Customer List ─────────────────────────────────────────────────────────────

export function CustomerList({ initialData = [] }: Props) {
  const [customers, setCustomers] = useState<Customer[]>(initialData);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreated = (customer: Customer) => {
    setCustomers((prev) => [customer, ...prev]);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>

      {/* Header row */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h2 style={{ fontSize:'22px', fontWeight:700, color:'#0f172a', margin:'0 0 4px' }}>
            Customer Management
          </h2>
          <p style={{ fontSize:'13px', color:'#64748b', margin:0 }}>
            {customers.length} record{customers.length !== 1 ? 's' : ''} · manage client contacts and information
          </p>
        </div>
        <button
          id="crm-add-customer-btn"
          onClick={() => setModalOpen(true)}
          style={{
            display:'flex', alignItems:'center', gap:'8px',
            padding:'10px 18px', borderRadius:'12px',
            background:'linear-gradient(135deg,#6366f1,#7c3aed)',
            border:'none', color:'#fff', fontWeight:700, fontSize:'14px',
            cursor:'pointer', boxShadow:'0 4px 14px rgba(99,102,241,0.35)',
            transition:'opacity 0.15s,transform 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='translateY(0)'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Customer
        </button>
      </div>

      {/* Empty state */}
      {customers.length === 0 ? (
        <div style={{
          textAlign:'center', padding:'56px 24px',
          border:'2px dashed #e2e8f0', borderRadius:'16px', color:'#94a3b8',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ margin:'0 auto 12px', display:'block' }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <p style={{ fontWeight:600, margin:'0 0 4px', color:'#475569' }}>No customers yet</p>
          <p style={{ fontSize:'13px', margin:0 }}>Click "Add Customer" to create your first record.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'16px' }}>
          {customers.map((customer) => (
            <div
              key={customer.id}
              style={{
                background:'#fff', padding:'20px', borderRadius:'16px',
                border:'1px solid #e2e8f0', boxShadow:'0 1px 4px rgba(0,0,0,0.05)',
                display:'flex', flexDirection:'column', gap:'14px',
                transition:'box-shadow 0.2s,transform 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,0.12)'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform='translateY(0)'; }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{
                  width:'42px', height:'42px', borderRadius:'12px', flexShrink:0,
                  background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:700, fontSize:'16px', color:'#fff',
                }}>
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth:0 }}>
                  <h3 style={{ fontWeight:700, fontSize:'15px', color:'#0f172a', margin:'0 0 2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {customer.name}
                  </h3>
                  <span style={{ fontSize:'12px', color:'#6366f1', fontWeight:600 }}>
                    {customer.company || 'Individual'}
                  </span>
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#475569' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0 }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{customer.email}</span>
                </div>
                {customer.phone && (
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#475569' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0 }}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.13.97.36 1.92.7 2.84a2 2 0 0 1-.45 2.11L7.91 9.6a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.92.34 1.87.57 2.84.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {customer.phone}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <CreateCustomerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}

// Keep CreateCustomerForm exported for any consumers using it directly
export function CreateCustomerForm({ onSuccess }: { onSuccess?: (c: Customer) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding:'10px 18px', borderRadius:'12px',
          background:'linear-gradient(135deg,#6366f1,#7c3aed)',
          border:'none', color:'#fff', fontWeight:700, fontSize:'14px', cursor:'pointer',
        }}
      >
        + Add Customer
      </button>
      <CreateCustomerModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={(c) => { onSuccess?.(c); setOpen(false); }}
      />
    </>
  );
}