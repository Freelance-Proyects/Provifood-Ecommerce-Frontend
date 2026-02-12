import { useQuery } from '@tanstack/vue-query'
import { productsRepository } from '@/lib/repositories'
import { queryKeys } from '@/lib/query/keys'

export function useProductStats() {
  return useQuery({
    queryKey: queryKeys.products.stats(),
    queryFn: () => productsRepository.getStats(),
  })
}
