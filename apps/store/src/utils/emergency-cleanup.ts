// Script de emergencia para limpiar localStorage corrupto

export function emergencyCleanup() {
  if (typeof window === 'undefined') return

  console.log('🚨 Ejecutando limpieza de emergencia del carrito...')

  const keysToClean = [
    'provifood-cart',
    'provifood-promo-code',
    'provifood-user',
    'provifood-preferences',
    'provifood-token',
    'provifood-addresses',
    'provifood-checkout-step',
    'provifood-checkout-payment',
    'provifood-checkout-invoice',
    'provifood-wishlist',
    'provifood-saved-lists',
    'provifood-recent-searches',
  ]

  keysToClean.forEach((key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error al limpiar ${key}:`, error)
    }
  })

  console.log('✅ Limpieza de emergencia completada')
  console.log('🔄 Por favor recarga la página')
}

// Exportar globalmente para uso desde consola
if (typeof window !== 'undefined') {
  ;(window as any).emergencyCleanup = emergencyCleanup
}
