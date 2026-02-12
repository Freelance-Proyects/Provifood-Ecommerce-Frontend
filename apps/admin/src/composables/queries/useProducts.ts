import { useQuery } from '@tanstack/vue-query'
import { productsRepository } from '@/lib/repositories'
import { queryKeys } from '@/lib/query/keys'
import type { ProductFilters } from '@provifood/types'
import type { MaybeRef } from 'vue'
import { unref, computed } from 'vue'

export function useProducts(filters?: MaybeRef<ProductFilters>) {
  return useQuery({
    queryKey: computed(() => queryKeys.products.list(unref(filters))),
    queryFn: () => productsRepository.getAll(unref(filters)),
  })
}

export function useProduct(id: MaybeRef<number>) {
  return useQuery({
    queryKey: computed(() => queryKeys.products.detail(unref(id))),
    queryFn: () => productsRepository.getById(unref(id)),
    enabled: computed(() => !!unref(id)),
  })
}
