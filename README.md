# HAUNTED

**Discover the costume your alter ego would wear.**

HAUNTED is an interactive Halloween costume discovery app, designed for the Kiroween 2026 Costume Contest.

> **Status: planning complete, implementation not started.**
> This repository currently contains the product specification, architecture, design system, steering documents and task plan. There is no application code yet, and nothing in this repository can be run.

## The idea

Choosing a Halloween costume is hard when you also have a budget, limited time and only the clothes you already own. HAUNTED asks 12 short questions about your style, budget, time, comfort and wardrobe. It then creates a personal Halloween identity and recommends up to three costumes you can realistically make.

The identities are creative styling profiles. They do not measure real personality.

## Planned features

**Core (built first)**
- Cinematic landing page and a 12-question quiz in four sections, with progress, validation, back navigation and a currency selector (NGN, USD, GBP).
- A deterministic recommendation engine with four identities (The Velvet Enigma, The Arcane Wanderer, The Crimson Phantom, The Neon Revenant) and hybrid identities such as "Velvet Phantom". It works with no external AI service.
- Budget, time, comfort and wardrobe filtering, with a plain-language reason for every recommendation.
- Awakening reveal animation with a Skip button.
- Costume Atelier (browse and filter), Wardrobe Alchemist (costumes made from clothes you own) and Grimoire (saved favourites kept in browser Local Storage, no account needed).
- Responsive, mobile-first, keyboard accessible, with reduced-motion support.

**Signature features (built after the core works)**
- Downloadable identity card (PNG), drawn in the browser.
- Costume Séance Mode: an optional, longer cinematic reveal with opt-in sound.
- Kiro Showcase page describing how the project was built with Kiro.

## Planned technology

React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, React Router, Vitest and React Testing Library. Data is stored in the browser with Local Storage. There is no backend.

## Built with Kiro

This project follows spec-driven development. The `.kiro` folder is part of the repository:

| Path | Contents |
|---|---|
| [`.kiro/specs/haunted/requirements.md`](.kiro/specs/haunted/requirements.md) | Requirements, acceptance criteria, test plan, risks |
| [`.kiro/specs/haunted/design.md`](.kiro/specs/haunted/design.md) | Architecture, data model, engine algorithm, design system |
| [`.kiro/specs/haunted/tasks.md`](.kiro/specs/haunted/tasks.md) | Phased implementation plan |
| [`.kiro/steering/`](.kiro/steering) | Product, technical and design rules Kiro follows |
| [`.kiro/hooks/`](.kiro/hooks) | Automation that runs unit tests when source files are saved |

## Roadmap

| Phase | Work | Status |
|---|---|---|
| 1 | Plan and design | Done |
| 2 | Foundation, landing page, navigation | Not started |
| 3 | Interactive quiz | Not started |
| 4 | Recommendation engine | Not started |
| 5 | Awakening and results | Not started |
| 6 | Atelier and Wardrobe Alchemist | Not started |
| 7 | Grimoire and Local Storage | Not started |
| 8 | Signature features | Not started |
| 9 | Test, fix and optimise | Not started |
| 10 | Deployment and submission | Not started |

## Licence

Released under the [MIT License](LICENSE).
