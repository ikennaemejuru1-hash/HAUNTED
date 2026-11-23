import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { IDENTITIES } from '../../data/identities'
import type { Costume } from '../../types/engine'
import type { Currency } from '../../types/quiz'
import { SaveButton } from '../grimoire/SaveButton'
import { Badge, Button } from '../ui'
import { costRange } from './costRange'
import { CostumeImage } from './CostumeImage'

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
const PLAY: Record<string, string> = { solo: 'Solo', couple: 'Couple', group: 'Group' }

// Accessible dialog (R8.4): Escape, the close button and a click outside all close it; Tab stays inside;
// focus returns to the button that opened it.
export function CostumeDetailModal({ costume: c, opener, currency, onClose }: { costume: Costume; opener: HTMLElement; currency: Currency; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    return () => {
      document.body.style.overflow = overflow
      opener.focus()
    }
  }, [opener])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab' || !panel.current) return
    const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) return
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  const items = [...c.requiredClothing, ...c.requiredAccessories]
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-obsidian/85 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
      onKeyDown={onKeyDown}
      data-testid="modal-backdrop"
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="costume-dialog-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-md border border-gold/40 bg-charcoal p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="costume-dialog-title" className="text-2xl">{c.name}</h2>
          <Button variant="ghost" data-autofocus aria-label="Close dialog" onClick={onClose} className="px-3"><X size={20} aria-hidden="true" /></Button>
        </div>
        <Badge tone="gold" className="mt-2">{IDENTITIES[c.aesthetic].name}</Badge>
        <CostumeImage costume={c} className="mt-4" />
        <p className="mt-4">{c.description}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div><dt className="label-tech text-xs uppercase">Cost (estimate)</dt><dd>{costRange(c, currency)}</dd></div>
          <div><dt className="label-tech text-xs uppercase">Difficulty</dt><dd className="capitalize">{c.difficulty}</dd></div>
          <div><dt className="label-tech text-xs uppercase">Prep time</dt><dd>{c.prepMinutes} min</dd></div>
          <div><dt className="label-tech text-xs uppercase">Best for</dt><dd>{c.playModes.map((p) => PLAY[p]).join(', ')}</dd></div>
        </dl>
        <h3 className="mt-5 text-lg">What you need</h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{items.map((i) => <li key={i.label}>{i.label}</li>)}</ul>
        <h3 className="mt-5 text-lg">Makeup</h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{c.makeup.map((m) => <li key={m}>{m}</li>)}</ul>
        <h3 className="mt-5 text-lg">Make it yourself</h3>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">{c.diySteps.map((s) => <li key={s}>{s}</li>)}</ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <SaveButton id={c.id} name={c.name} />
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
