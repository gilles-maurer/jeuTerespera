import { cn } from '@/lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'

interface GamePathProps {
  maxSteps: number
  currentStep: number
  characterImage?: string | null
  className?: string
}

export function GamePath({ maxSteps, currentStep, characterImage, className }: GamePathProps) {
  const progressPercentage = ((currentStep + 1) / maxSteps) * 100

  // Mesure du conteneur pour un layout responsive
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect
      setSize({ width: cr.width, height: cr.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

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

  // Paramètres responsives dérivés de la taille du conteneur
  const layout = useMemo(() => {
    const w = size.width
    const h = size.height
    if (!w || !h) {
      return {
        nodeW: 120,
        nodeH: 128,
        radius: 220,
        angleSpacing: 38,
        yOffset: 220 * 0.66,
        charSize: 144,
      }
    }

    const arcMargin = Math.min(w, h) * 0.03
    // Réduire la largeur et augmenter la hauteur des cases (plus hautes et un peu plus étroites)
    const nodeW = Math.min(Math.max(w * 0.28, 80), 160) // 80..160 px
    const nodeH = Math.min(
      Math.max(nodeW * 0.95, 64),
      Math.min(h * 0.28, nodeW * 1.1)
    )

    let radius = Math.min(
      w / 2 - nodeW / 2 - arcMargin,
      h * 0.72 - nodeH / 2
    )
    radius = Math.max(80, radius)

  // Augmenter encore l'espacement pour éviter le chevauchement et mieux aérer
  const desiredSpacingPx = nodeW * 1.25
    const angleSpacingRad = Math.min(
      Math.max(desiredSpacingPx / Math.max(1, radius), 0.3),
      0.7
    ) // ~17°..40°
    const angleSpacing = angleSpacingRad * (180 / Math.PI)

  const yOffset = Math.max(nodeH * 0.9, radius * 0.68)

  const charSize = Math.min(Math.max(w * 0.24, 96), 160)

    return { nodeW, nodeH, radius, angleSpacing, yOffset, charSize }
  }, [size.width, size.height])

  // Espacement angulaire adaptatif: plus large près du centre, plus serré aux extrémités
  const stepFactorForDistance = (d: number) => {
    // Courbe douce: plus grand au centre, plus petit en s'éloignant
    const base = 1.0
    const boost = 0.45
    const k = 5
    return base + boost * Math.exp(-k * d * d)
  }

  const angleForPosition = (position: number) => {
    const s = Math.sign(position)
    const steps = Math.abs(position)
    let factorSum = 0
    for (let i = 0; i < steps; i++) {
      factorSum += stepFactorForDistance(i)
    }
    return s * factorSum * layout.angleSpacing
  }

  // Fonction pour calculer la position d'une case sur l'arc
  const getArcPosition = (position: number) => {
    const angle = angleForPosition(position)
    const angleRad = (angle * Math.PI) / 180

    // Position X et Y sur l'arc
    const x = Math.sin(angleRad) * layout.radius
    const y = -Math.cos(angleRad) * layout.radius + layout.yOffset

    // Scale et opacity basés sur la distance au centre
    const distance = Math.abs(position)
    const scale = Math.max(0.6, 1 - distance * 0.15)
    const opacity = Math.max(0.4, 1 - distance * 0.2)
    
    return { x, y, scale, opacity, angle }
  }

  return (
  <div className={cn("relative w-full h-full flex flex-col items-center justify-between p-0 overflow-hidden", className)}>
      
      {/* MINI-MAP en haut - Vue d'ensemble stylée */}
      <div className="w-full max-w-full">
  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-1.5 border border-white/30 shadow-xl">
          {/* Titre de la mini-map */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              Progression
            </h3>
            <span className="text-white/80 text-xs font-semibold bg-white/10 px-3 py-1 rounded-full">
              {currentStep + 1}/{maxSteps}
            </span>
          </div>

          {/* Barre de progression avec gradient */}
          <div className="relative w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
            {/* Indicateur de position actuelle */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-500 shadow-lg transition-all duration-700"
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
      <div className="flex-1 flex items-center justify-center w-full relative py-0">
        <div ref={containerRef} className="relative w-full h-full" style={{ perspective: '700px' }}>
          
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
                    transform: `translate(${x}px, ${y}px) scale(${scale})`,
                    width: `${layout.nodeW}px`,
                    height: `${layout.nodeH}px`,
                    opacity,
                    zIndex: isCurrent ? 20 : 10 - Math.abs(step.position),
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Case ovale (ellipse) */}
                  <div
                    className={cn(
                      "relative rounded-[50%] border-4 backdrop-blur-sm shadow-2xl",
                      isCurrent && "border-yellow-400 bg-gradient-to-br from-yellow-400/50 to-orange-500/50 shadow-yellow-400/50",
                      isPast && "border-green-400/60 bg-gradient-to-br from-green-400/30 to-blue-500/30 shadow-green-400/30",
                      isFuture && "border-purple-400/60 bg-gradient-to-br from-purple-500/30 to-pink-500/30 shadow-purple-400/30"
                    )}
                    style={{
                      width: '100%',
                      height: '100%',
                      transition: 'all 0.5s ease-in-out',
                      transform: 'rotateX(65deg)',
                      transformOrigin: 'center center',
                      boxShadow: '0 18px 40px rgba(0,0,0,0.35), inset 0 10px 18px rgba(255,255,255,0.22), inset 0 -16px 26px rgba(0,0,0,0.25)'
                    }}
                  >
                    {/* Effets de volume et de brillance */}
                    {/* <div className="absolute inset-0 rounded-[50%]"
                         style={{
                           background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.08) 40%, rgba(0,0,0,0.18) 100%)'
                         }}
                    />
                    <div className="absolute inset-0 rounded-[50%]"
                         style={{
                           boxShadow: 'inset 0 0 24px rgba(0,0,0,0.25)'
                         }}
                    /> */}


                    {/* Indicateur pour la case actuelle (anneau subtil) */}
                    {isCurrent && (
                      <div className="absolute -inset-2 border-2 border-yellow-300 rounded-[50%] animate-ping"></div>
                    )}
                    {/* Indicateur pour les cases passées */}
                    {isPast && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Le numéro est désormais rendu dans une couche séparée hors du contexte de perspective */}
                </div>
              )
            })}
          </div>

          {/* Couche séparée pour les numéros (aucun rotateX ni perspective) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 25 }}>
            {visibleSteps.map((step) => {
              const { x, y, scale, opacity } = getArcPosition(step.position)
              const isCurrent = step.position === 0
              return (
                <div
                  key={`num-${step.index}`}
                  className="absolute flex items-center justify-center"
                  style={{
                    transform: `translate(${x}px, ${y}px) scale(${scale})`,
                    width: `${layout.nodeW}px`,
                    height: `${layout.nodeH}px`,
                    opacity,
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'transform, opacity'
                  }}
                >
                  <span
                    className={cn(
                      'font-extrabold drop-shadow',
                      isCurrent ? 'text-3xl' : 'text-2xl',
                      'text-white'
                    )}
                    style={{ letterSpacing: '0.5px', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
                  >
                    {step.number}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Personnage au-dessus des cases */}
    <div className="absolute inset-0 flex items-center justify-center"
      style={{ transform: `translateY(${(-layout.radius + layout.yOffset) - layout.charSize * 0.7}px)` }}>
            <div className="relative z-30">
              {/* Effet de lumière */}
              <div className="absolute inset-0 -m-8 bg-gradient-to-b from-blue-400/30 via-purple-500/30 to-pink-500/30 rounded-full blur-2xl animate-pulse"></div>
              
              {/* Personnage */}
              <div className="relative">
                {characterImage ? (
                  <div className="relative z-10 flex items-center justify-center" style={{ width: `${layout.charSize}px`, height: `${layout.charSize}px` }}>
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
                  <div className="flex items-center justify-center" style={{ width: `${layout.charSize}px`, height: `${layout.charSize}px` }}>
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

      {/* Message de fin uniquement (suppression de "Prochaine étape" pour gagner de la place) */}
      {currentStep === maxSteps - 1 && (
  <div className="w-full max-w-full mb-2">
          <div className="bg-gradient-to-r from-yellow-400/30 to-orange-500/30 backdrop-blur-md rounded-xl p-3 border-2 border-yellow-400/50 animate-pulse">
            <p className="text-white font-bold text-center text-base flex items-center justify-center gap-2">
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

