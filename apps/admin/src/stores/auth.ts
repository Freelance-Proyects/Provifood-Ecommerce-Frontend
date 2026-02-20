import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const AUTH_TOKEN_KEY = 'provifood_admin_token'
const API_BASE = import.meta.env.VITE_API_BASE_URL

export type AuthRole = 'admin' | 'operator' | 'customer'

export interface AuthUser {
  username: string | null
  email: string | null
  is_admin: boolean
  role: AuthRole
}

function decodeJwtPayload(token: string): AuthUser | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    const data = JSON.parse(json)
    const role = (data.role === 'admin' || data.role === 'operator' ? data.role : 'customer') as AuthRole
    return {
      username: data.username ?? null,
      email: data.email ?? null,
      is_admin: Boolean(data.is_admin),
      role,
    }
  } catch {
    return null
  }
}

function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getStoredToken())

  const user = computed<AuthUser | null>(() => {
    const t = token.value
    if (!t) return null
    return decodeJwtPayload(t)
  })

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isOperator = computed(() => user.value?.role === 'operator')
  /** Puede entrar al dashboard: Admin o Operator */
  const canAccessDashboard = computed(() => user.value?.role === 'admin' || user.value?.role === 'operator')

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem(AUTH_TOKEN_KEY, newToken)
  }

  function logout() {
    token.value = null
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  function initFromStorage() {
    const stored = getStoredToken()
    if (stored) token.value = stored
  }

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data } = await axios.post<{ access_token: string; token_type: string }>(
        `${API_BASE}/auth/login`,
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 12_000,
        }
      )
      const t = data.access_token
      if (!t) return { success: false, error: 'Respuesta inválida' }
      const decoded = decodeJwtPayload(t)
      if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'operator')) {
        return { success: false, error: 'Solo el personal autorizado puede acceder al panel.' }
      }
      setToken(t)
      return { success: true }
    } catch (err: any) {
      const status = err.response?.status
      const detail = err.response?.data?.detail
      if (status === 401) return { success: false, error: 'Correo o contraseña incorrectos.' }
      if (status === 403) return { success: false, error: detail || 'No tienes permiso para acceder.' }
      if (status === 404) return { success: false, error: 'Usuario no encontrado.' }
      if (err.code === 'ECONNABORTED' || err.message === 'Network Error' || !err.response) {
        return {
          success: false,
          error: 'No se pudo conectar con el servidor. Comprueba que el backend esté en marcha (docker compose up -d en Provifood-Ecommerce-Backend).',
        }
      }
      return { success: false, error: (typeof detail === 'string' ? detail : null) || err.message || 'Error al iniciar sesión.' }
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isOperator,
    canAccessDashboard,
    setToken,
    logout,
    initFromStorage,
    login,
  }
})
