# Architecture Mobile - Guide de Développement

## 📱 Structure de l'Application Mobile

L'application est conçue avec une architecture mobile-first qui s'adapte parfaitement aux téléphones.

### 🏗️ Composants de Layout

#### `MobileLayout`
Composant parent principal qui gère l'architecture générale :
- **Viewport 100vh** - Prend toute la hauteur de l'écran
- **Flex column** - Organisation verticale
- **Pas de scroll parent** - Le scroll est géré dans les composants enfants

```tsx
<MobileLayout
  navigation={<BottomNavigation />}
>
  <MainContent />
</MobileLayout>
```

#### `BottomNavigation`
Barre de navigation en bas de l'écran :
- **Position fixe** en bas
- **5 onglets** configurables
- **Icônes + labels** pour une UX claire
- **État actif** avec couleurs distinctives

#### `MainContent`
Zone de contenu principal :
- **Header fixe** avec titre et actions
- **Contenu scrollable** avec gestion optimisée
- **Padding safe-area** pour les encoches iPhone

### 🎨 Conception Mobile-First

#### Tailles d'écran supportées
- **XS (0-639px)** - Téléphones portrait
- **SM (640-767px)** - Téléphones paysage / petites tablettes
- **MD (768-1023px)** - Tablettes
- **LG+ (1024px+)** - Écrans plus larges

#### Optimisations mobiles
- **Safe Area** - Support des encoches iOS
- **Touch targets** - Boutons optimisés pour le tactile (44px min)
- **Scroll performance** - `-webkit-overflow-scrolling: touch`
- **Tap highlights** - Suppression des highlights par défaut

### 🔧 Configuration Viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
```

#### Propriétés importantes :
- `viewport-fit=cover` - Utilise tout l'écran (encoches)
- `user-scalable=no` - Empêche le zoom involontaire
- `maximum-scale=1.0` - Verrouille le niveau de zoom

### 📐 Structure des Composants

```
MobileLayout (100vh, flex-col)
├── MainContent (flex-1, overflow-hidden)
│   ├── Header (flex-shrink-0, sticky)
│   └── Content (flex-1, overflow-y-auto)
│       ├── Sections...
│       └── Safe padding bottom
└── BottomNavigation (flex-shrink-0, fixed height)
```

### 🎯 Bonnes Pratiques

#### 1. Gestion de l'espace
- **Pas de scroll horizontal** - `overflow-x: hidden`
- **Contenu adaptatif** - Utiliser `min-h-0` si nécessaire
- **Padding safe-area** - `env(safe-area-inset-bottom)`

#### 2. Navigation tactile
- **Zone de touch minimum** - 44px × 44px
- **Espacement suffisant** - 8px entre éléments cliquables
- **Feedback visuel** - États hover/active

#### 3. Performance
- **Lazy loading** - Images et composants lourds
- **Optimisation scroll** - `will-change: scroll-position`
- **Réduction des animations** - Respecter `prefers-reduced-motion`

### 🛠️ Composants Utilitaires

#### ResponsiveTestCard
Composant de debug pour tester la responsivité :
- Affiche la taille d'écran actuelle
- Montre les breakpoints Tailwind
- Bouton de rechargement rapide

### 📱 Tests sur Appareils

#### Émulation navigateur
1. **Chrome DevTools** - F12 → Toggle device toolbar
2. **Responsive mode** - Tester différentes tailles
3. **Throttling réseau** - Simuler 3G/4G

#### Appareils réels
- **iPhone** - Safari + Chrome
- **Android** - Chrome + Samsung Internet
- **Tablettes** - iPad Safari + Android Chrome

### 🔧 Scripts de développement

```bash
# Serveur dev avec accès réseau
npm run dev -- --host

# Build optimisé
npm run build

# Prévisualisation build
npm run preview
```

### 📊 Métriques importantes

#### Performance mobile
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1
- **First Input Delay** < 100ms

#### Accessibilité
- **Contraste minimum** 4.5:1
- **Tailles tactiles** ≥ 44px
- **Navigation clavier** complète
- **Lecteurs d'écran** compatibles

## 🚀 Prochaines étapes

1. **Ajout de pages** - Router pour navigation entre écrans
2. **Gestes tactiles** - Swipe, pinch-to-zoom
3. **Mode hors-ligne** - Service Worker + Cache
4. **Notifications** - Push notifications web
5. **Installation PWA** - Web App Manifest