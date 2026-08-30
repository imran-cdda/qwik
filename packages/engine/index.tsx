// QwikEngine - Dynamic routing engine that auto-discovers packages
import { Navigation } from './components/navigation';
import { matchRoute, registerPackage, type PageConfig, type PackageConfig } from './registry';

// Built-in packages - these register themselves
import { FinancialDashboard } from '@qwik/monorepo/erm/financial/components';
import { getInvoices } from '@qwik/monorepo/erm/financial';
import { EmployeeList } from '@qwik/monorepo/erm/hr/components';
import { getEmployees } from '@qwik/monorepo/erm/hr';
import { InventoryDashboard } from '@qwik/monorepo/erm/inventory/components';
import { getProducts } from '@qwik/monorepo/erm/inventory';
import { CustomerList } from '@qwik/monorepo/crm/components';
import { getCustomers } from '@qwik/monorepo/crm/actions';

// Register ERM package
registerPackage({
  name: 'erm',
  pages: [
    {
      route: 'financial',
      component: FinancialDashboard,
      loader: getInvoices,
      title: 'Financial',
    },
    {
      route: 'hr',
      component: EmployeeList,
      loader: getEmployees,
      title: 'Human Resources',
    },
    {
      route: 'inventory',
      component: InventoryDashboard,
      loader: getProducts,
      title: 'Inventory',
    },
  ],
});

// Register CRM package
registerPackage({
  name: 'crm',
  pages: [
    {
      route: 'customers',
      component: CustomerList,
      loader: getCustomers,
      title: 'Customers',
    },
  ],
});

interface Props {
  params: { slug: string[] } | Promise<{ slug: string[] }>;
  currentPath?: string;
}

export default async function QwikEngine({ params, currentPath }: Props) {
  const resolved = params instanceof Promise ? await params : params;
  const slug = resolved.slug;

  const match = matchRoute(slug || []);

  let content: React.ReactNode;

  if (match) {
    const { page } = match;
    const data = await page.loader();
    const PageComponent = page.component;
    content = <PageComponent initialData={data} />;
  } else {
    content = (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
          <p className="text-slate-500">
            {slug?.length ? `Route "/admin/${slug.join('/')}" not found` : 'No route specified'}
          </p>
        </div>
      </div>
    );
  }

  const activePath = currentPath || `/admin/${(slug || []).join('/')}`;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navigation currentPath={activePath} />
      <main className="flex-1 p-8">
        {content}
      </main>
    </div>
  );
}
