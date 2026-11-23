# HAUNTED: Implementation Plan

Rule: finish one phase, explain it, run its tests, then wait for approval before the next phase.
Requirement IDs refer to `requirements.md`.

## Phase 1: Plan and design (this phase)
- [x] 1.1 Analyse brief and PDF, resolve conflicts (requirements section 0)
- [x] 1.2 Write requirements, acceptance criteria, risks, test plan
- [x] 1.3 Write architecture, data model, engine algorithm, design system
- [x] 1.4 Write task list
- [x] 1.5 Create steering documents and a test hook

## Phase 2: Foundation, landing page and navigation (R1, R2, N1, N2, N5)
- [x] 2.1 Scaffold Vite + React + TypeScript, install Tailwind, Framer Motion, Lucide, React Router, Vitest
- [x] 2.2 Configure design tokens, self-hosted fonts, global styles, focus styles
- [x] 2.3 Build ui components: Button, GlassPanel, Badge, EmptyState, LoadingState, ErrorState
- [x] 2.4 Build AppShell, Navigation, MobileMenu, Footer
- [~] 2.5 ~~Build FogLayer and ParticleField~~ Replaced by 2R.4 (lite CSS fog fallback) and 2R.5 (3D atmosphere)
- [x] 2.6 Build Home (hero, How It Works, Explore Styles) and Discover intro (copy and structure kept; visuals are redesigned in 2R)
- [ ] 2.7 Create placeholder pages and routes for all pages, plus NotFound
- [~] 2.8 ~~Create SVG hero art and four aesthetic sigils~~ Hero art replaced by the Threshold (2R.6). Sigils move to 2R.7
- [x] 2.9 Tests: routes render, mobile menu opens and closes with keyboard
- [ ] 2.10 Checkpoint: explain, run tests, wait for approval (taken together with the 2R checkpoints)

## Phase 2R: The Threshold redesign (R2.3, R15, N4, N9). Owner-approved
Each step ends with headless-browser screenshots, a colour scan, an update of the Pages preview and a pause for approval.
- [x] 2R.1 Update requirements, design and steering for the redesign
- [ ] 2R.2 Write `docs/ASSET_BRIEF.md` (prompts, sizes, formats, rules) and present it for review
- [ ] 2R.3 Early GitHub Pages preview on the `gh-pages` branch (relative base, deploy script)
- [x] 2R.4 3D foundation: install Three, R3F, Drei, GSAP; `WorldCanvas`, `SceneDirector`, `quality.ts` (+ tests), `palette.ts` (+ no-blue test), poster fallback, CSS fog, reduced motion, context-loss handling, Visual effects Full/Lite setting
- [x] 2R.5 Atmosphere: layered fog shader, embers, dust motes, candle flames, lighting, post effects on the full tier. **Checkpoint: visual review**
- [x] 2R.6 Threshold scene: procedural gate, arches, pillars; scroll camera (GSAP ScrollTrigger); chapters 0 to 3 aligned with the HTML sections; scrims for text. **Checkpoint: major visual review**
- [x] 2R.7 The four artefacts, ArtefactRig, focus/hover/tap responses, four sigils, Explore Styles chapter. **Checkpoint: visual review**
- [x] 2R.8 Doorway push transition into Discover; Discover page restyled to match
- [ ] 2R.9 Integrate the owner's generated assets (process, colour scan, swap placeholders)
- [~] 2R.10 Measure (bundle sizes recorded in `docs/PERFORMANCE.md`; Lighthouse and 2.7 still open): bundle sizes, Lighthouse lite and full, record in `docs/PERFORMANCE.md`; finish 2.7 routes. **Checkpoint: Phase 2 approval**

## Phase 3: Interactive quiz (R3, AC1 to AC3)
- [x] 3.1 Define quiz types and the 12 questions in `data/questions.ts`
- [x] 3.2 Build `utils/storage.ts` and `useLocalStorage`
- [x] 3.3 Build QuizContext with validation and persistence
- [x] 3.4 Build QuizShell, ProgressBar, QuestionCard, AnswerOption, MultiSelectGrid, CurrencySelect
- [x] 3.5 Q10 exclusivity ("scratch"), Q7 currency display
- [x] 3.6 Section headers, transitions, selected-answer animation
- [x] 3.7 Tests: validation, previous/next, answer changes, multi-select rules, refresh persistence, corrupt storage
- [x] 3.8 Checkpoint

## Phase 4: Recommendation engine (R4, R5, AC4 to AC11)
- [x] 4.1 Define result types
- [x] 4.2 Write `data/identities.ts` (descriptions, palettes, advice, hybrid wording)
- [x] 4.3 Write the costume dataset (20 or more entries) and the dataset validation test
- [x] 4.4 Implement scoring, tie-breaks and hybrid naming
- [x] 4.5 Implement filters, wardrobe matching, ranking, relaxation, stretch options
- [x] 4.6 Implement reason generation
- [x] 4.7 Tests: a table of known answers and expected outputs, determinism, identity unaffected by Q7 to Q12, tight budget, no wardrobe, all-A to all-D
- [x] 4.8 Checkpoint (engine can be shown with a temporary debug view)

## Phase 5: Awakening and results (R6, R7, AC12)
- [x] 5.1 Build the 3D Awakening (design 11.5): AwakeningScene, 8 to 10 s GSAP timeline, Skip, sound toggle, lite 2D version, reduced-motion fade
- [x] 5.2 Build IdentityReveal and IdentityCard
- [x] 5.3 Build Results page: identity, scores, palette, budget info, styling advice
- [x] 5.4 Build RecommendationCard with reasons
- [x] 5.5 Buttons: Explore, Save, Retake (with confirm), Copy result
- [x] 5.6 Empty state when no result exists
- [x] 5.7 Tests: skip works at every stage, reveal ends within 10 s, result identical with any tier, results render from fixed answers, retake clears state
- [x] 5.8 Checkpoint

## Phase 6: Atelier and Wardrobe Alchemist (R8, R9, AC10, AC18)
- [ ] 6.1 Build CostumeCard, AtelierGrid, FilterPanel (mobile drawer)
- [ ] 6.2 Combine filters, empty state, clear filters
- [ ] 6.3 Build CostumeDetailModal (focus trap, Escape, focus return)
- [ ] 6.4 Build Alchemist panel (owned, missing, styling, extra cost)
- [ ] 6.5 Image lazy loading and fallback
- [ ] 6.6 Tests: each filter, combined filters, modal keyboard behaviour, alchemist budget rule
- [ ] 6.7 Checkpoint

## Phase 7: Grimoire and Local Storage (R10, AC13, AC14)
- [ ] 7.1 Build GrimoireContext (versioned storage)
- [ ] 7.2 Wire Save buttons everywhere with a consistent state
- [ ] 7.3 Build GrimoireView, SavedCostumeCard, empty state
- [ ] 7.4 Show saved identity and a link back to recommendations
- [ ] 7.5 Handle blocked storage, bad data, unknown ids
- [ ] 7.6 Tests: save, remove, persist, corrupt data, blocked storage
- [ ] 7.7 Checkpoint

## Phase 8: Signature features (R12 to R14). Start only when Phases 2 to 7 pass.
Drop order if time runs short: 8.B, then 8.A, keep 8.C.
- [ ] 8.A Shareable identity card (R12)
  - [ ] 8.A.1 Canvas drawing function and font readiness wait
  - [ ] 8.A.2 ShareCardButton with Download, Share (when supported) and error state
  - [ ] 8.A.3 Tests: card builder returns a PNG blob (mocked canvas), error path shows message
- [ ] 8.B Costume Séance Mode (R13)
  - [ ] 8.B.1 `useStageTimeline` hook and skip logic
  - [ ] 8.B.2 SeanceAwakening stages (max 15 s), toggle on Discover and Awakening pages
  - [ ] 8.B.3 `useSound` with Web Audio, opt-in only, moderate volume
  - [ ] 8.B.4 Reduced-motion fallback
  - [ ] 8.B.5 Tests: off by default, Skip works at each stage, result identical with and without séance, sound never starts without opt-in
- [ ] 8.C Kiro Showcase (R14)
  - [ ] 8.C.1 `data/showcase.ts` with real file paths, phase timeline, requirement-to-test table
  - [ ] 8.C.2 KiroShowcase page, footer and About links
  - [ ] 8.C.3 Test: every listed file and test path exists
- [ ] 8.D Checkpoint

## Phase 9: Test, fix and optimise (N1 to N8, AC15 to AC17)
- [ ] 9.1 Write `docs/TEST_CHECKLIST.md`
- [ ] 9.2 Add Playwright end-to-end journey (mobile and desktop)
- [ ] 9.3 Accessibility pass: contrast, keyboard, labels, reduced motion
- [ ] 9.4 Responsive pass at 320, 375, 768, 1280
- [ ] 9.5 Performance pass: bundle size, image sizes, Lighthouse lite and full measured separately, real-device frame rate
- [ ] 9.6 Fix all defects found
- [ ] 9.7 Checkpoint

## Phase 10: Deployment and submission
- [ ] 10.1 README: problem, solution, features, setup, stack, screenshots
- [ ] 10.2 About page content and credits
- [ ] 10.3 Add open-source licence (MIT unless you choose another)
- [ ] 10.4 Confirm `.kiro` is committed and not ignored
- [ ] 10.5 Deploy the final build to GitHub Pages (preview already running since 2R.3) and test the live URL
- [ ] 10.6 Demo video script and checklist
- [ ] 10.7 Re-check the official Kiroween 2026 rules and deadline before submitting
