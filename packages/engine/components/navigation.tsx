// Navigation - Built into QwikEngine, reads from registry
import { NavigationClient } from './navigation-client';
import { getAllPackages } from '../registry';

interface NavItem {
  href: string;
  label: string;
  package: string;
}

interface Props {
  currentPath?: string;
}

export function Navigation({ currentPath = '' }: Props) {
  const packages = getAllPackages();

  const items: NavItem[] = packages.flatMap(pkg =>
    pkg.pages.map(page => ({
      href: `/admin/${pkg.name}/${page.route}`,
      label: page.title,
      package: pkg.name,
    }))
  );

  return <NavigationClient items={items} currentPath={currentPath} />;
}
