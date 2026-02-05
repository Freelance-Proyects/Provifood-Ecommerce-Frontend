const API_BASE_URL = 'http://localhost:8000/api/v1'

export interface Product {
  id: number
  sku: string
  name: string
  description: string
  price: number
  category: string
  brand?: string
  stock: number
  image_url?: string
}

export const productsApi = {
  async getAll(params?: {
    skip?: number
    limit?: number
    category?: string
    search?: string
  }): Promise<Product[]> {
    const queryParams = new URLSearchParams()
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString())
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)

    try {
      const response = await fetch(`${API_BASE_URL}/products?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      return response.json()
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },

  async getById(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      return response.json()
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }
}
