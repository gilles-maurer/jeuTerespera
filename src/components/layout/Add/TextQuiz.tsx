import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import quizzesData from '@/data/quizzes_cloze.json'
import { useGameStore } from '@/store/gameStore'

interface QuizOption {
  text: string
  correct: boolean
}

interface QuizQuestion {
  id: number
  options: QuizOption[]
}

interface Quiz {
  id: string
  title: string
  mode?: 'cloze'
  bonusSteps?: number
  text: string
  questions: QuizQuestion[]
}

interface TextQuizProps {
  quizIndex?: number
}

export function TextQuiz({ quizIndex = 0 }: TextQuizProps) {
  // Store bindings
  const currentStepStore = useGameStore((s) => s.currentStep)
  const maxSteps = useGameStore((s) => s.maxSteps)
  const setCurrentStepStore = useGameStore((s) => s.setCurrentStep)
  const isAdminMode = useGameStore((s) => s.isAdminMode)

  // Normalize raw quiz data to strong shape
  const normalizeQuiz = (raw: any): Quiz => {
    return {
      id: String(raw.id),
      title: String(raw.title),
      mode: 'cloze',
      bonusSteps: Number.isFinite(raw.bonusSteps) ? Number(raw.bonusSteps) : 0,
      text: String(raw.text || ''),
      questions: (raw.questions || []).map((q: any) => ({
        id: Number(q.id),
        options: (q.options || []).map((o: any) => ({
          text: String(o.text),
          correct: !!o.correct,
        })),
      })),
    }
  }

  // Local component state
  const [quiz, setQuiz] = useState<Quiz>(() => normalizeQuiz((quizzesData as any)[quizIndex]))
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [lives, setLives] = useState(3)
  const [hasWon, setHasWon] = useState(false)
  const [locked, setLocked] = useState<Record<number, boolean>>({})
  const [currentBonus, setCurrentBonus] = useState(0);

  // When quizIndex changes, reload quiz and restore lives/won flags
  useEffect(() => {
    const raw = (quizzesData as any)[quizIndex]
    const next = normalizeQuiz(raw)
    setQuiz(next)
    setAnswers({})
    setIsSubmitted(false)
    setIsCorrect(false)
    setLocked({})

    const storedLives = localStorage.getItem(`quiz_${next.id}_lives`)
    setLives(storedLives ? parseInt(storedLives, 10) : 3)
    const storedWon = localStorage.getItem(`quiz_${next.id}_won`)
    setHasWon(storedWon === 'true')
  }, [quizIndex])

  // Sync view of current step from store
  useEffect(() => {
    setCurrentStep(currentStepStore)
  }, [currentStepStore])

  // Note: previously we computed allAnswersFilled to disable the button until filled,
  // but the current UX keeps the button always enabled.

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }
  
  const computeBonus = (correct: number, tot: number, maxSteps: number) => {
    if (correct <= 0 || tot <= 0) return 0
    const scaled = Math.round((5 * correct) / tot)
    return Math.max(1, Math.min(5, scaled))
  }

  const checkAnswers = () => {
    let count = quiz.questions.length;
    for (const q of quiz.questions) {
      const user = (answers[q.id] ?? '').trim().toLowerCase()
      const correctAns = (q.options.find((o) => o.correct)?.text ?? '').trim().toLowerCase()
      if (!user || user !== correctAns) {
        count = count-1
      }
    }
    setIsCorrect(quiz.questions.length === count)
    setIsSubmitted(true)

    if (count === quiz.questions.length) {
      const bonus = quiz.bonusSteps ?? 0
      const newStep = Math.min(currentStepStore + bonus, maxSteps - 1)
      setCurrentStepStore(newStep)
      setCurrentStep(newStep)
      setHasWon(true)
      localStorage.setItem(`quiz_${quiz.id}_won`, 'true')
    } else {
      const maxBonus = quiz.bonusSteps ?? 0
      const bonus = computeBonus(count, quiz.questions.length, maxBonus)
      setCurrentBonus(bonus);
      const newLives = lives - 1
      setLives(newLives)
      localStorage.setItem(`quiz_${quiz.id}_lives`, String(newLives))
    }
  }

  const resetQuiz = () => {
    // Only clear wrong answers; keep correct ones prefilled
    const next: Record<number, string> = {}
    const nextLocked: Record<number, boolean> = {}
    for (const q of quiz.questions) {
      const user = (answers[q.id] ?? '').trim().toLowerCase()
      const correctAns = (q.options.find((o) => o.correct)?.text ?? '').trim().toLowerCase()
      if (user && user === correctAns) {
        next[q.id] = answers[q.id]
        nextLocked[q.id] = true
      } else {
        next[q.id] = ''
        nextLocked[q.id] = false
      }
    }
    setAnswers(next)
    setLocked(nextLocked)
    setIsSubmitted(false)
    setIsCorrect(false)
  }

  const handleResetLives = () => {
    setLives(3)
    setHasWon(false)
    localStorage.setItem(`quiz_${quiz.id}_lives`, '3')
    localStorage.removeItem(`quiz_${quiz.id}_won`)
    setAnswers({})
    setIsSubmitted(false)
    setIsCorrect(false)
    setLocked({})
  }

  // Render helpers
  const renderTextWithInputs = () => {
    const parts = (quiz.text || '').split(/(\{\d+\})/g)
    return (
      <span>
        {parts.map((part, index) => {
          const m = part.match(/\{(\d+)\}/)
          if (!m) return <span key={index}>{part}</span>
          const qid = parseInt(m[1], 10)
          const question = quiz.questions.find((q) => q.id === qid)
          if (!question) return <span key={index}>?</span>
          const userAnswer = answers[qid] ?? ''
          const correctAnswer = question.options.find((o) => o.correct)?.text ?? ''
          const isLocked = !isSubmitted && locked[qid] === true

          if (!isSubmitted) {
            if (isLocked) {
              return (
                <input
                  key={index}
                  type="text"
                  value={userAnswer}
                  disabled
                  readOnly
                  className="mx-1 px-1.5 py-0.5 text-sm rounded-md bg-green-200 text-green-800 border border-green-400 cursor-not-allowed"
                />
              )
            }
            return (
              <input
                key={index}
                type="text"
                value={userAnswer}
                onChange={(e) => handleAnswerChange(qid, e.target.value)}
                placeholder="Votre réponse"
                className="mx-1 px-1.5 py-0.5 text-sm border border-white/40 rounded-md bg-white/80 text-purple-800 placeholder-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400"
              />
            )
          }

          const isGood = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
          return (
            <span
              key={index}
              className={`mx-1 px-2 py-1 rounded font-semibold ${isGood ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
            >
              {userAnswer || '?'}
            </span>
          )
        })}
      </span>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card className="bg-gradient-to-br from-purple-600/60 to-purple-800/60 border-white/20 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center justify-center gap-2 text-lg">
            <BookOpen className="h-6 w-6" />
            {quiz.title}
          </CardTitle>
          <div className="text-center mt-2">
            <p className="text-white/90 text-lg font-semibold">❤️ {lives}/3</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Admin: reset lives when out or already won */}
          {isAdminMode && (lives === 0 || hasWon) && (
            <Button
              onClick={handleResetLives}
              variant="outline"
              className="w-full bg-orange-500/20 text-white border-orange-400/50 hover:bg-orange-500/30"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              [Admin] Réinitialiser le quiz
            </Button>
          )}

          {/* Already won */}
          {hasWon && (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-bold">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p>✅ Quiz réussi !</p>
              {quiz.bonusSteps ? (
                <p className="text-sm mt-1">+{quiz.bonusSteps} cases gagnées</p>
              ) : null}
            </div>
          )}

          {/* Out of lives */}
          {!hasWon && lives === 0 && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center font-bold">
              <XCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Plus de vies ! 💔</p>
              <p className="text-sm mt-1">Le quiz est terminé</p>
              <p className="text-sm mt-1">Bonus: {currentBonus} cases bonus !</p>
            </div>
          )}

          {/* Main cloze interaction */}
          {lives > 0 && !hasWon && (
            <>
              <div className="bg-white/10 rounded-lg p-4 border border-white/30">
                <div className="text-white whitespace-pre-wrap">{renderTextWithInputs()}</div>
              </div>

              {!isSubmitted ? (
                <Button
                  onClick={checkAnswers}
                  // je ne veux pas que le bouton soit désactivés
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Valider mes réponses
                </Button>
              ) : (
                <div className="space-y-3">
                  <div
                    className={`p-4 rounded-lg text-center font-bold ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-xl">🎉 Bravo !</p>
                        {quiz.bonusSteps ? (
                          <p className="text-sm mt-1">+{quiz.bonusSteps} cases bonus !</p>
                        ) : null}
                        <p className="text-sm mt-1">Case {currentStep + 1}</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-xl">Mauvaise réponse</p>
                        <p className="text-sm mt-1">
                          {lives} vie{lives > 1 ? 's' : ''} restante{lives > 1 ? 's' : ''}
                        </p>
                      </>
                    )}
                  </div>

                  {!isCorrect && (
                    <Button
                      onClick={resetQuiz}
                      variant="outline"
                      className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20"
                    >
                      Réessayer
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
