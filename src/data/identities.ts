import type { AestheticId } from '../types/quiz'

export interface IdentityProfile {
  id: AestheticId
  name: string // "The Velvet Enigma"
  word1: string // "Velvet"
  word2: string // "Enigma"
  tagline: string
  description: string
  palette: { name: string; hex: string }[] // approved palette tokens only
  advice: string[]
}

// Fixed order, also the last tie-break in the engine.
export const AESTHETIC_ORDER: AestheticId[] = ['velvet', 'arcane', 'crimson', 'neon']

export const IDENTITIES: Record<AestheticId, IdentityProfile> = {
  velvet: {
    id: 'velvet', name: 'The Velvet Enigma', word1: 'Velvet', word2: 'Enigma',
    tagline: 'Elegant, composed and impossible to read.',
    description: 'A creative styling profile built on quiet confidence: dark silk, gold detail and a look that never explains itself.',
    palette: [
      { name: 'Obsidian', hex: '#0A0908' }, { name: 'Antique Gold', hex: '#C5A15B' },
      { name: 'Burgundy', hex: '#641B35' }, { name: 'Warm Silver', hex: '#CFCBC6' },
    ],
    advice: ['Keep the silhouette clean and let one gold detail carry the look.', 'Choose fabric with a sheen, such as satin or velvet.', 'Move slowly. Stillness is part of the costume.'],
  },
  arcane: {
    id: 'arcane', name: 'The Arcane Wanderer', word1: 'Arcane', word2: 'Wanderer',
    tagline: 'Wise, weathered and a little unsettling.',
    description: 'A creative styling profile for the keeper of old secrets: layered cloth, worn leather and symbols that mean something to you.',
    palette: [
      { name: 'Charcoal', hex: '#1E1B1C' }, { name: 'Antique Gold', hex: '#C5A15B' },
      { name: 'Ash Grey', hex: '#8A8786' }, { name: 'Ember Orange', hex: '#E87524' },
    ],
    advice: ['Layer textures: cloth over leather over wool.', 'Age your pieces with tea staining or light sanding.', 'Carry one prop with a story, like a book or a lantern.'],
  },
  crimson: {
    id: 'crimson', name: 'The Crimson Phantom', word1: 'Crimson', word2: 'Phantom',
    tagline: 'Dramatic, restless and darkly romantic.',
    description: 'A creative styling profile for beautiful haunting: lace, deep red and edges that look a little torn by time.',
    palette: [
      { name: 'Burgundy', hex: '#641B35' }, { name: 'Obsidian', hex: '#0A0908' },
      { name: 'Warm Silver', hex: '#CFCBC6' }, { name: 'Ember Orange', hex: '#E87524' },
    ],
    advice: ['Pair one deep red piece with pale skin tones and dark eyes.', 'Distress lace and hems on purpose.', 'Half a mask says more than a full one.'],
  },
  neon: {
    id: 'neon', name: 'The Neon Revenant', word1: 'Neon', word2: 'Revenant',
    tagline: 'Bold, bright and rebuilt by the future.',
    description: 'A creative styling profile for the glowing return: sleek dark layers with ember-bright trim and a hint of circuitry.',
    palette: [
      { name: 'Obsidian', hex: '#0A0908' }, { name: 'Ember Orange', hex: '#E87524' },
      { name: 'Ash Grey', hex: '#8A8786' }, { name: 'Antique Gold', hex: '#C5A15B' },
    ],
    advice: ['Dress in black and add glow with LED strips or glow tape.', 'Keep wires and batteries hidden and safe.', 'Use metallic makeup to suggest circuitry.'],
  },
}
