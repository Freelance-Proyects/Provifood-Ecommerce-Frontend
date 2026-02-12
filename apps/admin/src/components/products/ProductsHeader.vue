<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
      <p class="text-sm text-gray-500 mt-1">Administra el catálogo de productos de Provifood</p>
    </div>
    <Button variant="secondary" size="lg" @click="$emit('create')">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Nuevo Producto
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '../ui/Button.vue'

defineEmits<{
  (e: 'create'): void
}>()
</script>
