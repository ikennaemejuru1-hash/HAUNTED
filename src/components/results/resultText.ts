import { IDENTITIES } from '../../data/identities'
import type { RecommendationResult } from '../../types/engine'

// Plain text for "Copy my result" (R7.3). It names no social network and posts nothing.
export function resultText(result: RecommendationResult): string {
  const { identity, recommendations } = result
  const lines = [
    `My HAUNTED identity: ${identity.name}`,
    IDENTITIES[identity.primary].tagline,
    '',
    'My costume picks:',
    ...recommendations.map((r, i) => `${i + 1}. ${r.costume.name}`),
  ]
  return lines.join('\n')
}
