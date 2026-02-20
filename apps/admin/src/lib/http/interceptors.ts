import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getActivePinia } from 'pinia'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const AUTH_TOKEN_KEY = 'provifood_admin_token'

export function setupInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status
      const url = error.config?.url ?? ''

      if (status === 401 && !url.includes('/auth/login')) {
        const pinia = getActivePinia()
        if (pinia) {
          useAuthStore(pinia).logout()
        }
        localStorage.removeItem(AUTH_TOKEN_KEY)
        window.location.href = '/login'
        return Promise.reject(error)
      }

      const toast = useToast()
      const message = (error.response?.data as any)?.detail ?? (error.response?.data as any)?.message ?? error.message

      switch (status) {
        case 400:
          toast.error(`Validación: ${message}`)
          break
        case 403:
          toast.error('Sin permisos para esta acción')
          break
        case 404:
          toast.error('Recurso no encontrado')
          break
        case 500:
          toast.error('Error del servidor')
          break
        default:
          if (status !== 401) toast.error(typeof message === 'string' ? message : 'Error de conexión')
      }

      return Promise.reject(error)
    }
  )
}
