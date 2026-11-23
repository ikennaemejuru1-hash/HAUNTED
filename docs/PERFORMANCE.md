# HAUNTED: Performance record

Budgets come from requirements N4 and N9. Numbers are from `npm run build` (Vite gzip report).

## Bundle sizes (task 2R.10 measure, Threshold with procedural placeholders)

| What | File | Raw | Gzip | Budget (gzip) | Verdict |
|---|---|---|---|---|---|
| App entry (React, router, shell, poster backdrop, tier logic) | `index-*.js` | 277.6 kB | 88.6 kB | | |
| Landing page chunk (Home, Framer Motion) | `Home-*.js` | 146.4 kB | 49.9 kB | | |
| **Landing JS before 3D** (entry + Home) | | 424.0 kB | **138.5 kB** | under 150 kB | Pass |
| Styles | `index-*.css` | 30.3 kB | 6.6 kB | | |
| **3D chunk** (Three.js, R3F, Drei, postprocessing, GSAP, scenes) | `WorldCanvas-*.js` | 1,174.1 kB | **335.1 kB** | under 350 kB | Pass, close to the limit |

How the 3D chunk stays out of the first load:
- `src/three/WorldHost.tsx` imports `world/WorldCanvas` with `lazy()`. It is fetched only after the page is idle (`requestIdleCallback`, or a 400 ms timer in Safari) and only when the tier is not lite.
- On the lite tier (no WebGL, reduced motion, Save-Data, weak device, `?fx=lite`, or the footer "Lite" choice) the 3D chunk is never downloaded.
- Vite warns that the 3D chunk is over 500 kB raw. This is expected; the budget is measured in gzip.

Headroom notes: the 3D chunk has about 15 kB gzip left. Adding more Drei helpers or postprocessing effects should be checked against this budget.

## Lighthouse

Not measured yet. Lighthouse needs a real browser run against the GitHub Pages preview, which is pending. Both runs (lite with `?fx=lite`, and full) will be recorded here.

| Run | Performance | LCP | Notes |
|---|---|---|---|
| Mobile, lite (`?fx=lite`) | pending | pending | |
| Mobile, full | pending | pending | |

## Frame rate

The sandbox renders WebGL in software (SwiftShader), so its frame rates do not represent real devices. Real-device checks happen on the Pages preview. Drei's `PerformanceMonitor` steps the tier down (full to balanced to lite) if the frame rate stays low.
