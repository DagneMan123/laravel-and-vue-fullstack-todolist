<template>
  <AppLayout>
    <div class="p-3 sm:p-6">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ $t('dashboard.welcomeBackUser', { name: authStore.user?.name || 'User' }) }}
        </h1>
        <p class="mt-1 sm:mt-2 text-sm sm:text-base" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          {{ getGreeting() }}
        </p>
      </div>

      <!-- Stats Cards Section - ABOVE CHARTS -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div :class="[
          'p-4 sm:p-6 rounded-lg border transition-all hover:shadow-lg',
          isDark 
            ? 'bg-[#1a1f2e] border-gray-700 hover:border-blue-500'
            : 'bg-white border-gray-200 hover:border-blue-500'
        ]">
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="text-xs sm:text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ $t('stats.total_tasks') }}</p>
              <p class="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2" :class="isDark ? 'text-white' : 'text-gray-900'">{{ taskStore.stats?.total || 0 }}</p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-600/20 flex-shrink-0 flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </div>

        <div :class="[
          'p-4 sm:p-6 rounded-lg border transition-all hover:shadow-lg',
          isDark 
            ? 'bg-[#1a1f2e] border-gray-700 hover:border-green-500'
            : 'bg-white border-gray-200 hover:border-green-500'
        ]">
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="text-xs sm:text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ $t('stats.completed_tasks') }}</p>
              <p class="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2" :class="isDark ? 'text-white' : 'text-gray-900'">{{ taskStore.stats?.completed || 0 }}</p>
              <p class="text-xs mt-0.5 sm:mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-500'">{{ completionRate }}% {{ $t('dashboard.done') }}</p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-600/20 flex-shrink-0 flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div :class="[
          'p-4 sm:p-6 rounded-lg border transition-all hover:shadow-lg',
          isDark 
            ? 'bg-[#1a1f2e] border-gray-700 hover:border-yellow-500'
            : 'bg-white border-gray-200 hover:border-yellow-500'
        ]">
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="text-xs sm:text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ $t('stats.pending_tasks') }}</p>
              <p class="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2" :class="isDark ? 'text-white' : 'text-gray-900'">{{ taskStore.stats?.pending || 0 }}</p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-yellow-600/20 flex-shrink-0 flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div :class="[
          'p-4 sm:p-6 rounded-lg border transition-all hover:shadow-lg',
          isDark 
            ? 'bg-[#1a1f2e] border-gray-700 hover:border-red-500'
            : 'bg-white border-gray-200 hover:border-red-500'
        ]">
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="text-xs sm:text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ $t('stats.overdue_tasks') }}</p>
              <p class="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2" :class="isDark ? 'text-white' : 'text-gray-900'">{{ taskStore.stats?.overdue || 0 }}</p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-600/20 flex-shrink-0 flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <TasksLineChart />
        <TasksStatusChart />
      </div>

      <div class="mb-6 sm:mb-8">
        <TasksBarChart />
      </div>

      <!-- Recent Tasks -->
      <div :class="[
        'w-full p-4 sm:p-6 rounded-lg border',
        isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200'
      ]">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 class="text-lg sm:text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ $t('dashboard.recentTasks') }}</h2>
          <router-link to="/tasks" class="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium whitespace-nowrap">{{ $t('dashboard.viewAll') }} →</router-link>
        </div>

        <div v-if="taskStore.tasks.length === 0" class="text-center py-6 sm:py-8">
          <svg class="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-xs sm:text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ $t('dashboard.noTasksYet') }}</p>
        </div>

        <div class="space-y-2">
          <div 
            v-for="task in taskStore.tasks.slice(0, 5)" 
            :key="task.id"
            :class="[
              'flex items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-all hover:shadow',
              isDark ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            ]"
          >
            <input 
              type="checkbox" 
              :checked="task.is_completed"
              @change="() => taskStore.toggleComplete(task.id)"
              class="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-blue-600 cursor-pointer flex-shrink-0 mt-0.5 sm:mt-0"
            >
            <div class="flex-1 min-w-0">
              <p :class="[
                'text-xs sm:text-sm font-medium truncate',
                task.is_completed ? 'text-gray-500 line-through' : isDark ? 'text-white' : 'text-gray-900'
              ]">
                {{ task.title }}
              </p>
              <p v-if="task.due_date" class="text-xs mt-0.5 sm:mt-1 truncate" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                {{ $t('dashboard.due') }} {{ formatDateWithMonthAndTime(task.due_date, task.due_time || '') }}
              </p>
            </div>
            <span :class="[
              'px-2 py-0.5 sm:py-1 rounded text-xs font-medium flex-shrink-0',
              task.priority === 'high' ? 'bg-red-600/20 text-red-600' :
              task.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-600' :
              'bg-blue-600/20 text-blue-600'
            ]">
              {{ $t('tasks.' + task.priority) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useTaskStore } from '@/stores/tasks'
import AppLayout from '@/layouts/AppLayout.vue'
import TasksLineChart from '@/components/TasksLineChart.vue'
import TasksBarChart from '@/components/TasksBarChart.vue'
import TasksStatusChart from '@/components/TasksStatusChart.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const taskStore = useTaskStore()

const isDark = computed(() => themeStore.isDark)

const completionRate = computed(() => {
  if (!taskStore.stats || taskStore.stats.total === 0) return 0
  return Math.round((taskStore.stats.completed / taskStore.stats.total) * 100)
})

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return t('dashboard.goodMorning')
  if (hour < 18) return t('dashboard.goodAfternoon')
  return t('dashboard.goodEvening')
}

// ─── Date Helper with Month Translation ───
const formatDateWithMonthAndTime = (date: string, time: string | null): string => {
  if (!date) return ''
  
  const dateObj = new Date(date)
  const monthIndex = dateObj.getMonth()
  const day = dateObj.getDate()
  const year = dateObj.getFullYear()
  
  // Get translated month name from calendar structure
  const monthName = t(`calendar.months.${monthIndex}`)
  const formattedDate = `${monthName} ${day}, ${year}`
  
  if (!time) {
    return `${formattedDate} 12:00 AM`
  }
  
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const minute = minutes || '00'
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  const formattedTime = `${displayHour}:${minute} ${period}`
  
  return `${formattedDate} ${formattedTime}`
}

onMounted(async () => {
  try {
    await taskStore.fetchStats()
    await taskStore.fetchTasks()
  } catch (err) {
    console.error('Dashboard error:', err)
  }
})
</script>