import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Shield, RefreshCw } from 'lucide-react'
import { useGameStore } from '@/store/gameStore'

export function AdminPanel() {
  const isAdminMode = useGameStore(s => s.isAdminMode)
  const setIsAdminMode = useGameStore(s => s.setIsAdminMode)
  const resetAll = useGameStore(s => s.resetAll)

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode)
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-lg border-2 border-purple-400/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center justify-center gap-2 text-base">
            <Shield className="h-5 w-5" />
            Panneau Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/10 rounded-lg p-4 border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="admin-switch" className="text-white font-semibold">
                  Mode Administrateur
                </Label>
                <p className="text-white/70 text-xs mt-1">
                  {isAdminMode ? 'Activé' : 'Désactivé'}
                </p>
              </div>
              
              {/* Switch Toggle */}
              <button
                id="admin-switch"
                onClick={toggleAdminMode}
                className={`
                  relative inline-flex h-8 w-14 items-center rounded-full transition-colors
                  ${isAdminMode ? 'bg-green-500' : 'bg-gray-400'}
                `}
                role="switch"
                aria-checked={isAdminMode}
              >
                <span
                  className={`
                    inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                    ${isAdminMode ? 'translate-x-7' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>

          {isAdminMode && (
            <div className="bg-green-500/20 rounded-lg p-3 border border-green-400/50 animate-in fade-in">
              <p className="text-white text-sm text-center">
                ✅ Accès administrateur accordé
              </p>
            </div>
          )}

          {/* Liste des codes */}
          <div className="bg-white/10 rounded-lg p-4 border border-white/30">
            <h3 className="text-white font-semibold mb-3 text-center">📝 Codes disponibles</h3>
            <div className="space-y-2">
              <div className="bg-black/20 rounded p-2">
                <p className="text-white font-mono text-sm">admin12*</p>
                <p className="text-white/60 text-xs">Ouvre ce panneau admin</p>
              </div>
              <div className="bg-black/20 rounded p-2">
                <p className="text-white font-mono text-sm">position99</p>
                <p className="text-white/60 text-xs">Modifier la position et le nombre d'étapes</p>
              </div>
              <div className="bg-black/20 rounded p-2">
                <p className="text-white font-mono text-sm">quiz77</p>
                <p className="text-white/60 text-xs">Quiz 77 - Texte à trous (+3 cases)</p>
              </div>
              <div className="bg-black/20 rounded p-2">
                <p className="text-white font-mono text-sm">quiz88</p>
                <p className="text-white/60 text-xs">Quiz 88 - QCM (bonus proportionnel, max 5 cases)</p>
              </div>
            </div>
          </div>

          {isAdminMode && (
            <div className="bg-white/10 rounded-lg p-4 border border-white/30">
              <h3 className="text-white font-semibold mb-3 text-center">⚠️ Réinitialisation totale</h3>
              <Button
                onClick={() => {
                  // Nettoyer les clés de quiz dans le localStorage
                  const keysToRemove: string[] = []
                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i)
                    if (key && key.startsWith('quiz_')) keysToRemove.push(key)
                  }
                  keysToRemove.forEach(k => localStorage.removeItem(k))
                  // Réinitialiser le store
                  resetAll()
                }}
                className="w-full bg-red-500/80 hover:bg-red-600 text-white border border-red-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                [Admin] Tout réinitialiser
              </Button>
              <p className="text-white/70 text-xs mt-2 text-center">
                Efface la progression, l'étoile et les données des quiz.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
