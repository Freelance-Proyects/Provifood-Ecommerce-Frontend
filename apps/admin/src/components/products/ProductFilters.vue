<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
    <div class="flex flex-col gap-4">
      <!-- Search Bar -->
      <div class="relative">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          :value="search"
          type="text"
          placeholder="Buscar productos por nombre, SKU, categoría o marca..."
          class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-provifood-primary focus:ring-2 focus:ring-provifood-primary/20 focus:outline-none transition-all bg-gray-50 text-gray-900"
          @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- Filters Row -->
      <div class="flex flex-wrap gap-3">
        <select
          :value="category"
          @change="$emit('update:category', ($event.target as HTMLSelectElement).value)"
          class="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-provifood-primary focus:ring-2 focus:ring-provifood-primary/20 focus:outline-none transition-all bg-white text-gray-700 font-medium"
        >
          <option value="">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <select
          :value="stock"
          @change="$emit('update:stock', ($event.target as HTMLSelectElement).value)"
          class="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-provifood-primary focus:ring-2 focus:ring-provifood-primary/20 focus:outline-none transition-all bg-white text-gray-700 font-medium"
        >
          <option value="">Todos los estados</option>
          <option value="inStock">En Stock</option>
          <option value="lowStock">Stock Bajo</option>
          <option value="outOfStock">Sin Stock</option>
        </select>

        <select
          :value="sort"
          @change="$emit('update:sort', ($event.target as HTMLSelectElement).value)"
          class="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-provifood-primary focus:ring-2 focus:ring-provifood-primary/20 focus:outline-none transition-all bg-white text-gray-700 font-medium"
        >
          <option value="name">Ordenar por Nombre</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="stock-asc">Stock: Menor a Mayor</option>
          <option value="stock-desc">Stock: Mayor a Menor</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PRODUCT_CATEGORIES } from '@/lib/constants'

defineProps<{
  search: string
  category: string
  stock: string
  sort: string
}>()

defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:category', value: string): void
  (e: 'update:stock', value: string): void
  (e: 'update:sort', value: string): void
}>()

const categories = PRODUCT_CATEGORIES
</script>
