# Coding Style Rules

## Core Principles

- **Immutability**: Prefer creating new objects over mutating existing ones
- **KISS**: Keep solutions simple
- **DRY**: Don't repeat yourself
- **YAGNI**: Don't build features speculatively

## TypeScript/JavaScript

- Use `const` by default, `let` only when reassignment is needed
- Avoid `any` — use proper types
- Use strict TypeScript (`strict: true` in tsconfig)
- Prefer named exports over default exports for better refactoring support

## Monorepo Imports

Use `@qwik/*` for package imports:
```typescript
// ✅ Correct
import { CustomerList } from '@qwik/crm/components';

// ❌ Wrong - file protocol breaks Turbopack
import { CustomerList } from '../../packages/crm/components';
```

## File Organization

- Prefer many small files (200-400 lines) over large ones
- Organize by feature, not by type
- Co-locate tests with source files
- Packages go in `packages/*/src/`
- Apps go in `apps/*/src/`

## Functions

- Keep functions small and focused (< 50 lines)
- Single responsibility principle
- Use early returns to avoid deep nesting
- Descriptive names: `getUserById` not `getUser`

## Error Handling

- Handle errors at every level
- Never swallow exceptions silently
- Return Result types or throw with context
- Error messages should be actionable

## Naming Conventions

- `camelCase` for variables and functions
- `PascalCase` for components and classes
- `UPPER_SNAKE_CASE` for constants
- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components

## Quality Checklist

- [ ] No `console.log` left in production code
- [ ] No hardcoded values — use constants
- [ ] Error cases handled
- [ ] Types are explicit (no implicit `any`)
- [ ] Functions are documented only when necessary
- [ ] API calls use `createApiClient()` (server-side only)
