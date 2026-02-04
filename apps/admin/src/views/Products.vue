<template>
  <div class="space-y-6">
    <!-- Search and Actions -->
    <div class="bg-white rounded-lg border-2 border-gray-300 shadow-sm p-6">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex-1 min-w-[300px]">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Buscar productos por nombre, SKU o categoría..." 
              class="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-provifood-primary focus:outline-none transition-colors bg-white text-gray-900"
            />
            <button class="absolute right-2 top-1/2 -translate-y-1/2 bg-provifood-primary hover:bg-provifood-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        <button 
          @click="showCreateModal = true"
          class="px-6 py-3 bg-provifood-secondary hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Crear Producto
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border-2 border-gray-300 shadow-sm p-6">
      <div class="flex flex-wrap gap-4">
        <select 
          v-model="filterCategory"
          class="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-provifood-primary focus:outline-none font-medium"
        >
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
        
        <select 
          v-model="filterStock"
          class="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-provifood-primary focus:outline-none font-medium"
        >
          <option value="">Todo el stock</option>
          <option value="in-stock">En Stock</option>
          <option value="low-stock">Stock Bajo (&lt; 10)</option>
          <option value="out-of-stock">Sin Stock</option>
        </select>

        <select 
          v-model="sortBy"
          class="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-provifood-primary focus:outline-none font-medium"
        >
          <option value="name-asc">Nombre (A-Z)</option>
          <option value="name-desc">Nombre (Z-A)</option>
          <option value="price-asc">Precio (Menor a Mayor)</option>
          <option value="price-desc">Precio (Mayor a Menor)</option>
          <option value="stock-asc">Stock (Menor a Mayor)</option>
          <option value="stock-desc">Stock (Mayor a Menor)</option>
        </select>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-5 text-white">
        <p class="text-sm font-medium opacity-90">Total Productos</p>
        <p class="text-3xl font-bold mt-2">{{ products.length }}</p>
      </div>
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-5 text-white">
        <p class="text-sm font-medium opacity-90">En Stock</p>
        <p class="text-3xl font-bold mt-2">{{ products.filter(p => p.stock > 0).length }}</p>
      </div>
      <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-sm p-5 text-white">
        <p class="text-sm font-medium opacity-90">Stock Bajo</p>
        <p class="text-3xl font-bold mt-2">{{ products.filter(p => p.stock > 0 && p.stock < 10).length }}</p>
      </div>
      <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-sm p-5 text-white">
        <p class="text-sm font-medium opacity-90">Sin Stock</p>
        <p class="text-3xl font-bold mt-2">{{ products.filter(p => p.stock === 0).length }}</p>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="bg-white rounded-lg border-2 border-gray-300 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
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
          <tbody class="divide-y divide-gray-200">
            <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ product.name }}</p>
                    <p class="text-sm text-gray-500 line-clamp-1">{{ product.description }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-mono text-sm text-gray-600">{{ product.sku }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ product.category }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <p class="font-semibold text-gray-900">${{ product.price.toLocaleString() }}</p>
                  <p v-if="product.discount" class="text-xs text-gray-500 line-through">${{ product.originalPrice?.toLocaleString() }}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <span class="font-semibold" :class="getStockColor(product.stock)">{{ product.stock }}</span>
                  <span class="text-sm text-gray-500">unidades</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="product.inStock ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'"
                >
                  {{ product.inStock ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="editProduct(product)"
                    class="p-2 text-white bg-provifood-primary hover:bg-provifood-primary/90 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="deleteProduct(product)"
                    class="p-2 text-white bg-provifood-secondary hover:bg-orange-600 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a 
          <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }}</span> de 
          <span class="font-medium">{{ filteredProducts.length }}</span> productos
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
            v-for="page in visiblePages" 
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

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="showCreateModal = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
            <h3 class="text-2xl font-bold text-gray-900">Crear Nuevo Producto</h3>
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
              <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" placeholder="Ej: Tomate Fresco 1kg" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
              <textarea rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" placeholder="Descripción del producto..."></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
                <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" placeholder="SKU-001" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent">
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
                <label class="block text-sm font-semibold text-gray-700 mb-2">Precio</label>
                <input type="number" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" placeholder="1200" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                <input type="number" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" placeholder="100" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">URL de Imagen</label>
              <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent" placeholder="https://..." />
            </div>

            <div class="flex items-center gap-3">
              <input type="checkbox" id="inStock" class="w-5 h-5 text-provifood-primary rounded focus:ring-2 focus:ring-provifood-primary" checked />
              <label for="inStock" class="text-sm font-medium text-gray-700">Producto activo</label>
            </div>

            <div class="flex gap-3 pt-4">
              <button 
                @click="showCreateModal = false"
                class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                class="flex-1 px-6 py-3 bg-provifood-primary text-white rounded-lg hover:bg-provifood-primary/90 font-medium transition-colors"
              >
                Crear Producto
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Product {
  id: number
  name: string
  description: string
  sku: string
  category: string
  price: number
  originalPrice?: number
  discount?: number
  stock: number
  inStock: boolean
  image: string
}

const searchQuery = ref('')
const filterCategory = ref('')
const filterStock = ref('')
const sortBy = ref('name-asc')
const currentPage = ref(1)
const itemsPerPage = 20
const showCreateModal = ref(false)

const products = ref<Product[]>([
  {
    id: 1,
    name: 'Tomate Fresco 1kg',
    description: 'Tomates frescos de primera calidad',
    sku: 'TOM-001',
    category: 'Frutas y Verduras',
    price: 1200,
    stock: 156,
    inStock: true,
    image: 'https://via.placeholder.com/100/FF6B6B/FFFFFF?text=Tomate'
  },
  {
    id: 2,
    name: 'Palta Hass 1kg',
    description: 'Paltas Hass importadas',
    sku: 'PAL-001',
    category: 'Frutas y Verduras',
    price: 3500,
    stock: 89,
    inStock: true,
    image: 'https://via.placeholder.com/100/4ECDC4/FFFFFF?text=Palta'
  },
  {
    id: 3,
    name: 'Lechuga Hidropónica',
    description: 'Lechuga fresca hidropónica',
    sku: 'LEC-001',
    category: 'Frutas y Verduras',
    price: 890,
    stock: 234,
    inStock: true,
    image: 'https://via.placeholder.com/100/95E1D3/FFFFFF?text=Lechuga'
  },
  {
    id: 4,
    name: 'Zanahoria 1kg',
    description: 'Zanahorias frescas',
    sku: 'ZAN-001',
    category: 'Frutas y Verduras',
    price: 750,
    stock: 8,
    inStock: true,
    image: 'https://via.placeholder.com/100/F38181/FFFFFF?text=Zanahoria'
  },
  {
    id: 5,
    name: 'Limón 1kg',
    description: 'Limones de Pica',
    sku: 'LIM-001',
    category: 'Frutas y Verduras',
    price: 1100,
    stock: 0,
    inStock: false,
    image: 'https://via.placeholder.com/100/FCE77D/FFFFFF?text=Limón'
  }
])

// Generate more mock products
const categories = ['Frutas y Verduras', 'Carnes y Pescados', 'Lácteos', 'Panadería', 'Bebidas', 'Despensa', 'Congelados', 'Limpieza']
const productNames = [
  'Manzana Red', 'Plátano', 'Naranja', 'Pera', 'Uva', 'Frutilla', 'Kiwi', 'Melón',
  'Sandía', 'Piña', 'Mango', 'Papaya', 'Durazno', 'Damasco', 'Ciruela', 'Pepino',
  'Pimiento', 'Cebolla', 'Ajo', 'Zapallo', 'Choclo', 'Arveja', 'Poroto Verde',
  'Brócoli', 'Coliflor', 'Repollo', 'Espinaca', 'Acelga', 'Apio', 'Perejil'
]

for (let i = 6; i <= 150; i++) {
  const randomName = productNames[Math.floor(Math.random() * productNames.length)]
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  const randomStock = Math.floor(Math.random() * 200)
  
  products.value.push({
    id: i,
    name: `${randomName} ${i}`,
    description: `Descripción del producto ${randomName}`,
    sku: `PRO-${i.toString().padStart(3, '0')}`,
    category: randomCategory,
    price: Math.floor(Math.random() * 5000) + 500,
    stock: randomStock,
    inStock: randomStock > 0,
    image: `https://via.placeholder.com/100/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${randomName.substring(0, 3)}`
  })
}

const filteredProducts = computed(() => {
  let filtered = products.value.filter(product => {
    const matchesSearch = searchQuery.value === '' || 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCategory = filterCategory.value === '' || product.category === filterCategory.value
    
    let matchesStock = true
    if (filterStock.value === 'in-stock') {
      matchesStock = product.stock > 10
    } else if (filterStock.value === 'low-stock') {
      matchesStock = product.stock > 0 && product.stock < 10
    } else if (filterStock.value === 'out-of-stock') {
      matchesStock = product.stock === 0
    }
    
    return matchesSearch && matchesCategory && matchesStock
  })

  // Sort
  if (sortBy.value === 'name-asc') {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'name-desc') {
    filtered = filtered.sort((a, b) => b.name.localeCompare(a.name))
  } else if (sortBy.value === 'price-asc') {
    filtered = filtered.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    filtered = filtered.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'stock-asc') {
    filtered = filtered.sort((a, b) => a.stock - b.stock)
  } else if (sortBy.value === 'stock-desc') {
    filtered = filtered.sort((a, b) => b.stock - a.stock)
  }

  return filtered
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
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

const getStockColor = (stock: number) => {
  if (stock === 0) return 'text-red-600'
  if (stock < 10) return 'text-yellow-600'
  return 'text-green-600'
}

const editProduct = (product: Product) => {
  console.log('Edit product:', product)
  // TODO: Open edit modal
}

const deleteProduct = (product: Product) => {
  console.log('Delete product:', product)
  // TODO: Show confirmation dialog
}
</script>
