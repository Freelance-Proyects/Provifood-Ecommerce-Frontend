# Estructura del Proyecto - Store (Astro)

## Arquitectura Híbrida (Feature + Layer based)

```
src/
├── components/
│   ├── ui/              # Componentes reutilizables de UI
│   │   └── Button.astro
│   ├── layout/          # Componentes de estructura general
│   │   ├── TopBar.astro
│   │   ├── Navbar.astro
│   │   ├── Footer.astro
│   │   └── CategoryMenu.astro
│   └── features/        # Componentes específicos por feature
│       └── products/
│           └── ProductCard.astro
├── lib/
│   ├── constants/       # Constantes y configuraciones
│   │   ├── index.ts
│   │   ├── categories.ts
│   │   └── site.ts
│   ├── utils/           # Funciones helper
│   │   ├── index.ts
│   │   └── format.ts
│   └── api/             # Clientes API y fetchers
│       └── (futuros clientes)
├── layouts/             # Layouts de Astro
│   └── Layout.astro
├── pages/               # Rutas de la aplicación
│   └── index.astro
├── styles/              # Estilos globales
│   └── global.css
└── assets/              # Imágenes y archivos estáticos (futuros)

public/
├── logo.png
├── navlogo.png
└── (otros assets estáticos)
```

## Convenciones

### Imports
- Usa path alias `@/` para importar desde src:
  ```typescript
  import Button from '@/components/ui/Button.astro';
  import { CATEGORIES } from '@/lib/constants';
  import { formatPrice } from '@/lib/utils';
  ```

### Componentes
- **UI**: Componentes genéricos reutilizables (botones, inputs, cards, etc.)
- **Layout**: Estructura de la página (header, footer, sidebar, etc.)
- **Features**: Componentes específicos de funcionalidades (ProductCard, CartItem, etc.)

### Lib
- **constants**: Configuración estática (categorías, textos, configuraciones)
- **utils**: Funciones helper puras (formateo, validaciones, etc.)
- **api**: Clientes HTTP y fetchers

## Próximas Features

### Rutas por implementar:
- `/productos` - Listado de productos
- `/producto/[slug]` - Detalle de producto
- `/categoria/[slug]` - Productos por categoría
- `/carrito` - Carrito de compras
- `/checkout` - Proceso de pago
- `/login` - Inicio de sesión
- `/registro` - Registro usuario final
- `/registro-empresa` - Registro empresarial
- `/cuenta` - Dashboard del usuario
- `/cuenta/pedidos` - Historial de pedidos

### Componentes pendientes:
- `components/features/cart/` - CartItem, CartSummary
- `components/features/checkout/` - CheckoutForm, OrderSummary
- `components/features/auth/` - LoginForm, RegisterForm
- `components/ui/` - Input, Select, Badge, Alert, Modal
