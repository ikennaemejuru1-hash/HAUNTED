// role="status" makes screen readers announce the message politely.
export function LoadingState({ label = 'Summoning the page...' }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
      />
      <p className="label-tech">{label}</p>
    </div>
  )
}
