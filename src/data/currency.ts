import type { BudgetTier, Currency } from '../types/quiz'

// Approximate fixed rates (units of currency per 1 USD). Estimates only, never live prices.
export const RATES: Record<Currency, number> = { USD: 1, NGN: 1500, GBP: 0.79 }
const SYMBOL: Record<Currency, string> = { USD: '$', NGN: '₦', GBP: '£' }
// Rounding step so the labels read as friendly numbers.
const STEP: Record<Currency, number> = { USD: 1, NGN: 5000, GBP: 5 }

export const CURRENCIES: Currency[] = ['NGN', 'USD', 'GBP']

export function formatAmount(usd: number, currency: Currency): string {
  const raw = usd * RATES[currency]
  const value = Math.round(raw / STEP[currency]) * STEP[currency]
  return `${SYMBOL[currency]}${value.toLocaleString('en-US')}`
}

// The stored answer is the tier id. Only the label changes with the currency.
export function budgetLabel(tier: BudgetTier, currency: Currency): string {
  const f = (usd: number) => formatAmount(usd, currency)
  switch (tier) {
    case 'lt20': return `Under ${f(20)}`
    case '20to50': return `${f(20)} to ${f(50)}`
    case '50to100': return `${f(50)} to ${f(100)}`
    case 'gt100': return `Over ${f(100)}`
  }
}
