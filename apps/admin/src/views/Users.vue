<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Cuentas de staff</h1>
          <p class="text-sm text-gray-500 mt-1">Administradores y operadores del dashboard</p>
        </div>
        <Button variant="secondary" size="lg" @click="openCreate">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva cuenta
        </Button>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div v-if="isLoading" class="p-12 text-center text-gray-500">
          <p>Cargando...</p>
          <p class="text-xs mt-2 max-w-sm mx-auto">Si tarda más de unos segundos, comprueba que el backend esté en marcha (<code class="bg-gray-100 px-1 rounded">docker compose up -d</code> en la carpeta del backend).</p>
        </div>
        <div v-else-if="isError" class="p-12 text-center">
          <p class="text-red-600 font-medium mb-2">No se pudo cargar la lista de cuentas.</p>
          <p class="text-sm text-gray-500 mb-4">Comprueba que el backend esté en marcha (timeout o conexión).</p>
          <Button variant="secondary" @click="refetch">Reintentar</Button>
        </div>
        <div v-else-if="!staffList.length" class="p-12 text-center text-gray-500">
          No hay cuentas de staff. Crea una para comenzar.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rol</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="u in staffList" :key="u.id" class="hover:bg-gray-50/50">
                <td class="px-6 py-4 text-sm text-gray-900">{{ u.email }}</td>
                <td class="px-6 py-4 text-sm text-gray-700">{{ u.first_name }} {{ u.last_name }}</td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                      u.role === 'admin' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800',
                    ]"
                  >
                    {{ u.role === 'admin' ? 'Administrador' : 'Operador' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                      u.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600',
                    ]"
                  >
                    {{ u.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="openEdit(u)"
                      class="p-2 bg-provifood-primary text-white rounded-lg hover:bg-provifood-primary/90 transition-colors"
                      title="Editar"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="confirmDelete(u)"
                      class="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Crear / Editar -->
    <Modal v-model="showModal" :title="editingId ? 'Editar cuenta' : 'Nueva cuenta'" max-width="md">
      <form @submit.prevent="submitForm" class="space-y-4">
        <Input
          v-model="form.email"
          label="Correo"
          type="email"
          required
          placeholder="usuario@provifood.cl"
        />
        <Input
          v-model="form.password"
          :label="editingId ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'"
          type="password"
          :required="!editingId"
          placeholder="••••••••"
        />
        <Input v-model="form.first_name" label="Nombre" required placeholder="Nombre" />
        <Input v-model="form.last_name" label="Apellido" required placeholder="Apellido" />
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Rol</label>
          <select
            v-model="form.role"
            required
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-provifood-primary focus:border-transparent outline-none"
          >
            <option value="admin">Administrador</option>
            <option value="operator">Operador</option>
          </select>
        </div>
        <div v-if="editingId" class="flex items-center gap-2">
          <input
            id="is_active"
            v-model="form.is_active"
            type="checkbox"
            class="rounded border-gray-300 text-provifood-primary focus:ring-provifood-primary"
          />
          <label for="is_active" class="text-sm font-medium text-gray-700">Cuenta activa</label>
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" @click="showModal = false">Cancelar</Button>
          <Button type="submit" :disabled="createMutation.isPending.value || updateMutation.isPending.value">
            {{ editingId ? 'Guardar' : 'Crear cuenta' }}
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Confirm delete -->
    <Modal v-model="showDeleteConfirm" title="Eliminar cuenta" max-width="sm">
      <p class="text-gray-700">
        ¿Eliminar la cuenta de <strong>{{ userToDelete?.email }}</strong>? Esta acción no se puede deshacer.
      </p>
      <div class="flex justify-end gap-3 mt-6">
        <Button variant="secondary" @click="showDeleteConfirm = false">Cancelar</Button>
        <Button class="bg-red-500 hover:bg-red-600" :disabled="deleteMutation.isPending.value" @click="doDelete">
          Eliminar
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import { useStaffUsers, useCreateStaffUser, useUpdateStaffUser, useDeleteStaffUser } from '@/composables/queries/useStaffUsers'
import type { StaffUser } from '@/lib/repositories/staff.repository'

const { data: staffUsers, isLoading, isError, refetch } = useStaffUsers()
const createMutation = useCreateStaffUser()
const updateMutation = useUpdateStaffUser()
const deleteMutation = useDeleteStaffUser()

const staffList = computed(() => staffUsers.value || [])

const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editingId = ref<string | null>(null)
const userToDelete = ref<StaffUser | null>(null)

const form = ref({
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  role: 'operator' as 'admin' | 'operator',
  is_active: true,
})

function resetForm() {
  form.value = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'operator',
    is_active: true,
  }
  editingId.value = null
}

function openCreate() {
  resetForm()
  showModal.value = true
}

function openEdit(u: StaffUser) {
  editingId.value = u.id
  form.value = {
    email: u.email,
    password: '',
    first_name: u.first_name,
    last_name: u.last_name,
    role: u.role as 'admin' | 'operator',
    is_active: u.is_active,
  }
  showModal.value = true
}

function submitForm() {
  if (editingId.value) {
    const payload: any = {
      email: form.value.email,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      role: form.value.role,
      is_active: form.value.is_active,
    }
    if (form.value.password) payload.password = form.value.password
    updateMutation.mutate(
      { id: editingId.value, payload },
      { onSuccess: () => { showModal.value = false } }
    )
  } else {
    createMutation.mutate(
      {
        email: form.value.email,
        password: form.value.password,
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        role: form.value.role,
      },
      { onSuccess: () => { showModal.value = false } }
    )
  }
}

function confirmDelete(u: StaffUser) {
  userToDelete.value = u
  showDeleteConfirm.value = true
}

function doDelete() {
  if (!userToDelete.value) return
  deleteMutation.mutate(userToDelete.value.id, {
    onSuccess: () => {
      showDeleteConfirm.value = false
      userToDelete.value = null
    },
  })
}
</script>
