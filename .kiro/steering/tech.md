# HAUNTED: Technical Steering

## Stack
React, TypeScript (strict), Vite, Tailwind CSS, Framer Motion, Lucide React, React Router (HashRouter), Vitest, React Testing Library, Local Storage.

## Architecture rules
- Pages in `src/pages`, reusable parts in `src/components`, logic in `src/engine`, content in `src/data`, interfaces in `src/types`.
- `src/engine` must be pure TypeScript: no React, no `window`, no `localStorage`, no randomness, no `Date.now()`.
- All Local Storage access goes through `src/utils/storage.ts` with try/catch and versioned keys (`haunted:v1:*`).
- Saved costumes are stored by id, never by copy.
- No `any`. Prefer small files (under about 200 lines) and small components.
- Code comments explain why in plain language, since the owner is a beginner.
- Lazy-load pages. Lazy-load catalogue images.

## Quality gates
- Every engine change needs a test.
- Run `npm run test -- --run` and `npm run build` before ending a phase.
- Never use watch mode in the sandbox shell.

## Accessibility
- Semantic HTML first. Answers use radio or checkbox semantics. Modals trap focus and restore it.
- Every animation checks `useReducedMotion`.
- Decorative images use `alt=""` and `aria-hidden`.
