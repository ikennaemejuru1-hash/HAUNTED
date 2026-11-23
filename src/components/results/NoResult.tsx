import { Button, EmptyState } from '../ui'

// R7.4: no finished quiz means no result, so lead the visitor to the quiz.
export function NoResult() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <EmptyState
        title="No result yet"
        description="Finish the 12 questions and your Halloween identity will appear here."
        action={<Button to="/quiz">Take the quiz</Button>}
      />
    </div>
  )
}
