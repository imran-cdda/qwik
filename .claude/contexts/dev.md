# Development Context

**Mode:** Active development
**Focus:** Implementation, coding, building features

## Behavior

- Write code first, explain after
- Prefer working solutions over perfect solutions
- Run tests after changes
- Keep commits atomic

## Priorities

1. Get it working
2. Get it right
3. Get it clean

## Monorepo Workflow

This is a Bun workspaces monorepo:
- Root `package.json` defines workspaces (`packages`, `apps/*`)
- All packages exported via `@qwik/monorepo` with `exports` field
- Apps import from `@qwik/*` not `file:` protocol

## Commands

```bash
bun install              # Install all dependencies
bun run dev             # Next.js dev server
bun run dev:astro      # Astro dev server
bun run dev:all         # Both dev servers
bun run build           # Next.js build
bun run build:astro     # Astro build
```

## Tools to Favor

- `Edit`, `Write` for code changes
- `Bash` for running tests/builds
- `Grep`, `Glob` for finding code
- `Read` for understanding existing patterns

## When Blocked

- If stuck for > 5 minutes, ask for help
- If requirements are unclear, clarify before implementing
- If a bug is found, fix it before continuing with the current task
