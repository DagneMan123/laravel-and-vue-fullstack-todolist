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

              <router-link 
                to="/profile"
                @click="sidebarOpen = false"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  $route.name === 'Profile'
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                    : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
                <span>Settings</span>
              </router-link>
            </div>
          </div>
        </div>

        <div class="absolute bottom-0 left-0 right-0 p-4 border-t" :class="isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-gray-50 border-gray-200'">
          <router-link 
            to="/profile"
            @click="sidebarOpen = false"
            class="flex items-center gap-3 mb-3 p-2 rounded-lg transition-colors"
            :class="isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'"
          >
            <img :src="authStore.user?.avatar || 'https://ui-avatars.com/api/?name=User'" class="w-10 h-10 rounded-full">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">{{ authStore.user?.name }}</p>
              <p class="text-xs truncate" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ authStore.user?.email }}</p>
            </div>
          </router-link>
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

          <div class="flex items-center gap-3">
            <button 
              @click="toggleTheme"
              :class="[
                'p-2 rounded-lg transition-colors',
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              ]"
              title="Toggle theme"
            >
              <!-- Sun Icon (Light Mode) -->
            <svg v-if="!isDark" class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>

  <!-- Moon Icon (Dark Mode) -->
            <svg v-else class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
            </button>

            <!-- Notification Dropdown Component -->
            <NotificationDropdown />

            <div class="relative group">
              <router-link 
                to="/profile"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Go to Profile"
              >
                <img :src="authStore.user?.avatar || 'https://ui-avatars.com/api/?name=User'" class="w-8 h-8 rounded-full">
              </router-link>
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-auto">
          <slot />
        </main>
      </div>
    </div>

    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black/50 md:hidden z-30" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useNotificationStore } from '@/stores/notifications'
import NotificationDropdown from '@/components/NotificationDropdown.vue'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const notificationStore = useNotificationStore()

const sidebarOpen = ref(false)
const isDark = computed(() => themeStore.isDark)

// Polling interval reference
let pollInterval: ReturnType<typeof setInterval> | null = null

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const handleLogout = async () => {
  if (pollInterval) clearInterval(pollInterval)
  await authStore.logout()
  router.push('/')
}

// Initialize notifications and set up polling
const initializeNotifications = async () => {
  // Load notifications on mount
  await notificationStore.fetchNotifications()
  
  // Poll for unread count every 60 seconds (reduced from 30s to reduce server load)
  pollInterval = setInterval(async () => {
    await notificationStore.fetchUnreadCount()
  }, 60000)
}

// Cleanup on unmount
const cleanup = () => {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

onMounted(() => {
  initializeNotifications()
})

onUnmounted(() => {
  cleanup()
})
</script>
