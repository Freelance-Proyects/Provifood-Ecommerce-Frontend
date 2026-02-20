<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50">
    <div class="w-full max-w-[400px]">
      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
        <!-- Header (fondo claro para que el logo sin fondo se vea bien) -->
        <div class="px-8 pt-10 pb-6 text-center border-b border-slate-100">
          <img src="/provifoodWB.png" alt="Provifood" class="h-14 mx-auto mb-4" />
          <h1 class="text-lg font-bold text-slate-800 tracking-tight">Panel de administración</h1>
          <p class="text-slate-500 text-sm mt-0.5">Solo personal autorizado</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-8 pt-6 space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Correo</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              :disabled="loading"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-provifood-primary/20 focus:border-provifood-primary outline-none transition disabled:opacity-60"
              placeholder="admin@provifood.cl"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              :disabled="loading"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-provifood-primary/20 focus:border-provifood-primary outline-none transition disabled:opacity-60"
              placeholder="••••••••"
            />
          </div>

          <div v-if="error" class="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="login-submit-btn"
          >
            <span v-if="loading" class="inline-flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Entrando...
            </span>
            <span v-else>Entrar</span>
          </button>
        </form>
      </div>

      <p class="text-center text-xs text-slate-500 mt-6">
        Provifood Admin
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    const result = await authStore.login(email.value, password.value)
    if (result.success) {
      const redirect = (route.query.redirect as string) || '/'
      const target = redirect === '/login' || redirect === '' ? '/' : redirect
      router.replace(target)
    } else {
      error.value = result.error || 'Error al iniciar sesión.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Anular el reset global de botones para que este botón ocupe todo el ancho y el texto quede centrado */
.login-submit-btn {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  box-sizing: border-box !important;
  padding: 0.875rem 1rem;
  background-color: #156F70;
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 10px 15px -3px rgb(21 111 112 / 0.25);
}
.login-submit-btn:hover:not(:disabled) {
  background-color: #125a5b;
  box-shadow: 0 10px 15px -3px rgb(21 111 112 / 0.3);
}
.login-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
