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
| Framer Motion | Smooth page, quiz and reveal animations. |
| Lucide React | Icon set. |
| React Router (HashRouter) | Moves between pages. Hash routing means refresh and static hosting work without server setup. |
| Vitest + React Testing Library | Automatic tests. |
| Local Storage | Saves answers, favourites and settings in the visitor's browser. |

React Router and Vitest are additions to your list. They are needed for navigation and for the "create appropriate tests" requirement.

## 3. Folder structure

```
sandbox/
├── .kiro/
│   ├── specs/haunted/        requirements.md, design.md, tasks.md
│   ├── steering/             product.md, tech.md, design-system.md
│   └── hooks/                automation (run tests on save)
├── public/assets/            images (hero, portraits, costumes)
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
│   ├── hooks/                useLocalStorage, useReducedMotion, useSound
│   ├── utils/                storage.ts (safe wrapper), format.ts, a11y.ts
│   ├── components/
│   │   ├── layout/           AppShell, Navigation, MobileMenu, Footer, PageContainer
│   │   ├── effects/          FogLayer, ParticleField (decorative only)
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

Rule: black dominates, one glow colour per screen region, at most one decorative effect per viewport.

### Components

- **Button**: primary (gold fill, obsidian text), secondary (gold outline), ghost. All have visible focus rings (2px gold plus 2px offset) and a 44px minimum height.
- **GlassPanel**: `bg-charcoal/40`, backdrop blur, 1px border at gold 25%, subtle inner glow.
- **AnswerOption**: a large card with icon, label and a gold check when selected. It has role radio or checkbox.
- **Badge**: Space Grotesk, uppercase, small.
- **Motion**: durations 150 to 400 ms, ease-out. The reveal is the only longer animation (up to 6 s, skippable). A `useReducedMotion` hook switches variants off.

### Imagery plan

Phase 2 builds original SVG artwork: castle silhouette hero, four sigils (one per aesthetic), and 20+ costume illustrations drawn as a consistent set (same frame, same lighting gradient, aesthetic colour per category). All are decorative or have alt text. Real AI images can replace them by overwriting files in `public/assets/`.

## 9. Signature features (built after the core MVP)

**Share card (R12).** `utils/shareCard.ts` draws onto an off-screen `<canvas>` (1080x1350): background gradient from the identity palette, sigil, name in Cinzel, aesthetic labels in Space Grotesk, palette swatches, costume names. It waits for `document.fonts.ready` first. `canvas.toBlob` gives a PNG. Download uses an `<a download>` link. Sharing uses `navigator.canShare({ files })` when available. No library needed. Component: `components/results/ShareCardButton.tsx`.

**Séance Mode (R13).** `pages/Awakening.tsx` picks between `StandardAwakening` and `SeanceAwakening` (`components/awakening/`). The séance is a list of timed stages driven by one `useStageTimeline` hook, which makes it easy to skip and to test. Sound is produced in `hooks/useSound.ts` with the Web Audio API (soft low drone, candle crackle from filtered noise, gentle chime). The audio context is created only after the user clicks the sound toggle, as browsers require. The toggles live in settings storage. The engine runs before the animation starts, so the result is the same either way.

**Kiro Showcase (R14).** `pages/KiroShowcase.tsx` at `/kiro`. Static content in `data/showcase.ts`: spec files, steering files, hook, a phase timeline, and a requirement-to-test table. The requirement-to-test table is written by hand and checked by a unit test that fails if a listed test file does not exist.

All three are lazy-loaded chunks.

## 10. Kiro workflow artefacts

- **Spec**: this folder. `tasks.md` is the implementation source of truth.
- **Steering** (`.kiro/steering/`): `product.md` (what HAUNTED is and its content rules), `tech.md` (stack and code conventions), `design-system.md` (tokens and aesthetic rules). Kiro reads these on every task.
- **Hook** (`.kiro/hooks/`): runs the unit tests when a TypeScript file under `src/` is saved, so engine mistakes surface early.
