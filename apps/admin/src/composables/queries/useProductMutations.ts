import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { productsRepository } from '@/lib/repositories'
import { queryKeys } from '@/lib/query/keys'
import { useToast } from '../useToast'
import type { Product } from '@provifood/types'

// Note: HTTP error toasts (4xx/5xx) are handled globally by the Axios interceptor.
// onError here is only needed for non-HTTP errors (e.g. network unreachable, timeout).

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (product: Omit<Product, 'id'>) => productsRepository.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      toast.success('Producto creado exitosamente')
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      productsRepository.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      toast.success('Producto actualizado exitosamente')
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (id: number) => productsRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      toast.success('Producto eliminado exitosamente')
    },
  })
}
