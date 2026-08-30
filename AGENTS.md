# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

**Qwik** is a modular package-based dashboard system. Packages (ERM, CRM) are framework-agnostic React packages that can be used in any React host (Next.js, Astro, Remix).

## Architecture

```
qwik/                           # Root workspace (@qwik/monorepo)
├── packages/                    # Framework-agnostic packages
│   ├── engine/index.tsx        # QwikEngine - routing shell
│   ├── engine/components/      # Navigation, etc.
│   ├── engine/registry.ts     # Dynamic route registry
│   ├── erm/                   # Enterprise Resource Management
│   │   ├── financial/         # Actions + components
│   │   ├── hr/              # Actions + components
│   │   └── inventory/        # Actions + components
│   ├── crm/                   # Customer Relationship Management
│   │   ├── actions.ts         # API functions
│   │   └── components.tsx     # React components
│   └── shared/                # Shared types & API client
│       └── index.ts           # TypeScript interfaces
│       └── api-client.ts      # Server-side HTTP client
└── apps/
    ├── astro/                 # Astro consumer (recommended)
    │   └── src/
    │       ├── pages/
    │       │   ├── index.astro
    │       │   ├── admin/[...slug].astro  # Mounts QwikEngine
    │       │   └── api/                   # Astro API routes
    │       └── layouts/
    └── next/                  # Next.js consumer
        └── src/
            └── app/
                ├── admin/[...slug]/page.tsx  # Mounts QwikEngine
                └── api/                     # Next.js API routes
```

## Key Principles

1. **Single monorepo package** - All packages exported via `@qwik/monorepo/*`
2. **API calls stay server-side** - Packages use `createApiClient()` to call internal API routes
3. **Framework-agnostic** - Packages are plain React components, work in Next.js, Astro, Remix
4. **Host provides API routes** - Each host (Next.js, Astro) has its own `/api/*` routes
5. **QwikEngine handles routing** - Host app only mounts `<QwikEngine params={params} />`

## Commands

```bash
# Root workspace (monorepo)
bun install                    # Install all dependencies

# Astro consumer (recommended)
bun run dev:astro            # Dev server on port 4321
bun run build:astro          # Production build
APP_BASE_URL=http://localhost:4321 bun start:astro  # Run production

# Next.js consumer
bun run dev                   # Dev server on port 3000
bun run build                # Production build

# Both apps concurrently
bun run dev:all             # Next.js + Astro dev servers
```

## Package Exports

All packages accessed via `@qwik/monorepo`:
- `@qwik/monorepo/engine` - QwikEngine
- `@qwik/monorepo/erm/financial` - Financial module
- `@qwik/monorepo/erm/hr` - HR module
- `@qwik/monorepo/erm/inventory` - Inventory module
- `@qwik/monorepo/crm` - CRM module
- `@qwik/monorepo/crm/actions` - CRM API functions
- `@qwik/monorepo/crm/components` - CRM React components
- `@qwik/monorepo/shared` - Shared types and utilities

## Environment Variables

```bash
APP_BASE_URL=           # API base URL (default: http://localhost:4321 for Astro)
NEXT_PUBLIC_APP_URL=    # Next.js app URL
API_KEY=               # API authentication key (server-side only)
```

## API Routes (Host-specific)

Each host has its own API routes at `src/pages/api/`:
- Astro: `apps/astro/src/pages/api/*`
- Next.js: `apps/next/src/app/api/*`

## Security

- API key never reaches the browser
- All data fetching happens server-side via package actions
- API routes handle external API communication

## Troubleshooting

- **"Cannot find module @qwik/monorepo"**: Run `bun install` at root
- **"Invalid URL" errors**: Ensure `createApiClient()` is used (not raw `fetch()`) for server-side calls
- **Astro dynamic routes**: Use `slug.split('/')` to convert Astro's `erm/financial` string to array format
- **Astro HMR for packages**: Astro dev server may not hot-reload changes in packages folder - restart dev server if needed
