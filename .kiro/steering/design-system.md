# HAUNTED: Design System Steering

## Palette (use these tokens, never raw hex in components)
- obsidian #08070D: main background, dominant
- midnight #241137: panels and depth
- violet #8138C8: supernatural glow, selected states (not small text)
- gold #C5A15B: headings, borders, primary buttons
- burgundy #641B35: horror details, hover surfaces
- silver #C8C8D4: body text
- phantom #3C73D9: futuristic labels, glass edges
- ember #E87524: tiny accent for warnings and active states only

## Fonts
- Cinzel: headings and identity names
- Inter: body text
- Space Grotesk: labels, progress, badges, filters (uppercase, letter-spaced)

## One cohesive look
- Gothic luxury gives structure: serif headings, gold hairlines, spacing.
- Haunted fantasy gives atmosphere: slow fog, drifting motes.
- Horror cinema gives mood: vignette, burgundy shadow, top light.
- Futuristic Halloween gives the interface: glass panels, thin blue edges, technical labels.
- Black dominates. One glow colour per region. At most one decorative effect per viewport.
- Avoid heavy neon. Decorative effects never sit above text.

## Interaction
- Tap targets at least 44px. Focus ring 2px violet with offset on every interactive element.
- Animations 150 to 400 ms. The awakening is the only long one (max 6 s, skippable).
- Respect `prefers-reduced-motion`. Nothing flashes.
- Design for 320px first, then scale up.
