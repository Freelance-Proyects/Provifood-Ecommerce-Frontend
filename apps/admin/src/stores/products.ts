import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductsStore = defineStore('products', () => {
  const showCreateModal = ref(false)
  const selectedProductId = ref<number | null>(null)

  const openCreateModal = () => {
    showCreateModal.value = true
    selectedProductId.value = null
  }

  const openEditModal = (id: number) => {
    showCreateModal.value = true
    selectedProductId.value = id
  }

  const closeModal = () => {
    showCreateModal.value = false
    selectedProductId.value = null
  }

  return {
    showCreateModal,
    selectedProductId,
    openCreateModal,
    openEditModal,
    closeModal,
  }
})
