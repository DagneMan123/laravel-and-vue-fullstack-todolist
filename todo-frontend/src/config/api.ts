export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
export const API_URL = `${API_BASE_URL}/api`

export const API_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  USER: '/user',
  TASKS: '/tasks',
  TASK: (id: number) => `/tasks/${id}`,
  TOGGLE_TASK: (id: number) => `/tasks/${id}/toggle-complete`,
  BULK_DELETE: '/tasks/bulk-delete',
} as const
