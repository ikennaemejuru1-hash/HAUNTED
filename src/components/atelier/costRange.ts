import { formatAmount } from '../../data/currency'
import type { Costume } from '../../types/engine'
import type { Currency } from '../../types/quiz'

export const costRange = (c: Costume, currency: Currency) => `${formatAmount(c.costUsd.min, currency)} to ${formatAmount(c.costUsd.max, currency)}`
