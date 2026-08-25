# /code-review - Run Code Review

Use this command when code is ready for review.

## Review Scope

- Modified files in the current session
- Files changed since last commit (if requested)
- Specific file(s) mentioned by user

## Review Checklist

### Correctness
- [ ] Logic is correct
- [ ] Edge cases handled
- [ ] Error handling is present

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Output properly encoded

### Performance
- [ ] No obvious bottlenecks
- [ ] Appropriate data structures used

### Maintainability
- [ ] Code is readable
- [ ] Functions are small (< 50 lines)
- [ ] No code duplication

### Testing
- [ ] Tests cover main functionality
- [ ] Tests are deterministic

## Output

For each finding:
- File and line number
- Severity (High/Medium/Low)
- Description
- Suggested fix

## Final Verdict

- **Approve** — ready to merge
- **Request Changes** — needs fixes before merge
- **Needs Discussion** — requires clarification
