// Utilidad para limpiar datos antiguos del carrito

export function cleanOldCartData() {
  if (typeof window === 'undefined') return

  try {
    const oldCartKey = 'provifood-cart'
    const oldCart = localStorage.getItem(oldCartKey)

    if (oldCart) {
      const parsed = JSON.parse(oldCart)

      // Si es un array (formato antiguo), limpiarlo
      if (Array.isArray(parsed)) {
        console.log('🧹 Limpiando formato antiguo del carrito...')
        localStorage.removeItem(oldCartKey)
        console.log('✅ Carrito limpiado. Los datos se actualizarán automáticamente.')
      }
    }
  } catch (error) {
    console.warn('⚠️ Error al limpiar datos antiguos del carrito:', error)
    // Si hay error, limpiar localStorage para empezar fresco
    localStorage.removeItem('provifood-cart')
  }
}

// NO ejecutar automáticamente - el store ya maneja la limpieza
// Si necesitas forzar una limpieza manual, llama a cleanOldCartData() desde consola
