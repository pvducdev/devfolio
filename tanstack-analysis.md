# TanStack Libraries: Technical Architecture Analysis

## Executive Summary

TanStack has evolved into a comprehensive ecosystem of framework-agnostic, type-safe libraries that share a consistent architectural philosophy. This analysis synthesizes patterns across `@tanstack/router`, `@tanstack/query`, `@tanstack/db`, `@tanstack/ai`, `@tanstack/store`, `@tanstack/table`, and `@tanstack/form` to extract reusable design principles.

The ecosystem is unified by a core principle: **separate logic from rendering**. Every library follows a "headless" architecture where business logic lives in a framework-agnostic core, with thin framework adapters providing reactivity integration.

---

## 1. Design Language

### 1.1 Naming Conventions

TanStack employs a consistent naming vocabulary across all libraries:

| Pattern | Examples | Purpose |
|---------|----------|---------|
| `create*` | `createFileRoute`, `createColumnHelper`, `createStore` | Factory functions that construct instances |
| `use*` | `useQuery`, `useStore`, `useSearch`, `useParams` | React/framework hooks |
| `inject*` | `injectQuery`, `injectMutation` | Angular-specific dependency injection |
| `*Options` | `queryOptions`, `mutationOptions` | Type-preserving configuration helpers |
| `*Definition` | `toolDefinition` | Schema/contract declarations |
| `*Adapter` | `openaiText`, `anthropicText`, `zodAdapter` | Provider/integration bridges |
| `*Collection` | `QueryCollection`, `ElectricCollection` | Data source abstractions |
| `*Core` | `@tanstack/router-core`, `@tanstack/query-core` | Framework-agnostic base packages |

**Key naming rules:**
- Noun-first for objects/instances (`Store`, `Derived`, `Effect`)
- Verb-first for functions (`create*`, `use*`, `get*`)
- Provider/framework in suffix position (`openaiText`, `zodAdapter`)
- `-core` suffix for framework-agnostic packages

### 1.2 Public API Shape

TanStack APIs follow a consistent shape pattern:

```typescript
// Pattern: Options object with inference
const result = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  // ... additional options
})

// Pattern: Factory with chained configuration
const route = createFileRoute('/posts/$postId')({
  component: PostComponent,
  loader: async ({ params }) => fetchPost(params.postId),
})

// Pattern: Definition-then-implementation
const toolDef = toolDefinition({
  name: 'getProducts',
  inputSchema: z.object({ query: z.string() }),
})
const tool = toolDef.server(async ({ query }) => db.search(query))
```

**API design principles:**
1. **Single object argument** - All functions take a single options object (not positional args)
2. **Inference over annotation** - Types flow from configuration, minimizing manual generics
3. **Composition through spread** - Options can be spread/merged (`{...baseOptions, override}`)
4. **Progressive disclosure** - Simple cases need minimal config; advanced features are additive

### 1.3 Mental Models

TanStack libraries share mental models:

**The "Store + Derived + Effect" Model (from @tanstack/store):**
- `Store`: Mutable state container with immutable updates
- `Derived`: Computed values that automatically track dependencies
- `Effect`: Side effects that react to state/derived changes

This model powers Table, Form, Query internals, and is exposed directly in Store.

**The "Core + Adapter" Model:**
```
┌─────────────────────────────────────────────────────┐
│                   Application Code                   │
├─────────────────────────────────────────────────────┤
│         Framework Adapter (React, Vue, etc.)        │
├─────────────────────────────────────────────────────┤
│                Framework-Agnostic Core              │
└─────────────────────────────────────────────────────┘
```

---

## 2. Architecture

### 2.1 Core vs Adapters Separation

Every TanStack library follows a strict separation:

```
@tanstack/query
├── @tanstack/query-core          # Zero dependencies, pure logic
├── @tanstack/react-query         # React bindings
├── @tanstack/vue-query           # Vue bindings
├── @tanstack/solid-query         # Solid bindings
├── @tanstack/angular-query       # Angular bindings
└── @tanstack/svelte-query        # Svelte bindings
```

**Core package responsibilities:**
- State management logic
- Cache/data algorithms
- Event system
- Type definitions
- Zero framework dependencies

**Adapter responsibilities:**
- Framework-specific hooks/primitives
- Reactivity integration
- Context/provider patterns
- DevTools integration

### 2.2 Micro-Adapter Architecture (TanStack AI)

TanStack AI introduced a refined adapter pattern—**micro-adapters**—that solves bundle size, complexity, and extensibility:

```typescript
// Old monolithic approach (problematic)
import { openai } from '@tanstack/ai-openai'
const adapter = openai()  // Bundles ALL functionality

// New micro-adapter approach
import { openaiText } from '@tanstack/ai-openai/adapters'
import { openaiImage } from '@tanstack/ai-openai/adapters'

// Only bundle what you use
const textAdapter = openaiText()
const imageAdapter = openaiImage()
```

**Rationale:**
1. **Bundle splitting** - Import only needed functionality
2. **Reduced generic complexity** - Monolithic adapters had 7+ generics; micro-adapters max at 3
3. **Incremental rollout** - New capabilities added without touching all adapters
4. **Community contribution** - External contributors can add single-purpose adapters

### 2.3 Plugin/Feature System (TanStack Table)

Table demonstrates a sophisticated feature composition pattern:

```typescript
interface TableFeature<TData> {
  getInitialState?: (initialState: TableState) => TableState
  getDefaultOptions?: (table: Table<TData>) => TableOptions<TData>
  createTable?: (table: Table<TData>) => void
  createColumn?: (column: Column<TData>) => void
  createRow?: (row: Row<TData>) => void
  createCell?: (cell: Cell<TData>) => void
  createHeader?: (header: Header<TData>) => void
}
```

Features hook into the table lifecycle at specific points. The table instance aggregates all registered features, calling their hooks in order.

**Key insight:** TanStack moved AWAY from a plugin system in v8. Instead of plugins, features are implemented as functional wrappers that compose the core API. This is simpler and more type-safe.

### 2.4 State Management Strategies

**Immutable updates with functional setState:**
```typescript
store.setState((prev) => ({
  ...prev,
  count: prev.count + 1,
}))
```

**Subscription-based reactivity:**
```typescript
const unsub = store.subscribe(() => {
  console.log('State changed:', store.state)
})
```

**Fine-grained derived values:**
```typescript
const double = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
})
```

---

## 3. TypeScript Patterns

### 3.1 The Register Interface Pattern

TanStack uses TypeScript module augmentation via a `Register` interface for global type customization:

```typescript
// In @tanstack/react-query
interface Register {
  // Empty by default
}

// User augmentation
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError
    queryMeta: { auth: boolean }
  }
}
```

This pattern enables:
- Global error types without per-call generics
- Custom metadata types
- Router type registration
- Request context typing

**Why it works:** TypeScript's declaration merging allows users to extend the interface. The library uses conditional types to extract registered types:

```typescript
type RegisteredError = Register extends { defaultError: infer E } 
  ? E 
  : Error
```

### 3.2 Inference-First Philosophy

TanStack prioritizes inference over explicit generics:

```typescript
// Bad: Requires manual type annotation
const { data } = useQuery<Todo[], Error>({ ... })

// Good: Types flow from queryFn return type
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: (): Promise<Todo[]> => fetch('/todos').then(r => r.json()),
})
// data is inferred as Todo[] | undefined
```

**The queryOptions helper preserves inference across boundaries:**
```typescript
const todoOptions = queryOptions({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})

// Later: type information preserved
queryClient.prefetchQuery(todoOptions)
const { data } = useQuery(todoOptions)  // Still typed correctly
```

### 3.3 Conditional Types for Route Safety

TanStack Router achieves end-to-end type safety through conditional types:

```typescript
type ParsePathParams<T extends string> = 
  T extends `${infer _}$${infer Param}/${infer Rest}`
    ? Param | ParsePathParams<Rest>
    : T extends `${infer _}$${infer Param}`
      ? Param
      : never

// '/posts/$postId' → 'postId'
// '/users/$userId/posts/$postId' → 'userId' | 'postId'
```

This enables:
- `useParams()` returns exactly the params defined in the route
- `<Link to="/posts/$postId" params={{ postId: 1 }}>` is type-checked
- Invalid routes cause compile-time errors

### 3.4 Generic Constraints and Defaults

```typescript
// Pattern: Constrained generics with sensible defaults
function useQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>)
```

**Rules:**
- Defaults enable minimal configuration
- Constraints ensure type compatibility
- Later generics can depend on earlier ones (`TData = TQueryFnData`)

### 3.5 Branded Types and Discriminated Unions

```typescript
// Query states as discriminated union
type QueryStatus = 'pending' | 'error' | 'success'

interface QueryResult<TData, TError> {
  status: QueryStatus
  data: TData | undefined
  error: TError | null
  isPending: boolean
  isError: boolean
  isSuccess: boolean
}
```

Type narrowing works correctly:
```typescript
if (query.isSuccess) {
  query.data // TData, not TData | undefined
}
```

---

## 4. Code Patterns

### 4.1 Factory Patterns

**Configuration Factory:**
```typescript
// Creates typed option objects
export function queryOptions<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
>(options: QueryOptionsInput<TQueryFnData, TError, TData>) {
  return options  // Identity at runtime, type magic at compile time
}
```

**Instance Factory:**
```typescript
// Creates configured instances
export function createStore<T>(initialState: T): Store<T> {
  return new Store(initialState)
}
```

**Definition-Implementation Factory (TanStack AI):**
```typescript
const toolDef = toolDefinition({
  name: 'search',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.array(ProductSchema),
})

// Separate definition from implementation
const serverTool = toolDef.server(async (input) => { /* server impl */ })
const clientTool = toolDef.client(async (input) => { /* client impl */ })
```

### 4.2 Config Normalization

TanStack libraries normalize configuration at boundaries:

```typescript
// Internal pattern
function normalizeOptions(input: PartialOptions): NormalizedOptions {
  return {
    staleTime: input.staleTime ?? 0,
    gcTime: input.gcTime ?? 5 * 60 * 1000,
    refetchOnWindowFocus: input.refetchOnWindowFocus ?? true,
    // ... merge with defaults
  }
}
```

**Benefits:**
- Consistent internal state
- Optional config with sensible defaults
- Single source of truth for defaults

### 4.3 Lifecycle Handling

**Mount/Unmount pattern:**
```typescript
const derived = new Derived({ fn: () => store.state * 2, deps: [store] })
const unmount = derived.mount()  // Start tracking
// ... later
unmount()  // Clean up subscriptions
```

**Effect cleanup:**
```typescript
const effect = new Effect({
  fn: () => {
    const cleanup = subscribeToExternal()
    return cleanup  // Called on unmount or re-run
  },
  deps: [store],
})
```

### 4.4 Immutability Practices

```typescript
// Always return new objects
store.setState((prev) => ({
  ...prev,
  items: [...prev.items, newItem],
}))

// Never mutate
store.setState((prev) => {
  prev.items.push(newItem)  // ❌ Mutation
  return prev
})
```

**Structural sharing for performance:**
```typescript
// TanStack Query/Router use structural sharing
// Only creates new references for changed parts
function replaceEqualDeep(a: unknown, b: unknown): unknown {
  if (a === b) return a
  // ... deep comparison with reference preservation
}
```

---

## 5. Consistency Across Ecosystem

### 5.1 Shared Abstractions

**@tanstack/store powers:**
- Query's cache state
- Router's state management
- Form's field state
- Table's internal state

**Common utilities:**
- `replaceEqualDeep` - Structural sharing
- Scheduling/batching primitives
- Event emitters

### 5.2 Cross-Library Conventions

| Convention | Router | Query | Table | Form | AI |
|------------|--------|-------|-------|------|-----|
| Core package | ✓ | ✓ | ✓ | ✓ | ✓ |
| Framework adapters | ✓ | ✓ | ✓ | ✓ | ✓ |
| DevTools | ✓ | ✓ | (contrib) | - | ✓ |
| Options helper | ✓ | ✓ | - | - | - |
| Register interface | ✓ | ✓ | - | - | - |
| Zod integration | ✓ | - | - | ✓ | ✓ |

### 5.3 Error Handling

**Consistent error patterns:**
- Errors are typed via Register interface
- Error boundaries integration
- Retry logic with configurable backoff
- Error state separate from loading state

```typescript
// Pattern: Error as first-class state
interface QueryResult {
  status: 'pending' | 'error' | 'success'
  error: TError | null
  failureCount: number
  failureReason: TError | null
}
```

### 5.4 Composability

Libraries are designed to work together:

```typescript
// Router + Query integration
const route = createFileRoute('/posts/$postId')({
  loader: ({ params }) => 
    queryClient.ensureQueryData(postQueryOptions(params.postId)),
})

// DB + Query integration
const { data } = useLiveQuery((q) => 
  q.from({ todos }).where(({ status }) => status === 'active')
)
```

---

## 6. Evolution Strategy

### 6.1 Versioning Philosophy

- **Semver for runtime API** - Breaking changes increment major version
- **Types are NOT semver** - Type improvements ship as patches
- Lock to specific patch versions for type stability

### 6.2 Backwards Compatibility

**Deprecation strategy:**
```typescript
/**
 * @deprecated Use `queryOptions` instead. Will be removed in v6.
 */
export function useQuery<T>(key: string, fn: () => Promise<T>) {
  console.warn('Deprecated: use object syntax')
  return useQueryNew({ queryKey: [key], queryFn: fn })
}
```

**Migration helpers:**
- Codemods for major version upgrades
- Compatibility layers during transition periods
- Clear migration guides

### 6.3 Framework Support Strategy

**Priority tiers:**
1. React (primary, most features first)
2. Solid (close second, similar model)
3. Vue (strong support)
4. Angular, Svelte (community-driven)

**New framework additions:**
- Core remains unchanged
- Only adapter package needed
- Can be community-contributed

### 6.4 Scaling Architecture

**Monorepo structure:**
```
packages/
├── query-core/
├── react-query/
├── vue-query/
├── solid-query/
├── query-devtools/
└── ... (adapters)
```

**Independent versioning within ecosystem:**
- Core packages version together
- Adapters can have independent patch versions
- DevTools versioned separately

---

## 7. Mental Model Synthesis

### The TanStack Way

```
┌──────────────────────────────────────────────────────────────┐
│                     YOUR APPLICATION                          │
├──────────────────────────────────────────────────────────────┤
│  Framework Hooks    │   useQuery, useStore, useSearch, ...  │
├─────────────────────┼────────────────────────────────────────┤
│  Framework Adapter  │   Reactivity bindings, Context, etc.  │
├─────────────────────┼────────────────────────────────────────┤
│  Core Logic         │   State, Cache, Algorithms, Events    │
├─────────────────────┼────────────────────────────────────────┤
│  @tanstack/store    │   Signals: Store, Derived, Effect     │
└─────────────────────┴────────────────────────────────────────┘
```

### Design Decisions Tree

When building a TanStack-style library:

1. **Is it framework-specific logic?** → Put in adapter
2. **Is it pure state/data logic?** → Put in core
3. **Does it need reactivity primitives?** → Use @tanstack/store
4. **Should types flow automatically?** → Design for inference
5. **Is configuration optional?** → Normalize with defaults
6. **Will there be multiple providers/integrations?** → Use micro-adapters
7. **Should users customize global types?** → Use Register interface

---

## 8. Reusable Principles for New Libraries

### Checklist for TanStack-Idiomatic Library Design

#### Package Structure
- [ ] `@tanstack/{name}-core` - Framework-agnostic core
- [ ] `@tanstack/react-{name}` - React adapter
- [ ] `@tanstack/vue-{name}` - Vue adapter
- [ ] `@tanstack/{name}-devtools` - Optional DevTools

#### API Design
- [ ] Single options object argument pattern
- [ ] Factory functions with `create*` prefix
- [ ] Hooks with `use*` prefix (React) / `inject*` (Angular)
- [ ] Type-preserving helper with `*Options` suffix
- [ ] Prefer inference over explicit generics

#### TypeScript
- [ ] Register interface for global type customization
- [ ] Conditional types for extraction
- [ ] Defaults for all generics
- [ ] Type narrowing via discriminated unions
- [ ] No mandatory generics at call sites

#### Architecture
- [ ] Zero framework dependencies in core
- [ ] Immutable state updates
- [ ] Subscription-based reactivity
- [ ] Derived/computed values pattern
- [ ] Effect/cleanup lifecycle

#### Extensibility
- [ ] Feature composition over plugin system
- [ ] Micro-adapters for integrations
- [ ] Module augmentation for customization

#### DX
- [ ] DevTools integration
- [ ] Clear error messages
- [ ] TypeScript playground examples
- [ ] Incremental adoption path

---

## 9. Example: Designing a TanStack-Style Library

Here's how you might design a hypothetical `@tanstack/websocket` library:

```typescript
// packages/websocket-core/src/types.ts
export interface Register {
  // User augmentation point
}

export type RegisteredMessageType = Register extends { messageType: infer T }
  ? T
  : unknown

// packages/websocket-core/src/websocket.ts
export interface WebSocketOptions<TMessage = RegisteredMessageType> {
  url: string
  protocols?: string[]
  reconnect?: boolean
  reconnectInterval?: number
  onMessage?: (message: TMessage) => void
  onError?: (error: Error) => void
}

export function createWebSocket<TMessage = RegisteredMessageType>(
  options: WebSocketOptions<TMessage>
): WebSocketInstance<TMessage> {
  // Core implementation
}

// packages/websocket-core/src/options.ts
export function websocketOptions<TMessage>(
  options: WebSocketOptions<TMessage>
): WebSocketOptions<TMessage> {
  return options  // Identity, preserves types
}

// packages/react-websocket/src/useWebSocket.ts
export function useWebSocket<TMessage = RegisteredMessageType>(
  options: WebSocketOptions<TMessage>
): WebSocketResult<TMessage> {
  const [state, setState] = useState<WebSocketState>('connecting')
  const wsRef = useRef<WebSocketInstance<TMessage>>()
  
  useEffect(() => {
    wsRef.current = createWebSocket(options)
    return () => wsRef.current?.close()
  }, [options.url])
  
  return { state, send: wsRef.current?.send, ... }
}
```

---

## Conclusion

TanStack's success stems from unwavering commitment to:

1. **Separation of concerns** - Logic in core, rendering in adapters
2. **Type inference** - Types that "just work" without annotation
3. **Composition over inheritance** - Features compose, not extend
4. **Developer experience** - Sensible defaults, progressive complexity
5. **Framework agnosticism** - Write once, adapt everywhere

By following these patterns, new libraries can achieve the same level of type safety, developer ergonomics, and cross-framework portability that defines the TanStack ecosystem.
