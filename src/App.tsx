import { useState } from 'react'
import { MobileLayout, BottomNavigation, MainContent } from '@/components/layout'
import { Home, Plus, User } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  const navigationItems = [
    {
      id: 'user',
      label: 'Mon profil',
      icon: <User className="h-5 w-5" />,
      active: activeTab === 'user',
      onClick: () => setActiveTab('user')
    },
    {
      id: 'home',
      label: 'Accueil',
      icon: <Home className="h-5 w-5" />,
      active: activeTab === 'home',
      onClick: () => setActiveTab('home')
    },

    {
      id: 'add',
      label: 'Ajouter',
      icon: <Plus className="h-5 w-5" />,
      active: activeTab === 'add',
      onClick: () => setActiveTab('add')
    },
  ]

  return (
    <MobileLayout
      navigation={<BottomNavigation items={navigationItems} />}
    >
      <MainContent activeTab={activeTab} />
    </MobileLayout>
  )
}

export default App
