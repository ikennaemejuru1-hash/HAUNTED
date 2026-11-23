// Four simple gold line sigils, one per identity. Decorative: the name is always written beside them.
const paths: Record<string, string> = {
  mirror: 'M16 3c6 0 9 6 9 13s-3 13-9 13S7 23 7 16 10 3 16 3Zm0 5c-3 0-4.5 3.5-4.5 8s1.5 8 4.5 8',
  grimoire: 'M6 6h13a3 3 0 0 1 3 3v17H9a3 3 0 0 1-3-3V6Zm4 5h8m-8 5h8M25 8l2 3-2 3-2-3 2-3Z',
  mask: 'M5 8c7-4 15-4 22 0 0 9-3 18-11 20C8 26 5 17 5 8Zm4 6 4 2m10-2-4 2m-6 8h4',
  lantern: 'M12 5h8m-9 3h10l2 15H9L11 8Zm5 5v7m-3-3h6M12 26h8',
}

export function Sigil({ name, className }: { name: keyof typeof paths; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={paths[name]} />
    </svg>
  )
}
