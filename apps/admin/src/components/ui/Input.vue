<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="block text-sm font-semibold text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="['w-full px-4 py-3 border rounded-lg transition-all focus:outline-none', inputClasses]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id?: string
    modelValue: string | number
    type?: string
    label?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    error?: string
  }>(),
  {
    type: 'text',
    disabled: false,
    required: false,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const inputClasses = computed(() => {
  if (props.error) {
    return 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
  }
  return 'border-gray-300 focus:border-provifood-primary focus:ring-2 focus:ring-provifood-primary/20'
})
</script>
