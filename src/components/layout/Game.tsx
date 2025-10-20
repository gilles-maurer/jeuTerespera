// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
// import { Bell, Settings, ChevronRight } from 'lucide-react'
// import { ResponsiveTestCard } from '@/components/debug/ResponsiveTestCard'

import background from '@/assets/background/village.png'
import charactersData from '@/data/character.json'

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

  useEffect(() => {
    // Récupérer le personnage sélectionné depuis le localStorage
    const storedCharacterId = localStorage.getItem('selectedCharacter')
    if (storedCharacterId) {
      const character = charactersData.characters.find(c => c.id === storedCharacterId)
      if (character) {
        setSelectedCharacter(character)
      }
    }
  }, [])

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


        {/* Personnage en bas de l'écran */}
        {selectedCharacter && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <div className="flex flex-col items-center gap-2">
              <div className="w-48 h-48 md:w-32 md:h-32 flex items-center justify-center">
                <img
                  src={new URL(`../../assets/characters/${selectedCharacter.image}`, import.meta.url).href}
                  alt={selectedCharacter.name}
                  className="max-h-full max-w-full object-contain drop-shadow-2xl"
                />
              </div>
              {/* <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                <p className="text-sm font-semibold text-white drop-shadow">
                  {selectedCharacter.name}
                </p>
              </div> */}
            </div>
          </div>
        )}
    </div>
  )
}