import { atom, computed } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'
import type {
  CheckoutStep,
  CheckoutState,
  DeliverySlot,
  TimeSlot,
  PaymentMethod,
  InvoiceData,
  Address,
  OrderDetails,
} from '../types/store.types'
import { $selectedAddress } from './addresses'
import { $cartItems, $cartTotals, $appliedPromoCode, clearCart } from './cart'
import { $authToken, $user } from './user'

// ============================================
// Constants
// ============================================

const CHECKOUT_STORAGE_KEY = 'provifood-checkout'

// ============================================
// Default Values
// ============================================

const defaultDeliverySlot: DeliverySlot = {
  date: null,
  timeSlot: null,
  availableSlots: [],
}

const defaultInvoice: InvoiceData = {
  needsInvoice: false,
  rut: '',
  businessName: '',
  address: '',
}

// ============================================
// Persistent Stores
// ============================================

export const $checkoutStep = persistentAtom<CheckoutStep>(
  `${CHECKOUT_STORAGE_KEY}-step`,
  'cart',
  {
    encode: (value) => value,
    decode: (str) => str as CheckoutStep,
  }
)

export const $paymentMethod = persistentAtom<PaymentMethod | null>(
  `${CHECKOUT_STORAGE_KEY}-payment`,
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

export const $invoiceData = persistentAtom<InvoiceData>(
  `${CHECKOUT_STORAGE_KEY}-invoice`,
  defaultInvoice,
  {
    encode: JSON.stringify,
    decode: (str) => {
      try {
        return { ...defaultInvoice, ...JSON.parse(str) }
      } catch {
        return defaultInvoice
      }
    },
  }
)

// ============================================
// Non-Persistent Stores
// ============================================

export const $deliverySlot = atom<DeliverySlot>(defaultDeliverySlot)
export const $isProcessing = atom<boolean>(false)
export const $checkoutError = atom<string | null>(null)
export const $orderId = atom<string | null>(null)

// ============================================
// Computed Stores
// ============================================

export const $canProceedToAddress = computed($cartItems, (items) => {
  return items.length > 0
})

export const $canProceedToDelivery = computed($selectedAddress, (address) => {
  return address !== null
})

export const $canProceedToPayment = computed($deliverySlot, (slot) => {
  return slot.date !== null && slot.timeSlot !== null
})

export const $canPlaceOrder = computed(
  [$paymentMethod, $invoiceData],
  (payment, invoice) => {
    if (!payment) return false
    if (invoice.needsInvoice) {
      return !!invoice.rut && !!invoice.businessName && !!invoice.address
    }
    return true
  }
)

export const $checkoutSummary = computed(
  [$cartItems, $cartTotals, $selectedAddress, $deliverySlot, $paymentMethod],
  (items, totals, address, delivery, payment) => {
    return {
      itemCount: items.length,
      totalProducts: items.reduce((sum, item) => sum + item.quantity, 0),
      totals,
      address,
      delivery,
      payment,
    }
  }
)

// ============================================
// Step Navigation Actions
// ============================================

export function goToStep(step: CheckoutStep): void {
  $checkoutStep.set(step)
  $checkoutError.set(null)
}

export function nextStep(): void {
  const currentStep = $checkoutStep.get()

  switch (currentStep) {
    case 'cart':
      if ($canProceedToAddress.get()) {
        goToStep('address')
      } else {
        $checkoutError.set('Tu carrito está vacío')
      }
      break
    case 'address':
      if ($canProceedToDelivery.get()) {
        goToStep('delivery')
      } else {
        $checkoutError.set('Selecciona una dirección de entrega')
      }
      break
    case 'delivery':
      if ($canProceedToPayment.get()) {
        goToStep('payment')
      } else {
        $checkoutError.set('Selecciona un horario de entrega')
      }
      break
    case 'payment':
      if ($canPlaceOrder.get()) {
        placeOrder()
      } else {
        $checkoutError.set('Completa la información de pago')
      }
      break
    default:
      break
  }
}

export function previousStep(): void {
  const currentStep = $checkoutStep.get()

  switch (currentStep) {
    case 'address':
      goToStep('cart')
      break
    case 'delivery':
      goToStep('address')
      break
    case 'payment':
      goToStep('delivery')
      break
    case 'confirmation':
      goToStep('cart')
      break
    default:
      break
  }
}

// ============================================
// Delivery Slot Actions
// ============================================

export async function fetchAvailableSlots(
  addressId: string,
  date: Date
): Promise<boolean> {
  const token = $authToken.get()

  if (!token) {
    $checkoutError.set('Usuario no autenticado')
    return false
  }

  $isProcessing.set(true)
  $checkoutError.set(null)

  try {
    // TODO: Reemplazar con llamada real al API
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_BASE_URL}/delivery/available-slots`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressId,
          date: date.toISOString(),
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Error al cargar horarios disponibles')
    }

    const slots: TimeSlot[] = await response.json()

    $deliverySlot.set({
      ...$deliverySlot.get(),
      date,
      availableSlots: slots,
    })

    $isProcessing.set(false)
    return true
  } catch (error) {
    $checkoutError.set(
      error instanceof Error ? error.message : 'Error al cargar horarios'
    )
    $isProcessing.set(false)
    return false
  }
}

export function selectDeliverySlot(slot: TimeSlot): void {
  const current = $deliverySlot.get()

  $deliverySlot.set({
    ...current,
    timeSlot: slot,
  })
}

export function selectDeliveryDate(date: Date): void {
  const current = $deliverySlot.get()

  $deliverySlot.set({
    ...current,
    date,
    timeSlot: null, // Reset slot when date changes
  })
}

export function clearDeliverySlot(): void {
  $deliverySlot.set(defaultDeliverySlot)
}

// ============================================
// Payment Actions
// ============================================

export function selectPaymentMethod(method: PaymentMethod): void {
  $paymentMethod.set(method)
}

export function clearPaymentMethod(): void {
  $paymentMethod.set(null)
}

// ============================================
// Invoice Actions
// ============================================

export function updateInvoiceData(data: Partial<InvoiceData>): void {
  const current = $invoiceData.get()
  $invoiceData.set({ ...current, ...data })
}

export function toggleInvoice(needsInvoice: boolean): void {
  updateInvoiceData({ needsInvoice })
}

export function clearInvoiceData(): void {
  $invoiceData.set(defaultInvoice)
}

// ============================================
// Order Placement
// ============================================

export function validateCheckout(): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Validar carrito
  const items = $cartItems.get()
  if (items.length === 0) {
    errors.push('Tu carrito está vacío')
  }

  // Validar dirección
  const address = $selectedAddress.get()
  if (!address) {
    errors.push('Debes seleccionar una dirección de entrega')
  }

  // Validar slot de entrega
  const delivery = $deliverySlot.get()
  if (!delivery.date || !delivery.timeSlot) {
    errors.push('Debes seleccionar un horario de entrega')
  }

  // Validar método de pago
  const payment = $paymentMethod.get()
  if (!payment) {
    errors.push('Debes seleccionar un método de pago')
  }

  // Validar factura si es necesaria
  const invoice = $invoiceData.get()
  if (invoice.needsInvoice) {
    if (!invoice.rut) errors.push('RUT de factura requerido')
    if (!invoice.businessName) errors.push('Razón social requerida')
    if (!invoice.address) errors.push('Dirección de factura requerida')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export async function placeOrder(): Promise<boolean> {
  const validation = validateCheckout()

  if (!validation.valid) {
    $checkoutError.set(validation.errors.join('. '))
    return false
  }

  const token = $authToken.get()
  const user = $user.get()

  if (!token || !user) {
    $checkoutError.set('Usuario no autenticado')
    return false
  }

  $isProcessing.set(true)
  $checkoutError.set(null)

  try {
    const orderData = {
      userId: user.id,
      items: $cartItems.get().map((item) => ({
        productId: item.id,
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      address: $selectedAddress.get(),
      deliverySlot: $deliverySlot.get(),
      paymentMethod: $paymentMethod.get(),
      invoice: $invoiceData.get(),
      totals: $cartTotals.get(),
      promoCode: $appliedPromoCode.get()?.code,
    }

    // TODO: Reemplazar con llamada real al API
    const response = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error('Error al procesar el pedido')
    }

    const order: OrderDetails = await response.json()

    $orderId.set(order.id)
    $isProcessing.set(false)
    goToStep('confirmation')

    // Limpiar carrito y checkout
    clearCart()
    resetCheckout()

    // Disparar evento de pedido completado
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('order-placed', { detail: { orderId: order.id } })
      )
    }

    return true
  } catch (error) {
    $checkoutError.set(
      error instanceof Error ? error.message : 'Error al procesar el pedido'
    )
    $isProcessing.set(false)
    return false
  }
}

// ============================================
// Reset Actions
// ============================================

export function resetCheckout(): void {
  $checkoutStep.set('cart')
  $deliverySlot.set(defaultDeliverySlot)
  $paymentMethod.set(null)
  $invoiceData.set(defaultInvoice)
  $checkoutError.set(null)
  $orderId.set(null)
}

export function resetDeliveryAndPayment(): void {
  $deliverySlot.set(defaultDeliverySlot)
  $paymentMethod.set(null)
}

// ============================================
// Utilities
// ============================================

export function getStepNumber(step: CheckoutStep): number {
  const steps: CheckoutStep[] = ['cart', 'address', 'delivery', 'payment', 'confirmation']
  return steps.indexOf(step) + 1
}

export function getTotalSteps(): number {
  return 5
}

export function getStepProgress(): number {
  const currentStep = $checkoutStep.get()
  const stepNumber = getStepNumber(currentStep)
  return (stepNumber / getTotalSteps()) * 100
}

export function formatTimeSlot(slot: TimeSlot): string {
  return `${slot.start} - ${slot.end}${slot.isExpress ? ' (Express)' : ''}`
}

export function calculateEstimatedDelivery(
  date: Date,
  slot: TimeSlot
): { date: Date; text: string } {
  const [hours] = slot.start.split(':').map(Number)
  const deliveryDate = new Date(date)
  deliveryDate.setHours(hours, 0, 0, 0)

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const dateText = deliveryDate.toLocaleDateString('es-CL', options)
  const timeText = formatTimeSlot(slot)

  return {
    date: deliveryDate,
    text: `${dateText} entre ${timeText}`,
  }
}
