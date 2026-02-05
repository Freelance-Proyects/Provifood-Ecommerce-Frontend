const API_BASE_URL = 'https://provifood-ecommerce-backend.onrender.com/api/v1'

export interface Product {
  id?: number
  sku: string
  name: string
  description: string
  price: number
  category: string
  brand?: string
  stock: number
  image_url?: string
}

export interface ProductStats {
  total: number
  in_stock: number
  low_stock: number
  out_of_stock: number
}

export const productsApi = {
  async getAll(params?: {
    skip?: number
    limit?: number
    category?: string
    search?: string
  }): Promise<Product[]> {
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)

    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },

  async getById(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    return response.json()
  },

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
    if (!response.ok) throw new Error('Failed to create product')
    return response.json()
  },

  async update(id: number, product: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
    if (!response.ok) throw new Error('Failed to update product')
    return response.json()
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete product')
  },

  async getStats(): Promise<ProductStats> {
    const response = await fetch(`${API_BASE_URL}/products/stats/summary`)
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
  }
}
