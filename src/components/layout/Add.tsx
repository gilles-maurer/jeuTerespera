import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'

import background from '@/assets/background/boutique.png'
import { AdminPanel } from './Add/AdminPanel'
import { PositionChanger } from './Add/PositionChanger'
import { TextQuiz } from './Add/TextQuiz'

interface AddProps {
  className?: string
}

type ComponentType = 'admin' | 'position' | 'quiz' | null

export function Add({ className }: AddProps) {
  const [code, setCode] = useState('')
  const [activeComponent, setActiveComponent] = useState<ComponentType>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Vérifier le code et définir quel composant afficher
    if (code === 'admin12*') {
      setActiveComponent('admin')
      setMessage({ type: 'success', text: '✅ Panneau Admin ouvert' })
      setCode('')
      setTimeout(() => setMessage(null), 2000)
    } else if (code === 'position99') {
      setActiveComponent('position')
      setMessage({ type: 'success', text: '✅ Modificateur de position ouvert' })
      setCode('')
      setTimeout(() => setMessage(null), 2000)
    } else if (code === 'quiz777') {
      setActiveComponent('quiz')
      setMessage({ type: 'success', text: '✅ Quiz ouvert' })
      setCode('')
      setTimeout(() => setMessage(null), 2000)
    } else {
      setMessage({ type: 'error', text: '❌ Code incorrect' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // Fonction pour rendre le composant actif
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'admin':
        return <AdminPanel />
      case 'position':
        return <PositionChanger />
      case 'quiz':
        return <TextQuiz />
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/60 text-center">
              Entrez un code pour accéder aux fonctionnalités
            </p>
          </div>
        )
    }
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

        <div className="relative z-10 flex flex-col h-full">
          {/* Zone de contenu dynamique - prend tout l'espace disponible */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Rendu du composant actif selon le code */}
            {renderActiveComponent()}

            {/* Message de feedback temporaire */}
            {message && (
              <div className="max-w-md mx-auto mt-4">
                <div className={cn(
                  "p-3 rounded-lg text-center text-sm font-semibold shadow-lg",
                  message.type === 'success' && "bg-green-100 text-green-800",
                  message.type === 'error' && "bg-red-100 text-red-800"
                )}>
                  {message.text}
                </div>
              </div>
            )}
          </div>

          {/* Formulaire de saisie fixé en bas */}
          <div className="flex-shrink-0 p-4 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Entrez un code..."
                className="text-center font-mono"
                autoComplete="off"
              />
              <Button type="submit" size="icon" className="shrink-0">
                <CheckCircle className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
    </div>
  )
}