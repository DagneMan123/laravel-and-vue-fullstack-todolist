<template>
  <AppLayout>
    <div class="p-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Notifications</h1>
          <p class="mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ notificationStore.unreadCount }} unread notifications
          </p>
        </div>
        <div class="flex gap-2">
          <button 
            v-if="notificationStore.unreadCount > 0"
            @click="markAllAsRead"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            Mark All as Read
          </button>
          <button 
            v-if="notificationStore.readNotifications.length > 0"
            @click="deleteAllRead"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
          >
            Delete Read
          </button>
        </div>
      </div>

      <div v-if="notificationStore.notifications.length === 0" class="text-center py-12">
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">No notifications yet</p>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="notification in notificationStore.notifications" 
          :key="notification.id"
          :class="[
            'p-4 rounded-lg border transition-all',
            notification.is_read
              ? isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
              : isDark ? 'bg-[#1a1f2e] border-blue-600/50' : 'bg-blue-50 border-blue-200'
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ notification.title }}
              </h3>
              <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                {{ notification.message }}
              </p>
              <p class="text-xs mt-2" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                {{ new Date(notification.created_at).toLocaleString() }}
              </p>
            </div>
            <div class="flex gap-2 ml-4">
              <button 
                @click="() => notification.is_read ? notificationStore.markAsUnread(notification.id) : notificationStore.markAsRead(notification.id)"
                class="px-3 py-1 text-xs rounded-lg transition-colors"
                :class="notification.is_read
                  ? 'bg-gray-600/20 text-gray-600 hover:bg-gray-600/30'
                  : 'bg-blue-600/20 text-blue-600 hover:bg-blue-600/30'"
              >
                {{ notification.is_read ? 'Unread' : 'Read' }}
              </button>
              <button 
                @click="notificationStore.deleteNotification(notification.id)"
                class="px-3 py-1 text-xs rounded-lg bg-red-600/20 text-red-600 hover:bg-red-600/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
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

const themeStore = useThemeStore()
const notificationStore = useNotificationStore()

const isDark = computed(() => themeStore.isDark)

const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
}

const deleteAllRead = async () => {
  if (confirm('Delete all read notifications?')) {
    await notificationStore.deleteAllRead()
  }
}

onMounted(async () => {
  await notificationStore.fetchNotifications()
})
</script>
