import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const appName = ref('Provifood Admin')
  const version = ref('1.0.0')

  return {
    appName,
    version
  }
})
