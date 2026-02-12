import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ToastMessage {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

export const useToastStore = defineStore('toast', () => {
  const messages = ref<ToastMessage[]>([])
  let nextId = 1

  const add = (type: ToastMessage['type'], message: string) => {
    const id = nextId++
    messages.value.push({ id, type, message })
    setTimeout(() => remove(id), 5000)
  }

  const remove = (id: number) => {
    messages.value = messages.value.filter((m) => m.id !== id)
  }

  return { messages, add, remove }
})
