import { atom, computed } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'
import type { Product } from '@provifood/types'
import type { WishlistItem, SavedList } from '../types/store.types'
import { addToCart } from './cart'

// ============================================
// Constants
// ============================================

const WISHLIST_STORAGE_KEY = 'provifood-wishlist'
const SAVED_LISTS_STORAGE_KEY = 'provifood-saved-lists'

// ============================================
// Persistent Stores
// ============================================

export const $wishlist = persistentAtom<Record<string, WishlistItem>>(
  WISHLIST_STORAGE_KEY,
  {},
  {
    encode: JSON.stringify,
    decode: (str) => {
      try {
        const parsed = JSON.parse(str)
        Object.values(parsed).forEach((item: any) => {
          if (item.addedAt) item.addedAt = new Date(item.addedAt)
        })
        return parsed
      } catch {
        return {}
      }
    },
  }
)

export const $savedLists = persistentAtom<SavedList[]>(SAVED_LISTS_STORAGE_KEY, [], {
  encode: JSON.stringify,
  decode: (str) => {
    try {
      const parsed = JSON.parse(str)
      parsed.forEach((list: any) => {
        if (list.createdAt) list.createdAt = new Date(list.createdAt)
        if (list.updatedAt) list.updatedAt = new Date(list.updatedAt)
        list.items.forEach((item: any) => {
          if (item.addedAt) item.addedAt = new Date(item.addedAt)
        })
      })
      return parsed
    } catch {
      return []
    }
  },
})

// ============================================
// Non-Persistent Stores
// ============================================

export const $selectedListId = atom<string | null>(null)

// ============================================
// Computed Stores
// ============================================

export const $wishlistItems = computed($wishlist, (wishlistMap) => {
  return Object.values(wishlistMap).sort(
    (a, b) => b.addedAt.getTime() - a.addedAt.getTime()
  )
})

export const $wishlistCount = computed($wishlistItems, (items) => {
  return items.length
})

export const $selectedList = computed(
  [$savedLists, $selectedListId],
  (lists, selectedId) => {
    if (!selectedId) return null
    return lists.find((list) => list.id === selectedId) || null
  }
)

// ============================================
// Wishlist Actions
// ============================================

export function addToWishlist(product: Product, notes?: string): void {
  const wishlistMap = $wishlist.get()

  const item: WishlistItem = {
    productId: product.id,
    product,
    addedAt: new Date(),
    notes,
  }

  wishlistMap[product.id.toString()] = item
  $wishlist.set({ ...wishlistMap })

  // Disparar evento personalizado
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('wishlist-updated', { detail: { added: true, productId: product.id } })
    )
  }
}

export function removeFromWishlist(productId: string | number): void {
  const wishlistMap = { ...$wishlist.get() }
  delete wishlistMap[productId.toString()]
  $wishlist.set(wishlistMap)

  // Disparar evento personalizado
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('wishlist-updated', {
        detail: { added: false, productId },
      })
    )
  }
}

export function toggleWishlist(product: Product): boolean {
  const isInWishlist = isProductInWishlist(product.id)

  if (isInWishlist) {
    removeFromWishlist(product.id)
    return false
  } else {
    addToWishlist(product)
    return true
  }
}

export function clearWishlist(): void {
  $wishlist.set({})

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('wishlist-cleared'))
  }
}

export function moveToCart(productId: string | number): boolean {
  const wishlistMap = $wishlist.get()
  const item = wishlistMap[productId.toString()]

  if (!item) {
    console.warn('Producto no encontrado en la lista de deseos')
    return false
  }

  const added = addToCart(item.product, 1)

  if (added) {
    removeFromWishlist(productId)
    return true
  }

  return false
}

export function moveAllToCart(): { success: number; failed: number } {
  const items = $wishlistItems.get()
  let success = 0
  let failed = 0

  items.forEach((item) => {
    const added = addToCart(item.product, 1)
    if (added) {
      success++
      removeFromWishlist(item.productId)
    } else {
      failed++
    }
  })

  return { success, failed }
}

export function updateWishlistNotes(productId: string | number, notes: string): void {
  const wishlistMap = $wishlist.get()
  const item = wishlistMap[productId.toString()]

  if (item) {
    wishlistMap[productId.toString()] = { ...item, notes }
    $wishlist.set({ ...wishlistMap })
  }
}

// ============================================
// Saved Lists Actions
// ============================================

export function createList(name: string): string {
  const lists = $savedLists.get()
  const newList: SavedList = {
    id: `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isShared: false,
  }

  $savedLists.set([...lists, newList])
  return newList.id
}

export function deleteList(listId: string): void {
  const lists = $savedLists.get()
  $savedLists.set(lists.filter((list) => list.id !== listId))

  if ($selectedListId.get() === listId) {
    $selectedListId.set(null)
  }
}

export function renameList(listId: string, newName: string): void {
  const lists = $savedLists.get()
  $savedLists.set(
    lists.map((list) =>
      list.id === listId
        ? { ...list, name: newName, updatedAt: new Date() }
        : list
    )
  )
}

export function addToList(listId: string, product: Product, notes?: string): void {
  const lists = $savedLists.get()
  const list = lists.find((l) => l.id === listId)

  if (!list) {
    console.warn('Lista no encontrada')
    return
  }

  // Verificar si el producto ya está en la lista
  const existingItem = list.items.find((item) => item.productId === product.id)
  if (existingItem) {
    console.warn('El producto ya está en esta lista')
    return
  }

  const newItem: WishlistItem = {
    productId: product.id,
    product,
    addedAt: new Date(),
    notes,
  }

  $savedLists.set(
    lists.map((l) =>
      l.id === listId
        ? { ...l, items: [...l.items, newItem], updatedAt: new Date() }
        : l
    )
  )
}

export function removeFromList(listId: string, productId: string | number): void {
  const lists = $savedLists.get()

  $savedLists.set(
    lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: list.items.filter((item) => item.productId !== productId),
            updatedAt: new Date(),
          }
        : list
    )
  )
}

export function clearList(listId: string): void {
  const lists = $savedLists.get()

  $savedLists.set(
    lists.map((list) =>
      list.id === listId
        ? { ...list, items: [], updatedAt: new Date() }
        : list
    )
  )
}

export function selectList(listId: string): void {
  $selectedListId.set(listId)
}

export function shareList(listId: string): string {
  const lists = $savedLists.get()
  const shareCode = `PROV${Math.random().toString(36).substr(2, 8).toUpperCase()}`

  $savedLists.set(
    lists.map((list) =>
      list.id === listId
        ? { ...list, isShared: true, shareCode, updatedAt: new Date() }
        : list
    )
  )

  return shareCode
}

export function unshareList(listId: string): void {
  const lists = $savedLists.get()

  $savedLists.set(
    lists.map((list) =>
      list.id === listId
        ? { ...list, isShared: false, shareCode: undefined, updatedAt: new Date() }
        : list
    )
  )
}

export function duplicateList(listId: string): string {
  const lists = $savedLists.get()
  const originalList = lists.find((l) => l.id === listId)

  if (!originalList) {
    console.warn('Lista no encontrada')
    return ''
  }

  const newList: SavedList = {
    id: `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${originalList.name} (copia)`,
    items: [...originalList.items],
    createdAt: new Date(),
    updatedAt: new Date(),
    isShared: false,
  }

  $savedLists.set([...lists, newList])
  return newList.id
}

export function addListToCart(listId: string): {
  success: number
  failed: number
} {
  const lists = $savedLists.get()
  const list = lists.find((l) => l.id === listId)

  if (!list) {
    return { success: 0, failed: 0 }
  }

  let success = 0
  let failed = 0

  list.items.forEach((item) => {
    const added = addToCart(item.product, 1)
    if (added) {
      success++
    } else {
      failed++
    }
  })

  return { success, failed }
}

// ============================================
// Utilities
// ============================================

export function isProductInWishlist(productId: string | number): boolean {
  const wishlistMap = $wishlist.get()
  return !!wishlistMap[productId.toString()]
}

export function isProductInList(listId: string, productId: string | number): boolean {
  const lists = $savedLists.get()
  const list = lists.find((l) => l.id === listId)

  if (!list) return false

  return list.items.some((item) => item.productId === productId)
}

export function getWishlistItem(productId: string | number): WishlistItem | null {
  const wishlistMap = $wishlist.get()
  return wishlistMap[productId.toString()] || null
}

export function getListById(listId: string): SavedList | null {
  const lists = $savedLists.get()
  return lists.find((list) => list.id === listId) || null
}

export function getListByShareCode(shareCode: string): SavedList | null {
  const lists = $savedLists.get()
  return lists.find((list) => list.shareCode === shareCode) || null
}
