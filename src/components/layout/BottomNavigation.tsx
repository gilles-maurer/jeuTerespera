import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Home, Search, Heart, User, Plus } from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
  active?: boolean
}

interface BottomNavigationProps {
  items?: NavigationItem[]
  className?: string
}

const defaultItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Accueil',
    icon: <Home className="h-5 w-5" />,
    active: true
  },
  {
    id: 'search',
    label: 'Rechercher',
    icon: <Search className="h-5 w-5" />
  },
  {
    id: 'add',
    label: 'Ajouter',
    icon: <Plus className="h-5 w-5" />
  },
  {
    id: 'favorites',
    label: 'Favoris',
    icon: <Heart className="h-5 w-5" />
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: <User className="h-5 w-5" />
  }
]

export function BottomNavigation({ items = defaultItems, className }: BottomNavigationProps) {
  return (
    <div className={cn(
      "bg-white border-t border-gray-200 px-4 py-2 safe-area-pb",
      "flex items-center justify-around",
      "min-h-[60px]",
      className
    )}>
      {items.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          size="sm"
          onClick={item.onClick}
          className={cn(
            "flex flex-col items-center justify-center gap-1 h-auto py-2 px-3",
            "hover:bg-gray-100 transition-colors",
            item.active && "text-primary"
          )}
        >
          <div className={cn(
            "transition-colors",
            item.active ? "text-primary" : "text-gray-600"
          )}>
            {item.icon}
          </div>
          <span className={cn(
            "text-xs font-medium transition-colors",
            item.active ? "text-primary" : "text-gray-600"
          )}>
            {item.label}
          </span>
        </Button>
      ))}
    </div>
  )
}