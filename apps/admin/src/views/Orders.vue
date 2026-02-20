<template>
  <div class="space-y-6">
    <!-- DEMO Banner -->
    <div class="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-sm font-medium">
      <span class="text-lg">⚠️</span>
      <span><strong>Datos de demostración</strong> — Esta vista usa pedidos ficticios. Reemplazar con integración real al backend antes de producción.</span>
    </div>
    <!-- Filters -->
    <div class="bg-white rounded-lg border-2 border-gray-300 shadow-sm p-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-[300px]">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Buscar por ID, cliente o dirección..." 
              class="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-provifood-primary focus:outline-none transition-colors bg-white text-gray-900"
            />
            <button class="absolute right-2 top-1/2 -translate-y-1/2 bg-provifood-primary hover:bg-provifood-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        <select 
          v-model="filterStatus"
          class="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-provifood-primary focus:outline-none font-medium bg-white"
        >
          <option value="">Todos los estados</option>
          <option value="Nuevo">Nuevo</option>
          <option value="En Preparación">En Preparación</option>
          <option value="Preparado">Preparado</option>
          <option value="Despachado">Despachado</option>
          <option value="Entregado">Entregado</option>
        </select>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg border-2 border-gray-300 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cliente</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-mono font-semibold text-provifood-primary">#{{ order.id }}</span>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900">{{ order.customer.name }}</p>
                  <p class="text-sm text-gray-500">{{ order.customer.email }}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <p class="text-sm text-gray-900">{{ order.date }}</p>
                  <p class="text-xs text-gray-500">{{ order.time }}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-semibold text-gray-900">${{ order.total.toLocaleString() }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 rounded-full text-xs font-medium" :class="getStatusClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button 
                  @click="openOrderDetail(order)"
                  class="px-4 py-2 bg-provifood-primary text-white rounded-lg hover:bg-provifood-primary/90 font-medium text-sm transition-colors"
                >
                  Ver detalles
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a 
          <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, orders.length) }}</span> de 
          <span class="font-medium">{{ orders.length }}</span> pedidos
        </div>
        <div class="flex gap-2">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="page === currentPage 
              ? 'bg-provifood-primary text-white' 
              : 'border border-gray-300 hover:bg-gray-50'"
          >
            {{ page }}
          </button>
          <button 
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedOrder" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="selectedOrder = null">
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">Pedido #{{ selectedOrder.id }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ selectedOrder.date }} a las {{ selectedOrder.time }}</p>
            </div>
            <button 
              @click="selectedOrder = null"
              class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-8 space-y-6">
            <!-- Status Change -->
            <div class="bg-gray-50 rounded-xl p-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Estado del Pedido</label>
              <div class="flex gap-3">
                <select 
                  v-model="selectedOrder.status"
                  class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-provifood-primary focus:outline-none font-medium"
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="En Preparación">En Preparación</option>
                  <option value="Preparado">Preparado</option>
                  <option value="Despachado">Despachado</option>
                  <option value="Entregado">Entregado</option>
                </select>
                <button class="px-6 py-3 bg-provifood-secondary hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
                  Actualizar
                </button>
              </div>
            </div>

            <!-- Customer Info -->
            <div>
              <h4 class="text-lg font-bold text-gray-900 mb-4">Información del Cliente</h4>
              <div class="bg-gray-50 rounded-xl p-6 space-y-3">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="text-gray-900 font-medium">{{ selectedOrder.customer.name }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="text-gray-900">{{ selectedOrder.customer.email }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="text-gray-900">{{ selectedOrder.customer.phone }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-gray-900">{{ selectedOrder.customer.address }}</span>
                </div>
              </div>
            </div>

            <!-- Products -->
            <div>
              <h4 class="text-lg font-bold text-gray-900 mb-4">Productos</h4>
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div v-for="(item, index) in selectedOrder.items" :key="index" class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors" :class="{ 'border-b border-gray-200': index < selectedOrder.items.length - 1 }">
                  <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900">{{ item.name }}</p>
                    <p class="text-sm text-gray-500">{{ item.quantity }} x ${{ item.price.toLocaleString() }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900">${{ (item.quantity * item.price).toLocaleString() }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div class="border-t border-gray-200 pt-6">
              <div class="space-y-3">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span class="font-medium">${{ selectedOrder.subtotal.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span class="font-medium">${{ selectedOrder.shipping.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>${{ selectedOrder.total.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Customer {
  name: string
  email: string
  phone: string
  address: string
}

interface OrderItem {
  name: string
  quantity: number
  price: number
  image: string
}

interface Order {
  id: number
  customer: Customer
  date: string
  time: string
  status: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
}

const searchQuery = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const selectedOrder = ref<Order | null>(null)

const orders = ref<Order[]>([
  {
    id: 1234,
    customer: {
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+56 9 1234 5678',
      address: 'Av. Providencia 1234, Santiago'
    },
    date: '04/02/2026',
    time: '15:24',
    status: 'Nuevo',
    items: [
      { name: 'Tomate Fresco 1kg', quantity: 2, price: 1200, image: 'https://via.placeholder.com/100/FF6B6B/FFFFFF?text=Tomate' },
      { name: 'Palta Hass 1kg', quantity: 1, price: 3500, image: 'https://via.placeholder.com/100/4ECDC4/FFFFFF?text=Palta' },
      { name: 'Lechuga Hidropónica', quantity: 3, price: 890, image: 'https://via.placeholder.com/100/95E1D3/FFFFFF?text=Lechuga' }
    ],
    subtotal: 43100,
    shipping: 2500,
    total: 45600
  },
  {
    id: 1233,
    customer: {
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+56 9 8765 4321',
      address: 'Av. Vicuña Mackenna 5678, La Florida'
    },
    date: '04/02/2026',
    time: '15:09',
    status: 'En Preparación',
    items: [
      { name: 'Zanahoria 1kg', quantity: 2, price: 750, image: 'https://via.placeholder.com/100/F38181/FFFFFF?text=Zanahoria' },
      { name: 'Limón 1kg', quantity: 1, price: 1100, image: 'https://via.placeholder.com/100/FCE77D/FFFFFF?text=Limón' }
    ],
    subtotal: 29900,
    shipping: 2500,
    total: 32400
  },
  {
    id: 1232,
    customer: {
      name: 'Carlos Silva',
      email: 'carlos.silva@email.com',
      phone: '+56 9 5555 1234',
      address: 'Calle Los Aromos 789, Maipú'
    },
    date: '04/02/2026',
    time: '14:15',
    status: 'Preparado',
    items: [
      { name: 'Tomate Fresco 1kg', quantity: 3, price: 1200, image: 'https://via.placeholder.com/100/FF6B6B/FFFFFF?text=Tomate' },
      { name: 'Palta Hass 1kg', quantity: 2, price: 3500, image: 'https://via.placeholder.com/100/4ECDC4/FFFFFF?text=Palta' },
      { name: 'Lechuga Hidropónica', quantity: 1, price: 890, image: 'https://via.placeholder.com/100/95E1D3/FFFFFF?text=Lechuga' },
      { name: 'Zanahoria 1kg', quantity: 5, price: 750, image: 'https://via.placeholder.com/100/F38181/FFFFFF?text=Zanahoria' }
    ],
    subtotal: 76400,
    shipping: 2500,
    total: 78900
  }
])

// Generate more mock orders
for (let i = 1231; i >= 1200; i--) {
  orders.value.push({
    id: i,
    customer: {
      name: `Cliente ${i}`,
      email: `cliente${i}@email.com`,
      phone: `+56 9 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
      address: `Dirección de ejemplo ${i}, Santiago`
    },
    date: '04/02/2026',
    time: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    status: ['Nuevo', 'En Preparación', 'Preparado', 'Despachado', 'Entregado'][Math.floor(Math.random() * 5)],
    items: [
      { name: 'Tomate Fresco 1kg', quantity: Math.floor(Math.random() * 3 + 1), price: 1200, image: 'https://via.placeholder.com/100/FF6B6B/FFFFFF?text=Tomate' }
    ],
    subtotal: Math.floor(Math.random() * 50000 + 10000),
    shipping: 2500,
    total: Math.floor(Math.random() * 50000 + 12500)
  })
}

// Single filter source of truth — both filteredOrders and totalPages derive from this
const filteredOrdersAll = computed(() =>
  orders.value.filter((order) => {
    const matchesSearch =
      searchQuery.value === '' ||
      order.id.toString().includes(searchQuery.value) ||
      order.customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customer.address.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = filterStatus.value === '' || order.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
)

const filteredOrders = computed(() =>
  filteredOrdersAll.value.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage
  )
)

const totalPages = computed(() => Math.ceil(filteredOrdersAll.value.length / itemsPerPage))

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'Nuevo': 'bg-blue-500 text-white',
    'En Preparación': 'bg-yellow-500 text-white',
    'Preparado': 'bg-purple-500 text-white',
    'Despachado': 'bg-orange-500 text-white',
    'Entregado': 'bg-green-500 text-white'
  }
  return classes[status] || 'bg-gray-500 text-white'
}

const openOrderDetail = (order: Order) => {
  selectedOrder.value = { ...order }
}
</script>
