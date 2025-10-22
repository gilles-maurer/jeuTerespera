// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
// import { Bell, Settings, ChevronRight } from 'lucide-react'
// import { ResponsiveTestCard } from '@/components/debug/ResponsiveTestCard'
import { User } from './User/User'
import { Game } from './Game'
import { Add } from './Add'
import { useGameStore } from '@/store/gameStore'
import { Star } from 'lucide-react'

interface MainContentProps {
  activeTab: string,
  className?: string
}

export function MainContent({ activeTab, className }: MainContentProps) {
  const victoryCount = useGameStore(s => s.victoryCount)
  const currentStep = useGameStore(s => s.currentStep)
  const maxSteps = useGameStore(s => s.maxSteps)
  const [animateStar, setAnimateStar] = useState(false)
  const hasShownStar = useRef(false)
  const prevVictory = useRef(0)
  const [showTempStar, setShowTempStar] = useState(false)
  const winFlashArmed = useRef(true)

  useEffect(() => {
    // Ne pas animer sur les changements de victoryCount, l'anim se fait AVANT la popup
    // On mémorise juste la valeur
    prevVictory.current = victoryCount
    if (victoryCount > 0 && !hasShownStar.current) {
      // marquer comme déjà animé pour éviter toute anim ultérieure
      hasShownStar.current = true
      setShowTempStar(false)
    }
  }, [victoryCount])

  // Déclencher une animation d'étoile AVANT la popup quand on atteint la dernière case
  useEffect(() => {
    if (maxSteps <= 0) return
    // (Ré)armer quand on n'est pas à la fin
    if (currentStep < maxSteps - 1) {
      winFlashArmed.current = true
      setShowTempStar(false)
      return
    }
    // Si on vient d'atteindre la fin et que c'est armé, jouer l'anim et afficher une étoile temporaire
    if (currentStep >= maxSteps - 1 && winFlashArmed.current) {
      winFlashArmed.current = false
      setShowTempStar(true)
      setAnimateStar(true)
      hasShownStar.current = true
      const t1 = setTimeout(() => setAnimateStar(false), 1200)
      return () => {
        clearTimeout(t1)
      }
    }
  }, [currentStep, maxSteps])
  return (
    <div className={cn("h-full flex flex-col bg-gray-50 overflow-hidden", className)}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">The Terespera Game</h1>
            <p className="text-sm text-gray-500">By Bibule</p>
          </div>
          <div className="flex items-center gap-2">
            {(victoryCount > 0 || showTempStar) && (
              <div
                className="fixed top-3 right-4 z-[60] pointer-events-none p-1 rounded-full bg-yellow-100 border border-yellow-300 shadow-sm"
                style={animateStar ? { animation: 'star-pop 500ms ease-out, star-glow 1200ms ease-out' } : undefined}
              >
                {animateStar && (
                  <span className="absolute inset-0 rounded-full bg-yellow-300/60 animate-ping" aria-hidden />
                )}
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-500 relative" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenu scrollable - prend l'espace restant */}
      <div className="flex-1 overflow-hidden">
        <div className={cn("h-full", activeTab !== 'home' && "hidden")}>
          <Game/>
        </div>
        <div className={cn("h-full", activeTab !== 'user' && "hidden")}>
          <User/>
        </div>
        <div className={cn("h-full", activeTab !== 'add' && "hidden")}>
          <Add/>
        </div>
      </div>
      {/* Micro animation CSS for the header star */}
      <style>{`
        @keyframes star-pop {
          0% { transform: scale(0.6) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(0deg); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes star-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(250, 204, 21, 0); }
          50% { box-shadow: 0 0 20px 6px rgba(250, 204, 21, 0.45); }
        }
      `}</style>
    </div>
  )
}