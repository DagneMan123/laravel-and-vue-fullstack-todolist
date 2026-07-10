import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/types'
import api from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | undefined>(localStorage.getItem('auth_token') ?? undefined)
  const isLoading = ref(false)
  const error = ref<string | undefined>(undefined)
  const isLoggingOut = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function login(credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> {
    isLoading.value = true
    error.value = undefined

    try {
      const response = await api.post<{ user: User; token: string }>('/auth/login', credentials)
      const { user: userData, token: authToken } = response.data

      user.value = userData
      token.value = authToken
      localStorage.setItem('auth_token', authToken)
      
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
    isLoading.value = true
    error.value = undefined

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
    isLoading.value = false
    isLoggingOut.value = false
    await router.push('/login')
  }

  async function checkAuth(): Promise<void> {
    if (token.value && !user.value) {
      try {
        const response = await api.get<User>('/auth/user')
        user.value = response.data
      } catch (err: any) {
        // 401 means token is invalid
        // Don't trigger logout here - just clear state silently
        if (err.response?.status === 401) {
          console.warn('Token invalid during auth check')
          user.value = null
          token.value = undefined
          localStorage.removeItem('auth_token')
        } else {
          // Other errors, also clear but don't spam logs
          console.error('Auth check error:', err.message)
          user.value = null
          token.value = undefined
          localStorage.removeItem('auth_token')
        }
      }
    }
  }

  return {
    user,
    token,
    isLoading,
    isLoggingOut,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  }
})