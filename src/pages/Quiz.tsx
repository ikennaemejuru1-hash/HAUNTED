import { QuizShell } from '../components/quiz/QuizShell'
import { QuizProvider } from '../state/QuizContext'

// The 12-question quiz (R3). Progress is saved in Local Storage.
export default function Quiz() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="sr-only">The HAUNTED quiz</h1>
      <QuizProvider>
        <QuizShell />
      </QuizProvider>
    </div>
  )
}
