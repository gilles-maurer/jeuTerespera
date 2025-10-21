import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import background from '@/assets/background/boutique.png'
import charactersData from '@/data/character.json'

interface Character {
  id: string
  name: string
  description: string
  image: string
}

interface UserProps {
  className?: string
}

export function User({ className }: UserProps) {
  const characters: Character[] = charactersData.characters
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentCharacter = characters[currentIndex];
  localStorage.setItem('selectedCharacter', currentCharacter.id);

  const nextCharacter = () => {
    const newIndex = (currentIndex + 1) % characters.length;
    setCurrentIndex(newIndex);
    changeCharacter(newIndex);
  }

  const prevCharacter = () => {
    const newIndex = (currentIndex - 1 + characters.length) % characters.length;
    setCurrentIndex(newIndex);
    changeCharacter(newIndex);
  }

  const changeCharacter = (index: number) => {
    const newCharacter = characters[index];
    // Ici vous pouvez sauvegarder le choix dans le localStorage ou un état global
    localStorage.setItem('selectedCharacter', newCharacter.id);
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

        <div className="relative z-10 flex items-center justify-center h-full w-full p-4">
          <div className="flex flex-col items-center justify-center gap-6 md:gap-8 w-full max-w-5xl">
            
            {/* Ligne 1 : Flèches + Personnage */}
            <div className="flex items-center justify-center gap-4 md:gap-8 w-full">
              {/* Flèche Précédent */}
              <Button
                variant="ghost"
                size="icon"
                onClick={prevCharacter}
                className="shrink-0 h-12 w-12 md:h-16 md:w-16 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 transition-all"
              >
                <ChevronLeft className="h-8 w-8 md:h-10 md:w-10 text-white drop-shadow-lg" />
              </Button>

              {/* Image du personnage en grand */}
              <div className="w-full max-w-md h-64 md:h-80 flex items-center justify-center">
                <img
                  src={new URL(`../../../assets/characters/${currentCharacter.image}`, import.meta.url).href}
                  alt={currentCharacter.name}
                  className="max-h-full max-w-full object-contain drop-shadow-2xl"
                />
              </div>

              {/* Flèche Suivant */}
              <Button
                variant="ghost"
                size="icon"
                onClick={nextCharacter}
                className="shrink-0 h-12 w-12 md:h-16 md:w-16 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 transition-all"
              >
                <ChevronRight className="h-8 w-8 md:h-10 md:w-10 text-white drop-shadow-lg" />
              </Button>
            </div>

            {/* Indicateurs */}
            <div className="flex justify-center gap-2 md:gap-3">
              {characters.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 md:h-3 rounded-full transition-all backdrop-blur-sm",
                    index === currentIndex 
                      ? "bg-white w-8 md:w-10 shadow-lg" 
                      : "bg-white/40 w-2 md:w-3"
                  )}
                />
              ))}
            </div>

            {/* Ligne 2 : Nom et description */}
            <div className="flex flex-col items-center gap-4 md:gap-6 w-full max-w-2xl">
              <div className="text-center bg-white/10 backdrop-blur-md px-6 py-3 md:px-8 md:py-4 rounded-2xl border border-white/20">
                <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  {currentCharacter.name}
                </h3>
                <p className="text-base md:text-lg text-white/90 mt-1 md:mt-2 drop-shadow">
                  {currentCharacter.description}
                </p>
              </div>

            </div>

          </div>
        </div>
    </div>
  )
}