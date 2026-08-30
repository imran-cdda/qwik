# Testing Rules

## Coverage Target

- **80% minimum test coverage** across all code
- Coverage is measured by line count

## Test Types

### Unit Tests
- Test individual functions and components in isolation
- Mock external dependencies
- Fast to run, fast to write

### Integration Tests
- Test how components work together
- Test API routes and data fetching
- Use real connections to databases when necessary

### E2E Tests
- Test complete user flows
- Use Playwright or similar
- Only for critical paths

## TDD Workflow (Mandatory for New Features)

1. **RED**: Write a failing test
2. **GREEN**: Write minimal code to make it pass
3. **REFACTOR**: Improve code while keeping tests green
4. **REPEAT**: Continue until feature is complete

## Test Naming

Use descriptive names that explain the expected behavior:
- ✅ `returns empty array when no markets match query`
- ❌ `test1`, `test getMarkets`

## Test Structure (Arrange-Act-Assert)

```typescript
test('returns user when valid id provided', async () => {
  // Arrange
  const userId = '123';

  // Act
  const result = await getUserById(userId);

  // Assert
  expect(result).toEqual({ id: '123', name: 'Alice' });
});
```

## Testing Packages

Packages in `packages/*` should be tested in isolation:
- Unit test actions (API functions)
- Unit test components with mocked dependencies
- Use `createApiClient()` mock for server-side calls

## Testing Apps

Apps in `apps/*` should test integration:
- Test API routes
- Test page rendering
- Test navigation flows

## When Tests Fail

- If the test was correct and the implementation is wrong → fix the implementation
- If the test was testing the wrong thing → fix the test
- Never delete tests to make CI pass
