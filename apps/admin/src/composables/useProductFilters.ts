import { ref, computed, type Ref } from 'vue'
import type { Product } from '@provifood/types'

export function useProductFilters(products: Ref<Product[]>) {
  const searchQuery = ref('')
  const filterCategory = ref('')
  const filterStock = ref('')
  const sortBy = ref('name')

  const filteredProducts = computed(() => {
    let filtered = [...products.value]

    // Search filter — all fields guarded against null (backend may return null for any field)
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter(
        (p) =>
          (p.name?.toLowerCase() ?? '').includes(q) ||
          (p.sku?.toLowerCase() ?? '').includes(q) ||
          (p.category?.toLowerCase() ?? '').includes(q) ||
          (p.brand?.toLowerCase() ?? '').includes(q)
      )
    } else if (filterCategory.value) {
      // Category filter (only when not searching)
      filtered = filtered.filter((p) => p.category === filterCategory.value)
    }

    // Stock filter
    if (filterStock.value === 'inStock') filtered = filtered.filter((p) => p.stock >= 10)
    if (filterStock.value === 'lowStock')
      filtered = filtered.filter((p) => p.stock > 0 && p.stock < 10)
    if (filterStock.value === 'outOfStock') filtered = filtered.filter((p) => p.stock === 0)

    // Sort — guarded against null names
    if (sortBy.value === 'name') filtered.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
    if (sortBy.value === 'price-asc') filtered.sort((a, b) => a.price - b.price)
    if (sortBy.value === 'price-desc') filtered.sort((a, b) => b.price - a.price)
    if (sortBy.value === 'stock-asc') filtered.sort((a, b) => a.stock - b.stock)
    if (sortBy.value === 'stock-desc') filtered.sort((a, b) => b.stock - a.stock)

    return filtered
  })

  return {
    searchQuery,
    filterCategory,
    filterStock,
    sortBy,
    filteredProducts,
  }
}
