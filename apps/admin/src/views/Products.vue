<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p class="text-sm text-gray-500 mt-1">Administra el catálogo de productos de Provifood</p>
        </div>
        <button 
          @click="showCreateModal = true"
          class="px-6 py-3 bg-provifood-secondary hover:bg-orange-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Productos</p>
              <p class="text-4xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
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
              <p class="text-4xl font-bold text-green-600 mt-2">{{ stats.in_stock }}</p>
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
              <p class="text-4xl font-bold text-yellow-600 mt-2">{{ stats.low_stock }}</p>
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
              <p class="text-4xl font-bold text-red-600 mt-2">{{ stats.out_of_stock }}</p>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div class="flex flex-col gap-4">
          <!-- Search Bar -->
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Buscar productos por nombre, SKU, categoría o marca..." 
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-provifood-primary focus:ring-2 focus:ring-provifood-primary/20 focus:outline-none transition-all bg-gray-50 text-gray-900"
            />
          </div>

          <!-- Filters Row -->
          <div class="flex flex-wrap gap-3">
            <select v-model="filterCategory" class="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-provifood-primary focus:ring-2 focus:ring-provifood-primary/20 focus:outline-none transition-all bg-white text-gray-700 font-medium">
              <option value="">Todas las categorías</option>
              <option value="Frutas y Verduras">Frutas y Verduras</option>
              <option value="Carnes y Pescados">Carnes y Pescados</option>
              <option value="Lácteos">Lácteos</option>
              <option value="Panadería">Panadería</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Despensa">Despensa</option>
              <option value="Congelados">Congelados</option>
              <option value="Limpieza">Limpieza</option>
            </select>
            
            <select v-model="filterStock" class="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-provifood-primary focus:ring-2 focus:ring-provifood-primary/20 focus:outline-none transition-all bg-white text-gray-700 font-medium">
              <option value="">Todos los estados</option>
              <option value="inStock">En Stock</option>
              <option value="lowStock">Stock Bajo</option>
              <option value="outOfStock">Sin Stock</option>
            </select>

            <select v-model="sortBy" class="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-provifood-primary focus:ring-2 focus:ring-provifood-primary/20 focus:outline-none transition-all bg-white text-gray-700 font-medium">
              <option value="name">Ordenar por Nombre</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="stock-asc">Stock: Menor a Mayor</option>
              <option value="stock-desc">Stock: Mayor a Menor</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Producto</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">SKU</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Categoría</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Precio</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50/50 transition-all">
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
                  <span class="text-base font-bold text-gray-900">${{ product.price?.toLocaleString('es-CL') }}</span>
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
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center gap-2">
                    <button 
                      @click="editProduct(product)"
                      class="p-2 bg-provifood-primary text-white rounded-lg hover:bg-provifood-primary/90 transition-all transform hover:scale-105 shadow-sm"
                      title="Editar producto"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      @click="deleteProduct(product.id!)" 
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
            Mostrando <span class="font-bold text-gray-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a 
            <span class="font-bold text-gray-900">{{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }}</span> de 
            <span class="font-bold text-gray-900">{{ filteredProducts.length }}</span> productos
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Pagination controls -->
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:-translate-x-0.5 disabled:transform-none shadow-sm"
            >
              ← Anterior
            </button>
            
            <div class="flex gap-1">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="currentPage = page"
                class="px-4 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105 shadow-sm"
                :class="page === currentPage 
                  ? 'bg-provifood-primary text-white border border-provifood-primary' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:translate-x-0.5 disabled:transform-none shadow-sm"
            >
              Siguiente →
            </button>
            
            <!-- Items per page selector -->
            <div class="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
              <span class="text-sm font-medium text-gray-600">Mostrar:</span>
              <select 
                v-model.number="itemsPerPage"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary/20 focus:border-provifood-primary text-sm font-medium bg-white transition-all shadow-sm"
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
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="showCreateModal = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
            <h3 class="text-2xl font-bold text-gray-900">{{ editMode ? 'Editar Producto' : 'Crear Nuevo Producto' }}</h3>
            <button 
              @click="showCreateModal = false"
              class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-8 space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del Producto</label>
              <input 
                v-model="newProduct.name"
                type="text" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" 
                placeholder="Ej: Tomate Fresco 1kg" 
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
              <textarea 
                v-model="newProduct.description"
                rows="3" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" 
                placeholder="Descripción del producto..."
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
                <input 
                  v-model="newProduct.sku"
                  type="text" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" 
                  placeholder="SKU-001" 
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                <select 
                  v-model="newProduct.category"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent"
                >
                  <option>Frutas y Verduras</option>
                  <option>Carnes y Pescados</option>
                  <option>Lácteos</option>
                  <option>Panadería</option>
                  <option>Bebidas</option>
                  <option>Despensa</option>
                  <option>Congelados</option>
                  <option>Limpieza</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Marca</label>
                <input 
                  v-model="newProduct.brand"
                  type="text" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" 
                  placeholder="Marca del producto" 
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                <input 
                  v-model.number="newProduct.stock"
                  type="number" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" 
                  placeholder="100" 
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Precio</label>
              <input 
                v-model.number="newProduct.price"
                type="number" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" 
                placeholder="1200" 
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">URL de Imagen</label>
              <input 
                v-model="newProduct.image_url"
                type="text" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" 
                placeholder="https://..." 
              />
            </div>

            <div class="flex gap-3 pt-4">
              <button 
                @click="showCreateModal = false"
                class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                @click="editMode ? updateProduct() : createProduct()"
                class="flex-1 px-6 py-3 bg-provifood-primary text-white rounded-lg hover:bg-provifood-primary/90 font-medium transition-colors"
              >
                {{ editMode ? 'Guardar Cambios' : 'Crear Producto' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { productsApi, type Product, type ProductStats } from '../services/api'

// Reactive state
const products = ref<Product[]>([])
const stats = ref<ProductStats>({
  total: 0,
  in_stock: 0,
  low_stock: 0,
  out_of_stock: 0
})
const loading = ref(false)
const error = ref<string | null>(null)

const searchQuery = ref('')
const filterCategory = ref('')
const filterStock = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = ref(20)

const showCreateModal = ref(false)
const editMode = ref(false)
const editingProductId = ref<number | null>(null)
const newProduct = ref<Partial<Product>>({
  name: '',
  description: '',
  sku: '',
  category: 'Frutas y Verduras',
  brand: '',
  price: 0,
  stock: 0,
  image_url: ''
})

// Watchers to reset page when filters change
watch([searchQuery, filterCategory, filterStock, sortBy, itemsPerPage], () => {
  currentPage.value = 1
})

// Load products from API
const loadProducts = async () => {
  loading.value = true
  error.value = null
  try {
    products.value = await productsApi.getAll()
  } catch (err) {
    error.value = 'Error al cargar productos'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Load stats from API
const loadStats = async () => {
  try {
    stats.value = await productsApi.getStats()
  } catch (err) {
    console.error('Error al cargar estadísticas:', err)
  }
}

// Edit product
const editProduct = (product: Product) => {
  editMode.value = true
  editingProductId.value = product.id!
  newProduct.value = { ...product }
  showCreateModal.value = true
}

// Update product
const updateProduct = async () => {
  if (!newProduct.value.name || !newProduct.value.sku || !editingProductId.value) {
    alert('Por favor completa los campos requeridos')
    return
  }

  try {
    await productsApi.update(editingProductId.value, newProduct.value as Omit<Product, 'id'>)
    showCreateModal.value = false
    resetForm()
    await loadProducts()
    await loadStats()
  } catch (err) {
    console.error('Error al actualizar producto:', err)
    alert('Error al actualizar el producto')
  }
}

// Create product
const createProduct = async () => {
  if (!newProduct.value.name || !newProduct.value.sku) {
    alert('Por favor completa los campos requeridos (Nombre y SKU)')
    return
  }

  try {
    await productsApi.create(newProduct.value as Omit<Product, 'id'>)
    showCreateModal.value = false
    resetForm()
    await loadProducts()
    await loadStats()
  } catch (err) {
    console.error('Error al crear producto:', err)
    alert('Error al crear el producto')
  }
}

// Delete product
const deleteProduct = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return

  try {
    await productsApi.delete(id)
    await loadProducts()
    await loadStats()
  } catch (err) {
    console.error('Error al eliminar producto:', err)
    alert('Error al eliminar el producto')
  }
}

// Reset form
const resetForm = () => {
  editMode.value = false
  editingProductId.value = null
  newProduct.value = {
    name: '',
    description: '',
    sku: '',
    category: 'Frutas y Verduras',
    brand: '',
    price: 0,
    stock: 0,
    image_url: ''
  }
}

// Computed properties
const filteredProducts = computed(() => {
  let filtered = [...products.value]

  // Search filter - has priority over category
  if (searchQuery.value && searchQuery.value.trim().length > 0) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(p => 
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.sku && p.sku.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.brand && p.brand.toLowerCase().includes(query))
    )
  } else {
    // Category filter - only applied when NOT searching
    if (filterCategory.value) {
      filtered = filtered.filter(p => p.category === filterCategory.value)
    }
  }

  // Stock filter
  if (filterStock.value) {
    filtered = filtered.filter(p => {
      if (filterStock.value === 'inStock') return p.stock >= 10
      if (filterStock.value === 'lowStock') return p.stock > 0 && p.stock < 10
      if (filterStock.value === 'outOfStock') return p.stock === 0
      return true
    })
  }

  // Sort
  if (sortBy.value === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'price-asc') {
    filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
  } else if (sortBy.value === 'price-desc') {
    filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
  } else if (sortBy.value === 'stock-asc') {
    filtered.sort((a, b) => a.stock - b.stock)
  } else if (sortBy.value === 'stock-desc') {
    filtered.sort((a, b) => b.stock - a.stock)
  }

  return filtered
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

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

const getStockStatus = (stock: number) => {
  if (stock === 0) return { text: 'Sin Stock', class: 'text-red-600 bg-red-50 border-red-200' }
  if (stock < 10) return { text: 'Stock Bajo', class: 'text-yellow-600 bg-yellow-50 border-yellow-200' }
  return { text: 'En Stock', class: 'text-green-600 bg-green-50 border-green-200' }
}

onMounted(() => {
  loadProducts()
  loadStats()
})
</script>
