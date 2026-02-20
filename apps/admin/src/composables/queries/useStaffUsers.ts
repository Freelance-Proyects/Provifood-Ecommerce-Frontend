import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { staffRepository, type CreateStaffUserPayload, type UpdateStaffUserPayload } from '@/lib/repositories/staff.repository'
import { queryKeys } from '@/lib/query/keys'
import { useToast } from '@/composables/useToast'

export function useStaffUsers() {
  return useQuery({
    queryKey: queryKeys.staff.list(),
    queryFn: () => staffRepository.list(),
    retry: 0, // No reintentar; que el usuario pulse "Reintentar" si falla
  })
}

export function useCreateStaffUser() {
  const queryClient = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (payload: CreateStaffUserPayload) => staffRepository.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.list() })
      toast.success('Cuenta creada correctamente')
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || err.message
      toast.error(typeof msg === 'string' ? msg : 'Error al crear la cuenta')
    },
  })
}

export function useUpdateStaffUser() {
  const queryClient = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStaffUserPayload }) =>
      staffRepository.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.list() })
      toast.success('Cuenta actualizada')
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || err.message
      toast.error(typeof msg === 'string' ? msg : 'Error al actualizar')
    },
  })
}

export function useDeleteStaffUser() {
  const queryClient = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: string) => staffRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.list() })
      toast.success('Cuenta eliminada')
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || err.message
      toast.error(typeof msg === 'string' ? msg : 'Error al eliminar')
    },
  })
}
