<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="block text-sm font-semibold text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="['w-full px-4 py-3 border rounded-lg transition-all focus:outline-none', selectClasses]"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id?: string
    modelValue: string | number
    options: Array<{ value: string | number; label: string }>
    label?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    error?: string
  }>(),
  {
    disabled: false,
    required: false,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const selectClasses = computed(() => {
  if (props.error) {
    return 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
  }
  return 'border-gray-300 focus:border-provifood-primary focus:ring-2 focus:ring-provifood-primary/20'
})
</script>
