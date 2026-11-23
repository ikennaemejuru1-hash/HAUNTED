import type { ReactNode } from 'react'
import { GlassPanel } from './GlassPanel'

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
}

// Shown when there is nothing to display yet. Always explains why and offers a next step.
export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <GlassPanel className="mx-auto flex max-w-xl flex-col items-center gap-4 p-8 text-center">
      {icon && (
        <div className="text-gold" aria-hidden="true">
          {icon}
        </div>
      )}
      <h2 className="text-2xl">{title}</h2>
      <p>{description}</p>
      {action}
    </GlassPanel>
  )
}
