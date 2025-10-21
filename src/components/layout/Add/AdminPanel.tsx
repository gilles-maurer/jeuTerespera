import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Shield } from 'lucide-react'

export function AdminPanel() {
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem('isAdminMode') === 'true'
  })

  const toggleAdminMode = () => {
    const newValue = !isAdminMode
    setIsAdminMode(newValue)
    localStorage.setItem('isAdminMode', newValue.toString())
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
        </CardContent>
      </Card>
    </div>
  )
}
