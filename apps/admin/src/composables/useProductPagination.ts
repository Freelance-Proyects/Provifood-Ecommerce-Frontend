import { ref, computed, type Ref } from 'vue'

export function useProductPagination<T>(items: Ref<T[]>, initialPageSize = 20) {
  const currentPage = ref(1)
  const itemsPerPage = ref(initialPageSize)

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return items.value.slice(start, start + itemsPerPage.value)
  })

  const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage.value))

  const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  })

  const resetPage = () => {
    currentPage.value = 1
  }

  return {
    currentPage,
    itemsPerPage,
    paginatedItems,
    totalPages,
    visiblePages,
    resetPage,
  }
}
