<template>
  <div class="min-h-screen bg-gray-50">
    <div class="p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ appStore.appName }}</h1>
      <p class="text-gray-600 mb-8">Panel de administración de Provifood</p>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Dashboard</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="border rounded p-4">
            <p class="text-gray-500 text-sm">Productos</p>
            <p class="text-2xl font-bold">0</p>
          </div>
          <div class="border rounded p-4">
            <p class="text-gray-500 text-sm">Órdenes</p>
            <p class="text-2xl font-bold">0</p>
          </div>
          <div class="border rounded p-4">
            <p class="text-gray-500 text-sm">Usuarios</p>
            <p class="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/app'
import type { Product, Order, User } from '@provifood/types'

const appStore = useAppStore()
</script>
