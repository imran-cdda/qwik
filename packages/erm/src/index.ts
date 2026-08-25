// ERM Package - Enterprise Resource Management
// Financial, HR, and Inventory modules

export * from './financial/index';
export { FinancialDashboard, CreateInvoiceForm } from './financial/components';

export * from './hr/index';
export { EmployeeList, CreateEmployeeForm } from './hr/components';

export * from './inventory/index';
export { InventoryDashboard, CreateProductForm } from './inventory/components';

import { FinancialDashboard } from './financial/components';
import { EmployeeList } from './hr/components';
import { InventoryDashboard } from './inventory/components';

export const ermRoutes = [
  { path: 'financial', label: 'Financial', component: FinancialDashboard },
  { path: 'hr', label: 'Human Resources', component: EmployeeList },
  { path: 'inventory', label: 'Inventory', component: InventoryDashboard },
];
