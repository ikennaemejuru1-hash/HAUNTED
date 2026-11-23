import { TriangleAlert } from 'lucide-react'
import { Button } from './Button'
import { GlassPanel } from './GlassPanel'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

// role="alert" makes screen readers announce the problem straight away.
export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <GlassPanel role="alert" className="mx-auto flex max-w-xl flex-col items-center gap-4 border-ember/50 p-8 text-center">
      <TriangleAlert className="text-ember" aria-hidden="true" />
      <h2 className="text-2xl">{title}</h2>
      <p>{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
    </GlassPanel>
  )
}
