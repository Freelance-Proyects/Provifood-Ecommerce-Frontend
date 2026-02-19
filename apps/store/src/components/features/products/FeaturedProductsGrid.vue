<template>
  <div class="featured-products-grid">
    <!-- Skeleton mientras carga -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
      <div
        v-for="i in 12"
        :key="i"
        class="bg-white rounded-lg overflow-hidden border border-gray-200 h-full flex flex-col animate-pulse"
      >
        <div class="relative bg-gray-200 h-48 md:h-56" />
        <div class="p-3 md:p-4 flex-1 flex flex-col space-y-3">
          <div class="h-3 bg-gray-200 rounded w-1/3" />
          <div class="space-y-2">
            <div class="h-4 bg-gray-300 rounded w-full" />
            <div class="h-4 bg-gray-300 rounded w-2/3" />
          </div>
          <div class="flex-1" />
          <div class="h-6 bg-gray-300 rounded w-1/2" />
          <div class="h-10 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>

    <!-- Error: mensaje y reintentar -->
    <div
      v-else-if="error"
      class="rounded-xl bg-gray-50 border border-gray-200 p-8 md:p-12 text-center"
    >
      <p class="text-provifood-gray mb-4">
        No se pudieron cargar los productos. Revisa tu conexión o intenta más tarde.
      </p>
      <button
        type="button"
        class="px-6 py-3 bg-provifood-primary text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
        :disabled="loading"
        @click="retry"
      >
        {{ loading ? 'Cargando…' : 'Reintentar' }}
      </button>
    </div>

    <!-- Grid de productos (misma estructura que ProductCard.astro para setupProductCards) -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
    >
      <a
        v-for="product in sortedProducts"
        :key="product.id"
        :href="`/producto/${product.id}`"
        :class="[
          'product-card bg-white rounded-lg overflow-hidden border transition-shadow group relative h-full flex flex-col',
          !product.inStock ? 'border-gray-300 opacity-75' : 'border-gray-200 hover:shadow-xl'
        ]"
      >
        <!-- Badge sin stock -->
        <div
          v-if="!product.inStock"
          class="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
        >
          Sin Stock
        </div>

        <!-- Imagen -->
        <div class="relative bg-white h-48 md:h-56 overflow-hidden flex items-center justify-center p-4 md:p-6 group/image">
          <img
            v-if="product.image_url"
            :src="product.image_url"
            :alt="product.name"
            loading="lazy"
            decoding="async"
            :class="['max-w-full max-h-full object-contain', !product.inStock ? 'grayscale opacity-50' : '']"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg"
          >
            <svg class="w-20 h-20 md:w-24 md:h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <!-- Quick View -->
          <button
            type="button"
            class="quick-view-btn absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center"
            :data-product-id="product.id"
            :data-product-sku="product.sku"
            :data-product-name="product.name"
            :data-product-description="product.description"
            :data-product-price="product.price"
            :data-product-image="product.image_url"
            :data-product-category="product.category"
            :data-product-brand="product.brand"
            :data-stock="product.stock || 0"
            :aria-label="`Vista rápida de ${product.name}`"
            @click.prevent.stop
          >
            <div class="bg-white rounded-full p-3 hover:bg-provifood-primary hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </button>

          <div
            v-if="!product.inStock"
            class="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]"
          >
            <div class="text-center">
              <svg class="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="text-white text-base md:text-lg font-bold">Agotado</span>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="p-3 md:p-4 flex-1 flex flex-col">
          <p v-if="product.brand" class="text-xs text-gray-400 mb-1 uppercase tracking-wide">
            {{ product.brand }}
          </p>
          <h3 class="text-sm md:text-base font-semibold text-provifood-dark mb-2 md:mb-3 line-clamp-2 flex-1">
            {{ product.name }}
          </h3>
          <div class="mb-3 md:mb-4">
            <span class="text-xl md:text-2xl font-bold text-provifood-primary">
              ${{ (product.price || 0).toLocaleString('es-CL') }}
            </span>
          </div>
          <button
            type="button"
            class="add-to-cart-btn w-full bg-provifood-secondary hover:bg-orange-600 text-white font-semibold py-2.5 md:py-3 px-4 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
            :disabled="!product.inStock"
            :data-product-id="product.id"
            :data-product-sku="product.sku"
            :data-product-name="product.name"
            :data-product-price="product.price"
            :data-product-image="product.image_url"
            :data-product-category="product.category"
            :data-product-brand="product.brand"
            :data-stock="product.stock || 0"
            @click.prevent.stop
          >
            {{ product.inStock ? 'Agregar al Carrito' : 'Sin Stock' }}
          </button>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'

// Usar proxy del mismo origen para evitar CORS (el servidor reenvía al backend)
const PRODUCTS_API = '/api/products'

interface Product {
  id: number
  name: string
  description?: string
  price: number
  image_url?: string
  stock: number
  inStock?: boolean
  category?: string
  brand?: string
  sku?: string
}

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref(false)

const sortedProducts = computed(() => {
  return [...products.value].sort((a, b) => {
    const aIn = (a.stock ?? 0) > 0
    const bIn = (b.stock ?? 0) > 0
    if (aIn && !bIn) return -1
    if (!aIn && bIn) return 1
    return 0
  })
})

async function fetchProducts() {
  error.value = false
  loading.value = true
  try {
    const res = await fetch(`${PRODUCTS_API}?limit=12`, {
      headers: { Accept: 'application/json' },
      cache: 'default'
    })
    if (!res.ok) {
      error.value = true
      return
    }
    const data = await res.json()
    products.value = (Array.isArray(data) ? data : []).map((p: Product) => ({
      ...p,
      inStock: (p.stock ?? 0) > 0
    }))
  } catch (e) {
    console.error('Error fetching featured products:', e)
    error.value = true
  } finally {
    loading.value = false
    await nextTick()
    if (typeof window !== 'undefined' && (window as any).setupProductCards) {
      (window as any).setupProductCards()
    }
    window.dispatchEvent(new CustomEvent('products-rendered'))
  }
}

function retry() {
  fetchProducts()
}

onMounted(fetchProducts)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
