import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  sku: z.string().min(1, 'El SKU es requerido').regex(/^[A-Z0-9-]+$/i, 'SKU debe ser alfanumérico'),
  category: z.string().min(1, 'La categoría es requerida'),
  brand: z.string().nullable().optional(),
  price: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
  image_url: z.string().url('URL inválida').nullable().optional().or(z.literal('')),
})

export type ProductFormData = z.infer<typeof productSchema>
