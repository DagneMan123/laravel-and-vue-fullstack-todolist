<template>
  <div class="min-h-screen" :class="isDark ? 'bg-[#0f1419]' : 'bg-gray-50'">
    <div class="flex h-screen overflow-hidden">
      <nav :class="[
        'fixed inset-y-0 left-0 w-64 transform transition-transform duration-200 z-40',
        isDark ? 'bg-[#1a1f2e] border-r border-gray-700' : 'bg-white border-r border-gray-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]">
        <div class="flex items-center justify-between h-16 px-6 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span class="text-white font-bold">✓</span>
            </div>
            <span class="font-bold text-lg" :class="isDark ? 'text-white' : 'text-gray-900'">TodoList</span>
          </div>
          <button @click="sidebarOpen = false" class="md:hidden">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="overflow-y-auto h-full pb-20">
          <div class="px-3 py-4 space-y-2">
            <div class="mb-6">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Menu</p>
              
              <router-link 
                to="/dashboard"
                @click="sidebarOpen = false"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  $route.name === 'Dashboard'
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                    : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4V8" />
                </svg>
                <span>Dashboard</span>
              </router-link>

              <router-link 
                to="/tasks"
                @click="sidebarOpen = false"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  $route.name === 'Tasks'
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                    : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>Tasks</span>
              </router-link>

              <router-link 
                to="/reports"
                @click="sidebarOpen = false"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  $route.name === 'Reports'
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                    : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Reports</span>
              </router-link>
            </div>
          </div>
        </div>

        <div class="absolute bottom-0 left-0 right-0 p-4 border-t" :class="isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-gray-50 border-gray-200'">
          <div class="flex items-center gap-3 mb-3">
            <img :src="authStore.user?.avatar || 'https://ui-avatars.com/api/?name=User'" class="w-10 h-10 rounded-full">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">{{ authStore.user?.name }}</p>
              <p class="text-xs truncate" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ authStore.user?.email }}</p>
            </div>
          </div>
          <button 
            @click="handleLogout"
            :class="[
              'w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isDark ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' : 'bg-red-50 text-red-600 hover:bg-red-100'
            ]"
          >
            Logout
          </button>
        </div>
      </nav>

      <div class="flex-1 flex flex-col md:ml-64">
        <header :class="[
          'h-16 border-b flex items-center justify-between px-6 sticky top-0 z-30',
          isDark ? 'bg-[#0f1419] border-gray-700' : 'bg-white border-gray-200'
        ]">
          <button @click="sidebarOpen = !sidebarOpen" class="md:hidden">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div class="hidden md:block flex-1 max-w-md">
            <div class="relative">
              <input
                type="search"
                placeholder="Search projects, tasks..."
                :class="[
                  'w-full px-4 py-2 rounded-lg border transition-colors',
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                ]"
              >
              <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button 
              @click="toggleTheme"
              :class="[
                'p-2 rounded-lg transition-colors',
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              ]"
              title="Toggle theme"
            >
              <svg v-if="isDark" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.415 0l.707.707a1 1 0 01-1.415 1.415l-.707-.707a1 1 0 010-1.415zm2.24 2.24a1 1 0 010 1.415l-.707.707a1 1 0 11-1.415-1.415l.707-.707a1 1 0 011.415 0zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>

            <div class="relative">
              <button 
                @click="showNotifications = !showNotifications"
                :class="[
                  'p-2 rounded-lg transition-colors relative block focus:outline-none',
                  isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                ]"
                title="Notifications"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span 
                  v-if="notificationStore.unreadCount > 0" 
                  class="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse"
                >
                  {{ notificationStore.unreadCount }}
                </span>
              </button>

              <div 
                v-if="showNotifications" 
                :class="[
                  'absolute right-0 mt-2 w-80 rounded-xl shadow-lg border overflow-hidden z-50',
                  isDark ? 'bg-[#1a1f2e] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                ]"
              >
                <div class="p-3 border-b flex items-center justify-between" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
                  <span class="font-semibold text-sm">Notifications</span>
                  <button @click="notificationStore.markAllAsRead()" class="text-xs text-blue-500 hover:underline">
                    Mark all as read
                  </button>
                </div>

                <div class="max-h-64 overflow-y-auto">
                  <div v-if="!notificationStore.notifications || notificationStore.notifications.length === 0" class="p-6 text-center text-sm text-gray-400">
                    No new notifications
                  </div>
                  <div 
                    v-else
                    v-for="notification in notificationStore.notifications.slice(0, 5)" 
                    :key="notification.id"
                    :class="[
                      'p-3 border-b text-xs flex flex-col gap-1 transition-colors',
                      !notification.is_read ? (isDark ? 'bg-blue-600/10' : 'bg-blue-50') : '',
                      isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'
                    ]"
                  >
                    <p class="font-medium">{{ notification.title }}</p>
                    <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ notification.message }}</p>
                  </div>
                </div>

                <router-link 
                  to="/notifications" 
                  @click="showNotifications = false"
                  class="block p-2 text-center text-xs text-blue-500 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 border-t"
                  :class="isDark ? 'border-gray-700' : 'border-gray-200'"
                >
                  View all notifications
                </router-link>
              </div>
            </div>

            <div class="relative group">
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <img :src="authStore.user?.avatar || 'https://ui-avatars.com/api/?name=User'" class="w-8 h-8 rounded-full">
              </button>
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-auto">
          <slot />
        </main>
      </div>
    </div>

    <div v-if="showNotifications" @click="showNotifications = false" class="fixed inset-0 z-40 bg-transparent" />
    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black/50 md:hidden z-30" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const notificationStore = useNotificationStore()

const sidebarOpen = ref(false)
const showNotifications = ref(false)
const isDark = ref(themeStore.isDark)

const toggleTheme = () => {
  themeStore.toggleTheme()
  isDark.value = themeStore.isDark
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>