import { atom, computed } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'
import type { Address } from '../types/store.types'
import { $authToken, $user } from './user'

// ============================================
// Constants
// ============================================

const ADDRESSES_STORAGE_KEY = 'provifood-addresses'

// ============================================
// Persistent Stores
// ============================================

export const $addresses = persistentAtom<Address[]>(ADDRESSES_STORAGE_KEY, [], {
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

export const $selectedAddressId = atom<string | null>(null)
export const $isLoadingAddresses = atom<boolean>(false)
export const $addressError = atom<string | null>(null)

// ============================================
// Computed Stores
// ============================================

export const $selectedAddress = computed(
  [$addresses, $selectedAddressId],
  (addresses, selectedId) => {
    if (!selectedId) return null
    return addresses.find((addr) => addr.id === selectedId) || null
  }
)

export const $defaultAddress = computed($addresses, (addresses) => {
  return addresses.find((addr) => addr.isDefault) || null
})

export const $sortedAddresses = computed($addresses, (addresses) => {
  return [...addresses].sort((a, b) => {
    if (a.isDefault) return -1
    if (b.isDefault) return 1
    return a.alias.localeCompare(b.alias)
  })
})

// ============================================
// Actions
// ============================================

export async function fetchAddresses(): Promise<boolean> {
  const token = $authToken.get()
  const user = $user.get()

  if (!token || !user) {
    $addressError.set('Usuario no autenticado')
    return false
  }

  $isLoadingAddresses.set(true)
  $addressError.set(null)

  try {
    // TODO: Reemplazar con llamada real al API
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_BASE_URL}/users/${user.id}/addresses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Error al cargar direcciones')
    }

    const data = await response.json()
    $addresses.set(data)
    $isLoadingAddresses.set(false)

    return true
  } catch (error) {
    $addressError.set(error instanceof Error ? error.message : 'Error al cargar direcciones')
    $isLoadingAddresses.set(false)
    return false
  }
}

export async function addAddress(address: Omit<Address, 'id'>): Promise<boolean> {
  const token = $authToken.get()
  const user = $user.get()

  if (!token || !user) {
    $addressError.set('Usuario no autenticado')
    return false
  }

  $isLoadingAddresses.set(true)
  $addressError.set(null)

  try {
    // TODO: Reemplazar con llamada real al API
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_BASE_URL}/users/${user.id}/addresses`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      }
    )

    if (!response.ok) {
      throw new Error('Error al agregar dirección')
    }

    const newAddress = await response.json()
    const current = $addresses.get()

    // Si es la primera dirección o se marca como default, desmarcar otras
    if (address.isDefault) {
      $addresses.set([
        ...current.map((addr) => ({ ...addr, isDefault: false })),
        newAddress,
      ])
    } else {
      $addresses.set([...current, newAddress])
    }

    $isLoadingAddresses.set(false)
    return true
  } catch (error) {
    $addressError.set(error instanceof Error ? error.message : 'Error al agregar dirección')
    $isLoadingAddresses.set(false)
    return false
  }
}

export async function updateAddress(
  id: string,
  updates: Partial<Omit<Address, 'id'>>
): Promise<boolean> {
  const token = $authToken.get()
  const user = $user.get()

  if (!token || !user) {
    $addressError.set('Usuario no autenticado')
    return false
  }

  $isLoadingAddresses.set(true)
  $addressError.set(null)

  try {
    // TODO: Reemplazar con llamada real al API
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_BASE_URL}/users/${user.id}/addresses/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      }
    )

    if (!response.ok) {
      throw new Error('Error al actualizar dirección')
    }

    const updatedAddress = await response.json()
    const current = $addresses.get()

    // Si se marca como default, desmarcar otras
    if (updates.isDefault) {
      $addresses.set(
        current.map((addr) =>
          addr.id === id
            ? updatedAddress
            : { ...addr, isDefault: false }
        )
      )
    } else {
      $addresses.set(current.map((addr) => (addr.id === id ? updatedAddress : addr)))
    }

    $isLoadingAddresses.set(false)
    return true
  } catch (error) {
    $addressError.set(error instanceof Error ? error.message : 'Error al actualizar dirección')
    $isLoadingAddresses.set(false)
    return false
  }
}

export async function deleteAddress(id: string): Promise<boolean> {
  const token = $authToken.get()
  const user = $user.get()

  if (!token || !user) {
    $addressError.set('Usuario no autenticado')
    return false
  }

  const current = $addresses.get()
  const addressToDelete = current.find((addr) => addr.id === id)

  if (addressToDelete?.isDefault && current.length > 1) {
    $addressError.set('No puedes eliminar tu dirección predeterminada. Marca otra como predeterminada primero.')
    return false
  }

  $isLoadingAddresses.set(true)
  $addressError.set(null)

  try {
    // TODO: Reemplazar con llamada real al API
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_BASE_URL}/users/${user.id}/addresses/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Error al eliminar dirección')
    }

    $addresses.set(current.filter((addr) => addr.id !== id))

    // Si se eliminó la dirección seleccionada, limpiar selección
    if ($selectedAddressId.get() === id) {
      $selectedAddressId.set(null)
    }

    $isLoadingAddresses.set(false)
    return true
  } catch (error) {
    $addressError.set(error instanceof Error ? error.message : 'Error al eliminar dirección')
    $isLoadingAddresses.set(false)
    return false
  }
}

export async function setDefaultAddress(id: string): Promise<boolean> {
  return updateAddress(id, { isDefault: true })
}

export function selectAddress(id: string): void {
  const addresses = $addresses.get()
  const address = addresses.find((addr) => addr.id === id)

  if (address) {
    $selectedAddressId.set(id)
  } else {
    $addressError.set('Dirección no encontrada')
  }
}

export function clearAddressSelection(): void {
  $selectedAddressId.set(null)
}

export async function validateCoverage(address: Partial<Address>): Promise<{
  covered: boolean
  estimatedDelivery?: string
  message: string
}> {
  $addressError.set(null)

  try {
    // TODO: Reemplazar con llamada real al API de cobertura
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_BASE_URL}/delivery/coverage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comuna: address.comuna,
          city: address.city,
          region: address.region,
          coordinates: address.coordinates,
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Error al validar cobertura')
    }

    return await response.json()
  } catch (error) {
    $addressError.set(error instanceof Error ? error.message : 'Error al validar cobertura')
    return {
      covered: false,
      message: 'No se pudo validar la cobertura. Por favor intenta más tarde.',
    }
  }
}

// ============================================
// Utilities
// ============================================

export function formatAddress(address: Address): string {
  const parts = [
    `${address.street} ${address.number}`,
    address.apartment ? `Depto ${address.apartment}` : null,
    address.comuna,
    address.city,
    address.region,
  ].filter(Boolean)

  return parts.join(', ')
}

export function getAddressById(id: string): Address | null {
  const addresses = $addresses.get()
  return addresses.find((addr) => addr.id === id) || null
}

export function hasAddresses(): boolean {
  return $addresses.get().length > 0
}

// Comunas de Chile más comunes (para validación)
export const COMUNAS_SANTIAGO = [
  'Santiago',
  'Providencia',
  'Las Condes',
  'Vitacura',
  'Ñuñoa',
  'La Reina',
  'Peñalolén',
  'Macul',
  'La Florida',
  'San Joaquín',
  'San Miguel',
  'Pedro Aguirre Cerda',
  'Lo Espejo',
  'Estación Central',
  'Cerrillos',
  'Maipú',
  'Pudahuel',
  'Cerro Navia',
  'Renca',
  'Quinta Normal',
  'Independencia',
  'Recoleta',
  'Conchalí',
  'Huechuraba',
  'Quilicura',
  'Lo Prado',
  'La Cisterna',
  'El Bosque',
  'San Ramón',
  'La Granja',
  'La Pintana',
  'San Bernardo',
  'Puente Alto',
  'Pirque',
  'San José de Maipo',
]
