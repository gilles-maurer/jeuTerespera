import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ResponsiveTestCard() {
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-sm">🔧 Test Responsive</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="p-2 bg-red-100 rounded text-red-800 sm:bg-orange-100 sm:text-orange-800 md:bg-yellow-100 md:text-yellow-800 lg:bg-green-100 lg:text-green-800 xl:bg-blue-100 xl:text-blue-800">
            <span className="block sm:hidden">📱 XS (0-639px)</span>
            <span className="hidden sm:block md:hidden">📱 SM (640-767px)</span>
            <span className="hidden md:block lg:hidden">💻 MD (768-1023px)</span>
            <span className="hidden lg:block xl:hidden">🖥️ LG (1024-1279px)</span>
            <span className="hidden xl:block">🖥️ XL (1280px+)</span>
          </div>
          
          <div className="text-xs text-gray-600">
            <div>Largeur: <span className="font-mono">{typeof window !== 'undefined' ? `${window.innerWidth}px` : 'N/A'}</span></div>
            <div>Hauteur: <span className="font-mono">{typeof window !== 'undefined' ? `${window.innerHeight}px` : 'N/A'}</span></div>
          </div>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="text-xs"
          >
            🔄 Actualiser
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}