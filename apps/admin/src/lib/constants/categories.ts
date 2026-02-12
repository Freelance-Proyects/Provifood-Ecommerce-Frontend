export const PRODUCT_CATEGORIES = [
  'Frutas y Verduras',
  'Carnes y Pescados',
  'Lácteos',
  'Panadería',
  'Bebidas',
  'Despensa',
  'Congelados',
  'Limpieza',
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]
