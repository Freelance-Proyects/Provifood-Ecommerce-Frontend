import { atom, computed } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'
import type { Product } from '@provifood/types'
import type { SearchFilters, SortOption, SearchState } from '../types/store.types'
import { productsApi } from '../lib/api'

// ============================================
// Constants
// ============================================

const RECENT_SEARCHES_KEY = 'provifood-recent-searches'
const MAX_RECENT_SEARCHES = 10

// ============================================
// Default Values
// ============================================

const defaultFilters: SearchFilters = {
  categories: [],
  brands: [],
  priceRange: [0, 1000000],
  onSale: false,
  inStock: true,
  rating: 0,
  dietary: [],
  organic: false,
}

// ============================================
// Persistent Stores
// ============================================

export const $recentSearches = persistentAtom<string[]>(RECENT_SEARCHES_KEY, [], {
  encode: JSON.stringify,
  decode: (str) => {
    try {
      return JSON.parse(str)
    } catch {
      return []
    }
  },
})

// ============================================
// Non-Persistent Stores
// ============================================

export const $query = atom<string>('')
export const $filters = atom<SearchFilters>(defaultFilters)
export const $sort = atom<SortOption>('relevance')
export const $suggestions = atom<Product[]>([])
export const $isLoading = atom<boolean>(false)

// ============================================
// Computed Stores
// ============================================

export const $hasActiveFilters = computed($filters, (filters) => {
  return (
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000000 ||
    filters.onSale ||
    !filters.inStock ||
    filters.rating > 0 ||
    filters.dietary.length > 0 ||
    filters.organic
  )
})

export const $activeFilterCount = computed($filters, (filters) => {
  let count = 0
  if (filters.categories.length > 0) count += filters.categories.length
  if (filters.brands.length > 0) count += filters.brands.length
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) count++
  if (filters.onSale) count++
  if (!filters.inStock) count++
  if (filters.rating > 0) count++
  if (filters.dietary.length > 0) count += filters.dietary.length
  if (filters.organic) count++
  return count
})

// ============================================
// Search Actions
// ============================================

export function setQuery(query: string): void {
  $query.set(query)
}

export function clearQuery(): void {
  $query.set('')
  $suggestions.set([])
}

export async function search(query: string): Promise<Product[]> {
  setQuery(query)

  if (query.trim().length === 0) {
    return []
  }

  $isLoading.set(true)

  try {
    // Agregar a búsquedas recientes
    addRecentSearch(query)

    // Realizar búsqueda
    const results = await productsApi.getAll({ search: query })

    // Aplicar filtros
    const filtered = applyFiltersToProducts(results, $filters.get())

    // Aplicar ordenamiento
    const sorted = applySortToProducts(filtered, $sort.get())

    $isLoading.set(false)
    return sorted
  } catch (error) {
    console.error('Error en búsqueda:', error)
    $isLoading.set(false)
    return []
  }
}

export async function fetchSuggestions(query: string): Promise<void> {
  if (query.trim().length < 2) {
    $suggestions.set([])
    return
  }

  try {
    const results = await productsApi.getAll({ search: query, limit: 8 })
    $suggestions.set(results)
  } catch (error) {
    console.error('Error al cargar sugerencias:', error)
    $suggestions.set([])
  }
}

export function addRecentSearch(query: string): void {
  if (!query.trim()) return

  const current = $recentSearches.get()
  const cleanQuery = query.trim().toLowerCase()

  // Eliminar si ya existe
  const filtered = current.filter((q) => q.toLowerCase() !== cleanQuery)

  // Agregar al principio y limitar cantidad
  const updated = [query.trim(), ...filtered].slice(0, MAX_RECENT_SEARCHES)

  $recentSearches.set(updated)
}

export function removeRecentSearch(query: string): void {
  const current = $recentSearches.get()
  $recentSearches.set(current.filter((q) => q !== query))
}

export function clearRecentSearches(): void {
  $recentSearches.set([])
}

// ============================================
// Filter Actions
// ============================================

export function setFilters(filters: Partial<SearchFilters>): void {
  const current = $filters.get()
  $filters.set({ ...current, ...filters })
}

export function toggleCategory(category: string): void {
  const current = $filters.get()
  const categories = current.categories.includes(category)
    ? current.categories.filter((c) => c !== category)
    : [...current.categories, category]

  setFilters({ categories })
}

export function toggleBrand(brand: string): void {
  const current = $filters.get()
  const brands = current.brands.includes(brand)
    ? current.brands.filter((b) => b !== brand)
    : [...current.brands, brand]

  setFilters({ brands })
}

export function setPriceRange(min: number, max: number): void {
  setFilters({ priceRange: [min, max] })
}

export function toggleOnSale(): void {
  const current = $filters.get()
  setFilters({ onSale: !current.onSale })
}

export function toggleInStock(): void {
  const current = $filters.get()
  setFilters({ inStock: !current.inStock })
}

export function setMinRating(rating: number): void {
  setFilters({ rating })
}

export function toggleDietary(dietary: string): void {
  const current = $filters.get()
  const dietaryList = current.dietary.includes(dietary)
    ? current.dietary.filter((d) => d !== dietary)
    : [...current.dietary, dietary]

  setFilters({ dietary: dietaryList })
}

export function toggleOrganic(): void {
  const current = $filters.get()
  setFilters({ organic: !current.organic })
}

export function clearFilters(): void {
  $filters.set(defaultFilters)
}

export function clearFilter(filterType: keyof SearchFilters): void {
  const current = $filters.get()

  switch (filterType) {
    case 'categories':
      setFilters({ categories: [] })
      break
    case 'brands':
      setFilters({ brands: [] })
      break
    case 'priceRange':
      setFilters({ priceRange: [0, 1000000] })
      break
    case 'onSale':
      setFilters({ onSale: false })
      break
    case 'inStock':
      setFilters({ inStock: true })
      break
    case 'rating':
      setFilters({ rating: 0 })
      break
    case 'dietary':
      setFilters({ dietary: [] })
      break
    case 'organic':
      setFilters({ organic: false })
      break
  }
}

// ============================================
// Sort Actions
// ============================================

export function setSort(sort: SortOption): void {
  $sort.set(sort)
}

// ============================================
// Utilities
// ============================================

export function applyFiltersToProducts(
  products: Product[],
  filters: SearchFilters
): Product[] {
  let filtered = [...products]

  // Filtrar por categorías
  if (filters.categories.length > 0) {
    filtered = filtered.filter((p) => filters.categories.includes(p.category))
  }

  // Filtrar por marcas
  if (filters.brands.length > 0) {
    filtered = filtered.filter((p) => p.brand && filters.brands.includes(p.brand))
  }

  // Filtrar por rango de precios
  filtered = filtered.filter(
    (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
  )

  // Filtrar por stock
  if (filters.inStock) {
    filtered = filtered.filter((p) => p.stock > 0)
  }

  // TODO: Implementar filtros adicionales cuando estén disponibles en el API
  // - onSale (requiere campo de promociones)
  // - rating (requiere campo de calificación)
  // - dietary (requiere etiquetas dietarias)
  // - organic (requiere campo orgánico)

  return filtered
}

export function applySortToProducts(
  products: Product[],
  sort: SortOption
): Product[] {
  const sorted = [...products]

  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA
      })
    case 'relevance':
    default:
      // Para relevancia, mantener el orden del API
      return sorted
  }
}

// ============================================
// Predefined Filter Sets
// ============================================

export function applyQuickFilter(preset: 'offers' | 'new' | 'popular' | 'organic'): void {
  clearFilters()

  switch (preset) {
    case 'offers':
      setFilters({ onSale: true })
      break
    case 'new':
      setSort('newest')
      break
    case 'organic':
      setFilters({ organic: true })
      break
    case 'popular':
      // TODO: Implementar cuando haya campo de popularidad
      break
  }
}

// Categorías comunes de supermercado
export const SUPERMARKET_CATEGORIES = [
  'Lácteos y Huevos',
  'Carnes y Pescados',
  'Frutas y Verduras',
  'Panadería y Pastelería',
  'Despensa',
  'Bebidas',
  'Congelados',
  'Snacks y Dulces',
  'Limpieza',
  'Cuidado Personal',
  'Bebé',
  'Mascotas',
]

// Restricciones dietarias comunes
export const DIETARY_OPTIONS = [
  'Vegetariano',
  'Vegano',
  'Sin Gluten',
  'Sin Lactosa',
  'Sin Azúcar',
  'Bajo en Sodio',
  'Bajo en Grasa',
]

// Opciones de ordenamiento con labels
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Más relevantes' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'name-asc', label: 'A-Z' },
  { value: 'name-desc', label: 'Z-A' },
  { value: 'newest', label: 'Más recientes' },
]
