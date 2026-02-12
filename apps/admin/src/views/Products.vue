<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <ProductsHeader @create="store.openCreateModal()" />

      <ProductStats :stats="stats || defaultStats" :loading="statsLoading" />

      <ProductFilters
        v-model:search="searchQuery"
        v-model:category="filterCategory"
        v-model:stock="filterStock"
        v-model:sort="sortBy"
      />

      <ProductTable
        :products="paginatedItems"
        :loading="isLoading"
        :page="currentPage"
        :per-page="itemsPerPage"
        :total-pages="totalPages"
        :total-items="filteredProducts.length"
        :visible-pages="visiblePages"
        @edit="store.openEditModal($event)"
        @delete="handleDelete($event)"
        @update:page="(page) => (currentPage = page)"
        @update:per-page="(perPage) => (itemsPerPage = perPage)"
      />

      <ProductFormModal
        v-model="store.showCreateModal"
        :product-id="store.selectedProductId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useProducts } from '@/composables/queries/useProducts'
import { useProductStats } from '@/composables/queries/useProductStats'
import { useDeleteProduct } from '@/composables/queries/useProductMutations'
import { useProductFilters } from '@/composables/useProductFilters'
import { useProductPagination } from '@/composables/useProductPagination'
import { useProductsStore } from '@/stores/products'
import ProductsHeader from '@/components/products/ProductsHeader.vue'
import ProductStats from '@/components/products/ProductStats.vue'
import ProductFilters from '@/components/products/ProductFilters.vue'
import ProductTable from '@/components/products/ProductTable.vue'
import ProductFormModal from '@/components/products/ProductFormModal.vue'

const store = useProductsStore()

// Data fetching with TanStack Query
const { data: products, isLoading } = useProducts()
const { data: stats, isLoading: statsLoading } = useProductStats()

// Default stats for loading state
const defaultStats = { total: 0, in_stock: 0, low_stock: 0, out_of_stock: 0 }

// Ensure products is always an array
const productsList = computed(() => products.value || [])

// Filtering
const {
  searchQuery,
  filterCategory,
  filterStock,
  sortBy,
  filteredProducts,
} = useProductFilters(productsList)

// Pagination
const {
  currentPage,
  itemsPerPage,
  paginatedItems,
  totalPages,
  visiblePages,
  resetPage,
} = useProductPagination(filteredProducts)

// Mutations
const { mutate: deleteProduct } = useDeleteProduct()

const handleDelete = (id: number) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    deleteProduct(id)
  }
}

// Reset page when filters change
watch([searchQuery, filterCategory, filterStock, sortBy], resetPage)
</script>
