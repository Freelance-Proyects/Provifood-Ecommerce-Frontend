import { httpClient } from '../http/client'
import type { Product, ProductStats, ProductFilters } from '@provifood/types'

export class ProductsRepository {
  private baseUrl = '/products'

  async getAll(filters?: ProductFilters): Promise<Product[]> {
    const { data } = await httpClient.get<Product[]>(this.baseUrl, { params: filters })
    return data
  }

  async getById(id: number): Promise<Product> {
    const { data } = await httpClient.get<Product>(`${this.baseUrl}/${id}`)
    return data
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const { data } = await httpClient.post<Product>(this.baseUrl, product)
    return data
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    const { data } = await httpClient.put<Product>(`${this.baseUrl}/${id}`, product)
    return data
  }

  async delete(id: number): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`)
  }

  async getStats(): Promise<ProductStats> {
    const { data } = await httpClient.get<ProductStats>(`${this.baseUrl}/stats/summary`)
    return data
  }
}

export const productsRepository = new ProductsRepository()
