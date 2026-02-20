import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { staffRepository, type CreateStaffUserPayload, type UpdateStaffUserPayload } from '@/lib/repositories/staff.repository'
import { queryKeys } from '@/lib/query/keys'
import { useToast } from '@/composables/useToast'

// Note: HTTP error toasts (4xx/5xx) are handled globally by the Axios interceptor.
// onError here is only for additional success-context messages, NOT to duplicate HTTP toasts.

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
  })
}
