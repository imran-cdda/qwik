'use client';

import Link from 'next/link';

const navItems = [
  { href: '/admin/erm/financial', label: 'Financial', package: 'erm' },
  { href: '/admin/erm/hr', label: 'Human Resources', package: 'erm' },
  { href: '/admin/erm/inventory', label: 'Inventory', package: 'erm' },
  { href: '/admin/crm/customers', label: 'Customers', package: 'crm' },
];

export function Navigation() {
  return (
    <aside className="qwik-sidebar">
      <nav>
        <div className="qwik-package">
          <h3>ERM</h3>
          <ul>
            {navItems.filter(item => item.package === 'erm').map(item => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="qwik-package">
          <h3>CRM</h3>
          <ul>
            {navItems.filter(item => item.package === 'crm').map(item => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
