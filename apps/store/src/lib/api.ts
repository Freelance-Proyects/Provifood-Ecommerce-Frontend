import type { Product, ProductFilters } from '@provifood/types'

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL

// Cache simple para reducir llamadas a la API
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 2 * 60 * 1000 // 2 minutos

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T
  }
  return null
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

export const productsApi = {
  async getAll(params?: ProductFilters): Promise<Product[]> {
    const queryParams = new URLSearchParams()
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString())
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)

    const cacheKey = `products_${queryParams.toString()}`
    const cached = getCachedData<Product[]>(cacheKey)
    if (cached) return cached

    try {
      const response = await fetch(`${API_BASE_URL}/products/?${queryParams}`, {
        headers: {
          'Accept': 'application/json',
        },
        // Agregar cache HTTP
        cache: 'default'
      })
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },

  async getById(id: number): Promise<Product | null> {
    const cacheKey = `product_${id}`
    const cached = getCachedData<Product>(cacheKey)
    if (cached) return cached

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'default'
      })
      if (!response.ok) throw new Error('Failed to fetch product')
      const data = await response.json()
      setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }
}
