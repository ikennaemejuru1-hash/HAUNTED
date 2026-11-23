// The one place that knows where images live (steering rule: image paths come only from here).
// `null` means "the owner has not generated this yet", so the site draws a procedural stand-in.
// To swap in real art later, put the file in public/assets/ and set the path here. No other code changes.
export interface AssetManifest {
  posterDesktop: string | null
  posterMobile: string | null
  hallBackplate: string | null
  doorwayBackplate: string | null
  portraits: Record<'velvet-enigma' | 'arcane-wanderer' | 'crimson-phantom' | 'neon-revenant', string | null>
  socialPreview: string | null
  costumes: Record<string, string | null>
}

export const assets: AssetManifest = {
  posterDesktop: null, // A1 in docs/ASSET_BRIEF.md
  posterMobile: null, // A2
  hallBackplate: null, // A3
  doorwayBackplate: null, // B5
  portraits: {
    'velvet-enigma': null, // B1
    'arcane-wanderer': null, // B2
    'crimson-phantom': null, // B3
    'neon-revenant': null, // B4
  },
  socialPreview: null, // D1
  costumes: {
    'velvet-champagne-spectre': null,
    'velvet-salon-host': null,
    'velvet-gilded-widow': null,
    'velvet-mirror-muse': null,
    'velvet-masquerade-courtier': null,
    'velvet-opera-ghost': null,
    'arcane-lantern-wanderer': null,
    'arcane-hedge-scholar': null,
    'arcane-rune-keeper': null,
    'arcane-forest-oracle': null,
    'arcane-spellbinder-cloak': null,
    'arcane-grimoire-archivist': null,
    'crimson-candle-ghost': null,
    'crimson-torn-lace-bride': null,
    'crimson-chapel-phantom': null,
    'crimson-half-mask-duelist': null,
    'crimson-weeping-saint': null,
    'crimson-thorn-queen': null,
    'neon-static-ghost': null,
    'neon-glow-revenant': null,
    'neon-circuit-wraith': null,
    'neon-ember-android': null,
    'neon-cyber-lantern': null,
    'neon-chrome-reaper': null,
  },
}
