<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <SkeletonLoader v-if="loading" />
    <div v-else-if="products.length === 0" class="p-12 text-center">
      <p class="text-gray-500 text-lg">No se encontraron productos</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Producto</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">SKU</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Categoría</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Precio</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
            <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
            <th v-if="canEdit" class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50/50 transition-all">
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                  <img
                    :src="product.image_url || 'https://via.placeholder.com/100/CCCCCC/FFFFFF?text=No+Image'"
                    :alt="product.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p class="font-semibold text-gray-900 text-sm">{{ product.name }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ product.brand || 'Sin marca' }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{{ product.sku }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ product.category }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-base font-bold text-gray-900">${{ product.price.toLocaleString('es-CL') }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-semibold text-gray-700">{{ product.stock }} <span class="text-xs text-gray-500 font-normal">unidades</span></span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                :class="getStockStatus(product.stock).class"
              >
                {{ getStockStatus(product.stock).text }}
              </span>
            </td>
            <td v-if="canEdit" class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="$emit('edit', product.id)"
                  class="p-2 bg-provifood-primary text-white rounded-lg hover:bg-provifood-primary/90 transition-all transform hover:scale-105 shadow-sm"
                  title="Editar producto"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="$emit('delete', product.id)"
                  class="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-sm"
                  title="Eliminar producto"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-sm font-medium text-gray-600">
        Mostrando <span class="font-bold text-gray-900">{{ displayFrom }}</span> a
        <span class="font-bold text-gray-900">{{ displayTo }}</span> de
        <span class="font-bold text-gray-900">{{ totalItems }}</span> productos
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="$emit('update:page', page - 1)"
          :disabled="page === 1"
          class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          ← Anterior
        </button>

        <div class="flex gap-1">
          <button
            v-for="p in visiblePages"
            :key="p"
            @click="$emit('update:page', p)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm',
              p === page
                ? 'bg-provifood-primary text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
            ]"
          >
            {{ p }}
          </button>
        </div>

        <button
          @click="$emit('update:page', page + 1)"
          :disabled="page === totalPages"
          class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Siguiente →
        </button>

        <div class="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
          <span class="text-sm font-medium text-gray-600">Mostrar:</span>
          <select
            :value="perPage"
            @change="$emit('update:perPage', Number(($event.target as HTMLSelectElement).value))"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@provifood/types'
import SkeletonLoader from '../ui/SkeletonLoader.vue'

const props = withDefaults(
  defineProps<{
    products: Product[]
    loading?: boolean
    canEdit?: boolean
    page: number
    perPage: number
    totalPages: number
    totalItems: number
    visiblePages: number[]
  }>(),
  { canEdit: true }
)

defineEmits<{
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
  (e: 'update:page', page: number): void
  (e: 'update:perPage', perPage: number): void
}>()

const displayFrom = computed(() => (props.page - 1) * props.perPage + 1)
const displayTo = computed(() => Math.min(props.page * props.perPage, props.totalItems))

const getStockStatus = (stock: number) => {
  if (stock === 0) return { text: 'Sin Stock', class: 'text-red-600 bg-red-50' }
  if (stock < 10) return { text: 'Stock Bajo', class: 'text-yellow-600 bg-yellow-50' }
  return { text: 'En Stock', class: 'text-green-600 bg-green-50' }
}
</script>
