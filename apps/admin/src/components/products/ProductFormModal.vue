<template>
  <Modal :model-value="modelValue" :title="isEdit ? 'Editar Producto' : 'Crear Nuevo Producto'" @update:model-value="$emit('update:modelValue', $event)">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <Input
        id="name"
        v-model="form.name"
        label="Nombre del Producto"
        placeholder="Ej: Tomate Fresco 1kg"
        required
        :error="errors.name"
      />

      <Textarea
        id="description"
        v-model="form.description"
        label="Descripción"
        placeholder="Descripción del producto..."
        required
        :error="errors.description"
      />

      <div class="grid grid-cols-2 gap-4">
        <Input
          id="sku"
          v-model="form.sku"
          label="SKU"
          placeholder="SKU-001"
          required
          :error="errors.sku"
        />

        <Select
          id="category"
          v-model="form.category"
          label="Categoría"
          :options="categoryOptions"
          required
          :error="errors.category"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <Input
          id="brand"
          v-model="form.brand"
          label="Marca"
          placeholder="Marca del producto"
          :error="errors.brand"
        />

        <Input
          id="stock"
          v-model.number="form.stock"
          type="number"
          label="Stock"
          placeholder="100"
          required
          :error="errors.stock"
        />
      </div>

      <Input
        id="price"
        v-model.number="form.price"
        type="number"
        label="Precio"
        placeholder="1200"
        required
        :error="errors.price"
      />

      <Input
        id="image_url"
        v-model="form.image_url"
        label="URL de Imagen"
        placeholder="https://..."
        :error="errors.image_url"
      />

      <div class="flex gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          class="flex-1"
          @click="$emit('update:modelValue', false)"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          class="flex-1"
          :loading="createMutation.isPending.value || updateMutation.isPending.value"
        >
          {{ isEdit ? 'Guardar Cambios' : 'Crear Producto' }}
        </Button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useProduct } from '@/composables/queries/useProducts'
import { useCreateProduct, useUpdateProduct } from '@/composables/queries/useProductMutations'
import { useFormValidation } from '@/composables/useFormValidation'
import { productSchema } from '@/lib/validation/schemas/product.schema'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import Modal from '../ui/Modal.vue'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import Textarea from '../ui/Textarea.vue'
import Select from '../ui/Select.vue'

const props = defineProps<{
  modelValue: boolean
  productId: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isEdit = computed(() => props.productId !== null)

const form = ref({
  name: '',
  description: '',
  sku: '',
  category: PRODUCT_CATEGORIES[0] as string,
  brand: '',
  price: 0,
  stock: 0,
  image_url: '',
})

const { errors, validate, clearErrors } = useFormValidation(productSchema)

const createMutation = useCreateProduct()
const updateMutation = useUpdateProduct()

// Load product data when editing
const { data: productData } = useProduct(computed(() => props.productId || 0))

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && isEdit.value && productData.value) {
      form.value = {
        name: productData.value.name,
        description: productData.value.description,
        sku: productData.value.sku,
        category: productData.value.category,
        brand: productData.value.brand || '',
        price: productData.value.price,
        stock: productData.value.stock,
        image_url: productData.value.image_url || '',
      }
    } else if (isOpen && !isEdit.value) {
      form.value = {
        name: '',
        description: '',
        sku: '',
        category: PRODUCT_CATEGORIES[0] as string,
        brand: '',
        price: 0,
        stock: 0,
        image_url: '',
      }
    }
    clearErrors()
  }
)

const categoryOptions = PRODUCT_CATEGORIES.map((cat) => ({
  value: cat,
  label: cat,
}))

const handleSubmit = () => {
  const formData = {
    ...form.value,
    brand: form.value.brand || null,
    image_url: form.value.image_url || null,
  }

  if (!validate(formData)) {
    return
  }

  if (isEdit.value && props.productId) {
    updateMutation.mutate(
      { id: props.productId, data: formData },
      {
        onSuccess: () => {
          emit('update:modelValue', false)
        },
      }
    )
  } else {
    createMutation.mutate(formData, {
      onSuccess: () => {
        emit('update:modelValue', false)
      },
    })
  }
}
</script>
