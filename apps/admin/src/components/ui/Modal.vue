<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="close"
        @keydown.esc="close"
      >
        <div
          :class="['bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto', maxWidthClass]"
          role="dialog"
          aria-modal="true"
          @click.stop
        >
          <div
            class="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10"
          >
            <h3 class="text-2xl font-bold text-gray-900">{{ title }}</h3>
            <button
              @click="close"
              class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="p-8">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  }>(),
  {
    maxWidth: '2xl',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const maxWidthClass = computed(() => {
  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }
  return widths[props.maxWidth]
})

const close = () => {
  emit('update:modelValue', false)
}

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

// Prevent body scroll when modal is open
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white {
  transform: scale(0.9);
}

.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
