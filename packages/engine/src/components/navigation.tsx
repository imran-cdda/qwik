// Navigation - Framework-agnostic sidebar navigation
// Uses client-side routing when available, falls back to server navigation

import { NavigationClient } from './navigation-client';

const navItems = [
  { href: '/admin/erm/financial', label: 'Financial', package: 'erm' },
  { href: '/admin/erm/hr', label: 'Human Resources', package: 'erm' },
  { href: '/admin/erm/inventory', label: 'Inventory', package: 'erm' },
  { href: '/admin/crm/customers', label: 'Customers', package: 'crm' },
];

interface Props {
  currentPath?: string;
}

export function Navigation({ currentPath = '' }: Props) {
  return (
    <NavigationClient items={navItems} currentPath={currentPath} />
  );
}
