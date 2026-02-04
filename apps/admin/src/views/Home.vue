<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-lg border-2 border-gray-300 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="stat.bgColor">
            <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
          </div>
          <span class="text-xs font-semibold px-3 py-1 rounded-full" :class="stat.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
            {{ stat.change >= 0 ? '+' : '' }}{{ stat.change }}%
          </span>
        </div>
        <p class="text-gray-600 text-sm font-medium mb-1">{{ stat.label }}</p>
        <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <div class="bg-white rounded-lg border-2 border-gray-300 shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-900">Pedidos Recientes</h3>
          <router-link to="/orders" class="text-sm text-provifood-primary hover:text-provifood-primary/80 font-semibold flex items-center gap-1">
            Ver todos
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
        <div class="space-y-3">
          <div v-for="order in recentOrders" :key="order.id" class="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-all border border-gray-200">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-provifood-primary flex items-center justify-center">
                <span class="text-sm font-bold text-white">#{{ order.id }}</span>
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ order.customer }}</p>
                <p class="text-xs text-gray-500">{{ order.date }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900">${{ order.total.toLocaleString() }}</p>
              <span class="text-xs px-2 py-1 rounded-full font-medium" :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-lg border-2 border-gray-300 shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-900">Top Productos</h3>
          <router-link to="/products" class="text-sm text-provifood-primary hover:text-provifood-primary/80 font-semibold flex items-center gap-1">
            Ver todos
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
        <div class="space-y-3">
          <div v-for="(product, index) in topProducts" :key="product.id" class="group flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-all border border-gray-200">
            <div class="flex-shrink-0 relative">
              <div class="w-16 h-16 rounded-lg bg-white border-2 border-gray-200 overflow-hidden p-2 flex items-center justify-center">
                <img :src="product.image" :alt="product.name" class="w-full h-full object-contain" />
              </div>
              <span class="absolute -top-2 -left-2 w-6 h-6 bg-provifood-secondary text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {{ index + 1 }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 truncate">{{ product.name }}</p>
              <p class="text-xs text-gray-500">{{ product.sales }} vendidos</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900">${{ product.price.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'

const stats = [
  {
    label: 'Pedidos Hoy',
    value: '127',
    change: 12.5,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: defineComponent({
      setup() {
        return () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' })
        ])
      }
    })
  },
  {
    label: 'Ventas del Mes',
    value: '$2.4M',
    change: 8.2,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    icon: defineComponent({
      setup() {
        return () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
        ])
      }
    })
  },
  {
    label: 'Productos Activos',
    value: '856',
    change: -2.4,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    icon: defineComponent({
      setup() {
        return () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })
        ])
      }
    })
  },
  {
    label: 'Clientes',
    value: '3,456',
    change: 15.3,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    icon: defineComponent({
      setup() {
        return () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
        ])
      }
    })
  }
]

const recentOrders = [
  { id: 1234, customer: 'Juan Pérez', date: 'Hace 5 min', total: 45600, status: 'Nuevo' },
  { id: 1233, customer: 'María González', date: 'Hace 15 min', total: 32400, status: 'En Preparación' },
  { id: 1232, customer: 'Carlos Silva', date: 'Hace 1 hora', total: 78900, status: 'Preparado' },
  { id: 1231, customer: 'Ana Rojas', date: 'Hace 2 horas', total: 56700, status: 'Despachado' },
  { id: 1230, customer: 'Pedro Martínez', date: 'Hace 3 horas', total: 41200, status: 'Entregado' }
]

const topProducts = [
  { id: 1, name: 'Harina 000 x 1kg', sales: 234, price: 450, image: 'https://images.unsplash.com/photo-1628703413890-c27314bfea68?w=200&h=200&fit=crop' },
  { id: 2, name: 'Aceite de Girasol x 1.5L', sales: 198, price: 1200, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop' },
  { id: 3, name: 'Fideos Mostachol x 500g', sales: 176, price: 320, image: 'https://images.unsplash.com/photo-1551462147-37ec843e63a1?w=200&h=200&fit=crop' },
  { id: 4, name: 'Arroz Largo Fino x 1kg', sales: 154, price: 580, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop' },
  { id: 5, name: 'Azúcar Blanca x 1kg', sales: 142, price: 420, image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=200&h=200&fit=crop' }
]

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'Nuevo': 'bg-blue-100 text-blue-700',
    'En Preparación': 'bg-yellow-100 text-yellow-700',
    'Preparado': 'bg-purple-100 text-purple-700',
    'Despachado': 'bg-orange-100 text-orange-700',
    'Entregado': 'bg-green-100 text-green-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}
</script>
