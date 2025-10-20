# React + Shadcn/UI Project

Un projet React moderne avec Shadcn/UI, Tailwind CSS et TypeScript.

## 🚀 Technologies utilisées

- **React 19** - Framework UI moderne
- **TypeScript** - Typage statique pour JavaScript
- **Vite** - Build tool rapide et moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **Shadcn/UI** - Collection de composants réutilisables
- **Lucide React** - Icônes SVG modernes
- **Radix UI** - Composants accessibles et sans style

## 📦 Installation

1. Clonez le projet
2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

4. Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur

## 🎨 Composants disponibles

### Composants de base
- **Button** - Bouton avec différentes variantes (default, secondary, outline, ghost, link, destructive)
- **Card** - Conteneur avec header, content et footer
- **Input** - Champ de saisie stylisé
- **Label** - Label accessible pour les formulaires

### Variantes de Button
```tsx
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>
```

### Tailles de Button
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Exemple de Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Contenu de la carte</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Exemple de formulaire
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="votre@email.com"
  />
</div>
```

## 🎯 Fonctionnalités de la démo

L'application de démonstration inclut :

1. **Counter interactif** - Démonstration des états React
2. **Formulaire de contact** - Utilisation des composants Input et Label
3. **Galerie de boutons** - Toutes les variantes de boutons disponibles
4. **Cartes d'information** - Présentation des technologies utilisées

## 📁 Structure du projet

```
src/
├── components/
│   └── ui/           # Composants Shadcn/UI
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
├── lib/
│   └── utils.ts      # Utilitaires (cn function)
├── App.tsx           # Composant principal
├── index.css         # Styles Tailwind + variables CSS
└── main.tsx          # Point d'entrée
```

## 🛠️ Configuration

### Tailwind CSS
La configuration Tailwind est dans `tailwind.config.js` et inclut :
- Système de couleurs personnalisé avec variables CSS
- Classes utilitaires pour les composants Shadcn/UI
- Configuration responsive

### TypeScript
Le projet utilise TypeScript avec une configuration stricte pour :
- Vérification de types en temps réel
- IntelliSense amélioré
- Détection d'erreurs précoce

### Alias de chemin
Les imports utilisent l'alias `@/` pour pointer vers `src/` :
```tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

## 🎨 Thème et couleurs

Le projet utilise un système de variables CSS pour les couleurs :
- Mode clair et sombre supportés
- Variables CSS personnalisables
- Cohérence visuelle garantie

## 📚 Ressources

- [Shadcn/UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Documentation](https://react.dev/)

## 🚀 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build
- `npm run lint` - Vérification ESLint

## 📄 Licence

Ce projet est libre d'utilisation pour vos projets personnels et commerciaux.
