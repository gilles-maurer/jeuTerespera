// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
// import { Bell, Settings, ChevronRight } from 'lucide-react'
// import { ResponsiveTestCard } from '@/components/debug/ResponsiveTestCard'
import { User } from './User/User'
import { Game } from './Game'
import { Add } from './Add'

interface MainContentProps {
  activeTab: string,
  className?: string
}

export function MainContent({ activeTab, className }: MainContentProps) {
  return (
    <div className={cn("h-full flex flex-col bg-gray-50", className)}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">The Esmariran Show</h1>
            <p className="text-sm text-gray-500">By Bibule</p>
          </div>
          {/* <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Settings className="h-5 w-5" />
            </Button>
          </div> */}
        </div>
      </header>

      {/* Contenu scrollable */}
      {activeTab === 'home' && <Game/>}
      {activeTab === 'user' && <User/>}
      {activeTab === 'add' && <Add/>}
    </div>
  )
}