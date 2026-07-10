<template>
  <AppLayout>
    <div class="p-4 sm:p-6">
      <!-- ===== HEADER ===== -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            Reports & Analytics
          </h1>
          <p class="mt-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Track your productivity and progress
          </p>
        </div>
        
        <div class="flex items-center gap-3 self-start sm:self-center w-full sm:w-auto">
          <select 
            v-model="selectedTimeRange"
            @change="handleFilterChange"
            :class="[
              'px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer outline-none flex-1 sm:flex-none appearance-none',
              isDark 
                ? 'bg-[#1a1f2e] border-gray-700 text-white hover:bg-gray-800' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            ]"
          >
            <option value="all">📊 All Time</option>
            <option value="today">📆 Today</option>
            <option value="week">📅 This Week</option>
            <option value="month">📅 This Month</option>
          </select>

          <button 
            @click="exportReport"
            :class="[
              'px-3 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap',
              isDark 
                ? 'bg-[#1a1f2e] border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span class="hidden sm:inline">Export CSV</span>
            <span class="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      <!-- ===== STATS CARDS ===== -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div :class="['p-4 sm:p-6 rounded-lg border transition-all', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
          <p class="text-xs sm:text-sm font-medium mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Total Tasks</p>
          <p class="text-2xl sm:text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ filteredStats.total || 0 }}
          </p>
          <p class="text-xs mt-1 text-gray-500">
            {{ selectedTimeRange === 'all' ? 'All time' : selectedTimeRange }}
          </p>
        </div>

        <div :class="['p-4 sm:p-6 rounded-lg border transition-all', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
          <p class="text-xs sm:text-sm font-medium mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Completed</p>
          <p class="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
            {{ filteredStats.completed || 0 }}
          </p>
          <p class="text-xs mt-1 font-semibold text-blue-500">
            {{ completionRate }}% Efficiency
          </p>
        </div>

        <div :class="['p-4 sm:p-6 rounded-lg border transition-all', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
          <p class="text-xs sm:text-sm font-medium mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Pending</p>
          <p class="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {{ filteredStats.pending || 0 }}
          </p>
        </div>

        <div :class="['p-4 sm:p-6 rounded-lg border transition-all', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
          <p class="text-xs sm:text-sm font-medium mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Overdue</p>
          <p class="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
            {{ filteredStats.overdue || 0 }}
          </p>
        </div>
      </div>

      <!-- ===== CHARTS ===== -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Completion Rate Chart -->
        <div :class="['p-4 sm:p-6 rounded-lg border', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
          <h3 class="text-lg font-bold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">Completion Rate</h3>
          <div class="flex items-center justify-center py-4">
            <div class="relative w-40 h-40 sm:w-48 sm:h-48">
              <svg viewBox="0 0 200 200" class="transform -rotate-90 w-full h-full">
                <circle cx="100" cy="100" r="90" fill="none" :stroke="isDark ? '#2d3748' : '#e5e7eb'" stroke-width="20" />
                <circle 
                  cx="100" cy="100" r="90" fill="none" 
                  stroke="#3b82f6" 
                  stroke-width="20"
                  stroke-dasharray="565"
                  :stroke-dashoffset="565 - (565 * completionRate / 100)"
                  stroke-linecap="round"
                  class="transition-all duration-700 ease-out"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <p class="text-2xl sm:text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ completionRate }}%
                  </p>
                  <p class="text-[10px] sm:text-xs font-medium mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center gap-4 text-xs mt-2">
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-full bg-blue-500"></span>
              Completed
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-full" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></span>
              Pending
            </span>
          </div>
        </div>

        <!-- Priority Distribution -->
        <div :class="['p-4 sm:p-6 rounded-lg border', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
          <h3 class="text-lg font-bold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">By Priority</h3>
          <div class="space-y-4 py-2">
            <div v-for="(count, priority) in priorityCounts" :key="priority" class="flex items-center gap-3">
              <span class="capitalize text-sm font-semibold w-16 sm:w-20" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                {{ priority }}
              </span>
              <div class="flex-1 h-3 rounded-full overflow-hidden" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  :style="{
                    width: `${getPriorityPercentage(count)}%`,
                    backgroundColor: priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#3b82f6'
                  }"
                />
              </div>
              <span class="text-sm font-bold w-8 text-right" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ count }}
              </span>
            </div>
          </div>
          <div class="flex justify-center gap-4 text-xs mt-4">
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-full bg-red-500"></span>
              High
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
              Medium
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-full bg-blue-500"></span>
              Low
            </span>
          </div>
        </div>
      </div>

      <!-- ===== RECENT COMPLETED TASKS ===== -->
      <div :class="['p-4 sm:p-6 rounded-lg border', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Recent Completed Tasks</h3>
          <span class="text-xs px-2 py-1 rounded-full" :class="isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'">
            {{ completedTasks.length }} completed
          </span>
        </div>
        
        <div v-if="completedTasks.length > 0" class="space-y-3">
          <div 
            v-for="task in completedTasks.slice(0, 5)" 
            :key="task.id" 
            class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border text-sm transition-all hover:translate-x-1"
            :class="isDark ? 'bg-gray-800/60 border-gray-700 hover:bg-gray-800 text-gray-300' : 'bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-700'"
          >
            <div class="flex items-center gap-3 min-w-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="font-medium truncate">{{ task.title }}</span>
            </div>
            <div class="flex items-center gap-3 mt-2 sm:mt-0 ml-7 sm:ml-0">
              <span class="text-[10px] sm:text-xs px-2 py-0.5 rounded-full" :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'">
                {{ task.priority }}
              </span>
              <span class="text-[10px] sm:text-xs opacity-60">
                {{ task.due_date ? formatDate(task.due_date) : 'No due date' }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">No completed tasks yet</p>
          <p class="text-xs mt-1" :class="isDark ? 'text-gray-600' : 'text-gray-400'">Finish your pending tasks to see them listed here!</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useTaskStore } from '@/stores/tasks'
import AppLayout from '@/layouts/AppLayout.vue'

// ─── Stores ───
const themeStore = useThemeStore()
const taskStore = useTaskStore()

const isDark = computed(() => themeStore.isDark)

// ─── State ───
const selectedTimeRange = ref('all')

// ─── Date Helper ───
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

// ─── Filtered Tasks Based on Time Range ───
const filteredTasks = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  startOfMonth.setHours(0, 0, 0, 0)

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  endOfMonth.setHours(23, 59, 59, 999)

  let tasks = [...taskStore.tasks]

  switch (selectedTimeRange.value) {
    case 'today':
      tasks = tasks.filter(task => {
        const date = task.due_date ? new Date(task.due_date) : null
        if (date) {
          date.setHours(0, 0, 0, 0)
          return date.getTime() === today.getTime()
        }
        return false
      })
      break

    case 'week':
      tasks = tasks.filter(task => {
        const date = task.due_date ? new Date(task.due_date) : null
        if (date) {
          date.setHours(0, 0, 0, 0)
          return date >= startOfWeek && date <= today
        }
        return false
      })
      break

    case 'month':
      tasks = tasks.filter(task => {
        const date = task.due_date ? new Date(task.due_date) : null
        if (date) {
          date.setHours(0, 0, 0, 0)
          return date >= startOfMonth && date <= endOfMonth
        }
        return false
      })
      break

    case 'all':
    default:
      // Show all tasks
      break
  }

  return tasks
})

// ─── Filtered Stats ───
const filteredStats = computed(() => {
  const tasks = filteredTasks.value
  const total = tasks.length
  const completed = tasks.filter(t => t.is_completed).length
  const pending = tasks.filter(t => !t.is_completed).length
  const overdue = tasks.filter(t => {
    if (t.is_completed || !t.due_date) return false
    const dueDate = new Date(t.due_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today
  }).length

  return { total, completed, pending, overdue }
})

// ─── Completion Rate ───
const completionRate = computed(() => {
  const { total, completed } = filteredStats.value
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
})

// ─── Priority Counts ───
const priorityCounts = computed(() => {
  const counts = { low: 0, medium: 0, high: 0 }
  filteredTasks.value.forEach(task => {
    if (task.priority in counts) {
      counts[task.priority as keyof typeof counts]++
    }
  })
  return counts
})

// ─── Get Priority Percentage ───
const getPriorityPercentage = (count: number) => {
  const total = filteredStats.value.total
  if (total === 0) return 0
  return (count / total) * 100
}

// ─── Completed Tasks ───
const completedTasks = computed(() => {
  return filteredTasks.value
    .filter(t => t.is_completed)
    .sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at) : new Date()
      const dateB = b.updated_at ? new Date(b.updated_at) : new Date()
      return dateB.getTime() - dateA.getTime()
    })
})

// ─── Handle Filter Change ───
const handleFilterChange = async () => {
  await taskStore.fetchStats()
  await taskStore.fetchTasks()
}

// ─── Export Report to CSV ───
const exportReport = () => {
  const tasks = filteredTasks.value
  if (tasks.length === 0) {
    alert('No data available to export for the selected time range.')
    return
  }

  const headers = ['Task Title', 'Priority', 'Status', 'Due Date', 'Created At']
  const rows = tasks.map(t => [
    `"${t.title.replace(/"/g, '""')}"`,
    t.priority,
    t.is_completed ? 'Completed' : 'Pending',
    t.due_date || 'N/A',
    t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A'
  ])

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  const rangeLabel = selectedTimeRange.value === 'all' ? 'AllTime' : selectedTimeRange.value
  link.setAttribute("download", `TodoList_Report_${rangeLabel}_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ─── Lifecycle ───
onMounted(async () => {
  await taskStore.fetchStats()
  await taskStore.fetchTasks()
})
</script>

<style scoped>
/* ─── Custom Select Styling ─── */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.dark-mode select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
}

/* ─── Animation ─── */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* ─── Dark Mode Background ─── */
.dark .bg-gray-850 {
  background-color: #1a1f2e;
}

/* ─── Scrollbar Styling ─── */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* ─── Mobile Optimizations ─── */
@media (max-width: 640px) {
  select, button {
    min-height: 44px;
  }
}
</style>