# 🛒 Provifood E-commerce - Monorepo Frontend

Monorepo con **pnpm workspaces** para el proyecto Provifood.

## 📦 Estructura del Proyecto

```
Provifood-Ecommerce-Frontend/
├── apps/
│   ├── store/          # E-commerce público (Astro + Vue)
│   └── admin/          # Panel de administración (Vue 3 + Vite)
└── packages/
    └── types/          # Tipos TypeScript compartidos
```

## 🚀 Stack Tecnológico

### Store (E-commerce Público)
- **Astro** v4 - Framework SSG/SSR híbrido
- **Vue 3** - Componentes interactivos
- **TailwindCSS** - Estilos
- **TypeScript** - Tipado estático

### Admin (Panel de Administración)
- **Vue 3** - Framework principal
- **Vite** - Build tool
- **Pinia** - Gestión de estado
- **Vue Router** - Navegación
- **@tanstack/vue-query** - Data fetching
- **TailwindCSS** - Estilos
- **TypeScript** - Tipado estático

### Packages Compartidos
- **@provifood/types** - Interfaces TypeScript (`Product`, `Order`, `User`, `Category`)

## 🛠️ Requisitos Previos

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

### Instalar pnpm
```bash
npm install -g pnpm
```

## 📥 Instalación

```bash
# Clonar el repositorio
cd Provifood-Ecommerce-Frontend

# Instalar dependencias de todos los workspaces
pnpm install

# Compilar el package de tipos
pnpm --filter=@provifood/types build
```

## 🎯 Scripts Disponibles

### Desarrollo
```bash
# Iniciar Store (Astro) en http://localhost:4321
pnpm dev:store

# Iniciar Admin (Vue) en http://localhost:5173
pnpm dev:admin

# Iniciar ambas apps
pnpm dev
```

### Build
```bash
# Build de todos los packages
pnpm build

# Build individual
pnpm build:store
pnpm build:admin
```

### Preview
```bash
# Preview de los builds
pnpm preview
```

### Type Checking
```bash
# Verificar tipos en todos los workspaces
pnpm type-check
```

## 📁 Estructura de Carpetas Detallada

### `/apps/store` (Astro)
```
store/
├── src/
│   ├── pages/          # Rutas de la aplicación
│   │   └── index.astro # Página principal
│   ├── layouts/        # Layouts compartidos
│   │   └── Layout.astro
│   └── env.d.ts
├── public/             # Assets estáticos
│   └── favicon.svg
├── astro.config.mjs    # Config de Astro
├── tailwind.config.mjs # Config de Tailwind
└── tsconfig.json
```

### `/apps/admin` (Vue 3)
```
admin/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── stores/         # Pinia stores
│   │   └── app.ts
│   ├── router/         # Vue Router
│   │   └── index.ts
│   ├── views/          # Vistas/páginas
│   │   └── Home.vue
│   ├── App.vue         # Componente raíz
│   ├── main.ts         # Entry point
│   └── style.css       # Estilos globales + Tailwind
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### `/packages/types`
```
types/
├── src/
│   └── index.ts        # Exporta: Product, Order, User, Category
├── dist/               # Build output (generado)
├── package.json
└── tsconfig.json
```

## 🔗 Uso de Tipos Compartidos

```typescript
// En cualquier app del monorepo
import type { Product, Order, User, Category } from '@provifood/types'

const product: Product = {
  id: '1',
  name: 'Producto',
  price: 100,
  // ...
}
```

## 🌐 URLs de Desarrollo

- **Store**: http://localhost:4321
- **Admin**: http://localhost:5173

## 🏗️ Próximos Pasos

1. Implementar rutas en Astro (`/productos`, `/checkout`, etc.)
2. Crear componentes Vue para el carrito de compras
3. Configurar API client en `admin`
4. Implementar autenticación
5. Conectar con backend

## 📝 Notas

- El monorepo usa `pnpm workspaces` para compartir dependencias
- Los tipos en `@provifood/types` están disponibles para ambas apps
- Astro está configurado en modo híbrido (SSG + SSR)
- TailwindCSS está configurado en ambas aplicaciones

## 🤝 Contribuir

Este es un proyecto de Freelance para Provifood.

---

**Creado con ❤️ para Provifood**