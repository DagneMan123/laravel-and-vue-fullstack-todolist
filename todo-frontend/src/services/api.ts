import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/auth'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use((config) => {
      const authStore = useAuthStore()
      const token = authStore.token || localStorage.getItem('auth_token')
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Only logout on 401 for routes OTHER than auth routes
        // This prevents infinite loops on /auth/user and /auth/logout
        if (error.response?.status === 401) {
          const url = error.config?.url || ''
          const isAuthRoute = url.includes('/auth/')
          
          if (!isAuthRoute) {
            const authStore = useAuthStore()
            // Prevent infinite loop: only logout if not already logging out
            if (!authStore.isLoggingOut) {
              await authStore.logout()
            }
          }
        }
        return Promise.reject(error)
      }
    )
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config)
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config)
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config)
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config)
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config)
  }
}

export default new ApiService()