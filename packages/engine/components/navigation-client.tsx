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
  const pathname = (currentPath || '').replace(/\/$/, '');

  const ermItems = items.filter(item => item.package === 'erm');
  const crmItems = items.filter(item => item.package === 'crm');

  const renderNavLinks = (groupItems: NavItem[]) => (
    <ul className="space-y-1">
      {groupItems.map(item => {
        const isActive = pathname === item.href.replace(/\/$/, '');
        return (
          <li key={item.href}>
            <a
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold shadow-xs ring-1 ring-slate-700/60'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 font-medium'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-2.5 transition-colors ${
                isActive ? 'bg-indigo-400' : 'bg-transparent'
              }`} />
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-4 flex flex-col shrink-0">
      <div className="mb-8 px-2 pt-2">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
          Qwik Dashboard
        </h1>
      </div>
      <nav className="flex-1 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">ERM</h3>
          {renderNavLinks(ermItems)}
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">CRM</h3>
          {renderNavLinks(crmItems)}
        </div>
      </nav>
    </aside>
  );
}
