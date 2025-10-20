import React from 'react'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: React.ReactNode
  navigation: React.ReactNode
  className?: string
}

export function MobileLayout({ children, navigation, className }: MobileLayoutProps) {
  return (
    <div className={cn("flex flex-col h-screen w-full overflow-hidden", className)}>
      {/* Contenu principal - prend tout l'espace disponible */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      
      {/* Barre de navigation - hauteur fixe */}
      <nav className="flex-shrink-0">
        {navigation}
      </nav>
    </div>
  )
}