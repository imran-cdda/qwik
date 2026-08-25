# Frontend Patterns

## React Component Patterns

### Component Structure
```tsx
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

export function MyComponent({ title, onSubmit }: Props) {
  // 1. Hooks first
  const [state, setState] = useState('');

  // 2. Handlers
  const handleClick = () => { /* ... */ };

  // 3. Render
  return (
    <div>
      <h1>{title}</h1>
      {/* ... */}
    </div>
  );
}
```

### Client Directives (Astro)
- `client:load` — Hydrate immediately on page load
- `client:visible` — Hydrate when component enters viewport
- `client:idle` — Hydrate when browser is idle
- `client:only="react"` — Skip SSR, render only on client

### State Management
- Local state: `useState` for component state
- Shared state: Lift state to parent or use context
- Server state: React Query or SWR for data fetching

### Performance Tips
- Memoize expensive computations with `useMemo`
- Prevent unnecessary re-renders with `React.memo`
- Use `useCallback` for event handlers passed to children
- Lazy load components with `React.lazy`

## Astro Patterns

### Layouts
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Page Title">
  <slot />
</BaseLayout>
```

### Props
```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<h1>{title}</h1>
```
