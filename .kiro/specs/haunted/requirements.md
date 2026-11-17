# HAUNTED: Requirements Specification

Tagline: "Discover the costume your alter ego would wear."
Event: Kiroween 2026 Costume Contest.

## 0. Decisions that resolve conflicts in the brief

The brief and the attached PDF blueprint disagree in a few places. These decisions apply until the owner changes them.

| Topic | Brief | PDF blueprint | Decision |
|---|---|---|---|
| Colour palette | Obsidian, Midnight Purple, Royal Violet, Gold, Burgundy, Silver, Phantom Blue | Burgundy, Gold, Charcoal, Warm Grey, Burnt Orange | **Changed by the owner.** Use the PDF direction with no purple, violet or blue: Obsidian `#0A0908`, Charcoal `#1E1B1C`, Burgundy `#641B35`, Antique Gold `#C5A15B` (primary accent), Ember Orange `#E87524` (selective highlights, glows, selected and active states), Ash Grey `#8A8786`, Warm Silver `#CFCBC6`. |
| Futuristic font | Space Grotesk | Orbitron on page 1, Space Grotesk on page 6 | Space Grotesk. |
| Default currency | NGN, USD, GBP selector | NGN examples | Quiz budget tiers are stored in USD. The selector converts for display using fixed, clearly labelled approximate rates in one config file. |
| Images | AI-generated asset family | Pre-generated visuals | Kiro cannot generate photos. Phase 2 ships original SVG/CSS artwork as placeholders. Real AI images can be dropped into `public/assets/` later with no code change. |
| Quiz inputs | Q10 multi-select | Same | Q10 is multi-select. "Start from scratch" clears all other Q10 choices. |

## 1. Scope

Must have: landing page, 12-question quiz, scoring engine, awakening reveal, results with up to 3 recommendations, costume visuals, responsive layout, Grimoire (saved costumes).
Should have: Atelier with filters, Wardrobe Alchemist, budget filtering, DIY steps, copyable result summary.
Out of scope for v1: accounts, backend, database, external AI API, social publishing.

## 2. Requirements (EARS style)

Each requirement has an ID that tasks and tests refer to.

### R1 Navigation and layout
- R1.1 The app shall provide persistent navigation to Home, Discover, Atelier, Grimoire and About.
- R1.2 On screens narrower than 768px, the navigation shall collapse into a menu button that opens a keyboard-accessible panel.
- R1.3 Every button and link shall perform an action. No placeholder controls.
- R1.4 Unknown URLs shall show a friendly "lost in the mist" page with a link home.

### R2 Landing page
- R2.1 The hero shall show the heading "YOUR ALTER EGO IS WAITING.", the supporting line and the primary button "DISCOVER YOUR DARK SIDE".
- R2.2 Secondary links "How It Works", "Explore Styles" and "About HAUNTED" shall scroll to a section or open the matching page.
- R2.3 The hero shall have an animated fog or particle layer that sits behind all text and is switched off under reduced motion.
- R2.4 The Discovery Introduction shall explain the quiz (12 questions, 4 sections, about 3 minutes) and offer a Start button.

### R3 Quiz
- R3.1 The quiz shall contain exactly the 12 questions in the brief, in four sections A to D.
- R3.2 One question shall appear per screen with a progress indicator (for example "4 of 12", plus the section name).
- R3.3 Single-choice questions shall accept exactly one answer. Q10 shall accept several. Q10 "Start from scratch" shall be exclusive.
- R3.4 Next shall be disabled, with a visible reason, until the current question has a valid answer.
- R3.5 Previous shall return to the earlier question with the earlier answer still selected. Changing an answer shall be allowed at any time before submission.
- R3.6 Q7 shall include a currency selector (NGN, USD, GBP). The tier labels shall change with the currency. The stored answer shall be the tier, not the currency amount.
- R3.7 Quiz progress shall be saved to Local Storage so a page refresh does not lose it. Corrupted saved data shall be discarded without crashing.
- R3.8 The last question's button shall read "Awaken" and submit the quiz.
- R3.9 Selecting an answer shall play a short animation, which is disabled under reduced motion.

### R4 Recommendation engine
- R4.1 The engine shall be a pure, deterministic TypeScript function with no randomness, no network access and no browser APIs.
- R4.2 Q1 to Q6 shall each award 3 points to the aesthetic that matches the chosen option (A = Velvet Enigma, B = Arcane Wanderer, C = Crimson Phantom, D = Neon Revenant). The maximum for one aesthetic is 18.
- R4.3 The primary aesthetic shall be the highest score. Ties shall be broken by Q5 first, then Q1, then Q4, then fixed order (Velvet, Arcane, Crimson, Neon).
- R4.4 The secondary aesthetic shall be the second-highest score, using the same tie-break rules.
- R4.5 A hybrid identity shall be created when primary minus secondary is 3 points or less and the secondary score is at least 6. Otherwise the identity is the pure primary one.
- R4.6 A hybrid name shall be the first word of the lead identity plus the second word of the secondary identity. For example Velvet + Crimson gives "Velvet Phantom", Arcane + Velvet gives "Arcane Enigma", Crimson + Arcane gives "Crimson Wanderer" and Neon + Crimson gives "Neon Phantom".
- R4.7 Q7 to Q12 shall never change the identity. They shall only filter and rank costumes.
- R4.8 Hard filters: a costume is excluded if its minimum cost exceeds the budget tier ceiling, or its prep time exceeds the time tier ceiling. If a wardrobe is restrictive (Q10 "scratch" or no matching items), the engine shall still prefer the cheapest, quickest costumes in the identity's aesthetic.
- R4.9 Soft ranking (highest weight first): aesthetic match to primary, then secondary; wardrobe coverage (share of required items already owned); comfort fit against costume difficulty; event and group-size fit.
- R4.10 The engine shall return up to 3 recommendations. If fewer than 3 pass the filters, it shall relax filters in a documented order (group size, then event, then comfort) and mark the result "closest match". It shall never relax budget or time.
- R4.11 Each recommendation shall include human-readable reasons that cite the user's actual answers, for example "Fits your under-$20 budget" or "You already own 3 of 4 required items".
- R4.12 If nothing passes budget and time, the result shall explain why and suggest the cheapest options in the user's aesthetic that exceed the limit by the least, labelled as stretch options.
- R4.13 Results copy shall describe identities as creative styling profiles. It shall not claim to measure real personality.

### R5 Costume dataset
- R5.1 Each entry shall have: unique id, name, aesthetic, description, required clothing, required accessories, makeup suggestions, estimated cost range (USD), prep time in minutes, difficulty, DIY steps and image reference.
- R5.2 The dataset shall also carry the tags the engine needs: event suitability, play mode (solo, couple, group), and the wardrobe categories each required item maps to.
- R5.3 The dataset shall contain at least 5 costumes per aesthetic (20 or more in total), covering all budget tiers, all time tiers and all play modes.
- R5.4 A test shall validate every entry (unique ids, valid enums, non-empty fields, existing image).
- R5.5 The costume dataset shall be a data file. Editing it shall need no change to engine code.
- R5.6 Cost figures shall be shown as "estimates".

### R6 Awakening
- R6.1 After submit the app shall show "YOUR IDENTITY IS TAKING SHAPE..." with animated particles for no more than 6 seconds.
- R6.2 It shall then reveal "YOUR HALLOWEEN ALTER EGO HAS AWAKENED." and the identity card.
- R6.3 A visible Skip button shall jump straight to the results at any time. It shall be reachable by keyboard.
- R6.4 Sound shall be off by default. It shall play only after the user turns on a sound toggle. The setting shall be remembered.
- R6.5 With reduced motion on, the sequence shall be replaced by a short fade.

### R7 Results page
- R7.1 It shall show identity name, description, primary aesthetic, secondary aesthetic, 3 recommendations with reasons, colour palette, budget information and styling advice.
- R7.2 It shall have the buttons EXPLORE MY COSTUMES (opens the Atelier pre-filtered to the identity), SAVE TO MY GRIMOIRE (saves the identity and results) and RETAKE THE QUIZ (asks for confirmation, then clears answers).
- R7.3 It shall offer "Copy my result" as plain text. It shall not imply any social posting.
- R7.4 Opening the results page with no quiz result shall show an empty state that leads to the quiz.

### R8 Costume Atelier
- R8.1 The Atelier shall show premium cards with image, name, short description, estimated cost, difficulty, prep time, View Details and Save.
- R8.2 Filters shall cover aesthetic, budget, difficulty, prep time and solo, couple or group. Filters shall combine (AND). A Clear filters button shall reset them.
- R8.3 When no costume matches, an empty state shall explain this and offer Clear filters.
- R8.4 View Details shall open an accessible dialog with full costume data and DIY steps. It shall close with Escape, with a close button and by clicking outside. Focus shall return to the button that opened it.
- R8.5 Images shall lazy-load and fall back to a styled placeholder if missing.

### R9 Wardrobe Alchemist
- R9.1 Using Q10, the Alchemist shall list costumes buildable mostly from items the user owns.
- R9.2 Each card shall show: items already owned, additional items needed, styling suggestions and estimated additional cost.
- R9.3 It shall never list costumes whose additional cost exceeds the user's budget.
- R9.4 If the user chose "Start from scratch" or has no quiz result, it shall say so and show the cheapest complete looks.

### R10 Grimoire
- R10.1 Users shall be able to save and remove costumes from the Atelier, the results page and the detail dialog. The save control shall show the current state.
- R10.2 Saved costumes, the saved identity and the latest quiz answers shall persist across refreshes in Local Storage.
- R10.3 The Grimoire shall show the identity, saved costumes (with remove) and a link back to the recommendations.
- R10.4 An empty Grimoire shall show an empty state with a link to the Atelier.
- R10.5 Malformed or outdated stored data shall be ignored safely. If Local Storage is blocked, the app shall keep working in memory and show a gentle notice.
- R10.6 Stored data shall carry a version number so it can be migrated later.

### R11 About
- R11.1 The page shall explain the concept, the tech stack, how the engine works in plain language, the "creative styling profile, not psychology" note, credits and the repository link.

### R12 Shareable identity card (signature feature, built after the core MVP)
- R12.1 On the Results page the user shall be able to download their identity as a PNG image (portrait 1080x1350).
- R12.2 The card shall show identity name, primary and secondary aesthetic, palette, up to three costume names and the HAUNTED tagline. It shall not show personal data.
- R12.3 The image shall be drawn in the browser with the Canvas API. No server, no upload, no third-party image service.
- R12.4 Where the browser supports file sharing, a Share button shall open the system share sheet with the image. Otherwise only Download is offered. The app shall never claim to post to social media.
- R12.5 If the card cannot be created (for example a font fails to load), the user shall see a clear error and the rest of the results shall be unaffected.

### R13 Costume Séance Mode (signature feature, built after the core MVP)
- R13.1 Séance Mode shall be an optional, opt-in version of the Awakening. The standard Awakening (R6) remains the default.
- R13.2 The user shall switch it on with a labelled toggle before the Awakening starts. It shall be off by default.
- R13.3 It shall run as a staged ritual (candle ignites, sigil draws, the four identities flicker, one is chosen, the identity card rises) lasting at most 15 seconds.
- R13.4 Skip shall be visible and keyboard reachable at every moment.
- R13.5 Sound shall stay off unless the user enables sound separately. Sounds shall be generated with the Web Audio API, so there are no audio files or licence issues. Volume shall be moderate and there shall be no sudden loud sounds.
- R13.6 Under reduced motion, Séance Mode shall use the short fade from R6.5.
- R13.7 Séance Mode shall not change the engine result in any way. It is presentation only.

### R14 Kiro Showcase page (signature feature, built after the core MVP)
- R14.1 A `/kiro` page shall explain how the project was built with Kiro: the spec files, steering files, the hook, and the phase-by-phase workflow.
- R14.2 Content shall be true and traceable. It shall link to the real files in the public repository and shall not state features or results that do not exist.
- R14.3 It shall include a readable summary of requirements to tasks to tests (for example, which tests cover which requirement IDs).
- R14.4 Navigation shall link to it from the footer and About page, not as a main nav item, so the product experience stays first.

## 3. Priority and scope guard

The core MVP (R1 to R11) has priority over R12 to R14. Rules:
- Work on R12 to R14 shall not start until Phases 2 to 7 pass their tests.
- If time is short, R12 to R14 shall be dropped in the order R13, R12, R14. R14 is cheapest and judge-visible, so it is kept longest.
- None of R12 to R14 may slow the quiz, engine or main flows. Their code is lazy-loaded.

## 4. Non-functional requirements

- N1 Accessibility: WCAG 2.2 AA contrast for text, visible focus rings, semantic landmarks, labelled controls, radio and checkbox semantics for answers, `aria-live` for progress, alt text for meaningful images, `aria-hidden` for decorative ones.
- N2 Reduced motion: honour `prefers-reduced-motion` for every animation, including the fog layer.
- N3 No flashing effects (nothing flashes more than 3 times per second).
- N4 Performance: Lighthouse performance 90 or more on mobile for the landing page; images in WebP or SVG; each catalogue image under 150 KB; route-level code splitting.
- N5 Mobile first: usable at 320px wide, tap targets at least 44px, no horizontal scrolling.
- N6 Privacy: no personal data collected, no analytics, no network requests with user data.
- N7 Browsers: current Chrome, Safari, Firefox and Edge.
- N8 Maintainability: strict TypeScript, no `any`, engine and data covered by unit tests.

## 5. Acceptance criteria (summary)

| ID | Given / When / Then |
|---|---|
| AC1 | Given a fresh visit, when the user clicks DISCOVER YOUR DARK SIDE, then the Discovery Introduction appears, and Start opens question 1 of 12. |
| AC2 | Given an unanswered question, then Next is disabled and says why. After answering it is enabled. |
| AC3 | Given Q10, when "Start from scratch" is chosen, then other choices clear. When another item is chosen, then "scratch" clears. |
| AC4 | Given answers A on Q1 to Q6, then the identity is The Velvet Enigma with score 18. |
| AC5 | Given Q1 to Q6 scoring Velvet 9, Crimson 9, then the result is a hybrid (Velvet Phantom), decided by the tie-break rules. |
| AC6 | Given Q1 to Q6 scoring Velvet 12, Arcane 6, then the identity is not a hybrid. |
| AC7 | Given the same answers twice, then the engine returns identical results. |
| AC8 | Given a budget of under $20, then no recommendation has a minimum cost above $20. |
| AC9 | Given a 30-minute time limit, then no recommendation needs more than 30 minutes. |
| AC10 | Given Q10 includes black clothing, boots and jewellery, then recommendations with those required items rank above equal costumes without them. |
| AC11 | Given a user changes only Q7 to Q12, then the primary and secondary aesthetics stay the same. |
| AC12 | Given the quiz is submitted, then the awakening plays, Skip works, and results appear with 3 reasons-backed recommendations. |
| AC13 | Given the user saves a costume and refreshes, then it is still in the Grimoire. Removing it removes it after refresh. |
| AC14 | Given malformed JSON in Local Storage, then the app loads normally with an empty state. |
| AC15 | Given reduced motion is on, then no looping or large movement animations run. |
| AC16 | Given a keyboard only, then the whole journey from Home to Grimoire can be completed with visible focus. |
| AC17 | Given a 320px wide screen, then there is no horizontal scroll and all controls remain usable. |
| AC18 | Given Atelier filters match nothing, then an empty state with Clear filters appears. |

## 6. Test plan

| Level | Tool | What it covers |
|---|---|---|
| Unit | Vitest | Scoring, tie-breaks, hybrid naming, filters, ranking, reasons, budget and currency conversion, storage helpers, dataset validation. |
| Component | Vitest + React Testing Library | Quiz validation, multi-select exclusivity, Previous/Next, filter panel, Grimoire save/remove, modal focus handling. |
| End to end (Phase 8) | Playwright | Full journey on a mobile and a desktop viewport, refresh persistence. |
| Accessibility (Phase 8) | axe checks + manual keyboard pass | Contrast, labels, focus order, reduced motion. |
| Manual checklist | Written in `docs/TEST_CHECKLIST.md` (Phase 8) | Real device sizes: 320, 375, 768, 1280. |

## 7. Technical risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Too much visual effect hurts readability and speed | Medium | High | Effects sit on a separate decorative layer behind content. Contrast checks. Reduced motion support. Lightweight CSS and canvas-free particles first. |
| Engine gives poor or empty results for restrictive answers | Medium | High | Documented relaxation order (R4.10), stretch options (R4.12), a test matrix of answer combinations. |
| No real AI images available in this environment | High | Medium | Original SVG/CSS art as placeholders. Image paths come from data, so images can be swapped later. |
| Cost estimates look wrong in a local currency | Medium | Medium | Costs stored in USD, labelled estimates, fixed rates in one config file, checked before submission. |
| Local Storage blocked or corrupted | Low | Medium | Safe read/write wrapper with try/catch, schema version, in-memory fallback. |
| Scope creep before submission | High | High | Phases with approval gates. Must-have items first. |
| Hosting needs a base path (GitHub Pages) | Medium | Medium | Use hash routing or a configured base path. Decided in Phase 9. |
| Beginner finds code hard to follow | High | Medium | Small files, plain-language comments, an explanation after each phase. |
