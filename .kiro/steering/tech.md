# HAUNTED: Technical Steering

## Stack
React, TypeScript (strict), Vite, Tailwind CSS, Framer Motion, Lucide React, React Router (HashRouter), Vitest, React Testing Library, Local Storage.
3D and motion: Three.js, React Three Fiber, Drei, postprocessing (full tier only), GSAP with ScrollTrigger and SplitText via `@gsap/react`.

## Architecture rules
- Pages in `src/pages`, reusable parts in `src/components`, logic in `src/engine`, content in `src/data`, interfaces in `src/types`.
- `src/engine` must be pure TypeScript: no React, no `window`, no `localStorage`, no randomness, no `Date.now()`.
- All Local Storage access goes through `src/utils/storage.ts` with try/catch and versioned keys (`haunted:v1:*`).
- Saved costumes are stored by id, never by copy.
- No `any`. Prefer small files (under about 200 lines) and small components.
- Code comments explain why in plain language, since the owner is a beginner.
- Lazy-load pages. Lazy-load catalogue images.
- 3D code lives in `src/three`, GSAP timelines in `src/motion`. The 3D chunk is lazy-loaded after first paint and never imported by pages directly.
- One shared `<Canvas>` (`WorldCanvas`) for the whole app. Scenes are chosen by `SceneDirector`.
- Animation ownership: GSAP owns the camera, scene timelines and SplitText; Framer Motion owns UI transitions; `useFrame` owns ambient motion. Never two libraries on one element.
- Per-frame values (scroll progress, pointer) are read from refs in `useFrame`, never stored in React state.
- Tier logic (`quality.ts`) and palette (`palette.ts`) are pure and unit tested. WebGL itself is not run in unit tests.
- Dispose geometries, materials and textures when scenes unmount. Handle `webglcontextlost` by falling back to lite.
- Image paths come only from `src/data/assets.ts`.

## Quality gates
- Every engine change needs a test.
- Run `npm run test -- --run` and `npm run build` before ending a phase.
- Visual checkpoints: headless Chromium screenshots (desktop, mobile, lite, reduced motion) and the colour scan, then update the Pages preview.
- Respect the budgets in requirements N9. Report bundle sizes at each 2R checkpoint.
- Never use watch mode in the sandbox shell.

## Accessibility
- Semantic HTML first. Answers use radio or checkbox semantics. Modals trap focus and restore it.
- Every animation checks `useReducedMotion`, including GSAP timelines and the R3F frame loop.
- The canvas is `aria-hidden` and never focusable.
- Decorative images use `alt=""` and `aria-hidden`.
