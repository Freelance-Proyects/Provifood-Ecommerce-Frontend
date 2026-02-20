import { atom, computed, map } from 'nanostores'
import type { Product } from '@provifood/types'
import type { CartItem, CartTotals, PromoCode } from '../types/store.types'

// ============================================
// Constants
// ============================================

const CART_STORAGE_KEY = 'provifood-cart'
const PROMO_CODE_KEY = 'provifood-promo-code'
const FREE_SHIPPING_THRESHOLD = 50000 // $50.000 CLP
const SHIPPING_COST = 3500 // $3.500 CLP
const TAX_RATE = 0.19 // 19% IVA

// ============================================
// Stores (sin persistentMap para evitar bucles)
// ============================================

export const $cart = map<Record<string, CartItem>>({})
export const $appliedPromoCode = atom<PromoCode | null>(null)

// ============================================
// Persistencia Manual
// ============================================

function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue

  try {
    const stored = localStorage.getItem(key)
    if (!stored || stored === 'undefined' || stored === 'null') return defaultValue

    const parsed = JSON.parse(stored)

    // Validar formato
    if (!parsed || typeof parsed !== 'object') return defaultValue
    if (Array.isArray(parsed)) return defaultValue // Formato antiguo

    // Reconstruir fechas
    if (key === CART_STORAGE_KEY) {
      const result: Record<string, CartItem> = {}
      Object.entries(parsed).forEach(([id, item]: [string, any]) => {
        if (item && item.id && item.name) {
          result[id] = {
            ...item,
            addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
            modifiedAt: item.modifiedAt ? new Date(item.modifiedAt) : new Date(),
          }
        }
      })
      return result as T
    }

    return parsed
  } catch (error) {
    console.error(`Error loading ${key}:`, error)
    return defaultValue
  }
}

function saveToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key}:`, error)
  }
}

// Cargar datos iniciales
if (typeof window !== 'undefined') {
  const initialCart = loadFromLocalStorage(CART_STORAGE_KEY, {})
  const initialPromo = loadFromLocalStorage(PROMO_CODE_KEY, null)

  $cart.set(initialCart)
  $appliedPromoCode.set(initialPromo)

  // Guardar automáticamente en cambios
  $cart.subscribe((value) => {
    saveToLocalStorage(CART_STORAGE_KEY, value)
  })

  $appliedPromoCode.subscribe((value) => {
    saveToLocalStorage(PROMO_CODE_KEY, value)
  })
}

// ============================================
// Computed Stores (Getters)
// ============================================

export const $cartItems = computed($cart, (cartMap) => {
  const items = Object.values(cartMap)
  if (items.length === 0) return []

  return [...items].sort((a, b) => {
    const aTime = (a.addedAt instanceof Date && !isNaN(a.addedAt.getTime()))
      ? a.addedAt.getTime()
      : 0

    const bTime = (b.addedAt instanceof Date && !isNaN(b.addedAt.getTime()))
      ? b.addedAt.getTime()
      : 0

    return bTime - aTime
  })
})

export const $cartCount = computed($cartItems, (items) => {
  return items.reduce((sum, item) => sum + item.quantity, 0)
})

export const $cartSubtotal = computed($cartItems, (items) => {
  return items.reduce((sum, item) => {
    const price = item.promotion ? item.price : item.originalPrice || item.price
    return sum + price * item.quantity
  }, 0)
})

export const $cartDiscounts = computed(
  [$cartItems, $appliedPromoCode],
  (items, promoCode) => {
    let discount = 0

    // Descuentos por promociones de productos
    items.forEach((item) => {
      if (item.promotion) {
        const originalPrice = item.originalPrice || item.price
        const discountPerItem = originalPrice - item.price
        discount += discountPerItem * item.quantity
      }
    })

    // Descuentos por código promocional
    if (promoCode && promoCode.type !== 'free_shipping') {
      const subtotal = $cartSubtotal.get()

      if (!promoCode.minPurchase || subtotal >= promoCode.minPurchase) {
        if (promoCode.type === 'percentage') {
          discount += (subtotal * promoCode.value) / 100
        } else if (promoCode.type === 'fixed') {
          discount += promoCode.value
        }
      }
    }

    return Math.round(discount)
  }
)

export const $cartShipping = computed(
  [$cartSubtotal, $appliedPromoCode],
  (subtotal, promoCode) => {
    // Envío gratis si supera el umbral
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0
    }

    // Envío gratis por código promocional
    if (promoCode?.type === 'free_shipping') {
      if (!promoCode.minPurchase || subtotal >= promoCode.minPurchase) {
        return 0
      }
    }

    return SHIPPING_COST
  }
)

export const $cartTax = computed($cartSubtotal, (subtotal) => {
  // En Chile, algunos productos de supermercado están exentos de IVA
  // Para simplificar, calculamos IVA sobre todo
  return Math.round(subtotal * TAX_RATE)
})

export const $cartTotal = computed(
  [$cartSubtotal, $cartDiscounts, $cartShipping, $cartTax],
  (subtotal, discounts, shipping, _tax) => {
    // Note: _tax is received but NOT added here because Provifood prices already
    // include IVA (19%). $cartTax is exposed for display purposes only (e.g. receipt breakdown).
    return Math.max(0, subtotal + shipping - discounts)
  }
)

export const $cartTotals = computed(
  [$cartSubtotal, $cartDiscounts, $cartShipping, $cartTax, $cartTotal],
  (subtotal, discounts, shipping, tax, total): CartTotals => ({
    subtotal,
    discounts,
    shipping,
    tax,
    total,
  })
)

export const $hasAgeRestrictedItems = computed($cartItems, (items) => {
  return items.some((item) => item.restrictions?.ageRestriction)
})

export const $estimatedWeight = computed($cartItems, (items) => {
  return items.reduce((sum, item) => {
    if (item.weight) {
      const weightInKg =
        item.weight.unit === 'kg'
          ? item.weight.value
          : item.weight.unit === 'g'
            ? item.weight.value / 1000
            : item.weight.value * 0.453592 // lb to kg
      return sum + weightInKg * item.quantity
    }
    return sum
  }, 0)
})

export const $appliedPromotions = computed($cartItems, (items) => {
  const promotions = items
    .filter((item) => item.promotion)
    .map((item) => ({
      productName: item.name,
      promotion: item.promotion!,
    }))

  return promotions
})

// ============================================
// Actions
// ============================================

export function addToCart(product: Product, quantity: number = 1): boolean {
  const cartMap = $cart.get()
  const existingItem = cartMap[product.id]

  // Validar stock
  if (quantity > product.stock) {
    console.warn(`No hay suficiente stock. Disponible: ${product.stock}`)
    return false
  }

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity

    // Validar stock total
    if (newQuantity > product.stock) {
      console.warn('No puedes agregar más unidades de las disponibles')
      return false
    }

    // Validar límite máximo por pedido
    if (existingItem.restrictions?.maxPerOrder && newQuantity > existingItem.restrictions.maxPerOrder) {
      console.warn(`Máximo ${existingItem.restrictions.maxPerOrder} unidades por pedido`)
      return false
    }

    $cart.setKey(product.id.toString(), {
      ...existingItem,
      quantity: newQuantity,
      modifiedAt: new Date(),
    })
  } else {
    const newItem: CartItem = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.price,
      quantity,
      maxQuantity: product.stock,
      stock: product.stock,
      image: product.image_url,
      addedAt: new Date(),
      modifiedAt: new Date(),
    }

    $cart.setKey(product.id.toString(), newItem)
  }

  return true
}

export function updateQuantity(productId: string | number, quantity: number): boolean {
  const cartMap = $cart.get()
  const item = cartMap[productId.toString()]

  if (!item) {
    console.warn('Producto no encontrado en el carrito')
    return false
  }

  // Eliminar si cantidad es 0 o negativa
  if (quantity <= 0) {
    removeFromCart(productId)
    return true
  }

  // Validar stock
  if (quantity > item.stock) {
    console.warn(`Solo hay ${item.stock} unidades disponibles`)
    return false
  }

  // Validar límite máximo
  if (item.restrictions?.maxPerOrder && quantity > item.restrictions.maxPerOrder) {
    console.warn(`Máximo ${item.restrictions.maxPerOrder} unidades por pedido`)
    return false
  }

  $cart.setKey(productId.toString(), {
    ...item,
    quantity,
    modifiedAt: new Date(),
  })

  return true
}

export function removeFromCart(productId: string | number): void {
  const cartMap = { ...$cart.get() }
  delete cartMap[productId.toString()]
  $cart.set(cartMap)
}

export function clearCart(): void {
  $cart.set({})
  $appliedPromoCode.set(null)
}

export function applyPromoCode(code: PromoCode): boolean {
  const subtotal = $cartSubtotal.get()

  // Validar mínimo de compra
  if (code.minPurchase && subtotal < code.minPurchase) {
    console.warn(`Compra mínima de $${code.minPurchase.toLocaleString()} requerida`)
    return false
  }

  // Validar expiración
  if (code.expiresAt && code.expiresAt < new Date()) {
    console.warn('Este código promocional ha expirado')
    return false
  }

  $appliedPromoCode.set(code)
  return true
}

export function removePromoCode(): void {
  $appliedPromoCode.set(null)
}

export async function validateStock(): Promise<{
  valid: boolean
  outOfStock: CartItem[]
  lowStock: CartItem[]
}> {
  const items = $cartItems.get()
  const outOfStock: CartItem[] = []
  const lowStock: CartItem[] = []

  // En un caso real, aquí harías una llamada al API para verificar stock actualizado
  items.forEach((item) => {
    if (item.stock === 0 || item.quantity > item.stock) {
      outOfStock.push(item)
    } else if (item.stock < item.quantity * 1.2) {
      // Si el stock es menos de 20% más que lo solicitado
      lowStock.push(item)
    }
  })

  return {
    valid: outOfStock.length === 0,
    outOfStock,
    lowStock,
  }
}

export function getItemById(productId: string | number): CartItem | null {
  const cartMap = $cart.get()
  return cartMap[productId.toString()] || null
}

export function incrementQuantity(productId: string | number): boolean {
  const item = getItemById(productId)
  if (!item) return false
  return updateQuantity(productId, item.quantity + 1)
}

export function decrementQuantity(productId: string | number): boolean {
  const item = getItemById(productId)
  if (!item) return false
  return updateQuantity(productId, item.quantity - 1)
}

// ============================================
// Utilities
// ============================================

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price)
}

export function isInCart(productId: string | number): boolean {
  const cartMap = $cart.get()
  return !!cartMap[productId.toString()]
}

export function getQuantityInCart(productId: string | number): number {
  const item = getItemById(productId)
  return item?.quantity || 0
}
