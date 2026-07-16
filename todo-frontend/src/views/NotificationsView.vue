<template>
  <AppLayout>
    <!-- Header Section -->
    <div class="sticky top-0 z-10 bg-gradient-to-b from-white to-white/80 dark:from-gray-900 dark:to-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notifications
            </h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span v-if="notificationStore.unreadCount > 0" class="font-semibold text-primary-600">
                {{ notificationStore.unreadCount }} unread
              </span>
              <span v-else class="text-gray-500">All caught up</span>
              <span class="mx-2 text-gray-400">•</span>
              <span>{{ notificationStore.notifications.length }} total</span>
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 flex-shrink-0">
            <button 
              v-if="notificationStore.unreadCount > 0"
              @click="markAllAsRead"
              :disabled="notificationStore.isSubmitting"
              class="btn-secondary inline-flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Mark all as read
            </button>
            <button 
              v-if="notificationStore.readNotifications.length > 0"
              @click="deleteAllRead"
              :disabled="notificationStore.isSubmitting"
              class="btn-secondary inline-flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-red-600 hover:text-red-700"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear read
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-6">
      <!-- Empty State -->
      <div v-if="notificationStore.notifications.length === 0" class="flex flex-col items-center justify-center py-16">
        <div class="mb-4">
          <svg class="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">No notifications</h3>
        <p class="text-gray-600 dark:text-gray-400">You're all caught up! Check back later.</p>
      </div>

      <!-- Notifications List -->
      <div v-else class="space-y-3">
        <TransitionGroup name="notification" tag="div" class="space-y-3">
          <NotificationItem 
            v-for="notification in notificationStore.notifications" 
            :key="notification.id"
            :notification="notification"
            :is-loading="notificationStore.isSubmitting"
            @toggle-read="toggleRead"
            @delete="deleteNotification"
          />
        </TransitionGroup>
      </div>

      <!-- Loading State -->
      <div v-if="notificationStore.isLoading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin"></div>
          <p class="text-sm text-gray-600 dark:text-gray-400">Loading notifications...</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useNotificationStore } from '@/stores/notifications'
import AppLayout from '@/layouts/AppLayout.vue'
import NotificationItem from '@/components/NotificationItem.vue'

const themeStore = useThemeStore()
const notificationStore = useNotificationStore()

const isDark = computed(() => themeStore.isDark)

const markAllAsRead = async () => {
  const result = await notificationStore.markAllAsRead()
  if (!result.success) {
    console.error(result.message)
  }
}

const deleteAllRead = async () => {
  if (!confirm('Are you sure you want to delete all read notifications? This action cannot be undone.')) {
    return
  }
  const result = await notificationStore.deleteAllRead()
  if (!result.success) {
    console.error(result.message)
  }
}

const toggleRead = async (id: number, isRead: boolean) => {
  if (isRead) {
    await notificationStore.markAsUnread(id)
  } else {
    await notificationStore.markAsRead(id)
  }
}

const deleteNotification = async (id: number) => {
  const result = await notificationStore.deleteNotification(id)
  if (!result.success) {
    console.error(result.message)
  }
}

onMounted(async () => {
  await notificationStore.fetchNotifications()
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.notification-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
</script>
