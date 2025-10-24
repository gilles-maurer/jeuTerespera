import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle, XCircle } from 'lucide-react'
import quizzesData from '@/data/quizzes_mcq.json'
import { useGameStore } from '@/store/gameStore'
// Dynamically import all quiz background images
const bgGlobs = import.meta.glob('/src/assets/quizbg/*.png', { eager: true, as: 'url' }) as Record<string, string>
const bgGlobsJpeg = import.meta.glob('/src/assets/quizbg/*.jpeg', { eager: true, as: 'url' }) as Record<string, string>
const bgGlobJpg = import.meta.glob('/src/assets/quizbg/*.jpg', { eager: true, as: 'url' }) as Record<string, string>

const getQuizBgForQuestion = (questionNumber1Based: number): string => {
  // Keys are like '/src/assets/quizbg/3.png' (or with alias resolution)
  const wanted = `/src/assets/quizbg/${questionNumber1Based}.png`
  const wantedJpeg = `/src/assets/quizbg/${questionNumber1Based}.jpeg`
  const wantedJpg = `/src/assets/quizbg/${questionNumber1Based}.jpg`
  const fallback = `/src/assets/quizbg/default.png`
  return bgGlobs[wanted] || bgGlobsJpeg[wantedJpeg] || bgGlobJpg[wantedJpg] || bgGlobs[fallback] || ''
}

interface QuizOption {
  text: string
  correct: boolean
  image?: string
}

interface QuizQuestion {
  id: number
  prompt: string
  options: QuizOption[]
}

interface Quiz {
  id: string
  title: string
  mode: 'mcq'
  maxBonus: number
  questions: QuizQuestion[]
}

interface MCQQuizProps {
  quizIndex?: number
}

export function MCQQuiz({ quizIndex = 0 }: MCQQuizProps) {
  const currentStepStore = useGameStore((s) => s.currentStep)
  const maxSteps = useGameStore((s) => s.maxSteps)
  const setCurrentStepStore = useGameStore((s) => s.setCurrentStep)
  const isAdminMode = useGameStore((s) => s.isAdminMode)

  const normalizeQuiz = (raw: any): Quiz => ({
    id: String(raw.id),
    title: String(raw.title),
    mode: 'mcq',
    maxBonus: Number(raw.maxBonus) || 0,
    questions: (raw.questions || []).map((q: any) => ({
      id: Number(q.id),
      prompt: String(q.prompt || ''),
      options: (q.options || []).map((o: any) => ({
        text: String(o.text),
        correct: !!o.correct,
        image: o.image ? String(o.image) : undefined,
      })),
    })),
  })

  const [quiz, setQuiz] = useState<Quiz>(() => normalizeQuiz((quizzesData as any)[quizIndex]))
  const mcqProgressMap = useGameStore((s) => s.mcqProgress)
  const setMcqProgress = useGameStore((s) => s.setMcqProgress)
  const resetMcq = useGameStore((s) => s.resetMcq)
  const progress = mcqProgressMap[quiz.id]
  const idx = progress?.idx ?? 0
  const selected = progress?.selected ?? null
  const correctCount = progress?.correctCount ?? 0
  const finished = progress?.finished ?? false
  const showFeedback = progress?.showFeedback ?? false
  const lastChosen = useMemo<QuizOption | null>(() => {
    if (!progress) return null
    if (progress.lastChosenText == null) return null
    return {
      text: progress.lastChosenText,
      correct: progress.lastChosenCorrect,
    }
  }, [progress])
  const appliedBonus = progress?.appliedBonus ?? null
  const [feedbackBgUrl, setFeedbackBgUrl] = useState<string>('')

  useEffect(() => {
    const raw = (quizzesData as any)[quizIndex]
    const q = normalizeQuiz(raw)
    setQuiz(q)
  }, [quizIndex])

  // Ensure a progress entry exists for this quiz id
  useEffect(() => {
    if (!quiz?.id) return
    const existing = mcqProgressMap[quiz.id]
    if (!existing) {
      setMcqProgress(quiz.id, {})
    }
  }, [quiz.id, mcqProgressMap, setMcqProgress])

  const total = quiz.questions.length
  // Helper to compute bonus between 1..5 based on ratio; 0 if zero correct
  const computeBonus = (correct: number, tot: number) => {
    if (correct <= 0 || tot <= 0) return 0
    const scaled = Math.round((5 * correct) / tot)
    return Math.max(1, Math.min(5, scaled))
  }

  const currentQ = quiz.questions[idx]

  const proceedAfterFeedback = () => {
    setMcqProgress(quiz.id, { showFeedback: false, selected: null })
    if (idx < total - 1) {
      setMcqProgress(quiz.id, { idx: idx + 1 })
    } else {
      const bonusNow = computeBonus(correctCount, total)
      const newStep = Math.min(currentStepStore + bonusNow, maxSteps - 1)
      setCurrentStepStore(newStep)
      setMcqProgress(quiz.id, {
        appliedBonus: bonusNow,
        finished: true,
        done: true,
        showFeedback: false,
        selected: null,
      })
    }
  }

  const onValidate = () => {
    if (!selected) return
    const chosen = currentQ.options.find((o) => o.text === selected) || null
    const good = chosen?.correct === true
    if (good) setMcqProgress(quiz.id, { correctCount: correctCount + 1 })
    setMcqProgress(quiz.id, {
      lastChosenText: chosen?.text ?? null,
      lastChosenCorrect: !!good,
      showFeedback: true,
    })
    // Prepare feedback background
    const qNumber = idx + 1
    setFeedbackBgUrl(getQuizBgForQuestion(qNumber))
  }

  const canReplay = isAdminMode
  const replay = () => {
    resetMcq(quiz.id)
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {/* Header */}
      {!finished && (
        <div className="text-center">
          <p className="text-white flex items-center justify-center gap-2 text-lg font-semibold">
            <BookOpen className="h-6 w-6" /> {quiz.title}
          </p>
          <p className="text-white/80 text-sm mt-1">
            Question {Math.min(idx + 1, total)}/{total} | Score {correctCount}/{Math.min(idx + 1, total)}
          </p>
        </div>
      )}

      {/* Question UI */}
          {!finished && (
            <>
              {!showFeedback && (
                <>
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20 text-white">
                    <p className="mb-4">{currentQ.prompt}</p>
                    <div className="space-y-2">
                      {currentQ.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setMcqProgress(quiz.id, { selected: opt.text })}
                          className={
                            'w-full text-left px-3 py-2 rounded transition-colors ' +
                            (selected === opt.text
                              ? 'bg-white/25 text-white border-2 border-white'
                              : 'bg-white/10 hover:bg-white/15 text-white border border-white/20')
                          }
                        >
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end items-center">
                    <Button onClick={onValidate} disabled={!selected} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50">
                      {idx < total - 1 ? 'Valider' : 'Terminer'}
                    </Button>
                  </div>
                </>
              )}

              {showFeedback && (
                <div
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    backgroundImage: `url(${feedbackBgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '240px',
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative p-4 flex flex-col items-center justify-center text-center text-white gap-2">
                    {lastChosen?.correct ? (
                      <CheckCircle className="h-12 w-12 text-green-400" />
                    ) : (
                      <XCircle className="h-12 w-12 text-red-400" />
                    )}
                    <p className="text-base">
                      Réponse correcte : <span className="font-semibold">{currentQ.options.find(o => o.correct)?.text}</span>
                    </p>
                    <Button onClick={proceedAfterFeedback} className="mt-1 bg-white/20 hover:bg-white/30">
                      Continuer
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
      {finished && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg text-center font-bold bg-green-100 text-green-800">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-xl">Résultat</p>
            <p className="text-sm mt-1">{correctCount} bonne(s) réponse(s) / {total}</p>
            <p className="text-sm mt-1">+{appliedBonus ?? computeBonus(correctCount, total)} case(s)</p>
          </div>
          {canReplay ? (
            <Button onClick={replay} variant="outline" className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20">
              Rejouer (Admin)
            </Button>
          ) : (
            <p className="text-center text-white/80 text-sm">Le quiz ne peut pas être rejoué.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default MCQQuiz
