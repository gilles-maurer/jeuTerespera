import { cn } from '@/lib/utils'

interface GamePathProps {
  maxSteps: number
  currentStep: number
  characterImage?: string | null
  className?: string
}

export function GamePath({ maxSteps, currentStep, characterImage, className }: GamePathProps) {
  const progressPercentage = ((currentStep + 1) / maxSteps) * 100

  // Calculer les cases à afficher (2 avant, actuelle, 2 après)
  const visibleSteps = []
  for (let i = -2; i <= 2; i++) {
    const stepIndex = currentStep + i
    if (stepIndex >= 0 && stepIndex < maxSteps) {
      visibleSteps.push({
        index: stepIndex,
        position: i,
        number: stepIndex + 1
      })
    }
  }

  // Fonction pour calculer la position d'une case sur l'arc
  const getArcPosition = (position: number) => {
    const radius = 180 // Rayon de l'arc en pixels
    const angleSpacing = 35 // Espacement entre les cases en degrés
    const angle = position * angleSpacing
    const angleRad = (angle * Math.PI) / 180

    // Position X et Y sur l'arc
    const x = Math.sin(angleRad) * radius
    const y = -Math.cos(angleRad) * radius + radius * 0.6 // Décalage vers le haut

    // Scale et opacity basés sur la distance au centre
    const distance = Math.abs(position)
    const scale = Math.max(0.6, 1 - distance * 0.15)
    const opacity = Math.max(0.4, 1 - distance * 0.2)
    
    return { x, y, scale, opacity, angle }
  }

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

      {/* ZONE PRINCIPALE - Arc de cercle avec cases et personnage au centre */}
      <div className="flex-1 flex items-center justify-center w-full relative py-8">
        <div className="relative w-full max-w-md h-[400px]" style={{ perspective: '1000px' }}>
          
          {/* Cases en arc de cercle */}
          <div className="absolute inset-0 flex items-center justify-center">
            {visibleSteps.map((step) => {
              const { x, y, scale, opacity } = getArcPosition(step.position)
              const isCurrent = step.position === 0
              const isPast = step.position < 0
              const isFuture = step.position > 0
              
              return (
                <div
                  key={`step-${step.index}`}
                  className="absolute ease-in-out"
                  style={{
                    transform: `translate(${x}px, ${y}px) scale(${scale}) rotateX(60deg)`,
                    opacity,
                    zIndex: isCurrent ? 20 : 10 - Math.abs(step.position),
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Case ovale (ellipse pour simuler la profondeur) */}
                  <div
                    className={cn(
                      "relative w-28 h-20 rounded-[50%] border-4 backdrop-blur-sm shadow-2xl",
                      isCurrent && "border-yellow-400 bg-gradient-to-br from-yellow-400/50 to-orange-500/50 shadow-yellow-400/50",
                      isPast && "border-green-400/60 bg-gradient-to-br from-green-400/30 to-blue-500/30 shadow-green-400/30",
                      isFuture && "border-purple-400/60 bg-gradient-to-br from-purple-500/30 to-pink-500/30 shadow-purple-400/30"
                    )}
                    style={{
                      transition: 'all 0.5s ease-in-out'
                    }}
                  >
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-white/20 rounded-[50%]"></div>
                    
                    {/* Badge avec le numéro (au-dessus de la case) */}
                    <div 
                      className="absolute -top-8 left-1/2 -translate-x-1/2 z-10"
                      style={{
                        transition: 'all 0.5s ease-in-out'
                      }}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center border-3 shadow-lg",
                          isCurrent && "bg-gradient-to-br from-yellow-400 to-orange-500 border-white scale-125 animate-pulse",
                          isPast && "bg-gradient-to-br from-green-400 to-green-600 border-white/80",
                          isFuture && "bg-gradient-to-br from-purple-500 to-pink-500 border-white/80"
                        )}
                      >
                        <span
                          className={cn(
                            "font-black text-white",
                            isCurrent ? "text-2xl" : "text-lg"
                          )}
                          style={{
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                            transition: 'all 0.3s ease-in-out'
                          }}
                        >
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Indicateur pour la case actuelle */}
                    {isCurrent && (
                      <>
                        <div className="absolute -inset-2 border-2 border-yellow-300 rounded-[50%] animate-ping"></div>
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                          <div className="text-2xl animate-bounce">⭐</div>
                        </div>
                      </>
                    )}

                    {/* Indicateur pour les cases passées */}
                    {isPast && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Personnage au centre */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ marginTop: '100px' }}>
            <div className="relative z-30">
              {/* Effet de lumière */}
              <div className="absolute inset-0 -m-8 bg-gradient-to-b from-blue-400/30 via-purple-500/30 to-pink-500/30 rounded-full blur-2xl animate-pulse"></div>
              
              {/* Personnage */}
              <div className="relative">
                {characterImage ? (
                  <div className="relative z-10 w-32 h-32 flex items-center justify-center">
                    <img
                      src={characterImage}
                      alt="Character"
                      className="max-h-full max-w-full object-contain drop-shadow-2xl"
                      style={{
                        filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))',
                        animation: 'float 3s ease-in-out infinite'
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center">
                    <div className="text-6xl" style={{ animation: 'float 3s ease-in-out infinite' }}>👤</div>
                  </div>
                )}

                {/* Plateforme sous le personnage */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-white/20 rounded-[50%] blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message de fin ou prochaine étape */}
      <div className="w-full max-w-md mb-16">
        {currentStep === maxSteps - 1 ? (
          <div className="bg-gradient-to-r from-yellow-400/30 to-orange-500/30 backdrop-blur-md rounded-xl p-4 border-2 border-yellow-400/50 animate-pulse">
            <p className="text-white font-bold text-center text-lg flex items-center justify-center gap-2">
              🏆 Dernière case ! 🏆
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-white/60 text-sm mb-1">Prochaine étape</p>
            <p className="text-white font-bold text-xl">Case {currentStep + 2}</p>
          </div>
        )}
      </div>

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

