<template>
  <div 
    :class="[
      'group relative overflow-hidden rounded-xl border transition-all duration-300',
      'hover:shadow-lg dark:hover:shadow-lg/20',
      notification.is_read
        ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        : 'bg-white dark:bg-gray-800 border-primary-200 dark:border-primary-900/50 shadow-md dark:shadow-md/20'
    ]"
  >
    <!-- Unread Indicator -->
    <div 
      v-if="!notification.is_read"
      class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary-500 to-primary-600"
    />

    <div class="p-4">
      <!-- Top Row: Title and Actions -->
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <!-- Title and Type Badge -->
          <div class="flex items-center gap-2 mb-1">
            <h3 
              :class="[
                'font-semibold truncate',
                notification.is_read
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-gray-900 dark:text-white'
              ]"
            >
              {{ notification.title }}
            </h3>
            <span 
              v-if="notification.type"
              :class="[
                'inline-block px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap',
                getTypeClasses(notification.type).badge
              ]"
            >
              {{ formatType(notification.type) }}
            </span>
          </div>

          <!-- Message -->
          <p 
            :class="[
              'text-sm leading-relaxed line-clamp-2',
              notification.is_read
                ? 'text-gray-600 dark:text-gray-400'
                : 'text-gray-700 dark:text-gray-300'
            ]"
          >
            {{ notification.message }}
          </p>

          <!-- Timestamp -->
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {{ formatTime(notification.created_at) }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            @click="toggleRead"
            :disabled="isLoading"
            :title="notification.is_read ? 'Mark as unread' : 'Mark as read'"
            :class="[
              'p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              notification.is_read
                ? 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                : 'text-primary-600 hover:text-primary-700 dark:text-primary-400'
            ]"
          >
            <svg v-if="notification.is_read" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M3 10h18M5 6h14M7 6V4a1 1 0 011-1h8a1 1 0 011 1v2" />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </button>
          <button 
            @click="deleteItem"
            :disabled="isLoading"
            title="Delete notification"
            :class="[
              'p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
              'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Status Indicator for Actions -->
      <div v-if="isLoading" class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div class="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          Processing...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '@/types'

interface Props {
  notification: Notification
  isLoading?: boolean
}

interface Emits {
  (e: 'toggle-read', id: number, isRead: boolean): void
  (e: 'delete', id: number): void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const emit = defineEmits<Emits>()

const getTypeClasses = (type: string) => {
  const classes = {
    success: {
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    },
    error: {
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    },
    warning: {
      badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    },
    info: {
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    },
  }
  return classes[type as keyof typeof classes] || classes.info
}

const formatType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' }),
  })
}

const toggleRead = () => {
  emit('toggle-read', props.notification.id, props.notification.is_read)
}

const deleteItem = () => {
  emit('delete', props.notification.id)
}

</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
