// QwikEngine - server component that handles routing and data fetching
import { FinancialDashboard } from '@qwik/erm/financial/components';
import { EmployeeList } from '@qwik/erm/hr/components';
import { InventoryDashboard } from '@qwik/erm/inventory/components';
import { CustomerList } from '@qwik/crm/components';
import { Navigation } from './components/navigation';
import { getInvoices } from '@qwik/erm/financial';
import { getEmployees } from '@qwik/erm/hr';
import { getProducts } from '@qwik/erm/inventory';
import { getCustomers } from '@qwik/crm/actions';

interface Props {
  params: { slug: string[] } | Promise<{ slug: string[] }>;
}

export default async function QwikEngine({ params }: Props) {
  const resolved = params instanceof Promise ? await params : params;
  const slug = resolved.slug;
  const [packageName, pageName] = slug || [];

  // Fetch data based on route
  let pageComponent: React.ReactElement | null = null;

  if (packageName === 'erm') {
    if (pageName === 'financial') {
      const data = await getInvoices();
      pageComponent = <FinancialDashboard initialData={data} />;
    } else if (pageName === 'hr') {
      const data = await getEmployees();
      pageComponent = <EmployeeList initialData={data} />;
    } else if (pageName === 'inventory') {
      const data = await getProducts();
      pageComponent = <InventoryDashboard initialData={data} />;
    }
  } else if (packageName === 'crm') {
    if (pageName === 'customers') {
      const data = await getCustomers();
      pageComponent = <CustomerList initialData={data} />;
    }
  }

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-8 bg-slate-50">
        {pageComponent || <div>Page not found: {slug?.join('/')}</div>}
      </main>
    </div>
  );
}
