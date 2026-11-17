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
- Gothic luxury gives structure: serif headings, gold hairlines, spacing.
- Haunted fantasy gives atmosphere: slow fog, drifting motes.
- Horror cinema gives mood: vignette, burgundy shadow, top light.
- Futuristic Halloween gives the interface: glass panels, thin ash-grey edges, technical labels.
- Black dominates. One glow colour per region. At most one decorative effect per viewport.
- Avoid heavy neon. Decorative effects never sit above text.

## Interaction
- Tap targets at least 44px. Focus ring 2px gold with offset on every interactive element.
- Animations 150 to 400 ms. The awakening is the only long one (max 6 s, skippable).
- Respect `prefers-reduced-motion`. Nothing flashes.
- Design for 320px first, then scale up.
