import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskFormData, TaskFilters, PaginatedResponse, TaskStats } from '@/types'
import api from '@/services/api'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const stats = ref<TaskStats | null>(null)
  const pagination = ref({
    current_page: 1,
    total: 0,
    per_page: 15,
    last_page: 1,
  })
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | undefined>(undefined)
  const selectedTask = ref<Task | null>(null)
  const selectedIds = ref<number[]>([])

  const filters = ref<TaskFilters>({
    status: null,
    priority: null,
    search: '',
    sort_by: 'created_at',
    sort_direction: 'desc',
  })

  const filteredTasks = computed(() => {
    let filtered = [...tasks.value]
    
    if (filters.value.status && filters.value.status !== 'all') {
      filtered = filtered.filter(task => 
        filters.value.status === 'completed' ? task.is_completed : !task.is_completed
      )
    }
    
    if (filters.value.priority && filters.value.priority !== 'all') {
      filtered = filtered.filter(task => 
        task.priority === filters.value.priority
      )
    }
    
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search) ||
        (task.description?.toLowerCase() || '').includes(search)
      )
    }
    
    return filtered
  })

  const completedTasks = computed(() => tasks.value.filter(t => t.is_completed))
  const pendingTasks = computed(() => tasks.value.filter(t => !t.is_completed))
  const overdueTasks = computed(() => tasks.value.filter(t => t.is_overdue))
  
  /**
   * Upcoming tasks (next 5 due, excluding completed and past due dates)
   * Used for calendar view and dashboard
   */
  const upcomingTasks = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return tasks.value
      .filter(task => {
        // Exclude completed tasks
        if (task.is_completed) return false

        // Must have due_date
        if (!task.due_date) return false

        const dueDate = new Date(task.due_date)
        dueDate.setHours(0, 0, 0, 0)

        // Exclude past due dates
        return dueDate >= today
      })
      // Sort chronologically (earliest to latest)
      .sort((a, b) => {
        const dateA = new Date(a.due_date!).getTime()
        const dateB = new Date(b.due_date!).getTime()
        return dateA - dateB
      })
      // Limit to next 5 items
      .slice(0, 5)
  })
  
  const completionRate = computed(() => {
    if (tasks.value.length === 0) return 0
    return Math.round((completedTasks.value.length / tasks.value.length) * 100)
  })

  const hasSelected = computed(() => selectedIds.value.length > 0)

  async function fetchTasks(page: number = 1): Promise<void> {
    isLoading.value = true
    error.value = undefined

    try {
      const params = {
        page,
        per_page: pagination.value.per_page,
        status: filters.value.status,
        priority: filters.value.priority,
        search: filters.value.search,
        sort_by: filters.value.sort_by,
        sort_direction: filters.value.sort_direction,
      }

      const response = await api.get<PaginatedResponse<Task>>('/tasks', { params })
      tasks.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
        last_page: response.data.last_page,
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      console.error('Error fetching tasks:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStats(): Promise<void> {
    try {
      const response = await api.get<TaskStats>('/tasks/stats')
      stats.value = response.data
    } catch (err) {
      // Set default stats if error occurs
      console.error('Error fetching stats:', err)
      stats.value = {
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
        upcoming: 0,
      }
    }
  }

  async function createTask(taskData: TaskFormData): Promise<{ success: boolean; task?: Task; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      const response = await api.post<{ task: Task }>('/tasks', taskData)
      tasks.value.unshift(response.data.task)
      pagination.value.total += 1
      await fetchStats()
      return { success: true, task: response.data.task }
    } catch (err: any) {
      // Handle validation errors (422 response)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = err.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n')
        error.value = errorMessages
        console.error('Validation errors:', errors)
      } else {
        error.value = err.response?.data?.message || 'Failed to create task'
      }
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateTask(id: number, taskData: Partial<TaskFormData>): Promise<{ success: boolean; task?: Task; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      const response = await api.put<{ task: Task }>(`/tasks/${id}`, taskData)
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data.task
      }
      await fetchStats()
      return { success: true, task: response.data.task }
    } catch (err: any) {
      // Handle validation errors (422 response)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = err.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n')
        error.value = errorMessages
        console.error('Validation errors:', errors)
      } else {
        error.value = err.response?.data?.message || 'Failed to update task'
      }
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function deleteTask(id: number): Promise<{ success: boolean; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      await api.delete(`/tasks/${id}`)
      tasks.value = tasks.value.filter(t => t.id !== id)
      pagination.value.total -= 1
      selectedIds.value = selectedIds.value.filter(selectedId => selectedId !== id)
      await fetchStats()
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete task'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function toggleComplete(id: number): Promise<{ success: boolean; task?: Task; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      const response = await api.patch<{ task: Task }>(`/tasks/${id}/toggle-complete`)
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data.task
      }
      await fetchStats()
      return { success: true, task: response.data.task }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to toggle task'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function bulkDelete(ids: number[]): Promise<{ success: boolean; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      await api.delete('/tasks/bulk-delete', { data: { ids } })
      tasks.value = tasks.value.filter(t => !ids.includes(t.id))
      pagination.value.total -= ids.length
      selectedIds.value = []
      await fetchStats()
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete tasks'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  function setFilters(newFilters: Partial<TaskFilters>): void {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters(): void {
    filters.value = {
      status: null,
      priority: null,
      search: '',
      sort_by: 'created_at',
      sort_direction: 'desc',
    }
  }

  function toggleSelection(id: number): void {
    const index = selectedIds.value.indexOf(id)
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(id)
    }
  }

  function toggleAllSelection(): void {
    if (selectedIds.value.length === tasks.value.length) {
      selectedIds.value = []
    } else {
      selectedIds.value = tasks.value.map(t => t.id)
    }
  }

  function clearSelection(): void {
    selectedIds.value = []
  }

  return {
    tasks,
    stats,
    pagination,
    isLoading,
    isSubmitting,
    error,
    selectedTask,
    selectedIds,
    filters,
    filteredTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    upcomingTasks,
    completionRate,
    hasSelected,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    bulkDelete,
    setFilters,
    resetFilters,
    toggleSelection,
    toggleAllSelection,
    clearSelection,
  }
})