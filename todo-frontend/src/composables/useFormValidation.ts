import { ref, computed } from 'vue'
import type { ValidationError } from '@/utils/validation'
import {
  validateRegisterForm,
  validateLoginForm,
  validateProfileForm,
  validateCreateTaskForm,
  getFieldError,
  hasFieldError,
} from '@/utils/validation'

export function useFormValidation() {
  const errors = ref<ValidationError[]>([])
  
  const hasErrors = computed(() => errors.value.length > 0)
  
  const clearErrors = () => {
    errors.value = []
  }
  
  const setErrors = (newErrors: ValidationError[]) => {
    errors.value = newErrors
  }
  
  const validateRegister = (data: any) => {
    const result = validateRegisterForm(data)
    errors.value = result.errors
    return result.isValid
  }
  
  const validateLogin = (data: any) => {
    const result = validateLoginForm(data)
    errors.value = result.errors
    return result.isValid
  }
  
  const validateProfile = (data: any) => {
    const result = validateProfileForm(data)
    errors.value = result.errors
    return result.isValid
  }
  
  const validateCreateTask = (data: any) => {
    const result = validateCreateTaskForm(data)
    errors.value = result.errors
    return result.isValid
  }
  
  const getError = (fieldName: string) => getFieldError(errors.value, fieldName)
  
  const hasError = (fieldName: string) => hasFieldError(errors.value, fieldName)
  
  const getFieldErrors = (fieldName: string): string[] => {
    return errors.value
      .filter(e => e.field === fieldName)
      .map(e => e.message)
  }
  
  return {
    errors,
    hasErrors,
    clearErrors,
    setErrors,
    validateRegister,
    validateLogin,
    validateProfile,
    validateCreateTask,
    getError,
    hasError,
    getFieldErrors,
  }
}
