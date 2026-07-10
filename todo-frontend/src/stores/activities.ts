import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Activity, ActivityFormData, PaginatedResponse } from '@/types'
import api from '@/services/api'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([])
  const pagination = ref({
    current_page: 1,
    total: 0,
    per_page: 15,
    last_page: 1,
  })
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | undefined>(undefined)

  const filters = ref({
    status: null as string | null,
    priority: null as string | null,
    search: '',
    archived: false,
    sort_by: 'created_at',
    sort_direction: 'desc',
  })

  const pendingActivities = computed(() => activities.value.filter(a => a.status === 'pending'))
  const inProgressActivities = computed(() => activities.value.filter(a => a.status === 'in_progress'))
  const completedActivities = computed(() => activities.value.filter(a => a.status === 'completed'))
  const archivedActivities = computed(() => activities.value.filter(a => a.is_archived))

  async function fetchActivities(projectId: number, page: number = 1): Promise<void> {
    isLoading.value = true
    error.value = undefined

    try {
      const params = {
        page,
        per_page: pagination.value.per_page,
        status: filters.value.status,
        priority: filters.value.priority,
        search: filters.value.search,
        archived: filters.value.archived,
        sort_by: filters.value.sort_by,
        sort_direction: filters.value.sort_direction,
      }

      const response = await api.get<PaginatedResponse<Activity>>(`/projects/${projectId}/activities`, { params })
      activities.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
        last_page: response.data.last_page,
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch activities'
      console.error('Error fetching activities:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createActivity(projectId: number, activityData: ActivityFormData): Promise<{ success: boolean; activity?: Activity; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      const response = await api.post<{ activity: Activity }>(`/projects/${projectId}/activities`, activityData)
      activities.value.unshift(response.data.activity)
      pagination.value.total += 1
      return { success: true, activity: response.data.activity }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create activity'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateActivity(projectId: number, id: number, activityData: Partial<ActivityFormData>): Promise<{ success: boolean; activity?: Activity; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      const response = await api.put<{ activity: Activity }>(`/projects/${projectId}/activities/${id}`, activityData)
      const index = activities.value.findIndex(a => a.id === id)
      if (index !== -1) {
        activities.value[index] = response.data.activity
      }
      return { success: true, activity: response.data.activity }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update activity'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function deleteActivity(projectId: number, id: number): Promise<{ success: boolean; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      await api.delete(`/projects/${projectId}/activities/${id}`)
      activities.value = activities.value.filter(a => a.id !== id)
      pagination.value.total -= 1
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete activity'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function archiveActivity(projectId: number, id: number): Promise<{ success: boolean; activity?: Activity; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      const response = await api.patch<{ activity: Activity }>(`/projects/${projectId}/activities/${id}/archive`)
      const index = activities.value.findIndex(a => a.id === id)
      if (index !== -1) {
        activities.value[index] = response.data.activity
      }
      return { success: true, activity: response.data.activity }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to archive activity'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function unarchiveActivity(projectId: number, id: number): Promise<{ success: boolean; activity?: Activity; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      const response = await api.patch<{ activity: Activity }>(`/projects/${projectId}/activities/${id}/unarchive`)
      const index = activities.value.findIndex(a => a.id === id)
      if (index !== -1) {
        activities.value[index] = response.data.activity
      }
      return { success: true, activity: response.data.activity }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to unarchive activity'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  function setFilters(newFilters: any): void {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters(): void {
    filters.value = {
      status: null,
      priority: null,
      search: '',
      archived: false,
      sort_by: 'created_at',
      sort_direction: 'desc',
    }
  }

  return {
    activities,
    pagination,
    isLoading,
    isSubmitting,
    error,
    filters,
    pendingActivities,
    inProgressActivities,
    completedActivities,
    archivedActivities,
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    archiveActivity,
    unarchiveActivity,
    setFilters,
    resetFilters,
  }
})
