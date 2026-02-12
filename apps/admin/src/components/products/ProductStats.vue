<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Productos</p>
          <p v-if="loading" class="text-4xl font-bold text-gray-300 mt-2">--</p>
          <p v-else class="text-4xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">En Stock</p>
          <p v-if="loading" class="text-4xl font-bold text-gray-300 mt-2">--</p>
          <p v-else class="text-4xl font-bold text-green-600 mt-2">{{ stats.in_stock }}</p>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">Stock Bajo</p>
          <p v-if="loading" class="text-4xl font-bold text-gray-300 mt-2">--</p>
          <p v-else class="text-4xl font-bold text-yellow-600 mt-2">{{ stats.low_stock }}</p>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-md">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">Sin Stock</p>
          <p v-if="loading" class="text-4xl font-bold text-gray-300 mt-2">--</p>
          <p v-else class="text-4xl font-bold text-red-600 mt-2">{{ stats.out_of_stock }}</p>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductStats } from '@provifood/types'

withDefaults(
  defineProps<{
    stats: ProductStats
    loading?: boolean
  }>(),
  {
    loading: false,
  }
)
</script>
