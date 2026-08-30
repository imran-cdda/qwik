// CRM Package - Customer Relationship Management

export * from './actions';
export { CustomerList, CreateCustomerForm } from './components';

import { CustomerList } from './components';

export const crmRoutes = [
  { path: 'customers', label: 'Customers', component: CustomerList },
];
