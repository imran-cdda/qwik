'use client';

import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  package: string;
}

interface Props {
  items: NavItem[];
  currentPath?: string;
}

export function NavigationClient({ items, currentPath }: Props) {
  let pathname = currentPath || '';
  try {
    pathname = usePathname() || currentPath || '';
  } catch {
    // Astro - use currentPath prop
  }

  const ermItems = items.filter(item => item.package === 'erm');
  const crmItems = items.filter(item => item.package === 'crm');

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Qwik Dashboard</h1>
      </div>
      <nav>
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">ERM</h3>
          <ul className="space-y-1">
            {ermItems.map(item => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">CRM</h3>
          <ul className="space-y-1">
            {crmItems.map(item => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
