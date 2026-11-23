import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { QUESTIONS } from '../../data/questions'
import { useQuiz } from '../../state/quizContextValue'
import { TOTAL } from '../../state/quizLogic'
import { Button, GlassPanel } from '../ui'
import { ProgressBar } from './ProgressBar'
import { QuestionCard } from './QuestionCard'

// Where Awaken sends the user. The Awakening page is built in the next feature.
export const AWAKENING_PATH = '/awakening'

export function QuizShell() {
  const { step, canNext, isComplete, next, prev } = useQuiz()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const question = QUESTIONS[step]
  const last = step === TOTAL - 1

  const onNext = () => {
    if (!last) next()
    else if (isComplete) navigate(AWAKENING_PATH)
  }

  return (
    <GlassPanel className="bg-obsidian/80 p-5 sm:p-8">
      <ProgressBar current={step + 1} total={TOTAL} section={question.section} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
        >
          <QuestionCard question={question} />
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={prev} disabled={step === 0}>Previous</Button>
        <div className="flex flex-col items-end gap-1">
          <Button onClick={onNext} disabled={!canNext || (last && !isComplete)} aria-describedby="next-reason">
            {last ? 'Awaken' : 'Next'}
          </Button>
        </div>
      </div>
      <p id="next-reason" role="status" className="mt-3 min-h-5 text-right text-sm text-ash">
        {canNext
          ? last && !isComplete ? 'Go back and answer every question to awaken.' : ''
          : question.kind === 'multi' ? 'Choose at least one option to continue.' : 'Choose an answer to continue.'}
      </p>
    </GlassPanel>
  )
}
