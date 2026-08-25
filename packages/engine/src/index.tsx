// QwikEngine - server component that handles routing and data fetching
import { FinancialDashboard } from '@qwik/erm/financial/components';
import { EmployeeList } from '@qwik/erm/hr/components';
import { InventoryDashboard } from '@qwik/erm/inventory/components';
import { CustomerList } from '@qwik/crm/components';
import { getInvoices } from '@qwik/erm/financial';
import { getEmployees } from '@qwik/erm/hr';
import { getProducts } from '@qwik/erm/inventory';
import { getCustomers } from '@qwik/crm/actions';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function QwikEngine({ params }: Props) {
  const { slug } = await params;
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
    <div className="qwik-engine">
      <aside className="qwik-sidebar">
        <nav>
          <div className="qwik-package">
            <h3>ERM</h3>
            <ul>
              <li><a href="/admin/erm/financial">Financial</a></li>
              <li><a href="/admin/erm/hr">Human Resources</a></li>
              <li><a href="/admin/erm/inventory">Inventory</a></li>
            </ul>
          </div>
          <div className="qwik-package">
            <h3>CRM</h3>
            <ul>
              <li><a href="/admin/crm/customers">Customers</a></li>
            </ul>
          </div>
        </nav>
      </aside>
      <main className="qwik-content">
        {pageComponent || <div>Page not found: {slug?.join('/')}</div>}
      </main>
    </div>
  );
}
