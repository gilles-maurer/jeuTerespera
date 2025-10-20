import { PathNode } from './PathNode'
import { cn } from '@/lib/utils'

interface GamePathProps {
  maxSteps: number
  currentStep: number
  characterImage?: string | null
  className?: string
}

export function GamePath({ maxSteps, currentStep, characterImage, className }: GamePathProps) {
  const progressPercentage = ((currentStep + 1) / maxSteps) * 100

  return (
    <div className={cn("relative w-full h-full flex flex-col items-center justify-between p-4 pb-2 overflow-hidden", className)}>
      
      {/* MINI-MAP en haut - Vue d'ensemble stylée */}
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-2xl">
          {/* Titre de la mini-map */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              Progression
            </h3>
            <span className="text-white/80 text-xs font-semibold bg-white/10 px-3 py-1 rounded-full">
              {currentStep + 1}/{maxSteps}
            </span>
          </div>

          {/* Barre de progression avec gradient */}
          <div className="relative w-full h-3 bg-white/20 rounded-full overflow-hidden mb-3">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
            {/* Indicateur de position actuelle */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 border-blue-500 shadow-lg transition-all duration-700"
              style={{ left: `${progressPercentage}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          {/* Mini chemin avec toutes les cases */}
          <div className="flex items-center gap-1 overflow-hidden">
            {Array.from({ length: maxSteps }).map((_, index) => {
              const state = 
                index < currentStep ? 'past' :
                index === currentStep ? 'current' :
                'future'
              
              return (
                <div
                  key={index}
                  className={cn(
                    "flex-shrink-0 w-1.5 h-1.5 rounded-full transition-all duration-500",
                    state === 'past' && "bg-green-400 shadow-sm shadow-green-400/50",
                    state === 'current' && "bg-blue-500 scale-150 shadow-lg shadow-blue-500/50 ring-2 ring-blue-300/50",
                    state === 'future' && "bg-white/30"
                  )}
                />
              )
            })}
          </div>

          {/* Étapes importantes (chaque 10 cases) */}
          <div className="flex justify-between mt-2 text-xs text-white/60">
            <span>Départ</span>
            {maxSteps >= 20 && <span>Mi-parcours</span>}
            <span>Arrivée</span>
          </div>
        </div>
      </div>

      {/* ZONE PRINCIPALE - Case actuelle en GRAND avec personnage */}
      <div className="flex-1 flex items-center justify-center w-full max-w-md relative py-4">
        <div className="relative">
          {/* Effet de lumière autour du personnage */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Case actuelle ÉNORME */}
          <div className="relative">
            {/* Anneaux d'énergie autour */}
            <div className="absolute inset-0 -m-8">
              <div className="absolute inset-0 border-2 border-blue-400/30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 border-2 border-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
            </div>

            {/* Plateforme de la case actuelle */}
            <div className="relative bg-gradient-to-br from-blue-500/40 to-purple-600/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border-4 border-white/50 shadow-2xl">
              <div className="absolute inset-0 bg-white/10 rounded-3xl animate-pulse"></div>
              
              {/* Numéro de case */}
              <div className="absolute -top-4 -right-4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <span className="text-white font-black text-lg md:text-xl">{currentStep + 1}</span>
              </div>

              {/* Personnage */}
              {characterImage ? (
                <div className="relative z-10 w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
                  <img
                    src={characterImage}
                    alt="Character"
                    className="max-h-full max-w-full object-contain drop-shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">👤</div>
                </div>
              )}

              {/* Étoiles décoratives */}
              <div className="absolute top-4 left-4 text-yellow-300 animate-pulse text-lg md:text-xl">✨</div>
              <div className="absolute bottom-4 right-4 text-yellow-300 animate-pulse text-lg md:text-xl" style={{ animationDelay: '0.5s' }}>✨</div>
              <div className="absolute top-4 right-12 text-yellow-300 animate-pulse text-lg md:text-xl" style={{ animationDelay: '1s' }}>⭐</div>
            </div>
          </div>
        </div>
      </div>

      {/* APERÇU - Prochaine case (si pas à la fin) */}
      {currentStep < maxSteps - 1 && (
        <div className="w-full max-w-md mb-16">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="relative">
                <PathNode nodeNumber={currentStep + 2} state="future" />
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  ➜
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-white/60 text-xs">Prochaine étape</p>
              <p className="text-white font-bold">Case {currentStep + 2}</p>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
        </div>
      )}

      {/* Message de fin */}
      {currentStep === maxSteps - 1 && (
        <div className="w-full max-w-md mb-16">
          <div className="bg-gradient-to-r from-yellow-400/30 to-orange-500/30 backdrop-blur-md rounded-xl p-4 border-2 border-yellow-400/50 animate-pulse">
            <p className="text-white font-bold text-center text-lg flex items-center justify-center gap-2">
              🏆 Dernière case ! 🏆
            </p>
          </div>
        </div>
      )}

      {/* Animation CSS pour le flottement */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

