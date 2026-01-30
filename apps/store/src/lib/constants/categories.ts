// Categorías del supermercado
export const CATEGORIES = [
  { 
    id: 'harinas',
    name: 'Harinas y Panificación', 
    slug: 'harinas',
    icon: 'bread', 
    href: '/categoria/harinas',
    color: 'amber'
  },
  { 
    id: 'aceites',
    name: 'Aceites y Grasas', 
    slug: 'aceites',
    icon: 'oil', 
    href: '/categoria/aceites',
    color: 'yellow'
  },
  { 
    id: 'pastas',
    name: 'Pastas y Fideos', 
    slug: 'pastas',
    icon: 'pasta', 
    href: '/categoria/pastas',
    color: 'orange'
  },
  { 
    id: 'arroz',
    name: 'Arroz y Legumbres', 
    slug: 'arroz',
    icon: 'rice', 
    href: '/categoria/arroz',
    color: 'green'
  },
  { 
    id: 'azucar',
    name: 'Azúcar y Endulzantes', 
    slug: 'azucar',
    icon: 'sugar', 
    href: '/categoria/azucar',
    color: 'pink'
  },
  { 
    id: 'conservas',
    name: 'Conservas', 
    slug: 'conservas',
    icon: 'can', 
    href: '/categoria/conservas',
    color: 'red'
  },
  { 
    id: 'condimentos',
    name: 'Condimentos', 
    slug: 'condimentos',
    icon: 'spice', 
    href: '/categoria/condimentos',
    color: 'orange'
  },
  { 
    id: 'bebidas',
    name: 'Bebidas', 
    slug: 'bebidas',
    icon: 'drink', 
    href: '/categoria/bebidas',
    color: 'blue'
  },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];
