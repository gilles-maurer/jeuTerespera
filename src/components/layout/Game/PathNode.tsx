import { cn } from '@/lib/utils'

interface PathNodeProps {
  nodeNumber: number
  state: 'past' | 'current' | 'future'
  className?: string
}

export function PathNode({ nodeNumber, state, className }: PathNodeProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
          "border-2 shadow-lg",
          state === 'past' && "bg-green-500/80 border-green-600 text-white backdrop-blur-sm",
          state === 'current' && "bg-blue-500 border-blue-600 text-white scale-125 shadow-2xl ring-4 ring-blue-300/50",
          state === 'future' && "bg-white/40 border-white/60 text-white backdrop-blur-sm"
        )}
      >
        {nodeNumber}
      </div>
      
      {/* Indicateur spécial pour la case actuelle */}
      {state === 'current' && (
        <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-20" />
      )}
    </div>
  )
}
