# /tdd - Test-Driven Development Command

Use this command when starting a new feature or significant code change.

## Workflow

1. **Write the failing test first**
   - Describe the expected behavior in the test name
   - Use Arrange-Act-Assert pattern
   - Keep tests small and focused

2. **Run the test** — verify it fails (RED)

3. **Write minimal implementation** — just enough to pass (GREEN)

4. **Refactor** — improve code while keeping tests green

5. **Verify coverage** — ensure 80% minimum

## Rules

- Never delete tests to make CI pass
- When a test fails: fix implementation (not the test) unless the test itself was wrong
- Tests should be deterministic — no random data or timing dependencies
- Each test should test one thing

## Output Format

After each test run, report:
- Tests passed/failed
- Current coverage percentage
- Any remaining work
