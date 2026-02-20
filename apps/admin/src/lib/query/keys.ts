import type { ProductFilters } from '@provifood/types'

export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: ProductFilters) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
    stats: () => [...queryKeys.products.all, 'stats'] as const,
  },
  staff: {
    all: ['staff'] as const,
    list: () => [...queryKeys.staff.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.staff.all, 'detail', id] as const,
  },
}
