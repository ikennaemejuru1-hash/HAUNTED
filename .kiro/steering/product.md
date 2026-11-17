# HAUNTED: Product Steering

HAUNTED is a Halloween costume discovery app for the Kiroween 2026 Costume Contest.
Tagline: "Discover the costume your alter ego would wear."

## Rules for all work
- The owner is a beginner. After each phase, explain what was built in plain language and wait for approval.
- The spec in `.kiro/specs/haunted/` is the source of truth. Update the spec when decisions change.
- Identities are creative styling profiles. Never claim to measure real personality.
- No fake features. Every visible control must work. No AI claims: the engine is deterministic and local.
- Q1 to Q6 decide identity. Q7 to Q12 only filter and rank costumes.
- Costs are estimates, always labelled, stored in USD, shown in the user's chosen currency.
- Content must be original and not graphic. No copyrighted characters.
- Collect no personal data. No analytics. No external requests with user data.
- The `.kiro` directory must stay in the repository and must never be gitignored.

## Priority guard
- Core MVP (landing, quiz, engine, results, Atelier, Alchemist, Grimoire, responsive) always comes before signature features (share card, Séance Mode, Kiro Showcase).
- Signature features start only after the core phases pass their tests, and they must never slow or break the core flows.
- Séance Mode and sound are opt-in. Sound is never on by default.
- Kiro Showcase content must be true and link to real files.

## Fixed copy
- Hero heading: YOUR ALTER EGO IS WAITING.
- Hero support: Discover the Halloween look that matches your personality, aesthetic and imagination.
- Primary CTA: DISCOVER YOUR DARK SIDE.
- Awakening: YOUR IDENTITY IS TAKING SHAPE... then YOUR HALLOWEEN ALTER EGO HAS AWAKENED.
- Results buttons: EXPLORE MY COSTUMES, SAVE TO MY GRIMOIRE, RETAKE THE QUIZ.
