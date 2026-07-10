import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification, PaginatedResponse } from '@/types'
import api from '@/services/api'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const pagination = ref({
    current_page: 1,
    total: 0,
    per_page: 20,
    last_page: 1,
  })
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | undefined>(undefined)

  const filters = ref({
    is_read: null as boolean | null,
    type: null as string | null,
    sort_direction: 'desc',
  })

  const unreadNotifications = computed(() => notifications.value.filter(n => !n.is_read))
  const readNotifications = computed(() => notifications.value.filter(n => n.is_read))

  async function fetchNotifications(page: number = 1): Promise<void> {
    isLoading.value = true
    error.value = undefined

    try {
      const params = {
        page,
        per_page: pagination.value.per_page,
        is_read: filters.value.is_read !== null ? filters.value.is_read : undefined,
        type: filters.value.type,
        sort_direction: filters.value.sort_direction,
      }

      const response = await api.get<PaginatedResponse<Notification>>('/notifications', { params })
      notifications.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
        last_page: response.data.last_page,
      }
      await fetchUnreadCount()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch notifications'
      console.error('Error fetching notifications:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUnreadCount(): Promise<void> {
    try {
      const response = await api.get<{ unread_count: number }>('/notifications/unread/count')
      unreadCount.value = response.data.unread_count
    } catch (err: any) {
      console.error('Error fetching unread count:', err)
    }
  }

  async function markAsRead(id: number): Promise<{ success: boolean; notification?: Notification; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      const response = await api.patch<{ notification: Notification }>(`/notifications/${id}/read`)
      const index = notifications.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notifications.value[index] = response.data.notification
      }
      await fetchUnreadCount()
      return { success: true, notification: response.data.notification }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to mark notification as read'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function markAsUnread(id: number): Promise<{ success: boolean; notification?: Notification; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      const response = await api.patch<{ notification: Notification }>(`/notifications/${id}/unread`)
      const index = notifications.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notifications.value[index] = response.data.notification
      }
      await fetchUnreadCount()
      return { success: true, notification: response.data.notification }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to mark notification as unread'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function deleteNotification(id: number): Promise<{ success: boolean; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      await api.delete(`/notifications/${id}`)
      notifications.value = notifications.value.filter(n => n.id !== id)
      pagination.value.total -= 1
      await fetchUnreadCount()
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete notification'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function markAllAsRead(): Promise<{ success: boolean; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      await api.patch('/notifications/mark-all-read')
      notifications.value = notifications.value.map(n => ({
        ...n,
        is_read: true,
        read_at: new Date().toISOString(),
      }))
      unreadCount.value = 0
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to mark all notifications as read'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function deleteAllRead(): Promise<{ success: boolean; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      const response = await api.delete<{ deleted_count: number }>('/notifications/delete-all-read')
      notifications.value = notifications.value.filter(n => !n.is_read)
      pagination.value.total -= response.data.deleted_count
      return { success: true, message: response.data.deleted_count + ' notifications deleted' }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete read notifications'
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
      is_read: null,
      type: null,
      sort_direction: 'desc',
    }
  }

  return {
    notifications,
    unreadCount,
    pagination,
    isLoading,
    isSubmitting,
    error,
    filters,
    unreadNotifications,
    readNotifications,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAsUnread,
    deleteNotification,
    markAllAsRead,
    deleteAllRead,
    setFilters,
    resetFilters,
  }
})
