import { ref } from 'vue'
import type { ZodSchema } from 'zod'
import { ZodError } from 'zod'

export function useFormValidation<T extends Record<string, any>>(schema: ZodSchema<T>) {
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const isValid = ref(true)

  const validate = (data: T): boolean => {
    try {
      schema.parse(data)
      errors.value = {}
      isValid.value = true
      return true
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {}
        err.issues.forEach((issue) => {
          const path = issue.path[0] as keyof T
          newErrors[path] = issue.message
        })
        errors.value = newErrors
      }
      isValid.value = false
      return false
    }
  }

  const clearErrors = () => {
    errors.value = {}
    isValid.value = true
  }

  return { errors, isValid, validate, clearErrors }
}
