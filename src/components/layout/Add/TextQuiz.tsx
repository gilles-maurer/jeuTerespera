import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import quizzesData from '@/data/quizzes.json'
import gamePathData from '@/data/gamePath.json'

interface QuizOption {
  text: string
  correct: boolean
}

interface QuizQuestion {
  id: number
  type: string
  options: QuizOption[]
}

interface Quiz {
  id: string
  title: string
  bonusSteps: number
  text: string
  questions: QuizQuestion[]
}

export function TextQuiz() {
  const [quiz] = useState<Quiz>(quizzesData[0])
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [lives, setLives] = useState(() => {
    // Récupérer les vies depuis localStorage
    const storedLives = localStorage.getItem(`quiz_${quiz.id}_lives`)
    return storedLives ? parseInt(storedLives, 10) : 3
  })
  const [hasWon, setHasWon] = useState(() => {
    // Vérifier si le quiz a déjà été gagné
    const storedWon = localStorage.getItem(`quiz_${quiz.id}_won`)
    return storedWon === 'true'
  })
  const [isAdminMode, setIsAdminMode] = useState(() => {
    // Récupérer le mode admin depuis localStorage
    const storedAdminMode = localStorage.getItem('isAdminMode')
    return storedAdminMode === 'true'
  })

  useEffect(() => {
    // Récupérer la position actuelle
    const storedProgress = localStorage.getItem('gameProgress')
    if (storedProgress) {
      setCurrentStep(parseInt(storedProgress, 10))
    }

    // Écouter les changements du mode admin
    const handleStorageChange = () => {
      const storedAdminMode = localStorage.getItem('isAdminMode')
      setIsAdminMode(storedAdminMode === 'true')
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const checkAnswers = () => {
    let allCorrect = true

    for (const question of quiz.questions) {
      const userAnswer = answers[question.id]
      const correctOption = question.options.find(opt => opt.correct)
      
      if (!userAnswer || userAnswer !== correctOption?.text) {
        allCorrect = false
        break
      }
    }

    setIsCorrect(allCorrect)
    setIsSubmitted(true)

    if (allCorrect) {
      // Ajouter les cases bonus
      const newStep = Math.min(currentStep + quiz.bonusSteps, gamePathData.maxSteps - 1)
      localStorage.setItem('gameProgress', newStep.toString())
      setCurrentStep(newStep)
      // Marquer le quiz comme gagné
      setHasWon(true)
      localStorage.setItem(`quiz_${quiz.id}_won`, 'true')
    } else {
      // Retirer une vie en cas d'échec
      const newLives = lives - 1
      setLives(newLives)
      localStorage.setItem(`quiz_${quiz.id}_lives`, newLives.toString())
    }
  }

  const resetQuiz = () => {
    setAnswers({})
    setIsSubmitted(false)
    setIsCorrect(false)
  }

  const handleResetLives = () => {
    setLives(3)
    setHasWon(false)
    localStorage.setItem(`quiz_${quiz.id}_lives`, '3')
    localStorage.removeItem(`quiz_${quiz.id}_won`)
  }

  // Fonction pour rendre le texte avec les select boxes
  const renderTextWithBlanks = () => {
    const parts = quiz.text.split(/(\{\d+\})/)
    
    return (
      <div className="text-lg leading-relaxed">
        {parts.map((part, index) => {
          const match = part.match(/\{(\d+)\}/)
          if (match) {
            const questionId = parseInt(match[1], 10)
            const question = quiz.questions.find(q => q.id === questionId)
            
            if (!question) return null

            const userAnswer = answers[questionId]
            const correctAnswer = question.options.find(opt => opt.correct)?.text

            return (
              <span key={index} className="inline-block mx-1">
                {!isSubmitted ? (
                  <select
                    value={userAnswer || ''}
                    onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                    className="px-2 py-1 border-2 border-purple-400 rounded bg-white/90 font-semibold text-purple-700 cursor-pointer hover:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">?</option>
                    {question.options.map((option, optIndex) => (
                      <option key={optIndex} value={option.text}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded font-semibold ${
                    userAnswer === correctAnswer
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {userAnswer || '?'}
                  </span>
                )}
              </span>
            )
          }
          return <span key={index}>{part}</span>
        })}
      </div>
    )
  }

  const allAnswersFilled = quiz.questions.every(q => answers[q.id])

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-2 border-purple-400/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center justify-center gap-2 text-lg">
            <BookOpen className="h-6 w-6" />
            {quiz.title}
          </CardTitle>
          <div className="text-center mt-2">
            <p className="text-white/90 text-lg font-semibold">
              ❤️ {lives}/3
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bouton admin pour reset les vies */}
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

          {/* Quiz déjà gagné */}
          {hasWon && (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-bold">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p>✅ Quiz déjà réussi !</p>
              <p className="text-sm mt-1">+{quiz.bonusSteps} cases gagnées</p>
            </div>
          )}

          {/* Message si plus de vies */}
          {!hasWon && lives === 0 && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center font-bold">
              <XCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Plus de vies ! 💔</p>
              <p className="text-sm mt-1">Le quiz est terminé</p>
            </div>
          )}

          {/* Texte à trous */}
          {lives > 0 && !hasWon && (
            <>
              <div className="bg-white/10 rounded-lg p-4 border border-white/30">
                <div className="text-white">
                  {renderTextWithBlanks()}
                </div>
              </div>

              {/* Boutons */}
              {!isSubmitted ? (
                <Button
                  onClick={checkAnswers}
                  disabled={!allAnswersFilled}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Valider mes réponses
                </Button>
              ) : (
                <div className="space-y-3">
                  {/* Résultat */}
                  <div className={`p-4 rounded-lg text-center font-bold ${
                    isCorrect
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-xl">🎉 Bravo !</p>
                        <p className="text-sm mt-1">
                          +{quiz.bonusSteps} cases bonus !
                        </p>
                        <p className="text-sm mt-1">
                          Case {currentStep + 1}
                        </p>
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

                  {/* Bouton recommencer */}
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
