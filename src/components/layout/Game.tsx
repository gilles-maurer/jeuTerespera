// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { Crown, Skull, Dices, X } from 'lucide-react'
// import { ResponsiveTestCard } from '@/components/debug/ResponsiveTestCard'

import background from '@/assets/background/village.png'
import charactersData from '@/data/character.json'
import { GamePath } from './Game/GamePath'
import { useGameStore } from '@/store/gameStore'

interface Character {
  id: string
  name: string
  description: string
  image: string
}

interface GameProps {
  className?: string
}

export function Game({ className }: GameProps) {
  const selectedCharacterId = useGameStore(s => s.selectedCharacterId)
  const currentStep = useGameStore(s => s.currentStep)
  const maxSteps = useGameStore(s => s.maxSteps)
  const setCurrentStep = useGameStore(s => s.setCurrentStep)
  const restartGame = useGameStore(s => s.restartGame)
  const incrementVictory = useGameStore(s => s.incrementVictory)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [actionType, setActionType] = useState<'win' | 'lose' | null>(null)
  const [showVictory, setShowVictory] = useState(false)

  const selectedCharacter: Character | null = useMemo(() => {
    if (!selectedCharacterId) return null
    return charactersData.characters.find(c => c.id === selectedCharacterId) ?? null
  }, [selectedCharacterId])

  const handleDiceRoll = (type: 'win' | 'lose') => {
    setActionType(type)
    setIsRolling(true)
    setDiceResult(null)

    // Animation de dés pendant 1.2s
    setTimeout(() => {
      const additionalStep = type === 'win' 
        ? Math.floor(Math.random() * 3) + 4  // 4-6 cases
        : Math.floor(Math.random() * 3) + 1  // 1-3 cases
      
      setDiceResult(additionalStep)
      setIsRolling(false)

      // Afficher le résultat pendant 1s
      setTimeout(() => {
        // Fermer le modal IMMÉDIATEMENT
        setIsModalOpen(false)
        setDiceResult(null)
        setActionType(null)

        // PUIS animer case par case
        const baseStep = currentStep
        const targetStep = Math.min(baseStep + additionalStep, maxSteps - 1)
        let step = baseStep
        
        const animateStep = () => {
          if (step < targetStep) {
            step++
            setCurrentStep(step)
            
            // Délai entre chaque case (700ms pour correspondre à l'animation CSS)
            setTimeout(animateStep, 700)
          }
        }
        
        // Démarrer l'animation après un court délai
        setTimeout(animateStep, 200)
      }, 1000)
    }, 1200)
  }

  // Afficher la popup de victoire après un léger délai quand on atteint la dernière case
  useEffect(() => {
    if (currentStep >= maxSteps - 1) {
      // Attendre la fin de l'animation des cases ET l'animation d'étoile (≈1200ms)
      const t = setTimeout(() => setShowVictory(true), 1300)
      return () => clearTimeout(t)
    } else {
      setShowVictory(false)
    }
  }, [currentStep, maxSteps])

  return (
    <div className={cn('flex-1 h-full relative overflow-hidden', className)}>
        <img
            src={background}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-70"
        />

        {/* optional tint/overlay to tweak contrast */}
        <div aria-hidden className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* Chemin du jeu */}
        <div className="relative z-10 h-full pb-4">
          <GamePath 
            maxSteps={maxSteps} 
            currentStep={currentStep}
            characterImage={selectedCharacter ? new URL(`../../assets/characters/${selectedCharacter.image}`, import.meta.url).href : null}
          />
        </div>

        {/* Bouton principal du dé */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-500/30 hover:bg-purple-500/50 backdrop-blur-md border border-purple-400/50 text-white h-12 w-12"
            size="icon"
          >
            <Dices className="h-6 w-6" />
          </Button>
        </div>

        {/* Modal du dé */}
        {isModalOpen && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-md rounded-2xl p-8 border-2 border-purple-400/50 max-w-sm w-full mx-4">
              {/* Bouton fermer */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Titre */}
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Résultat du jeu 🎲
              </h2>

              {/* Zone d'animation du dé */}
              {isRolling || diceResult !== null ? (
                <div className="flex items-center justify-center min-h-[150px] mb-6">
                  <div className={cn(
                    "text-8xl font-bold text-white",
                    isRolling && "animate-dice-roll"
                  )}>
                    {isRolling ? (
                      <span className="inline-block">
                        {Math.floor(Math.random() * 6) + 1}
                      </span>
                    ) : (
                      <span className="inline-block animate-dice-bounce">
                        {diceResult}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* Boutons de choix */
                <div className="flex gap-4 justify-center mb-4">
                  <Button
                    onClick={() => handleDiceRoll('lose')}
                    className="bg-red-500/30 hover:bg-red-500/50 backdrop-blur-md border border-red-400/50 text-white h-16 w-16 flex-col gap-1"
                    size="icon"
                  >
                    <Skull className="h-6 w-6" />
                    <span className="text-xs">1-3</span>
                  </Button>

                  <Button
                    onClick={() => handleDiceRoll('win')}
                    className="bg-green-500/30 hover:bg-green-500/50 backdrop-blur-md border border-green-400/50 text-white h-16 w-16 flex-col gap-1"
                    size="icon"
                  >
                    <Crown className="h-6 w-6" />
                    <span className="text-xs">4-6</span>
                  </Button>
                </div>
              )}

              {/* Message du résultat */}
              {diceResult !== null && !isRolling && (
                <div className={cn(
                  "text-center text-lg font-semibold animate-fade-in",
                  actionType === 'win' ? "text-green-300" : "text-red-300"
                )}>
                  {actionType === 'win' ? '🎉 Victoire !' : '💪 Continue !'}
                  <br />
                  <span className="text-white">+{diceResult} cases</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Popup de victoire au-dessus de tout */}
        {showVictory && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm text-center border-2 border-yellow-300">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg ring-4 ring-yellow-200">
                  🏆
                </div>
              </div>
              <h2 className="text-xl font-extrabold mt-6 mb-2 text-yellow-700">Victoire !</h2>
              <p className="text-gray-700 mb-4">Tu as atteint la dernière case.</p>
              <Button
                onClick={() => { incrementVictory(); restartGame(); setIsModalOpen(false); setShowVictory(false) }}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
              >
                Recommencer
              </Button>
            </div>
          </div>
        )}
    </div>
  )
}