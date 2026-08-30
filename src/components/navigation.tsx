'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <aside className="qwik-sidebar">
      <nav>
        <div className="qwik-package">
          <h3>ERM</h3>
          <ul>
            <li><Link href="/admin/erm/financial">Financial</Link></li>
            <li><Link href="/admin/erm/hr">Human Resources</Link></li>
            <li><Link href="/admin/erm/inventory">Inventory</Link></li>
          </ul>
        </div>
        <div className="qwik-package">
          <h3>CRM</h3>
          <ul>
            <li><Link href="/admin/crm/customers">Customers</Link></li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
