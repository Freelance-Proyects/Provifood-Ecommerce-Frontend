# 🎨 Guía de Diseño - Provifood E-commerce

## Paleta de Colores

### Colores Principales

```css
/* Verde Petróleo / Teal - Color Primario */
--provifood-primary: #155E58;
/* Uso: Footer, botones principales, navegación hover, títulos destacados */

/* Naranja - Color Secundario */
--provifood-secondary: #F08200;
/* Uso: Botones CTA, iconos sociales, elementos decorativos, "sonrisa" del logo */

/* Gris Oscuro - Texto Principal */
--provifood-dark: #333333;
/* Uso: Títulos, navegación, texto destacado */

/* Gris Medio - Texto Secundario */
--provifood-gray: #666666;
/* Uso: Párrafos, descripciones, texto de apoyo */
```

### Uso en Tailwind

```javascript
// En tailwind.config.mjs
colors: {
  'provifood': {
    'primary': '#155E58',
    'secondary': '#F08200',
    'dark': '#333333',
    'gray': '#666666',
  }
}
```

## Tipografía

### Fuente Principal
- **Familia**: Open Sans (fallback: Roboto, sans-serif)
- **CDN**: Google Fonts
- **Pesos utilizados**:
  - Regular (400): Párrafos, texto normal
  - SemiBold (600): Énfasis medio
  - Bold (700): Títulos, botones, elementos destacados

### Jerarquía

```css
/* Títulos principales */
h1: text-4xl md:text-6xl font-bold

/* Títulos sección */
h2: text-3xl md:text-4xl font-bold

/* Títulos tarjetas */
h3: text-xl font-bold

/* Texto normal */
p: text-base text-provifood-gray

/* Texto grande */
.lead: text-lg md:text-xl
```

## Componentes UI

### Botones

#### Características
- **Border Radius**: 4px (`rounded-provifood`)
- **Padding**: 
  - SM: `px-4 py-2`
  - MD: `px-6 py-3`
  - LG: `px-8 py-4`
- **Transición**: `transition-all duration-200`

#### Variantes

```astro
<!-- Botón Primario -->
<Button variant="primary">Texto</Button>
<!-- bg-provifood-primary hover:bg-teal-700 -->

<!-- Botón Secundario -->
<Button variant="secondary">Texto</Button>
<!-- bg-provifood-secondary hover:bg-orange-600 -->

<!-- Botón Outline -->
<Button variant="outline">Texto</Button>
<!-- border-provifood-primary hover:bg-provifood-primary -->
```

### Tarjetas de Producto

```astro
<div class="product-card">
  <!-- Imagen -->
  <!-- Contenido -->
  <!-- Precio y botón -->
</div>
```

**Características**:
- `bg-white`
- `rounded-lg`
- `shadow-md hover:shadow-xl`
- Transición suave en hover

### Navbar

**Estructura**:
1. **TopBar**: 
   - Fondo: `bg-provifood-primary`
   - Contenido: Contacto + Redes Sociales
   - Iconos sociales: Círculos naranjas (`bg-provifood-secondary`)

2. **Navbar Principal**:
   - Fondo: `bg-white`
   - Logo con "sonrisa" naranja característica
   - Sticky: `sticky top-0 z-50`
   - Shadow: `shadow-sm`

### Footer

**Características**:
- Fondo: `bg-provifood-primary`
- Texto: `text-white`
- Grid de 4 columnas en desktop
- Separador superior para copyright

## Elementos Decorativos

### "Sonrisa" del Logo

```astro
<div class="w-24 h-1 bg-provifood-secondary rounded-full"></div>
```

### Iconos Sociales

```astro
<a class="w-8 h-8 rounded-full bg-provifood-secondary flex items-center justify-center hover:bg-orange-600">
  <!-- SVG Icon -->
</a>
```

### Banner Oblicuo

```astro
<div class="absolute ... bg-provifood-secondary opacity-20 transform rotate-45"></div>
```

## Espaciado y Layout

### Container
```css
.container {
  max-width: 1280px; /* max-w-7xl */
  margin: 0 auto;
  padding: 0 1rem; /* px-4 */
}
```

### Secciones
- **Padding vertical**: `py-16` (64px)
- **Márgenes entre secciones**: `mt-16` (64px)

### Grid de Productos
```astro
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
```

## Responsive Breakpoints

```javascript
// Tailwind por defecto
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
```

### Uso común

```astro
<!-- Ocultar en móvil -->
<div class="hidden md:flex">

<!-- Tamaño responsivo -->
<h1 class="text-4xl md:text-6xl">

<!-- Grid responsivo -->
<div class="grid grid-cols-1 md:grid-cols-3">
```

## Efectos y Transiciones

### Hover States
```css
/* Links */
hover:text-provifood-primary

/* Botones */
hover:bg-teal-700
hover:bg-orange-600

/* Tarjetas */
hover:shadow-xl

/* Transición */
transition-all duration-200
transition-colors
transition-shadow
```

### Estados Interactivos
- **Links**: Cambio de color suave
- **Botones**: Cambio de fondo
- **Tarjetas**: Elevación de sombra
- **Iconos**: Rotación o escala ligera

## Accesibilidad

### Contraste
- ✅ Verde primario sobre blanco: AAA
- ✅ Naranja sobre blanco: AAA
- ✅ Texto gris sobre blanco: AA

### ARIA Labels
```astro
<button aria-label="Carrito de compras">
<a aria-label="Facebook">
```

### Estructura Semántica
- Uso correcto de `<nav>`, `<main>`, `<footer>`
- Jerarquía de encabezados `h1` → `h6`
- Links descriptivos

## Iconografía

### Fuente de Iconos
- SVG inline para mejor control
- Heroicons (outline style)
- Emojis para contacto (📞, ✉️, 📍)

### Tamaños
```css
w-4 h-4   /* 16px - Iconos pequeños */
w-6 h-6   /* 24px - Iconos navegación */
w-8 h-8   /* 32px - Iconos destacados */
w-16 h-16 /* 64px - Iconos features */
```

## Mejores Prácticas

1. **Consistencia**: Usar componentes reutilizables
2. **Performance**: Lazy loading de imágenes
3. **SEO**: Títulos descriptivos, meta tags
4. **Mobile First**: Diseñar primero para móvil
5. **Accesibilidad**: Contraste, labels, semántica

---

**Creado para Provifood E-commerce** 🛒
