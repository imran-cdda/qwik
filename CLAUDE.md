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
    ├── be/                    # Hono backend API (port 3001)
    │   └── src/
    │       ├── index.ts       # Hono app entry
    │       └── routes/        # API route handlers
    │           ├── crm.ts
    │           └── erm/
    │               ├── financial.ts
    │               ├── hr.ts
    │               └── inventory.ts
    ├── astro/                 # Astro consumer (recommended)
    │   └── src/
    │       ├── pages/
    │       │   ├── index.astro
    │       │   └── admin/[...slug].astro  # Mounts QwikEngine
    │       └── layouts/
    └── next/                  # Next.js consumer
        └── src/
            └── app/
                └── admin/[...slug]/page.tsx  # Mounts QwikEngine
```

## Key Principles

1. **Single monorepo package** - All packages exported via `@qwik/*`
2. **API calls stay server-side** - Packages use `createApiClient()` to call internal API routes
3. **Framework-agnostic** - Packages are plain React components, work in Next.js, Astro, Remix
4. **Host provides API routes** - Each host (Next.js, Astro) has its own `/api/*` routes
5. **QwikEngine handles routing** - Host app only mounts `<QwikEngine params={params} />`

## Commands

```bash
# Root workspace (monorepo)
bun install                    # Install all dependencies

# Hono backend API (port 3001)
bun run dev:be              # Start backend dev server
bun run build:be            # Build backend
bun run start:be            # Start backend production

# Astro consumer (recommended)
bun run dev:astro           # Dev server on port 4321
bun run build:astro         # Production build
APP_BASE_URL=http://localhost:3001 bun start:astro  # Run production

# Next.js consumer
bun run dev                  # Dev server on port 3000
bun run build                # Production build

# All apps concurrently (BE + Next.js + Astro)
bun run dev:all
```

## Package Exports

All packages accessed via `@qwik/monorepo`:
- `@qwik/engine` - QwikEngine
- `@qwik/erm/financial` - Financial module
- `@qwik/erm/hr` - HR module
- `@qwik/erm/inventory` - Inventory module
- `@qwik/crm` - CRM module
- `@qwik/crm/actions` - CRM API functions
- `@qwik/crm/components` - CRM React components
- `@qwik/shared` - Shared types and utilities

## Environment Variables

```bash
APP_BASE_URL=           # API base URL for Hono backend (default: http://localhost:3001)
NEXT_PUBLIC_APP_URL=    # Next.js app URL
API_KEY=               # API authentication key (server-side only)
```

## API Routes (Centralized in Hono)

All API routes are centralized in the Hono backend at `apps/be/src/routes/`:
- `apps/be/src/routes/crm.ts` - CRM endpoints
- `apps/be/src/routes/erm/financial.ts` - Financial endpoints
- `apps/be/src/routes/erm/hr.ts` - HR endpoints
- `apps/be/src/routes/erm/inventory.ts` - Inventory endpoints

## Security

- API key never reaches the browser
- All data fetching happens server-side via package actions
- Hono backend handles external API communication

## Troubleshooting

- **"Cannot find module @qwik/monorepo"**: Run `bun install` at root
- **"Invalid URL" errors**: Ensure `createApiClient()` is used (not raw `fetch()`) for server-side calls
- **Astro dynamic routes**: Use `slug.split('/')` to convert Astro's `erm/financial` string to array format
- **Astro HMR for packages**: Astro dev server may not hot-reload changes in packages folder - restart dev server if needed
