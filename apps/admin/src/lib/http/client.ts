import axios, { AxiosInstance } from 'axios'
import { setupInterceptors } from './interceptors'

class HttpClient {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    })
    setupInterceptors(this.client)
  }

  getInstance(): AxiosInstance {
    return this.client
  }
}

export const httpClient = new HttpClient(
  import.meta.env.VITE_API_BASE_URL
).getInstance()
