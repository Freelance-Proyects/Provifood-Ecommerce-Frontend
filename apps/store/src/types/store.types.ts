import type { Product } from '@provifood/types'

// ============================================
// Cart Types
// ============================================

export interface Promotion {
  type: '2x1' | '3x2' | 'percentage' | 'fixed'
  value: number
  description: string
  endDate: Date
}

export interface ProductWeight {
  value: number
  unit: 'kg' | 'g' | 'lb'
  isVariable: boolean
}

export interface ProductRestrictions {
  ageRestriction?: number
  maxPerOrder?: number
}

export interface CartItem {
  id: string | number
  sku: string
  name: string
  brand: string | null
  category: string
  price: number
  originalPrice?: number
  quantity: number
  maxQuantity: number
  stock: number
  image: string | null
  weight?: ProductWeight
  promotion?: Promotion
  restrictions?: ProductRestrictions
  substitutes?: string[]
  addedAt: Date
  modifiedAt: Date
}

export interface PromoCode {
  code: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number
  minPurchase?: number
  expiresAt?: Date
}

export interface CartTotals {
  subtotal: number
  discounts: number
  shipping: number
  tax: number
  total: number
}

// ============================================
// User Types
// ============================================

export interface UserPreferences {
  defaultAddress: string | null
  defaultPaymentMethod: string | null
  newsletterEnabled: boolean
  smsNotifications: boolean
  dietaryRestrictions: string[]
}

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  rut: string
  isVerified: boolean
  membershipTier: 'basic' | 'premium' | 'vip'
}

export interface UserState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  preferences: UserPreferences
}

// ============================================
// Address Types
// ============================================

export interface Address {
  id: string
  alias: string
  street: string
  number: string
  apartment?: string
  comuna: string
  city: string
  region: string
  zipCode: string
  coordinates?: {
    lat: number
    lng: number
  }
  instructions?: string
  isDefault: boolean
  hasElevator: boolean
  phoneContact: string
}

// ============================================
// Checkout Types
// ============================================

export interface TimeSlot {
  id: string
  start: string
  end: string
  price: number
  isExpress: boolean
  isAvailable: boolean
}

export interface DeliverySlot {
  date: Date | null
  timeSlot: TimeSlot | null
  availableSlots: TimeSlot[]
}

export interface PaymentMethod {
  type: 'credit' | 'debit' | 'webpay' | 'mercadopago' | 'cash'
  lastFourDigits?: string
  installments?: number
}

export interface InvoiceData {
  needsInvoice: boolean
  rut: string
  businessName: string
  address: string
}

export type CheckoutStep = 'cart' | 'address' | 'delivery' | 'payment' | 'confirmation'

export interface CheckoutState {
  step: CheckoutStep
  selectedAddress: Address | null
  deliverySlot: DeliverySlot
  paymentMethod: PaymentMethod | null
  invoice: InvoiceData | null
  isProcessing: boolean
  orderId: string | null
}

// ============================================
// Order Types
// ============================================

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  productId: string | number
  name: string
  sku: string
  quantity: number
  price: number
  image: string | null
}

export interface TrackingInfo {
  courier: string
  trackingNumber: string
  currentLocation: string
  estimatedArrival: Date
  updates: TrackingUpdate[]
}

export interface TrackingUpdate {
  timestamp: Date
  status: string
  location: string
  description: string
}

export interface OrderDetails {
  id: string
  orderNumber: string
  date: Date
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  deliveryAddress: Address
  deliverySlot: {
    date: Date
    timeSlot: TimeSlot
  }
  trackingInfo?: TrackingInfo
  promoCode?: string
}

// ============================================
// Wishlist Types
// ============================================

export interface WishlistItem {
  productId: string | number
  product: Product
  addedAt: Date
  notes?: string
}

export interface SavedList {
  id: string
  name: string
  items: WishlistItem[]
  createdAt: Date
  updatedAt: Date
  isShared: boolean
  shareCode?: string
}

// ============================================
// Search Types
// ============================================

export interface SearchFilters {
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  onSale: boolean
  inStock: boolean
  rating: number
  dietary: string[]
  organic: boolean
}

export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'
  | 'name-asc'
  | 'name-desc'

export interface SearchState {
  query: string
  recentSearches: string[]
  suggestions: Product[]
  filters: SearchFilters
  sort: SortOption
  isLoading: boolean
}

// ============================================
// Notification Types
// ============================================

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
}
