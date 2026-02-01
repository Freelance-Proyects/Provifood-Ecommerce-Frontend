# Provifood E-commerce - Frontend

Monorepo con **pnpm workspaces** para el proyecto Provifood E-commerce (B2C y B2B).

## Arquitectura del Proyecto

```
Provifood-Ecommerce-Frontend/
├── apps/
│   ├── store/          # E-commerce público (Astro + Vue + TypeScript)
│   └── admin/          # Panel de administración (Vue 3 + Vite)
└── packages/
    └── types/          # Tipos TypeScript compartidos
```

## Stack Tecnológico

### Store (Frontend Público)
- **Astro** v4.16.19 - SSG/SSR híbrido
- **Vue 3** - Componentes interactivos
- **TailwindCSS** - Framework CSS
- **TypeScript** - Tipado estático

### Admin Dashboard
- **Vue 3** - Framework principal
- **Vite** - Build tool
- **Pinia** - State management
- **Vue Router** - Routing
- **TanStack Query** - Data fetching
- **TailwindCSS** - Estilos

### Shared Packages
- **@provifood/types** - Interfaces TypeScript compartidas

## Instalación y Setup

### Requisitos Previos
- Node.js >= 18.0.0
- pnpm >= 8.0.0

```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Instalar dependencias
pnpm install

# Compilar tipos compartidos
pnpm --filter=@provifood/types build
```

## Scripts de Desarrollo

```bash
# Store (http://localhost:4321)
pnpm dev:store

# Admin (http://localhost:5173)
pnpm dev:admin

# Ambas aplicaciones
pnpm dev

# Build de producción
pnpm build

# Type checking
pnpm type-check
```

---

## Modelo de Datos y Estructura de Base de Datos

> **Para el equipo Backend**: Esta sección describe la estructura de datos esperada por el frontend.

### Esquema de Datos

Todos los tipos están definidos en `/packages/types/src/index.ts`

---

### 1. Products (Productos)

Tabla principal de productos del catálogo.

```typescript
interface Product {
  id: string;                    // UUID o ID único
  name: string;                  // Nombre del producto
  description: string;           // Descripción detallada
  price: number;                 // Precio en CLP (pesos chilenos)
  discount?: number;             // Descuento porcentual (0-100)
  image: string;                 // URL de la imagen principal
  category: string;              // ID de la categoría
  inStock: boolean;              // Disponibilidad
  quantity?: number | string;    // Cantidad/Presentación (ej: "1kg", "500g", o número)
  createdAt?: Date;              // Fecha de creación
  updatedAt?: Date;              // Última actualización
}
```

**Tabla SQL recomendada:**
```sql
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5, 2) DEFAULT NULL,
    image VARCHAR(500) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    quantity VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

**Notas importantes:**
- `price`: Almacenar en centavos/céntimos para evitar problemas de precisión (ej: 1.500 CLP = 150000)
- `discount`: Porcentaje de descuento (10 = 10%)
- `quantity`: Puede ser numérico o texto (flexible para "1kg", "500ml", etc.)
- `image`: URL completa o ruta relativa al storage

---

### 2. **Categories** (Categorías)

Categorías de productos.

```typescript
interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Tabla SQL recomendada:**
```sql
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    image VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Categorías iniciales sugeridas:**
- Harinas y Panificación
- Aceites y Grasas
- Pastas y Fideos
- Arroz y Legumbres
- Azúcar y Endulzantes
- Conservas
- Condimentos
- Bebidas

---

### 3. **Users** (Usuarios)

Sistema de autenticación y roles.

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'operator' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

**Tabla SQL recomendada:**
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    role ENUM('customer', 'operator', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);
```

**Roles:**
- `customer`: Cliente final (B2C)
- `operator`: Operador/vendedor (gestión de pedidos)
- `admin`: Administrador (acceso completo)

---

### 4. **Orders** (Pedidos)

Sistema de pedidos y carrito de compras.

```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;          // Precio al momento de la compra
  subtotal: number;       // quantity * price
}
```

**Tablas SQL recomendadas:**
```sql
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

**Estados de pedido:**
1. `pending`: Creado, esperando pago
2. `processing`: En preparación
3. `shipped`: Enviado
4. `delivered`: Entregado
5. `cancelled`: Cancelado

---

## API API Endpoints Esperados

### Products
```
GET    /api/products              # Listar todos (con paginación)
GET    /api/products/:id          # Obtener uno
GET    /api/products?category=:id # Filtrar por categoría
POST   /api/products              # Crear (admin)
PUT    /api/products/:id          # Actualizar (admin)
DELETE /api/products/:id          # Eliminar (admin)
```

### Categories
```
GET    /api/categories            # Listar todas
GET    /api/categories/:id        # Obtener una
POST   /api/categories            # Crear (admin)
PUT    /api/categories/:id        # Actualizar (admin)
DELETE /api/categories/:id        # Eliminar (admin)
```

### Orders
```
GET    /api/orders                # Listar pedidos del usuario
GET    /api/orders/:id            # Obtener pedido específico
POST   /api/orders                # Crear pedido
PUT    /api/orders/:id            # Actualizar estado (admin/operator)
```

### Auth
```
POST   /api/auth/register         # Registro de usuario
POST   /api/auth/login            # Login
POST   /api/auth/logout           # Logout
GET    /api/auth/me               # Usuario actual
```

---

##  Formato de Respuestas API

### Success Response
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "El producto no existe"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

##  Variables de Diseño

### Colores Provifood
```css
--color-primary: #156F70;    /* Verde petróleo */
--color-secondary: #F08200;  /* Naranja */
--color-dark: #333333;       /* Texto oscuro */
--color-gray: #666666;       /* Texto gris */
```

### Tipografía
- **Font Family**: Open Sans (Google Fonts)
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)

---

##  Convenciones de Código

### Imports con Path Alias
```typescript
import Button from '@/components/ui/Button.astro';
import { CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
```

### Estructura de Componentes
```
src/
├── components/
│   ├── ui/              # Componentes reutilizables (Button, Input, etc.)
│   ├── layout/          # Header, Footer, Navbar
│   └── features/        # Componentes específicos por feature
├── lib/
│   ├── constants/       # Configuraciones estáticas
│   ├── utils/           # Funciones helper
│   └── api/             # Clientes API
└── pages/               # Rutas de Astro
```

---

##  Seguridad y Validación

### Validación en Frontend
- Validación de formularios con reglas básicas
- Sanitización de inputs antes de enviar al backend
- Validación de tipos con TypeScript

### Esperado del Backend
- Validación exhaustiva de todos los inputs
- Sanitización contra SQL Injection y XSS
- Rate limiting en endpoints públicos
- JWT/Session management para autenticación
- CORS configurado correctamente
- HTTPS en producción

---

##  Deployment

### Variables de Entorno Requeridas
```env
# API
VITE_API_URL=https://api.provifood.com
VITE_API_TIMEOUT=30000

# Storage
VITE_STORAGE_URL=https://storage.provifood.com

# Auth
VITE_JWT_SECRET=your-secret-key
```

---

##  Contacto Técnico

Para dudas sobre integración Backend-Frontend:
- **Frontend Lead**: [Nombre del desarrollador]
- **Backend Team**: [Contacto del equipo backend]

---

**Última actualización**: Enero 2026

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
│   ├── components/     # Componentes organizados por tipo
│   │   ├── ui/         # Componentes UI reutilizables
│   │   │   └── Button.astro
│   │   ├── layout/     # Componentes de estructura
│   │   │   ├── TopBar.astro
│   │   │   ├── Navbar.astro
│   │   │   ├── Footer.astro
│   │   │   └── CategoryMenu.astro
│   │   └── features/   # Componentes por feature
│   │       └── products/
│   │           └── ProductCard.astro
│   ├── lib/            # Utilidades y helpers
│   │   ├── constants/  # Configuraciones estáticas
│   │   │   ├── categories.ts
│   │   │   └── site.ts
│   │   └── utils/      # Funciones helper
│   │       └── format.ts
│   ├── pages/          # Rutas de la aplicación
│   │   └── index.astro # Página principal
│   ├── layouts/        # Layouts compartidos
│   │   └── Layout.astro
│   ├── styles/         # Estilos globales
│   │   └── global.css
│   └── env.d.ts
├── public/             # Assets estáticos
│   ├── logo.png
│   └── navlogo.png
├── astro.config.mjs    # Config de Astro + Path Aliases
├── tailwind.config.mjs # Config de Tailwind
└── tsconfig.json       # TypeScript config
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

##  Path Aliases

El proyecto usa path aliases para facilitar los imports:

```typescript
// En lugar de: import Button from '../../../components/ui/Button.astro'
import Button from '@/components/ui/Button.astro'
import { CATEGORIES } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
```

## 📐 Arquitectura del Store

El Store usa una **Estructura Híbrida** (Feature + Layer based):

- **`components/ui/`**: Componentes reutilizables de UI (Button, Input, Badge, etc.)
- **`components/layout/`**: Estructura de la página (TopBar, Navbar, Footer, etc.)
- **`components/features/`**: Componentes específicos por feature (ProductCard, CartItem, etc.)
- **`lib/constants/`**: Configuración estática (categorías, textos, config del sitio)
- **`lib/utils/`**: Funciones helper puras (formateo, validaciones, etc.)
- **`lib/api/`**: Clientes HTTP y fetchers (futuros)

Ver [STRUCTURE.md](apps/store/src/STRUCTURE.md) para más detalles.

## 🌐 URLs de Desarrollo

- **Store**: http://localhost:4321
- **Admin**: http://localhost:5173

## 🏗️ Próximos Pasos

1. Implementar rutas en Astro (`/productos`, `/checkout`, etc.)
2. Crear componentes Vue para el carrito de compras
3. Configurar API client en `admin`
4. Implementar autenticación
5. Conectar con backend

##  Notas

- El monorepo usa `pnpm workspaces` para compartir dependencias
- Los tipos en `@provifood/types` están disponibles para ambas apps
- Astro está configurado en modo híbrido (SSG + SSR)
- TailwindCSS está configurado en ambas aplicaciones

## 🤝 Contribuir

Este es un proyecto de Freelance para Provifood.

---

**Creado con ❤️ para Provifood**