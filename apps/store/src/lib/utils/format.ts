/**
 * Formatea un número como precio en CLP (pesos chilenos)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price);
}

/**
 * Calcula el precio con descuento
 */
export function calculateDiscount(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100);
}

/**
 * Formatea un slug de URL
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
