# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Qwik engine** monorepo — an embeddable package-based dashboard system. Users mount the QwikEngine component in their host app (Next.js/Astro/Remix) and get ERM/CRM modules with server actions.

## Architecture

```
qwik/                          # Root (Next.js host app)
├── src/app/
│   └── admin/[...slug]/       # Mount QwikEngine: /admin/erm/financial, /admin/crm/customers
│       └── page.tsx
├── packages/
│   ├── engine/                # Core engine (routing shell)
│   │   └── src/index.tsx      # QwikEngine, EngineProvider
│   ├── erm/                   # Enterprise Resource Management
│   │   └── src/
│   │       ├── financial/     # Invoices, payments (server actions + components)
│   │       ├── hr/            # Employees (server actions + components)
│   │       └── inventory/     # Products (server actions + components)
│   ├── crm/                   # Customer Relationship Management
│   │   └── src/
│   │       └── actions.ts     # Server actions (getCustomers, createCustomer, etc.)
│   └── shared/                # Shared types and API client
│       └── src/
│           ├── index.ts       # TypeScript interfaces
│           └── api-client.ts  # Server-side HTTP client
```

## Commands

```bash
bun dev          # Start Next.js dev server
bun build        # Production build
bun install      # Install and link packages
```

## How It Works

1. **Host app** mounts `<QwikEngine params={params} />` at `/admin/[...slug]`
2. **Engine** reads URL slug (`erm/financial`, `crm/customers`) and renders the correct package page
3. **Server actions** in each package call external APIs — API keys never reach the client
4. **Users can import actions directly** for custom pages:

```tsx
import { createInvoice } from '@qwik/erm/financial';
import { createCustomer } from '@qwik/crm/actions';
```

## Server Actions

All API calls happen server-side in `'use server'` files:
- API key lives in `process.env.API_KEY` — never exposed to client
- Each module has its own action file (`financial/index.ts`, `hr/index.ts`, etc.)
- Actions return typed data to React components

## Key Patterns

- **Server actions**: `'use server'` directive, never import in client code directly
- **Components**: `'use client'` for React UI, calls server actions via functions
- **Types**: All TypeScript interfaces in `@qwik/shared`
- **Routing**: Dynamic slug routing via Next.js `app/admin/[...slug]/page.tsx`

## Environment Variables

```bash
API_BASE_URL=  # External API base URL
API_KEY=       # API authentication key (server-side only)
```

## Dev Context

- **Mode**: Active development — implement first, refine after
- **Testing**: Write tests alongside features; maintain 80% coverage
- **Commits**: Keep atomic; commit working code

## Security

- Never hardcode secrets — use environment variables
- All API calls happen server-side via `'use server'` actions
- Validate all input at system boundaries
- API keys never sent to client
