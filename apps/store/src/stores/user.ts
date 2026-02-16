import { atom } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'
import type { UserProfile, UserPreferences, UserState } from '../types/store.types'

// ============================================
// Constants
// ============================================

const USER_STORAGE_KEY = 'provifood-user'
const PREFERENCES_STORAGE_KEY = 'provifood-preferences'
const TOKEN_STORAGE_KEY = 'provifood-token'

// ============================================
// Default Values
// ============================================

const defaultPreferences: UserPreferences = {
  defaultAddress: null,
  defaultPaymentMethod: null,
  newsletterEnabled: false,
  smsNotifications: false,
  dietaryRestrictions: [],
}

// ============================================
// Persistent Stores
// ============================================

export const $user = persistentAtom < UserProfile | null>(
  USER_STORAGE_KEY,
  null,
  {
    encode: JSON.stringify,
    decode: (str) => {
      try {
        return JSON.parse(str)
      } catch {
        return null
      }
    },
  }
)

export const $preferences = persistentAtom<UserPreferences>(
  PREFERENCES_STORAGE_KEY,
  defaultPreferences,
  {
    encode: JSON.stringify,
    decode: (str) => {
      try {
        return { ...defaultPreferences, ...JSON.parse(str) }
      } catch {
        return defaultPreferences
      }
    },
  }
)

export const $authToken = persistentAtom<string | null>(TOKEN_STORAGE_KEY, null, {
  encode: (value) => value || '',
  decode: (str) => str || null,
})

// ============================================
// Non-Persistent Stores
// ============================================

export const $isLoading = atom<boolean>(false)
export const $authError = atom<string | null>(null)

// ============================================
// Computed Stores
// ============================================

export const $isAuthenticated = atom<boolean>(false)

// Actualizar isAuthenticated cuando cambie el user o token
$user.subscribe((user) => {
  $isAuthenticated.set(!!user && !!$authToken.get())
})

$authToken.subscribe((token) => {
  $isAuthenticated.set(!!token && !!$user.get())
})

// ============================================
// Actions
// ============================================

export async function login(email: string, password: string): Promise<boolean> {
  $isLoading.set(true)
  $authError.set(null)

  try {
    // TODO: Reemplazar con llamada real al API
    const response = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error('Credenciales inválidas')
    }

    const data = await response.json()

    $user.set(data.user)
    $authToken.set(data.token)
    $isLoading.set(false)

    return true
  } catch (error) {
    $authError.set(error instanceof Error ? error.message : 'Error al iniciar sesión')
    $isLoading.set(false)
    return false
  }
}

export async function register(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  rut: string
}): Promise<boolean> {
  $isLoading.set(true)
  $authError.set(null)

  try {
    // TODO: Reemplazar con llamada real al API
    const response = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error('Error al registrar usuario')
    }

    const data = await response.json()

    $user.set(data.user)
    $authToken.set(data.token)
    $isLoading.set(false)

    return true
  } catch (error) {
    $authError.set(error instanceof Error ? error.message : 'Error al registrarse')
    $isLoading.set(false)
    return false
  }
}

export function logout(): void {
  $user.set(null)
  $authToken.set(null)
  $preferences.set(defaultPreferences)
  $authError.set(null)

  // Limpiar otros stores relacionados si es necesario
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('user-logout'))
  }
}

export async function updateProfile(
  updates: Partial<Omit<UserProfile, 'id'>>
): Promise<boolean> {
  const currentUser = $user.get()

  if (!currentUser) {
    $authError.set('Usuario no autenticado')
    return false
  }

  $isLoading.set(true)
  $authError.set(null)

  try {
    // TODO: Reemplazar con llamada real al API
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_BASE_URL}/users/${currentUser.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${$authToken.get()}`,
        },
        body: JSON.stringify(updates),
      }
    )

    if (!response.ok) {
      throw new Error('Error al actualizar perfil')
    }

    const updatedUser = await response.json()

    $user.set(updatedUser)
    $isLoading.set(false)

    return true
  } catch (error) {
    $authError.set(error instanceof Error ? error.message : 'Error al actualizar perfil')
    $isLoading.set(false)
    return false
  }
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<boolean> {
  const currentUser = $user.get()

  if (!currentUser) {
    $authError.set('Usuario no autenticado')
    return false
  }

  $isLoading.set(true)
  $authError.set(null)

  try {
    // TODO: Reemplazar con llamada real al API
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_BASE_URL}/users/${currentUser.id}/password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${$authToken.get()}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      }
    )

    if (!response.ok) {
      throw new Error('Error al cambiar contraseña')
    }

    $isLoading.set(false)
    return true
  } catch (error) {
    $authError.set(error instanceof Error ? error.message : 'Error al cambiar contraseña')
    $isLoading.set(false)
    return false
  }
}

export async function verifyEmail(token: string): Promise<boolean> {
  $isLoading.set(true)
  $authError.set(null)

  try {
    // TODO: Reemplazar con llamada real al API
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_BASE_URL}/auth/verify-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      }
    )

    if (!response.ok) {
      throw new Error('Token inválido o expirado')
    }

    const currentUser = $user.get()
    if (currentUser) {
      $user.set({ ...currentUser, isVerified: true })
    }

    $isLoading.set(false)
    return true
  } catch (error) {
    $authError.set(error instanceof Error ? error.message : 'Error al verificar email')
    $isLoading.set(false)
    return false
  }
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  $isLoading.set(true)
  $authError.set(null)

  try {
    // TODO: Reemplazar con llamada real al API
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_BASE_URL}/auth/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    )

    if (!response.ok) {
      throw new Error('Error al solicitar recuperación')
    }

    $isLoading.set(false)
    return true
  } catch (error) {
    $authError.set(
      error instanceof Error ? error.message : 'Error al solicitar recuperación de contraseña'
    )
    $isLoading.set(false)
    return false
  }
}

// ============================================
// Preferences Actions
// ============================================

export function updatePreferences(updates: Partial<UserPreferences>): void {
  const current = $preferences.get()
  $preferences.set({ ...current, ...updates })
}

export function setDefaultAddress(addressId: string): void {
  updatePreferences({ defaultAddress: addressId })
}

export function setDefaultPaymentMethod(methodId: string): void {
  updatePreferences({ defaultPaymentMethod: methodId })
}

export function toggleNewsletter(enabled: boolean): void {
  updatePreferences({ newsletterEnabled: enabled })
}

export function toggleSmsNotifications(enabled: boolean): void {
  updatePreferences({ smsNotifications: enabled })
}

export function addDietaryRestriction(restriction: string): void {
  const current = $preferences.get()
  if (!current.dietaryRestrictions.includes(restriction)) {
    updatePreferences({
      dietaryRestrictions: [...current.dietaryRestrictions, restriction],
    })
  }
}

export function removeDietaryRestriction(restriction: string): void {
  const current = $preferences.get()
  updatePreferences({
    dietaryRestrictions: current.dietaryRestrictions.filter((r) => r !== restriction),
  })
}

// ============================================
// Utilities
// ============================================

export function getFullName(): string {
  const user = $user.get()
  if (!user) return ''
  return `${user.firstName} ${user.lastName}`.trim()
}

export function getMembershipBadge(): string {
  const user = $user.get()
  if (!user) return ''

  switch (user.membershipTier) {
    case 'vip':
      return '👑 VIP'
    case 'premium':
      return '⭐ Premium'
    default:
      return ''
  }
}

export function hasPermission(permission: string): boolean {
  const user = $user.get()
  if (!user) return false

  // Lógica simple de permisos basada en tier
  if (user.membershipTier === 'vip') return true
  if (user.membershipTier === 'premium' && permission !== 'vip_exclusive') return true

  return false
}
