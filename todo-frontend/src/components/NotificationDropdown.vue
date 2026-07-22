<template>
  <div class="relative">
    <!-- Notification Bell Button -->
    <button 
      @click="isOpen = !isOpen"
      @keydown.escape="isOpen = false"
      :class="[
        'p-2 rounded-lg transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-offset-2',
        isDark 
          ? 'hover:bg-gray-800 text-gray-300 focus:ring-blue-500 focus:ring-offset-[#0f1419]' 
          : 'hover:bg-gray-100 text-gray-600 focus:ring-blue-500 focus:ring-offset-white'
      ]"
      :title="$t('notifications.notifications')"
      :aria-label="$t('notifications.notifications')"
      :aria-expanded="isOpen"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      
      <!-- Unread Badge -->
      <transition name="badge">
        <span 
          v-if="notificationStore.unreadCount > 0" 
          :class="[
            'absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg animate-pulse'
          ]"
        >
          {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
        </span>
      </transition>
    </button>

    <!-- Dropdown Menu -->
    <transition name="dropdown">
      <div 
        v-if="isOpen"
        :class="[
          'absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border overflow-hidden z-50',
          isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200'
        ]"
        role="dialog"
        aria-label="Notifications panel"
      >
        <!-- Header -->
        <div :class="[
          'p-4 border-b flex items-center justify-between bg-gradient-to-r',
          isDark 
            ? 'border-gray-700 from-gray-800 to-gray-800/50' 
            : 'border-gray-100 from-gray-50 to-white'
        ]">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="font-semibold text-sm">{{ $t('notifications.notifications') }}</span>
            <span v-if="notificationStore.unreadCount > 0" :class="[
              'text-xs font-bold rounded-full px-2 py-0.5',
              isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
            ]">
              {{ notificationStore.unreadCount }}
            </span>
          </div>
          
          <button 
            v-if="notificationStore.unreadCount > 0"
            @click="markAllAsRead"
            :disabled="notificationStore.isSubmitting"
            :class="[
              'text-xs font-medium transition-colors px-2 py-1 rounded hover:underline disabled:opacity-50',
              isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            ]"
          >
            {{ $t('notifications.markAllAsRead') }}
          </button>
        </div>

        <!-- Content Area -->
        <div class="max-h-96 overflow-y-auto">
          <!-- Empty State -->
          <div v-if="notificationStore.notifications.length === 0" :class="[
            'p-8 text-center',
            isDark ? 'bg-gray-800/30' : 'bg-gray-50'
          ]">
            <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2z" />
            </svg>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm">
              {{ $t('notifications.allCaughtUp') }}
            </p>
            <p :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-xs mt-1">
              {{ $t('notifications.noNotificationsYet') }}
            </p>
          </div>

          <!-- Notification List -->
          <TransitionGroup v-else name="notification-item" tag="div">
            <div 
              v-for="notification in displayedNotifications" 
              :key="notification.id"
              :class="[
                'p-3 border-b transition-all duration-200 cursor-pointer hover:shadow-inner',
                !notification.is_read 
                  ? isDark ? 'bg-blue-600/10 hover:bg-blue-600/15' : 'bg-blue-50/70 hover:bg-blue-100/50'
                  : isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50',
                isDark ? 'border-gray-700' : 'border-gray-100'
              ]"
              @click="toggleNotificationRead(notification)"
            >
              <div class="flex gap-3">
                <!-- Icon -->
                <div :class="[
                  'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                  getNotificationColor(notification.type)
                ]" />
                
                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <p :class="[
                        'text-sm font-semibold truncate',
                        !notification.is_read 
                          ? isDark ? 'text-white' : 'text-gray-900'
                          : isDark ? 'text-gray-400' : 'text-gray-600'
                      ]">
                        {{ $t(notification.title, notification.title_params) }}
                      </p>
                      <p :class="[
                        'text-xs leading-relaxed mt-0.5 line-clamp-2',
                        !notification.is_read
                          ? isDark ? 'text-gray-300' : 'text-gray-700'
                          : isDark ? 'text-gray-500' : 'text-gray-500'
                      ]">
                        {{ $t(notification.message, notification.message_params) }}
                      </p>
                    </div>
                    
                    <!-- Delete Button -->
                    <button 
                      @click.stop="deleteNotification(notification.id)"
                      :disabled="notificationStore.isSubmitting"
                      :class="[
                        'flex-shrink-0 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50',
                        isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-600'
                      ]"
                      :title="$t('notifications.deleteNotification')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Timestamp -->
                  <p :class="[
                    'text-xs mt-1.5',
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  ]">
                    {{ formatTime(notification.created_at) }}
                  </p>
                  
                  <!-- Type Badge -->
                  <span v-if="notification.type" :class="[
                    'inline-block mt-1.5 px-1.5 py-0.5 text-[10px] font-medium rounded',
                    getTypeClasses(notification.type).badge
                  ]">
                    {{ $t(`notifications.type${formatType(notification.type)}`) }}
                  </span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Footer -->
        <router-link 
          to="/notifications" 
          @click="isOpen = false"
          :class="[
            'block p-3 text-center text-sm font-medium transition-colors border-t',
            isDark 
              ? 'border-gray-700 text-blue-400 hover:bg-gray-800 hover:text-blue-300' 
              : 'border-gray-100 text-blue-600 hover:bg-gray-50 hover:text-blue-700'
          ]"
        >
          {{ $t('notifications.viewAll') }} →
        </router-link>
      </div>
    </transition>

    <!-- Backdrop -->
    <transition name="backdrop">
      <div 
        v-if="isOpen"
        @click="isOpen = false"
        class="fixed inset-0 z-40"
        aria-hidden="true"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notifications'
import { useNotificationUtils } from '@/composables/useNotificationUtils'
import type { Notification } from '@/types'

const { t } = useI18n()
const notificationStore = useNotificationStore()
const { isDark, getTypeClasses, getNotificationColor, formatType, formatTime } = useNotificationUtils()

const isOpen = ref(false)

// Show only latest 5 notifications in dropdown
const displayedNotifications = computed(() => {
  return notificationStore.notifications.slice(0, 5)
})

const markAllAsRead = async () => {
  const result = await notificationStore.markAllAsRead()
  if (!result.success) {
    console.error(result.message)
  }
}

const toggleNotificationRead = async (notification: Notification) => {
  if (notification.is_read) {
    await notificationStore.markAsUnread(notification.id)
  } else {
    await notificationStore.markAsRead(notification.id)
  }
}

const deleteNotification = async (id: number) => {
  const result = await notificationStore.deleteNotification(id)
  if (!result.success) {
    console.error(result.message)
  }
}
</script>

<style scoped>
/* Styles are imported from shared notifications.css */
</style>
