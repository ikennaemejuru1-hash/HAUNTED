# HAUNTED: Design System Steering

## Palette (use these tokens, never raw hex in components)
No purple, violet or blue anywhere.
- obsidian #0A0908: main background, dominant
- charcoal #1E1B1C: panels and depth
- burgundy #641B35: horror details, hover surfaces (text on it is silver)
- gold #C5A15B: primary accent. Headings, borders, focus rings, primary buttons
- ember #E87524: selective highlights, glows, selected and active states. Never large fills, never text on burgundy
- ash #8A8786: labels, glass edges, secondary text
- silver #CFCBC6: body text

## Fonts
- Cinzel: headings and identity names
- Inter: body text
- Space Grotesk: labels, progress, badges, filters (uppercase, letter-spaced)

## One cohesive look
- Gothic luxury gives structure: serif headings, gold hairlines, gothic architecture in the 3D world.
- Haunted fantasy gives atmosphere: layered animated fog, drifting motes, rising embers, candlelight.
- Horror cinema gives mood: vignette, burgundy shadow, light from behind and above, a scroll-driven camera.
- Futuristic Halloween gives the interface: glass panels, thin ash-grey edges, technical labels, ember circuitry on the lantern.

## The immersive layer (The Threshold, R15)
- The 3D world is decorative and `aria-hidden`. Every piece of text, navigation and every control is HTML above it.
- Depth order: far fog, architecture, near fog, particles, then HTML. Nothing decorative renders above text.
- Text over the scene gets a local obsidian scrim so contrast stays AA or better on real frames.
- Black dominates. Light comes from gold and ember sources in the scene. One dominant glow colour per screen region.
- Scene colours come only from `src/three/palette.ts` (built from the tokens). No purple or blue light, fog, material or post effect.
- Avoid heavy neon. Bloom is selective (embers, flames, windows) and gentle.
- AI-generated art follows `docs/ASSET_BRIEF.md` and must pass the colour scan before use.

## Interaction and motion
- Tap targets at least 44px. Focus ring 2px gold with offset on every interactive element.
- Interface transitions (Framer Motion): 150 to 400 ms.
- Cinematic sequences (GSAP): doorway push under 1 s, Awakening 8 to 10 s, Séance Mode up to 15 s. All skippable.
- Ambient motion (fog, embers, candles) is slow and continuous. Nothing flashes more than 3 times per second.
- Keyboard focus on an identity triggers the same artefact response as hover.
- Respect `prefers-reduced-motion`: no scroll camera, no drift, no particles, fades only.
- Design for 320px first, then scale up. Mobile gets the balanced or lite tier, never a broken full tier.
