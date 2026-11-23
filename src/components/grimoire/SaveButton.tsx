import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useGrimoire } from '../../state/grimoireContextValue'
import { Button } from '../ui'

// The one Save control used on Results, Atelier cards, the detail dialog and the Alchemist (R10.1).
// It reads the shared Grimoire, so its state is always the same everywhere.
export function SaveButton({ id, name, className }: { id: string; name: string; className?: string }) {
  const { isSaved, toggle } = useGrimoire()
  const saved = isSaved(id)
  return (
    <Button variant="secondary" className={className} onClick={() => toggle(id)} aria-pressed={saved} aria-label={`${saved ? 'Saved' : 'Save'}: ${name}`}>
      {saved ? <BookmarkCheck size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}
      {saved ? 'Saved' : 'Save'}
    </Button>
  )
}
