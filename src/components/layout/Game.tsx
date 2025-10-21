// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { Crown, RotateCcw, Skull } from 'lucide-react'
// import { ResponsiveTestCard } from '@/components/debug/ResponsiveTestCard'

import background from '@/assets/background/village.png'
import charactersData from '@/data/character.json'
import gamePathData from '@/data/gamePath.json'
import { GamePath } from './Game/GamePath'

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
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // Récupérer le personnage sélectionné depuis le localStorage
    const storedCharacterId = localStorage.getItem('selectedCharacter')
    if (storedCharacterId) {
      const character = charactersData.characters.find(c => c.id === storedCharacterId)
      if (character) {
        setSelectedCharacter(character)
      }
    }

    // Récupérer la progression du jeu
    const storedProgress = localStorage.getItem('gameProgress')
    if (storedProgress) {
      setCurrentStep(parseInt(storedProgress, 10))
    }
  }, [])

  // const handleNextStep = () => {
  //   if (currentStep < gamePathData.maxSteps - 1) {
  //     const newStep = currentStep + 1
  //     setCurrentStep(newStep)
  //     localStorage.setItem('gameProgress', newStep.toString())
  //   }
  // }

  // const handlePrevStep = () => {
  //   if (currentStep > 0) {
  //     const newStep = currentStep - 1
  //     setCurrentStep(newStep)
  //     localStorage.setItem('gameProgress', newStep.toString())
  //   }
  // }

  const handleReset = () => {
    setCurrentStep(0)
    localStorage.setItem('gameProgress', '0')
  }

  const handleLoseProgress = () => {
    const additionalStep = Math.floor(Math.random() * 3) + 1;
    console.log('additionalStep', additionalStep);
    const newStep = additionalStep + currentStep;
    setCurrentStep(Math.min(newStep, gamePathData.maxSteps - 1));
    localStorage.setItem('gameProgress', (newStep >= 0 ? newStep : 0).toString());
  }

  const handleWinProgress = () => {
    const additionalStep = Math.floor(Math.random() * 3) + 4;
    console.log('additionalStep', additionalStep);
    const newStep = additionalStep + currentStep;
    setCurrentStep(Math.min(newStep, gamePathData.maxSteps - 1));
    localStorage.setItem('gameProgress', (newStep >= 0 ? newStep : 0).toString());
  }

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
            maxSteps={gamePathData.maxSteps} 
            currentStep={currentStep}
            characterImage={selectedCharacter ? new URL(`../../assets/characters/${selectedCharacter.image}`, import.meta.url).href : null}
          />
        </div>

        {/* Contrôles de progression - positionnés juste au-dessus de la barre de navigation */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full p-2">
          {/* <Button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white disabled:opacity-30 h-10 w-10"
            size="icon"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            onClick={handleNextStep}
            disabled={currentStep === gamePathData.maxSteps - 1}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white disabled:opacity-30 h-10 w-10"
            size="icon"
          >
            <ChevronRight className="h-5 w-5" />
          </Button> */}

          <Button
            onClick={handleReset}
            className="bg-red-500/30 hover:bg-red-500/50 backdrop-blur-md border border-red-400/50 text-white h-10 w-10"
            size="icon"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleLoseProgress}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white disabled:opacity-30 h-10 w-10"
            size="icon"
          >
            <Skull className="h-5 w-5" />
          </Button>

          <Button
            onClick={handleWinProgress}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white disabled:opacity-30 h-10 w-10"
            size="icon"
          >
            <Crown className="h-5 w-5" />
          </Button>
        </div>
    </div>
  )
}