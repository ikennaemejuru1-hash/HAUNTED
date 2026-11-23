import { Ghost, Moon, Sparkles, Zap } from 'lucide-react'
import { useState } from 'react'
import { assets } from '../../data/assets'
import { IDENTITIES } from '../../data/identities'
import type { Costume } from '../../types/engine'
import type { AestheticId } from '../../types/quiz'
import { cn } from '../../utils/cn'

const ART: Record<AestheticId, { Icon: typeof Ghost; accent: string }> = {
  velvet: { Icon: Sparkles, accent: 'var(--color-gold)' },
  arcane: { Icon: Moon, accent: 'var(--color-ash)' },
  crimson: { Icon: Ghost, accent: 'var(--color-burgundy)' },
  neon: { Icon: Zap, accent: 'var(--color-ember)' },
}

// Costume picture (R8.5). It loads lazily. If the file is not set in the manifest, or fails to load,
// a palette-only placeholder is drawn instead. The placeholder holds no text that carries meaning.
export function CostumeImage({ costume, className }: { costume: Costume; className?: string }) {
  const src = assets.costumes[costume.image] ?? null
  const [failed, setFailed] = useState(false)
  const { Icon, accent } = ART[costume.aesthetic]
  if (src && !failed) {
    return <img src={src} alt={`${costume.name}, a ${IDENTITIES[costume.aesthetic].name} look`} loading="lazy" decoding="async" onError={() => setFailed(true)} className={cn('aspect-[4/3] w-full rounded-sm object-cover', className)} />
  }
  return (
    <div
      data-testid="costume-placeholder"
      aria-hidden="true"
      className={cn('flex aspect-[4/3] w-full items-center justify-center rounded-sm border border-gold/20', className)}
      style={{ background: `radial-gradient(circle at 50% 40%, color-mix(in srgb, ${accent} 55%, transparent), transparent 65%), linear-gradient(160deg, var(--color-charcoal), var(--color-obsidian))` }}
    >
      <Icon size={40} className="text-gold/80" />
    </div>
  )
}
