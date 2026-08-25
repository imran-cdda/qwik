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
- Use environment variables (`import.meta.env` in Astro/Vite)
- Validate secrets at startup — fail fast if missing
- Rotate any exposed secrets immediately

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
