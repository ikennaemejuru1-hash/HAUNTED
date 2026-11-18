import { Ghost } from 'lucide-react'
import { Button, EmptyState } from '../components/ui'

// R1.4: a friendly page for unknown addresses.
export default function NotFound() {
  return (
    <div className="px-4 py-20">
      <EmptyState
        icon={<Ghost size={36} />}
        title="You are lost in the mist"
        description="We could not find that page. The fog is thick tonight."
        action={<Button to="/">Return home</Button>}
      />
    </div>
  )
}
