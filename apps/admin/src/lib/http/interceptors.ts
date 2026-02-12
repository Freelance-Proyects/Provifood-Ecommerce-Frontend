import type { AxiosInstance, AxiosError } from 'axios'
import { useToast } from '@/composables/useToast'

export function setupInterceptors(client: AxiosInstance) {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const toast = useToast()
      const status = error.response?.status
      const message = (error.response?.data as any)?.message || error.message

      switch (status) {
        case 400:
          toast.error(`Validación: ${message}`)
          break
        case 404:
          toast.error('Recurso no encontrado')
          break
        case 500:
          toast.error('Error del servidor')
          break
        default:
          toast.error(`Error: ${message}`)
      }

      return Promise.reject(error)
    }
  )
}
