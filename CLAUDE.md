# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Qwik** is a modular package-based dashboard system. Packages (ERM, CRM) are framework-agnostic React packages that can be used in any React host (Next.js, Astro, Remix).

## Architecture

```
qwik/                           # Root workspace
├── packages/                    # Framework-agnostic packages
│   ├── engine/                 # QwikEngine - routing shell
│   │   └── src/index.tsx      # Server component, handles routing & data fetching
│   ├── erm/                    # Enterprise Resource Management
│   │   └── src/
│   │       ├── financial/       # Actions + components
│   │       ├── hr/            # Actions + components
│   │       └── inventory/      # Actions + components
│   ├── crm/                   # Customer Relationship Management
│   │   └── src/actions.ts      # API functions
│   └── shared/                 # Shared types & API client
│       └── src/
│           ├── index.ts         # TypeScript interfaces
│           └── api-client.ts    # Server-side HTTP client
├── src/app/                    # Next.js consumer (legacy)
│   └── api/                     # API routes
└── apps/astro/                 # Astro consumer (recommended)
    └── src/
        ├── pages/
        │   ├── index.astro
        │   ├── admin/[...slug].astro  # Mounts QwikEngine
        │   └── api/                   # Astro API routes
        │       ├── erm/financial/
        │       ├── erm/hr/
        │       ├── erm/inventory/
        │       └── crm/
        └── astro.config.mjs
```

## Key Principles

1. **API calls stay server-side** - Packages use `createApiClient()` to call internal API routes
2. **Framework-agnostic** - Packages are plain React components, work in Next.js, Astro, Remix
3. **Host provides API routes** - Each host (Next.js, Astro) has its own `/api/*` routes
4. **QwikEngine handles routing** - Host app only mounts `<QwikEngine params={params} />`

## Commands

```bash
# Astro consumer (recommended)
cd apps/astro
npm run dev        # Development
npm run build      # Production build
node dist/server/entry.mjs  # Run production

# Next.js consumer (legacy)
npm run dev        # Root dev server (port 3000)
```

## Environment Variables

```bash
APP_BASE_URL=           # API base URL (default: http://localhost:4321)
NEXT_PUBLIC_APP_URL=    # Next.js app URL
API_KEY=               # API authentication key (server-side only)
```

## API Routes (Host-specific)

Each host has its own API routes at `src/pages/api/`:
- Astro: `apps/astro/src/pages/api/*`
- Next.js: `src/app/api/*`

## Security

- API key never reaches the browser
- All data fetching happens server-side via package actions
- API routes handle external API communication

## Troubleshooting

- **"Cannot find module @qwik/..."**: Run `bun install` at root to link packages
- **"Invalid URL" errors**: Ensure `createApiClient()` is used (not raw `fetch()`) for server-side calls
- **Astro dynamic routes**: Use `slug.split('/')` to convert Astro's `erm/financial` string to array format
