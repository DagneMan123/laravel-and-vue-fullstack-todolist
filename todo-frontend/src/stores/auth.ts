import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/types'
import type { ValidationError } from '@/utils/validation'
import { validateLoginForm, validateRegisterForm } from '@/utils/validation'
import api from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | undefined>(localStorage.getItem('auth_token') ?? undefined)
  const isLoading = ref(false)
  const error = ref<string | undefined>(undefined)
  const validationErrors = ref<ValidationError[]>([])
  const isLoggingOut = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function login(credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> {
    // Clear previous errors
    validationErrors.value = []
    error.value = undefined

    // Validate input
    const validation = validateLoginForm(credentials)
    if (!validation.isValid) {
      validationErrors.value = validation.errors
      return { success: false, message: 'Please fix validation errors' }
    }

    isLoading.value = true

    try {
      const response = await api.post<{ user: User; token: string }>('/auth/login', credentials)
      const { user: userData, token: authToken } = response.data

      user.value = userData
      token.value = authToken
      localStorage.setItem('auth_token', authToken)
      persistUser(userData)
      
      await router.push('/dashboard')
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function register(data: RegisterData): Promise<{ success: boolean; message?: string }> {
    // Clear previous errors
    validationErrors.value = []
    error.value = undefined

    // Validate input
    const validation = validateRegisterForm(data)
    if (!validation.isValid) {
      validationErrors.value = validation.errors
      return { success: false, message: 'Please fix validation errors' }
    }

    isLoading.value = true

    try {
      await api.post('/auth/register', data)
      
      // Do NOT auto-login, just create the account
      // User must log in manually
      await router.push('/login')
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    isLoggingOut.value = true
    // Only try to call logout API if we have a token
    if (token.value) {
      try {
        await api.post('/auth/logout')
      } catch (err: any) {
        // Silently ignore logout errors
        // Could be 401 (already logged out), network error, etc.
        if (err.response?.status !== 401) {
          console.error('Logout API error:', err.message)
        }
      }
    }
    // Always clear local state
    user.value = null
    token.value = undefined
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    isLoading.value = false
    isLoggingOut.value = false
    await router.push('/login')
  }

  async function checkAuth(): Promise<void> {
    if (token.value) {
      // First try to restore from localStorage
      if (!user.value) {
        const restored = restoreUser()
        if (restored) {
          user.value = restored
        }
      }

      // Then verify with backend if user is not set
      if (!user.value) {
        try {
          const response = await api.get<User>('/auth/user')
          user.value = response.data
          persistUser(response.data)
        } catch (err: any) {
          // 401 means token is invalid
          if (err.response?.status === 401) {
            console.warn('Token invalid during auth check')
            user.value = null
            token.value = undefined
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
          } else {
            console.error('Auth check error:', err.message)
            user.value = null
            token.value = undefined
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
          }
        }
      }
    }
  }

  // Persist user data to localStorage
  function persistUser(userData: User) {
    if (userData) {
      localStorage.setItem('auth_user', JSON.stringify(userData))
    }
  }

  // Restore user data from localStorage
  function restoreUser(): User | null {
    try {
      const stored = localStorage.getItem('auth_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  // Initialize on app startup
  onMounted(() => {
    if (token.value && !user.value) {
      const restored = restoreUser()
      if (restored) {
        user.value = restored
      }
    }
  })

  return {
    user,
    token,
    isLoading,
    isLoggingOut,
    error,
    validationErrors,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    persistUser,
    restoreUser,
  }
})