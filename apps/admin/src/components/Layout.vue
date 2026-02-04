<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r-2 border-gray-200 shadow-sm flex flex-col">
      <!-- Logo -->
      <div class="p-6 border-b-2 border-gray-200">
        <div class="flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Provifood" class="h-16 w-auto" />
          <p class="text-xs font-semibold text-gray-600">Panel Admin</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200"
          :class="isActive(item.path) 
            ? 'bg-provifood-primary text-white' 
            : 'text-gray-700 hover:bg-gray-100'"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="font-medium">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- User Info -->
      <div class="p-4 border-t-2 border-gray-200">
        <div class="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <div class="w-10 h-10 bg-provifood-secondary rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-900">Admin</p>
            <p class="text-xs text-gray-600">admin@provifood.cl</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-8 py-5 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-provifood-primary">{{ pageTitle }}</h2>
            <p class="text-sm text-gray-600 mt-1">{{ pageDescription }}</p>
          </div>
          <div class="flex items-center gap-4">
            <button class="p-2 hover:bg-provifood-primary/10 rounded-lg transition-colors relative">
              <svg class="w-6 h-6 text-provifood-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-provifood-secondary rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto p-8 bg-gray-50">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: 'IconHome'
  },
  {
    path: '/orders',
    label: 'Pedidos',
    icon: 'IconOrders'
  },
  {
    path: '/products',
    label: 'Productos',
    icon: 'IconProducts'
  }
]

const isActive = (path: string) => {
  return route.path === path || (path !== '/' && route.path.startsWith(path))
}

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/orders': 'Gestión de Pedidos',
    '/products': 'Gestión de Productos'
  }
  return titles[route.path] || 'Provifood Admin'
})

const pageDescription = computed(() => {
  const descriptions: Record<string, string> = {
    '/': 'Resumen general del sistema',
    '/orders': 'Administra y gestiona los pedidos de clientes',
    '/products': 'Administra el catálogo de productos'
  }
  return descriptions[route.path] || ''
})
</script>

<script lang="ts">
import { defineComponent, h } from 'vue'

// Icon Components
export const IconHome = defineComponent({
  setup() {
    return () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      })
    ])
  }
})

export const IconOrders = defineComponent({
  setup() {
    return () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
      })
    ])
  }
})

export const IconProducts = defineComponent({
  setup() {
    return () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
      })
    ])
  }
})
</script>
