# Security Rules

## Pre-commit Security Checklist

Before any commit, verify:
- [ ] No hardcoded secrets (API keys, tokens, passwords)
- [ ] All input is validated at system boundaries
- [ ] Parameterized queries used for any database operations
- [ ] HTML output is sanitized to prevent XSS
- [ ] CSRF protection enabled for state-changing operations
- [ ] Authentication and authorization properly implemented
- [ ] Rate limiting where appropriate
- [ ] Error messages don't expose sensitive data

## Secret Management

- **Never** hardcode secrets in source code
- Use environment variables (`import.meta.env` in Astro/Vite, `process.env` in Node.js)
- Validate secrets at startup — fail fast if missing
- Rotate any exposed secrets immediately

## API Security (Critical)

All API calls must be server-side only. Use `createApiClient()` from `@qwik/monorepo/shared`:
```typescript
// ✅ Correct - server-side only
const api = createApiClient({ apiKey: process.env.API_KEY });
const data = await api.get('/api/data');

// ❌ Wrong - exposes API key to client
const data = await fetch('/api/data');
```

## If a Security Issue is Discovered

1. Stop immediately — do not continue coding
2. Assess the severity and blast radius
3. Fix critical issues before anything else
4. Rotate any exposed secrets
5. Audit for similar issues elsewhere
6. Document the vulnerability and fix

## Astro + React Specific

- Sanitize any user-generated HTML before rendering
- Use CSP headers where possible
- Validate all props passed to React components
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- `'use client'` directive does not make a component secure — always validate on server
