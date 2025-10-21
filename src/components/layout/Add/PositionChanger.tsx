import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, ArrowRight } from 'lucide-react'
import gamePathData from '@/data/gamePath.json'

export function PositionChanger() {
  const [currentStep, setCurrentStep] = useState(0)
  const [newStep, setNewStep] = useState('')
  const [maxSteps, setMaxSteps] = useState(gamePathData.maxSteps)
  const [newMaxSteps, setNewMaxSteps] = useState('')

  useEffect(() => {
    // Récupérer la position actuelle depuis localStorage
    const storedProgress = localStorage.getItem('gameProgress')
    if (storedProgress) {
      setCurrentStep(parseInt(storedProgress, 10))
    }

    // Récupérer le nombre d'étapes depuis localStorage
    const storedMaxSteps = localStorage.getItem('gameMaxSteps')
    if (storedMaxSteps) {
      setMaxSteps(parseInt(storedMaxSteps, 10))
    }
  }, [])

  const handleChangePosition = () => {
    const stepNumber = parseInt(newStep, 10)
    
    // Vérifier que c'est un nombre valide
    if (isNaN(stepNumber)) {
      return
    }

    // Vérifier que c'est dans les limites (1 à maxSteps)
    if (stepNumber < 1 || stepNumber > maxSteps) {
      return
    }

    // Mettre à jour la position (convertir case en index: case 1 = index 0)
    const indexPosition = stepNumber - 1
    localStorage.setItem('gameProgress', indexPosition.toString())
    setCurrentStep(indexPosition)
    setNewStep('')
    
    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(new Event('localStorageUpdated'))
  }

  const handleChangeMaxSteps = () => {
    const newMax = parseInt(newMaxSteps, 10)
    
    // Vérifier que c'est un nombre valide
    if (isNaN(newMax)) {
      return
    }

    // Vérifier que c'est au minimum 1
    if (newMax < 1) {
      return
    }

    // Mettre à jour le nombre d'étapes
    localStorage.setItem('gameMaxSteps', newMax.toString())
    setMaxSteps(newMax)
    setNewMaxSteps('')

    // Ajuster la position actuelle si elle dépasse la nouvelle limite
    if (currentStep >= newMax) {
      const newPosition = newMax - 1
      localStorage.setItem('gameProgress', newPosition.toString())
      setCurrentStep(newPosition)
    }
    
    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(new Event('localStorageUpdated'))
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg border-2 border-blue-400/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center justify-center gap-2 text-base">
            <MapPin className="h-5 w-5" />
            Modifier la Position
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Position actuelle */}
          <div className="bg-white/10 rounded-lg p-3 border border-white/30">
            <p className="text-white/70 text-xs mb-1">Position actuelle</p>
            <p className="text-white text-2xl font-bold text-center">
              Case {currentStep + 1} / {maxSteps}
            </p>
          </div>

          {/* Changer le nombre total d'étapes */}
          <div className="space-y-2">
            <Label htmlFor="new-max-steps" className="text-white">
              Nombre total d'étapes
            </Label>
            <div className="flex gap-2">
              <Input
                id="new-max-steps"
                type="number"
                min="1"
                value={newMaxSteps}
                onChange={(e) => setNewMaxSteps(e.target.value)}
                placeholder={`Actuel: ${maxSteps}`}
                className="text-center font-mono bg-white/90"
              />
              <Button 
                onClick={handleChangeMaxSteps}
                size="icon"
                className="shrink-0 bg-cyan-500 hover:bg-cyan-600"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Changer la position */}
          <div className="space-y-2">
            <Label htmlFor="new-position" className="text-white">
              Nouvelle position (1 à {maxSteps})
            </Label>
            <div className="flex gap-2">
              <Input
                id="new-position"
                type="number"
                min="1"
                max={maxSteps}
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                placeholder="Ex: 10"
                className="text-center font-mono bg-white/90"
              />
              <Button 
                onClick={handleChangePosition}
                size="icon"
                className="shrink-0 bg-blue-500 hover:bg-blue-600"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-white/60 text-xs">
              💡 Entrez le numéro de la case souhaitée
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
