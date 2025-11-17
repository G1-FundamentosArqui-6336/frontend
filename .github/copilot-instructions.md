---
name: cobox-frontend-rules
description: React 19 + TypeScript 5.9 + TailwindCSS + Vite 7 Clean Architecture guidelines for CoBox TMS platform
applyTo: "**/*.{ts,tsx}"
---

# Project Context

CoBox is a fleet-management and logistics platform (TMS) built on microservices:
Config → Eureka → Gateway → (IAM, Fleet, Delivery).
The frontend is a modular **React 19** + **TypeScript 5.9** + **Vite 7** web app that communicates **only** through the API Gateway.

## Key Principles

- **Clean Architecture** separation between **domain**, **application**, **infrastructure**, and **presentation**.
- End-to-end type safety using **Zod** and **TypeScript 5.9** in strict mode.
- Consistent data flow through **TanStack Query v5** for server state.
- Visual design using **TailwindCSS v4** (or v3) and accessible UI components (Headless UI / Radix UI).
- Modern React 19 patterns: use hooks, transitions, and Server Components concepts (when applicable).
- Testability and predictability across all slices.
- AI-friendly code generation for use with GitHub Copilot.

---

# Before Writing Code

1. Identify the **feature slice** (e.g., `auth`, `fleet`, `delivery`).
2. Define/extend **Zod schemas** for request & response data.
3. Create or reuse **service adapters** under `src/services/*` to access Gateway endpoints.
4. Define the **usecase hooks** (`useQuery`, `useMutation`) using TanStack Query.
5. Build UI components under `features/<slice>/ui` with proper accessibility.
6. Add integration tests with **MSW** and **Vitest**.
7. Validate build passes linting (Biome/ESLint) and type checks.

---

# Rules

## Architectural Boundaries

- **Domain (core/)**  
  - Contains pure business logic: entities, value objects, and validation schemas (Zod).  
  - Must not import React or HTTP clients.

- **Application (features/*/model)**  
  - Implements use cases and orchestrates data flow.  
  - Uses domain types and ports only.

- **Infrastructure (services/)**  
  - Contains HTTP adapters and storage interfaces.  
  - Only layer that can use `fetch` or external APIs.  
  - Each adapter must validate data using Zod before returning to the domain.

- **Presentation (features/*/ui, components/)**  
  - Pure React components and hooks.  
  - Never call HTTP directly—use adapters or hooks from the model layer.

---

## Accessibility (a11y)

- Every interactive element (`button`, `input`, `link`) must include `aria-*` attributes and accessible labels.
- All `button` elements require `type="button"`, `type="submit"`, or `type="reset"`.
- Use semantic HTML (no `div` buttons or `span` links).
- Support keyboard navigation: pair `onClick` with keyboard events (`onKeyUp`/`onKeyDown`).
- Use `focus-visible` utilities from Tailwind for consistent outline handling.

---

## Code Quality and Complexity

- No side effects in components; use hooks for effects.
- Use async/await properly — no `await` inside loops.
- Avoid duplicating code; refactor into utilities or shared hooks.
- Avoid “magic strings”: define constants for API paths, roles, and routes.
- Handle errors gracefully using typed `Result` or `Either` patterns.

---

## React and JSX Best Practices

- Use functional components only.
- Do not define components inside other components.
- Prefer `<>...</>` over `<Fragment>...</Fragment>`.
- Avoid inserting comments as text nodes.
- No inline CSS — use Tailwind utilities or classnames.
- Don't import `React` explicitly (React 19 uses automatic JSX runtime).
- Components should be small, testable, and named with PascalCase.
- Use `useTransition` and `useDeferredValue` for non-blocking UI updates when appropriate.
- Leverage `use` hook (React 19) for reading promises and context in render phase when needed.

---

## Function Parameters and Props

- Always use destructured props in components.  
  ✅ `function VehicleCard({ vehicle }: { vehicle: Vehicle })`
- Avoid positional parameters in functions.
- Define prop and state interfaces explicitly.
- Document complex props with TSDoc comments.

---

## Correctness and Safety

- Never commit API URLs or tokens — use `import.meta.env` or runtime ENV injection.
- Validate every response with Zod before use.
- Handle all network errors with user feedback (toast or inline error).
- Implement centralized retry/backoff logic (services/http/client.ts).
- Never mutate TanStack Query cache directly; use `queryClient.setQueryData()` safely.
- Always clean up event listeners and effects in hooks.

---

## TypeScript Best Practices

- No `any` or `@ts-ignore` — use `unknown` or proper type narrowing.
- Use union types instead of enums.
- Prefer `type` aliases over `interface` when merging is not needed.
- Use readonly arrays and tuples when possible (`readonly string[]`, `as const`).
- Avoid type assertions unless absolutely necessary — prefer type guards.
- Keep strict mode enabled in `tsconfig.json` (already enabled in TypeScript 5.9).
- Use `satisfies` operator to validate types without widening (TypeScript 4.9+).
- Leverage template literal types for string validation when appropriate.

---

## Style and Consistency

- Follow ESLint flat config formatting (configured in `eslint.config.js`).
- Use Tailwind naming conventions for spacing/layout (`p-4`, `mt-2`, `grid-cols-3`).
- Avoid deep nesting in components (>3 levels).
- Always separate logic and presentation:  
  - Hooks = data/behavior.  
  - Components = rendering.
- Use meaningful variable and function names — avoid abbreviations unless widely known.

---

## TanStack Query (Data Layer)

- Query keys must reflect the domain:  
  `['fleet', 'vehicles']`, `['delivery', 'orders', orderId]`.
- Always define `staleTime`, `gcTime`, and retry policy explicitly.
- Use `select` to project server data into domain entities.
- Mutations should invalidate only relevant keys (not global refetches).
- No direct `fetch` calls — use the shared client under `services/http/client.ts`.

---

## TailwindCSS Guidelines

- Use responsive utilities (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and dark mode classes.
- Avoid arbitrary pixel values; stick to design tokens from theme configuration.
- Use Tailwind `@layer` for global component styles (e.g., `.btn`, `.card`).
- Centralize theme customization in `tailwind.config.js`.
- Prefer `flex` and `grid` for layout — avoid floats.
- Use Tailwind v4 features when available (CSS-first configuration if migrated).
- Leverage container queries and modern CSS features supported by Tailwind v4.

---

## Testing

- Use **Vitest** for unit tests and **Testing Library** for integration tests.
- Use **MSW** to mock API responses per service context (IAM, Fleet, Delivery).
- Include tests for:  
  - Loading, error, empty, and success states.  
  - Accessibility (via `getByRole`, `getByLabelText`).
- No reliance on external APIs during testing.

---

## Error Handling and Observability

- Use a global `ErrorBoundary` at app root.
- Log errors through a centralized `logger` (console abstraction or Sentry).
- Always propagate `x-request-id` if received from Gateway.
- Provide meaningful user messages (“Connection lost. Retrying…”).
- Never swallow exceptions silently.

---

## Deployment and Configuration

- Use `.env.production` and `.env.development` for Gateway base URLs.
- Never embed credentials or keys in source code.
- Ensure `VITE_API_BASE_URL` points to the Gateway (not individual services).
- Feature flags come from `/config` endpoint or static config module.
- Validate all environment variables at startup using Zod.

---

# Example: Safe Fleet Fetch

```typescript
// src/services/fleet/fleet.service.ts
import { z } from "zod";
import { client } from "../http/client";
import { vehicleSchema } from "@/core/dtos/vehicle";

export async function getFleetVehicles() {
  const response = await client.get("/fleet-service/vehicles");
  const data = vehicleSchema.array().parse(await response.json());
  return data;
}
