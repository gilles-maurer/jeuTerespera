// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
// import { Bell, Settings, ChevronRight } from 'lucide-react'
// import { ResponsiveTestCard } from '@/components/debug/ResponsiveTestCard'

import background from '@/assets/background/boutique.png'

interface AddProps {
  className?: string
}

export function Add({ className }: AddProps) {
  return (
    <div className={cn('flex-1 h-screen relative overflow-hidden', className)}>
        <img
            src={background}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-70"
        />

        {/* optional tint/overlay to tweak contrast */}
        <div aria-hidden className="absolute inset-0 bg-black/30 pointer-events-none" />

        <div className="relative z-10 p-6">
            Coucou ! Ceci est la page User.
        </div>
    </div>
  )
}