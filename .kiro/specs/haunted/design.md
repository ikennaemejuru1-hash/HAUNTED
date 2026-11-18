# HAUNTED: Design Document

## 1. Architecture in plain language

The app has four layers. Each layer only talks to the one below it.

1. **Pages** are the screens a visitor sees (Home, Quiz, Results and so on).
2. **Components** are reusable building blocks that pages are made from (buttons, cards, progress bar).
3. **Engine** is plain TypeScript that turns answers into an identity and costume list. It knows nothing about screens, so it is easy to test.
4. **Data and storage** hold the costume catalogue, the quiz questions and the browser's Local Storage.

## 2. Tech stack

| Tool | Why it is here |
|---|---|
| React + TypeScript | Builds screens from components. TypeScript catches mistakes before the app runs. |
| Vite | Runs the app while you develop and packages it for release. |
| Tailwind CSS | Styles elements with short class names. Design tokens live in one place: the `@theme` block in `src/styles/index.css` (Tailwind 4 reads tokens from CSS, not `tailwind.config.ts`). |
| Framer Motion | Interface transitions: page fades, quiz answers, modals, cards. |
| Three.js | Draws the 3D world in the browser with WebGL. |
| React Three Fiber (R3F) | Lets us build the Three.js scene as React components. |
| Drei | Ready-made R3F helpers (performance monitor, adaptive pixel ratio, text-free utilities). |
| postprocessing + @react-three/postprocessing | Bloom, vignette and film grain on the full tier only. |
| GSAP + ScrollTrigger + SplitText (+ @gsap/react) | Cinematic timelines, the scroll-driven camera, letter-by-letter reveals. Free for commercial use under the GSAP Standard License (not MIT; the HAUNTED repo itself stays MIT). |
| sharp (dev only) | Converts the owner's generated images to WebP and AVIF at the right sizes. |
| Lucide React | Icon set. |
| React Router (HashRouter) | Moves between pages. Hash routing means refresh and static hosting work without server setup. |
| Vitest + React Testing Library | Automatic tests. |
| Local Storage | Saves answers, favourites and settings in the visitor's browser. |

React Router, Vitest and sharp are additions to your list; Three.js, R3F, Drei, postprocessing and GSAP were approved with the Threshold redesign. They are needed for navigation and for the "create appropriate tests" requirement.

## 3. Folder structure

```
sandbox/
├── .kiro/
│   ├── specs/haunted/        requirements.md, design.md, tasks.md
│   ├── steering/             product.md, tech.md, design-system.md
│   └── hooks/                automation (run tests on save)
├── assets-src/               owner's original generated images (PNG), never served directly
├── docs/                     ASSET_BRIEF.md, PERFORMANCE.md, TEST_CHECKLIST.md
├── scripts/                  process-assets.mjs, colour-scan.mjs, deploy-preview.sh
├── public/assets/            processed images (WebP/AVIF) listed in src/data/assets.ts
├── src/
│   ├── main.tsx              app entry
│   ├── App.tsx               routes only
│   ├── types/                TypeScript interfaces
│   │   ├── quiz.ts           Question, AnswerOption, QuizAnswers
│   │   ├── costume.ts        Costume, Aesthetic, Difficulty
│   │   └── result.ts         Identity, Recommendation, RecommendationResult
│   ├── data/
│   │   ├── questions.ts      the 12 questions
│   │   ├── costumes.ts       the catalogue
│   │   ├── identities.ts     4 identities, hybrid wording, palettes, advice
│   │   └── currency.ts       tiers and approximate exchange rates
│   ├── engine/               pure logic, fully tested
│   │   ├── scoring.ts        Q1-Q6 to aesthetic scores, primary/secondary, hybrid
│   │   ├── filtering.ts      budget, time, comfort, event, group filters
│   │   ├── wardrobe.ts       owned vs missing items, extra cost
│   │   ├── recommend.ts      combines everything, returns results and reasons
│   │   └── *.test.ts
│   ├── state/
│   │   ├── QuizContext.tsx   answers, current step
│   │   └── GrimoireContext.tsx  saved costumes, saved identity
│   ├── three/                3D world (decorative only, aria-hidden)
│   │   ├── WorldCanvas.tsx   the single shared <Canvas>, lazy-loaded
│   │   ├── SceneDirector.tsx picks the scene for the current route
│   │   ├── quality.ts        pure tier logic (full, balanced, lite), unit tested
│   │   ├── palette.ts        THREE.Color versions of the tokens (no purple or blue)
│   │   ├── atmosphere/       FogLayers, Embers, DustMotes, Candles, Lighting, Effects
│   │   ├── architecture/     Gate, Arches, Pillars, Floor (procedural geometry)
│   │   ├── artefacts/        Mirror, Grimoire, Mask, Lantern, ArtefactRig
│   │   ├── scenes/           ThresholdScene, AwakeningScene
│   │   └── shaders/          fog, ember, flame, crack-glow (GLSL)
│   ├── motion/               GSAP setup, scroll camera timeline, reveal timelines
│   ├── hooks/                useLocalStorage, useReducedMotion, useSound, useQualityTier, useVisualSettings
│   ├── utils/                storage.ts (safe wrapper), format.ts, a11y.ts
│   ├── components/
│   │   ├── layout/           AppShell, Navigation, MobileMenu, Footer, PageContainer
│   │   ├── effects/          PosterBackdrop, CssFog (lite tier and fallback)
│   │   ├── quiz/             QuizShell, ProgressBar, QuestionCard, AnswerOption, MultiSelectGrid, CurrencySelect
│   │   ├── results/          IdentityReveal, IdentityCard, RecommendationCard, PaletteStrip
│   │   ├── atelier/          AtelierGrid, FilterPanel, CostumeCard, CostumeDetailModal
│   │   ├── alchemist/        AlchemistPanel, OwnedMissingList
│   │   ├── grimoire/         GrimoireView, SavedCostumeCard
│   │   └── ui/               Button, Badge, Modal, EmptyState, LoadingState, ErrorState, GlassPanel
│   ├── pages/                Home, Discover, Quiz, Awakening, Results, Atelier, Alchemist, Grimoire, About, NotFound
│   └── styles/               index.css, tokens in the @theme block of index.css
├── index.html
├── package.json
└── README.md
```

## 4. Data model (TypeScript interfaces)

```ts
type AestheticId = 'velvet' | 'arcane' | 'crimson' | 'neon';
type Difficulty = 'easy' | 'medium' | 'hard';
type PlayMode = 'solo' | 'couple' | 'group';
type BudgetTier = 'lt20' | '20to50' | '50to100' | 'gt100';
type TimeTier = 'lt30m' | '30m2h' | '2to5h' | 'gt5h';
type ComfortId = 'simple' | 'stylish' | 'elaborate' | 'experimental';
type EventId = 'party' | 'photoshoot' | 'school' | 'trick' | 'fun';
type WardrobeItem =
  | 'black' | 'white' | 'jackets' | 'boots' | 'dresses'
  | 'accessories' | 'makeup' | 'themed' | 'other' | 'scratch';

interface QuizAnswers {
  q1?: 'A'|'B'|'C'|'D'; q2?: ...; q3?: ...; q4?: ...; q5?: ...; q6?: ...;
  budget?: BudgetTier;
  currency: 'USD' | 'NGN' | 'GBP';
  time?: TimeTier;
  comfort?: ComfortId;
  wardrobe: WardrobeItem[];
  event?: EventId;
  playMode?: PlayMode | 'open';
}

interface Costume {
  id: string;
  name: string;
  aesthetic: AestheticId;
  description: string;
  requiredClothing: { label: string; wardrobe: WardrobeItem }[];
  requiredAccessories: { label: string; wardrobe: WardrobeItem }[];
  makeup: string[];
  costUsd: { min: number; max: number };   // estimates
  prepMinutes: number;
  difficulty: Difficulty;
  diySteps: string[];
  image: string;
  events: EventId[];
  playModes: PlayMode[];
}

interface Identity {
  name: string;                  // "Velvet Phantom"
  isHybrid: boolean;
  primary: AestheticId;
  secondary: AestheticId;
  scores: Record<AestheticId, number>;
  influencedBy: { question: string; answer: string; aesthetic: AestheticId }[];
}

interface Recommendation {
  costume: Costume;
  score: number;
  reasons: string[];
  owned: string[];
  missing: string[];
  extraCostUsd: { min: number; max: number };
  kind: 'match' | 'closest' | 'stretch';
}

interface RecommendationResult {
  identity: Identity;
  recommendations: Recommendation[];   // up to 3
  notices: string[];                   // e.g. "Your budget is tight, so..."
}
```

## 5. Engine algorithm (deterministic)

1. **Score.** For Q1..Q6, add 3 points to the aesthetic of each chosen option. Record which answers contributed.
2. **Rank aesthetics.** Sort by score, then tie-break (Q5, Q1, Q4, fixed order).
3. **Identity.** Hybrid if `top - second <= 3` and `second >= 6`. Name = lead first word + secondary second word.
4. **Hard filters.** Drop costumes whose `costUsd.min` is above the budget ceiling or whose `prepMinutes` is above the time ceiling.
   Budget ceilings: lt20 = 20, 20to50 = 50, 50to100 = 100, gt100 = no limit.
   Time ceilings: lt30m = 30, 30m2h = 120, 2to5h = 300, gt5h = no limit.
5. **Soft score** for each remaining costume (weights are constants in one file):
   - aesthetic: primary 40, secondary 20 (a hybrid user gets both)
   - wardrobe coverage: up to 25 × (owned required items / total required items)
   - comfort fit: up to 10 (comfort maps to a preferred difficulty range)
   - event fit: 5
   - play mode fit: 5 (open to suggestions always fits)
   - cost headroom: up to 5 (cheaper than ceiling scores higher)
6. **Pick** the top 3 by score. Ties broken by costume id so output is stable.
7. **Relax** if fewer than 3: drop play mode, then event, then comfort; mark `closest`. Never relax budget or time.
8. **Stretch** if zero pass: show the 3 cheapest or quickest costumes in the identity's aesthetic, mark `stretch`, add a notice.
9. **Reasons** are built from templates that quote the user's answers.

Because the engine is pure, the same answers always give the same result, and tests do not need a browser.

## 6. State and storage

- `QuizContext` holds current answers and step. It writes to Local Storage on every change.
- `GrimoireContext` holds saved costume ids and the saved identity result.
- All Local Storage access goes through `utils/storage.ts`. It handles missing, blocked or corrupt storage.

Keys (all versioned):

| Key | Content |
|---|---|
| `haunted:v1:quiz` | `{ answers, step }` |
| `haunted:v1:result` | latest `RecommendationResult` summary (ids and identity, rebuilt from the catalogue) |
| `haunted:v1:grimoire` | `{ savedIds: string[], savedIdentity?: ... }` |
| `haunted:v1:settings` | `{ sound: boolean, currency }` |

Saved items are stored as costume ids, so catalogue edits do not leave stale copies. Unknown ids are dropped on load.

## 7. Routes

| Path | Page |
|---|---|
| `/` | Home (landing, how it works, explore styles) |
| `/discover` | Discovery Introduction |
| `/quiz` | Quiz |
| `/awakening` | Awakening (redirects to `/quiz` if there are no complete answers) |
| `/results` | Results |
| `/atelier` | Costume Atelier (Wardrobe Alchemist is a tab on this page and on Results) |
| `/grimoire` | Grimoire |
| `/about` | About |
| `/kiro` | Kiro Showcase (linked from footer and About) |
| `*` | Not found |

Pages are lazy-loaded.

## 8. Design system

### Colour tokens

No purple, violet or blue is used anywhere in the visual design.

| Token | Hex | Use |
|---|---|---|
| `obsidian` | #0A0908 | Main background (dominant) |
| `charcoal` | #1E1B1C | Panels, gradients, depth |
| `burgundy` | #641B35 | Horror details, hover surfaces, dividers |
| `gold` | #C5A15B | Primary accent: headings, borders, focus rings, primary button |
| `ember` | #E87524 | Selective highlights, glows, selected and active states, warnings |
| `ash` | #8A8786 | Technical labels, glass edges, secondary text, disabled hints |
| `silver` | #CFCBC6 | Body text (warm silver) |

Measured contrast ratios (WCAG relative luminance):

| Pair | Ratio | Verdict |
|---|---|---|
| silver on obsidian | 12.3:1 | AAA, body text |
| silver on charcoal | 10.6:1 | AAA, body text |
| gold on obsidian | 8.2:1 | AAA |
| gold on charcoal | 7.0:1 | AAA |
| ember on obsidian | 6.6:1 | AA, fine for text |
| ember on charcoal | 5.7:1 | AA, fine for text |
| ash on obsidian | 5.6:1 | AA, labels and secondary text |
| ash on charcoal | 4.8:1 | AA, labels and secondary text |
| silver on burgundy | 7.4:1 | AAA |
| gold on burgundy | 4.9:1 | AA, large or bold text only |
| ember on burgundy | 4.0:1 | Fails for small text. Never put ember text on burgundy |
| obsidian on gold | 8.2:1 | Primary button text |
| obsidian on ember | 6.6:1 | Text on ember fills |

Rules: gold is the main accent and ember is used sparingly. Ember appears in glows, selected states and small highlights, never as large fills. Text on burgundy is silver. Every pair is re-checked in Phase 9.

### Typography

| Role | Font | Use |
|---|---|---|
| Display | Cinzel | Headings, identity names |
| Body | Inter | Paragraphs, answers, buttons text |
| Technical | Space Grotesk | Labels, progress, filters, badges, uppercase with letter spacing |

Scale: 12, 14, 16, 18, 24, 32, 48, 64. Hero heading uses a fluid size (`clamp`). Fonts are self-hosted through `@fontsource` packages, so there are no third-party requests (privacy).

### How the four aesthetics become one

Each aesthetic owns one job, so they never fight:

| Aesthetic | Owns | Visible in |
|---|---|---|
| Gothic luxury | Structure | Serif headings, gold hairline borders, generous space, ornamental corners |
| Haunted fantasy | Atmosphere | Slow fog, small drifting motes, soft ember glow |
| Horror cinema | Mood | Deep vignette, burgundy shadows, dramatic light from above |
| Futuristic Halloween | Interface | Glass panels (blurred, translucent), thin ash-grey edges, technical labels |

Rules for the immersive layer (replaces the old "one decorative effect per viewport" rule):
- Black dominates. Light comes from gold and ember sources inside the scene, never from flat coloured backgrounds.
- Effects are layered by depth: far fog, architecture, near fog, particles, then HTML. Nothing decorative ever renders above text.
- Wherever text sits over the scene, a local scrim (soft obsidian gradient) keeps contrast at AA or better.
- One dominant glow colour per region of the screen.
- No purple or blue anywhere in lights, fog, materials or post effects.

### Components

- **Button**: primary (gold fill, obsidian text), secondary (gold outline), ghost. All have visible focus rings (2px gold plus 2px offset) and a 44px minimum height.
- **GlassPanel**: `bg-charcoal/40`, backdrop blur, 1px border at gold 25%, subtle inner glow.
- **AnswerOption**: a large card with icon, label and a gold check when selected. It has role radio or checkbox.
- **Badge**: Space Grotesk, uppercase, small.
- **Motion**: interface transitions 150 to 400 ms, ease-out (Framer Motion). Cinematic sequences are longer and owned by GSAP: the doorway push under 1 s, the Awakening 8 to 10 s, Séance Mode up to 15 s. All are skippable. Reduced motion switches every sequence to a short fade.

### Imagery plan

Two sources, each used for what it does best:

- **AI-generated 2D art** (owner, ChatGPT image generation, per `docs/ASSET_BRIEF.md`): the Threshold poster (desktop and mobile), the hall backplate, four identity portraits, tileable material textures, an Open Graph image, and later the costume illustrations (Phase 4/6). Originals go in `assets-src/`. `scripts/process-assets.mjs` crops, colour-grades toward the palette, and exports WebP and AVIF to `public/assets/`. `scripts/colour-scan.mjs` rejects images with purple or blue regions.
- **Procedural** (code): fog and mist, embers, dust motes, candle flames, gothic architecture, the four artefacts, sigils, lighting and post effects.

Until the generated art arrives, procedural placeholders stand in, and every image path comes from one manifest (`src/data/assets.ts`), so swapping assets needs no code change. AI assets are original, contain no copyrighted characters, no text and no real people, and are credited on the About page.

## 9. Signature features (built after the core MVP)

**Share card (R12).** `utils/shareCard.ts` draws onto an off-screen `<canvas>` (1080x1350): background gradient from the identity palette, sigil, name in Cinzel, aesthetic labels in Space Grotesk, palette swatches, costume names. It waits for `document.fonts.ready` first. `canvas.toBlob` gives a PNG. Download uses an `<a download>` link. Sharing uses `navigator.canShare({ files })` when available. No library needed. Component: `components/results/ShareCardButton.tsx`.

**Séance Mode (R13).** `pages/Awakening.tsx` picks between `StandardAwakening` and `SeanceAwakening` (`components/awakening/`). Both reuse the 3D `AwakeningScene` from section 11, so Séance Mode is a longer GSAP timeline over the same scene rather than a second world. The séance is a list of timed stages driven by one `useStageTimeline` hook, which makes it easy to skip and to test. Sound is produced in `hooks/useSound.ts` with the Web Audio API (soft low drone, candle crackle from filtered noise, gentle chime). The audio context is created only after the user clicks the sound toggle, as browsers require. The toggles live in settings storage. The engine runs before the animation starts, so the result is the same either way.

**Kiro Showcase (R14).** `pages/KiroShowcase.tsx` at `/kiro`. Static content in `data/showcase.ts`: spec files, steering files, hook, a phase timeline, and a requirement-to-test table. The requirement-to-test table is written by hand and checked by a unit test that fails if a listed test file does not exist.

All three are lazy-loaded chunks.

## 10. Kiro workflow artefacts

- **Spec**: this folder. `tasks.md` is the implementation source of truth.
- **Steering** (`.kiro/steering/`): `product.md` (what HAUNTED is and its content rules), `tech.md` (stack and code conventions), `design-system.md` (tokens and aesthetic rules). Kiro reads these on every task.
- **Hook** (`.kiro/hooks/`): runs the unit tests when a TypeScript file under `src/` is saved, so engine mistakes surface early.

## 11. The Threshold: 3D and motion architecture (R15, R6)

### 11.1 Concept and camera path

The landing page is one continuous journey. Scrolling moves the camera; the HTML sections are the chapters of that journey.

| Chapter | HTML on screen | What the camera and scene do |
|---|---|---|
| 0 Approach | Hero heading, support line, CTA, secondary links | Camera low outside a gothic gate. Thick layered fog, a gold moon glow high behind the gate, embers rising from braziers either side. |
| 1 Threshold | How It Works (three steps) | Camera glides forward through the gate arch. Three candles on the inner sill light one by one, one per step. Fog thins as we pass inside. |
| 2 The Hall | Explore Styles (four identities) | Camera drifts down a candlelit hall. The four artefacts float on plinths. Each comes forward as its identity is reached or focused. |
| 3 The Doorway | Final DISCOVER YOUR DARK SIDE | Camera faces a tall doorway glowing ember from within. Pressing the CTA pushes the camera through (under 1 s), then the route changes to Discover. |

The camera follows a spline. GSAP ScrollTrigger maps scroll position to a single `progress` value (0 to 1), smoothed with `scrub`. The R3F frame loop reads that value directly each frame (no React state), so scrolling never re-renders React. Mobile uses a shorter path with fewer fog layers and a slightly higher camera so the artefacts fit a portrait frame.

### 11.2 Layers and ownership

```
z: HTML (text, nav, controls, scrims)         <- React + Framer Motion
   ─────────────────────────────────────────
   <WorldCanvas> fixed, aria-hidden           <- R3F; motion driven by GSAP timelines
   PosterBackdrop (shown until 3D is ready,   <- also the lite tier and the WebGL fallback
   and whenever 3D is off)
```

- One shared `<WorldCanvas>` is mounted by `AppShell`, lazy-loaded after the first paint. `SceneDirector` picks `ThresholdScene` on `/`, `AwakeningScene` on `/awakening`, and nothing (canvas paused and hidden) elsewhere. Reusing one canvas avoids rebuilding the WebGL context on every route change.
- Ownership: **GSAP** owns the camera, scene timelines and SplitText reveals. **Framer Motion** owns component and page transitions. **R3F `useFrame`** owns continuous ambient motion (fog drift, ember rise, candle flicker). No element is animated by two libraries.
- The HTML layer never depends on the canvas. If the 3D chunk fails to load, the site is complete without it.

### 11.3 Atmosphere

- **Fog and mist**: 3 to 5 large camera-facing planes at different depths with a fog shader (layered noise that scrolls at different speeds and directions, soft edges, density higher near the ground). Tinted charcoal and warm grey, lit gold or ember by nearby lights. The camera passes through layers as it moves, which is what sells "entering".
- **Embers**: GPU instanced points (one draw call). Each rises, sways and fades with a custom shader; colour runs from ember to gold, additive blending.
- **Dust motes**: slow, sparse points in warm silver, visible where candle and moon light falls.
- **Candlelight**: flame shader on small planes, paired with point lights whose intensity follows smooth noise (no hard flicker, N3).
- **Lighting**: gold moon key light from behind the gate, ember rim lights, candle points in the hall, burgundy fill in shadows. Shadows are faked (baked darkening and contact gradients) instead of real-time shadow maps, to save GPU time.
- **Post effects (full tier)**: selective bloom on embers, flames and windows; vignette; fine film grain. Balanced and lite tiers use a CSS vignette instead.

### 11.4 Architecture and artefacts (procedural)

- **Gate, arches, pillars**: built from extruded 2D gothic profiles (pointed arches, tracery) and lathe shapes (pillars, finials), with aged stone and antique gold materials. Textures come from the asset brief once available; until then, procedural noise textures.
- **Artefacts** share one `ArtefactRig` (float, idle rotation, pointer drift, focus response):

| Artefact | Identity | Built from | Focus response (R15.5) |
|---|---|---|---|
| Gilded mirror | Velvet Enigma | Extruded ornate frame, reflective dark glass | Glass clears to reveal a faint reflection of candle flames; gold frame brightens |
| Floating grimoire | Arcane Wanderer | Boxes and bent planes for cover and pages, sprite runes on an orbit | Pages riffle open, runes orbit faster and glow gold |
| Porcelain mask | Crimson Phantom | Sculpted from a deformed sphere half-shell, crack lines in a shader | Cracks glow ember from within, burgundy light pulses once, slowly |
| Fractured lantern | Neon Revenant | Lathe body with missing glass panes, inner circuit pattern | Ember circuitry traces along its lines, flame steadies |

Interaction comes from HTML: hovering, focusing or tapping an identity in the Explore Styles list sets the "active artefact". Pointer drift is ambient and optional; it does nothing on touch devices.

### 11.5 Awakening reveal (built in Phase 5)

Timeline (GSAP, 8 to 10 s, Skip always visible and focusable):

| Time | Scene | HTML |
|---|---|---|
| 0 to 1.5 s | Altar in darkness, embers flow in from the edges | "YOUR IDENTITY IS TAKING SHAPE..." (SplitText) |
| 1.5 to 4 s | Four artefacts orbit the altar, accelerating; candles ignite in a ring | Text holds |
| 4 to 6.5 s | Others dissolve into embers; the primary artefact rises (hybrid: primary and secondary merge) | |
| 6.5 to 8 s | Light shifts to the identity palette; the gold sigil draws itself in the air | |
| 8 to 10 s | Camera settles | "YOUR HALLOWEEN ALTER EGO HAS AWAKENED." then identity card rises |

Lite tier: same timing with poster art, CSS fog and an SVG sigil drawn by GSAP. Reduced motion: fade (1 s or less) to the card.

### 11.6 Quality tiers and performance

| Tier | Who gets it | Contents |
|---|---|---|
| Full | Desktop and strong devices | 5 fog layers, ~3,000 embers, post effects, pixel ratio up to 2 |
| Balanced | Most phones and laptops | 3 fog layers, ~800 embers, no post effects, pixel ratio capped at 1.5 |
| Lite | Weak devices, Save-Data, reduced motion, no WebGL, or the visitor's choice | Poster art + CSS fog, no WebGL |

- `quality.ts` is pure: it takes facts (WebGL support, reduced motion, Save-Data, CPU cores, device memory, screen size, saved setting) and returns a tier. Unit tested.
- At runtime, Drei's `PerformanceMonitor` steps down one tier if the frame rate stays low, and never steps back up during a visit (avoids flicker between tiers).
- Rendering pauses when the tab is hidden, when the canvas is off screen, and on routes without a scene.
- Loading order: HTML and poster first (this is the largest contentful paint), then the 3D chunk on idle. The poster cross-fades into the live scene when its first frame is ready.
- Measuring (N4): Lighthouse mobile is run separately for lite (`?fx=lite`) and full, and both results are recorded in `docs/PERFORMANCE.md`. Real-device frame rates are checked on the GitHub Pages preview.

### 11.7 Accessibility in the 3D world

- The canvas is `aria-hidden` and not focusable. All content and controls are HTML.
- Text over the scene sits on scrims; contrast is checked on real rendered frames, not only on flat colours.
- Keyboard focus produces the same artefact response as hover (AC22).
- Reduced motion: no scroll camera, no drifting fog, no particle motion, a still frame or the poster.
- The footer has a working "Visual effects: Full / Lite" switch (R15.9).

