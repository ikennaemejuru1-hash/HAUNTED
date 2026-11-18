import { Hourglass } from 'lucide-react'
import { Button, EmptyState } from '../components/ui'

// Honest stand-in for pages built in later phases. It is replaced, never extended.
export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="px-4 py-20">
      <EmptyState
        icon={<Hourglass size={36} />}
        title={title}
        description={`This part of HAUNTED is still being built (${phase}). Check back soon.`}
        action={<Button to="/" variant="secondary">Back to home</Button>}
      />
    </div>
  )
}
