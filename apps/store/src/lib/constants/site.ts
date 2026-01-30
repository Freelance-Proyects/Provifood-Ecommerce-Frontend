// Configuración del sitio
export const SITE_CONFIG = {
  name: 'Provifood',
  description: 'Distribuidora de Alimentos al Por Mayor y Menor',
  url: 'https://provifood.com',
  phone: '+123 456 7890',
  email: 'info@provifood.com',
  address: 'Av. Principal 123, Ciudad',
  social: {
    facebook: '#',
    instagram: '#',
    whatsapp: '#',
  },
} as const;

// Configuración de envío
export const SHIPPING_CONFIG = {
  freeShippingMinAmount: 50000,
  deliveryTime: '24-48 horas hábiles',
} as const;

// Descuento mayorista
export const WHOLESALE_DISCOUNT = 0.15; // 15%
