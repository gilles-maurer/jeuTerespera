import { useState } from 'react'
import { MobileLayout, BottomNavigation, MainContent } from '@/components/layout'
import { Swords, Star, User } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('user')

  const navigationItems = [
    {
      id: 'user',
      label: 'Choix du personnage',
      icon: <User className="h-5 w-5" />,
      active: activeTab === 'user',
      onClick: () => setActiveTab('user')
    },
    {
      id: 'home',
      label: 'Accueil',
      icon: <Swords className="h-5 w-5" />,
      active: activeTab === 'home',
      onClick: () => setActiveTab('home')
    },

    {
      id: 'add',
      label: 'Ajouter',
      icon: <Star className="h-5 w-5" />,
      active: activeTab === 'add',
      onClick: () => setActiveTab('add')
    },
  ]

  return (
    <MobileLayout
      navigation={<BottomNavigation items={navigationItems} />}
      className="h-full"
    >
      <MainContent activeTab={activeTab} />
    </MobileLayout>
  )
}

export default App
