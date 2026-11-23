import { budgetLabel } from '../../data/currency'
import { useQuiz } from '../../state/QuizContext'
import type { BudgetTier, Question, SingleKey, WardrobeItem } from '../../types/quiz'
import { AnswerOption } from './AnswerOption'
import { CurrencySelect } from './CurrencySelect'
import { MultiSelectGrid } from './MultiSelectGrid'

export function QuestionCard({ question }: { question: Question }) {
  const { answers, answer, toggleItem, setCurrency } = useQuiz()
  const titleId = `q${question.number}-title`
  const label = (value: string, text: string) =>
    question.currencyAware ? budgetLabel(value as BudgetTier, answers.currency) : text

  return (
    <div>
      <h2 id={titleId} className="mb-6 text-2xl sm:text-3xl">{question.prompt}</h2>
      {question.currencyAware && <CurrencySelect value={answers.currency} onChange={setCurrency} />}
      {question.kind === 'multi' ? (
        <MultiSelectGrid
          labelledBy={titleId}
          options={question.options}
          selected={answers.wardrobe}
          onToggle={(v) => toggleItem(v as WardrobeItem)}
        />
      ) : (
        <div role="radiogroup" aria-labelledby={titleId} className="grid gap-3">
          {question.options.map((o) => (
            <AnswerOption
              key={o.value}
              role="radio"
              label={label(o.value, o.label)}
              hint={o.hint}
              selected={answers[question.key as SingleKey] === o.value}
              onSelect={() => answer(question.key as SingleKey, o.value)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
