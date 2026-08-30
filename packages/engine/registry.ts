// Registry - Auto-discovery system for QwikEngine
// Packages register themselves with their routes and components

export interface PageConfig {
  route: string;          // e.g., 'erm/financial'
  component: React.ComponentType<any>;
  loader: () => Promise<any>;
  title: string;
  icon?: string;
}

export interface PackageConfig {
  name: string;          // e.g., 'erm'
  pages: PageConfig[];
}

// Global registry - populated at build time
const registry = new Map<string, PackageConfig>();

export function registerPackage(config: PackageConfig) {
  registry.set(config.name, config);
}

export function getPackage(name: string): PackageConfig | undefined {
  return registry.get(name);
}

export function getAllPackages(): PackageConfig[] {
  return Array.from(registry.values());
}

export function matchRoute(slug: string[]): { package: PackageConfig; page: PageConfig } | null {
  const [packageName, ...rest] = slug;
  const pkg = registry.get(packageName);

  if (!pkg) return null;

  const routePath = rest.join('/');
  const page = pkg.pages.find(p => p.route === routePath);

  if (!page) return null;

  return { package: pkg, page };
}
