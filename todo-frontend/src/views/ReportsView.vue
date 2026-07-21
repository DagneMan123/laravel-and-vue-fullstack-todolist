<template>
  <AppLayout>
    <div class="p-4 sm:p-6">
      <!-- ===== HEADER ===== -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            📊 {{ $t('reports.title') }}
          </h1>
          <p class="mt-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ $t('reports.subtitle') }}
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
            <option value="all">📊 {{ $t('reports.all_time') }}</option>
            <option value="today">📆 {{ $t('reports.today') }}</option>
            <option value="week">📅 {{ $t('reports.this_week') }}</option>
            <option value="month">📅 {{ $t('reports.this_month') }}</option>
          </select>

          <!-- Export Dropdown -->
          <div class="relative" ref="exportDropdownRef">
            <button 
              @click="toggleExportDropdown"
              :class="[
                'px-3 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap',
                isDark 
                  ? 'bg-[#1a1f2e] border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{{ $t('common.export') }}</span>
              <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showExportDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Export Dropdown Menu -->
            <div 
              v-if="showExportDropdown" 
              class="absolute right-0 mt-2 w-48 rounded-lg shadow-2xl border z-50 overflow-hidden"
              :class="isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200'"
            >
              <button 
                @click="exportPDF" 
                class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                :class="isDark ? 'text-gray-200' : 'text-gray-700'"
              >
                <span class="text-lg">📄</span> {{ $t('reports.pdf_report') }}
              </button>
              <button 
                @click="exportCSV" 
                class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                :class="isDark ? 'text-gray-200' : 'text-gray-700'"
              >
                <span class="text-lg">📊</span> {{ $t('reports.csv_data') }}
              </button>
              <button 
                @click="exportExcel" 
                class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                :class="isDark ? 'text-gray-200' : 'text-gray-700'"
              >
                <span class="text-lg">📈</span> {{ $t('reports.excel_export') }}
              </button>
              <button 
                @click="printReport" 
                class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 border-t"
                :class="isDark ? 'border-gray-700 text-gray-200' : 'border-gray-200 text-gray-700'"
              >
                <span class="text-lg">🖨️</span> {{ $t('reports.print') }}
              </button>
              <button 
                @click="shareReport" 
                class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                :class="isDark ? 'text-gray-200' : 'text-gray-700'"
              >
                <span class="text-lg">🔗</span> {{ $t('reports.share') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== STATS CARDS ===== -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div :class="['p-4 sm:p-6 rounded-lg border transition-all', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
          <p class="text-xs sm:text-sm font-medium mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ $t('stats.total_tasks') }}
          </p>
          <p class="text-2xl sm:text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ filteredStats.total || 0 }}
          </p>
          <p class="text-xs mt-1 text-gray-500">
            {{ selectedTimeRange === 'all' ? $t('reports.all_time') : selectedTimeRange }}
          </p>
        </div>

        <div :class="['p-4 sm:p-6 rounded-lg border transition-all', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
          <p class="text-xs sm:text-sm font-medium mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ $t('stats.completed_tasks') }}
          </p>
          <p class="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
            {{ filteredStats.completed || 0 }}
          </p>
          <p class="text-xs mt-1 font-semibold text-blue-500">
            {{ completionRate }}% {{ $t('common.efficiency') }}
          </p>
        </div>

        <div :class="['p-4 sm:p-6 rounded-lg border transition-all', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
          <p class="text-xs sm:text-sm font-medium mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ $t('stats.pending_tasks') }}
          </p>
          <p class="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {{ filteredStats.pending || 0 }}
          </p>
        </div>

        <div :class="['p-4 sm:p-6 rounded-lg border transition-all', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
          <p class="text-xs sm:text-sm font-medium mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ $t('stats.overdue_tasks') }}
          </p>
          <p class="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
            {{ filteredStats.overdue || 0 }}
          </p>
        </div>
      </div>

      <!-- ===== CHARTS ===== -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Completion Rate Chart -->
        <div :class="['p-4 sm:p-6 rounded-lg border', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
          <h3 class="text-lg font-bold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ $t('reports.completion_rate') }}
          </h3>
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
                    {{ $t('stats.completed_tasks') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center gap-4 text-xs mt-2">
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-full bg-blue-500"></span>
              {{ $t('stats.completed_tasks') }}
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-full" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></span>
              {{ $t('stats.pending_tasks') }}
            </span>
          </div>
        </div>

        <!-- Priority Distribution -->
        <div :class="['p-4 sm:p-6 rounded-lg border', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
          <h3 class="text-lg font-bold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ $t('tasks.priority') }}
          </h3>
          <div class="space-y-4 py-2">
            <div v-for="(count, priority) in priorityCounts" :key="priority" class="flex items-center gap-3">
              <span class="capitalize text-sm font-semibold w-16 sm:w-20" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                {{ $t('tasks.' + priority) }}
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
              {{ $t('tasks.high') }}
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
              {{ $t('tasks.medium') }}
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-full bg-blue-500"></span>
              {{ $t('tasks.low') }}
            </span>
          </div>
        </div>
      </div>

      <!-- ===== RECENT COMPLETED TASKS ===== -->
      <div :class="['p-4 sm:p-6 rounded-lg border', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ $t('reports.recent_completed') }}
          </h3>
          <span class="text-xs px-2 py-1 rounded-full" :class="isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'">
            {{ completedTasks.length }} {{ $t('stats.completed_tasks') }}
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
                {{ $t('tasks.' + task.priority) }}
              </span>
              <span class="text-[10px] sm:text-xs opacity-60">
                {{ task.due_date ? formatDate(task.due_date) : $t('common.no_due_date') }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            {{ $t('reports.no_completed') }}
          </p>
          <p class="text-xs mt-1" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
            {{ $t('reports.complete_first') }}
          </p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useTaskStore } from '@/stores/tasks'
import AppLayout from '@/layouts/AppLayout.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ============================================
// I18N - Translation Function
// ============================================
const { t } = useI18n()

// ============================================
// STORES
// ============================================
const themeStore = useThemeStore()
const taskStore = useTaskStore()

const isDark = computed(() => themeStore.isDark)

// ============================================
// STATE
// ============================================
const selectedTimeRange = ref('all')
const showExportDropdown = ref(false)
const exportDropdownRef = ref<HTMLElement | null>(null)

// ============================================
// DATE HELPER
// ============================================
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

// ============================================
// FILTERED TASKS
// ============================================
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
      break
  }

  return tasks
})

// ============================================
// STATS
// ============================================
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

// ============================================
// COMPLETION RATE
// ============================================
const completionRate = computed(() => {
  const { total, completed } = filteredStats.value
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
})

// ============================================
// PRIORITY COUNTS
// ============================================
const priorityCounts = computed(() => {
  const counts: Record<string, number> = { low: 0, medium: 0, high: 0 }
  filteredTasks.value.forEach(task => {
    if (task.priority in counts) {
      counts[task.priority as keyof typeof counts]++
    }
  })
  return counts
})

// ============================================
// GET PRIORITY PERCENTAGE
// ============================================
const getPriorityPercentage = (count: number) => {
  const total = filteredStats.value.total
  if (total === 0) return 0
  return (count / total) * 100
}

// ============================================
// COMPLETED TASKS
// ============================================
const completedTasks = computed(() => {
  return filteredTasks.value
    .filter(t => t.is_completed)
    .sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at) : new Date()
      const dateB = b.updated_at ? new Date(b.updated_at) : new Date()
      return dateB.getTime() - dateA.getTime()
    })
})

// ============================================
// HANDLE FILTER CHANGE
// ============================================
const handleFilterChange = async () => {
  await taskStore.fetchStats()
  await taskStore.fetchTasks()
}

// ============================================
// TOGGLE EXPORT DROPDOWN
// ============================================
const toggleExportDropdown = () => {
  showExportDropdown.value = !showExportDropdown.value
}

// ============================================
// EXPORT CSV
// ============================================
const exportCSV = () => {
  const tasks = filteredTasks.value
  if (tasks.length === 0) {
    alert(t('reports.no_data_export'))
    return
  }

  // ✅ Pre-fetch translations to avoid variable conflict
  const completedText = t('tasks.completed')
  const pendingText = t('tasks.pending')
  const noDataText = t('common.n/a')
  
  const headers = [
    t('tasks.task_title'),
    t('tasks.priority'),
    t('tasks.status'),
    t('tasks.due_date'),
    t('common.created_at')
  ]
  
  // ✅ Using 'task' instead of 't' to avoid conflict with translation function
  const rows = tasks.map((task: any) => [
    `"${task.title.replace(/"/g, '""')}"`,
    task.priority,
    task.is_completed ? completedText : pendingText,
    task.due_date || noDataText,
    task.created_at ? new Date(task.created_at).toLocaleDateString() : 'N/A'
  ])

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map((row: any) => row.join(','))].join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  const rangeLabel = selectedTimeRange.value === 'all' ? 'AllTime' : selectedTimeRange.value
  link.setAttribute('download', `TaskFlow_Report_${rangeLabel}_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showExportDropdown.value = false
}

// ============================================
// EXPORT EXCEL
// ============================================
const exportExcel = () => {
  const tasks = filteredTasks.value
  if (tasks.length === 0) {
    alert(t('reports.no_data_export'))
    return
  }

  const completedText = t('tasks.completed')
  const pendingText = t('tasks.pending')
  const noDataText = t('common.n/a')
  
  const headers = [
    t('tasks.task_title'),
    t('tasks.priority'),
    t('tasks.status'),
    t('tasks.due_date'),
    t('common.created_at')
  ]
  
  const rows = tasks.map((task: any) => [
    `"${task.title.replace(/"/g, '""')}"`,
    task.priority,
    task.is_completed ? completedText : pendingText,
    task.due_date || noDataText,
    task.created_at ? new Date(task.created_at).toLocaleDateString() : 'N/A'
  ])

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map((row: any) => row.join(','))].join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  const rangeLabel = selectedTimeRange.value === 'all' ? 'AllTime' : selectedTimeRange.value
  link.setAttribute('download', `TaskFlow_Report_${rangeLabel}_${new Date().toISOString().split('T')[0]}.xls`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showExportDropdown.value = false
}

// ============================================
// PRINT REPORT
// ============================================
const printReport = () => {
  window.print()
  showExportDropdown.value = false
}

// ============================================
// SHARE REPORT
// ============================================
const shareReport = () => {
  const shareText = t('reports.share_text', {
    total: filteredStats.value.total,
    completed: filteredStats.value.completed,
    rate: completionRate.value
  })
  
  if (navigator.share) {
    navigator.share({
      title: t('reports.share_title'),
      text: shareText,
      url: window.location.href
    }).catch(() => {})
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert(t('common.copied'))
    }).catch(() => {
      alert(t('common.share_not_supported'))
    })
  }
  showExportDropdown.value = false
}

// ============================================
// EXPORT PDF
// ============================================
const exportPDF = () => {
  try {
    const tasks = filteredTasks.value
    if (tasks.length === 0) {
      alert(t('reports.no_data_export'))
      return
    }

    const doc = new jsPDF('landscape', 'pt', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    
    // ─── HEADER ───
    doc.setFillColor(59, 130, 246)
    doc.rect(0, 0, pageWidth, 100, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('📊 TaskFlow Report', 40, 50)
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    doc.text(`Generated: ${dateStr}`, 40, 75)

    // ─── STATS ───
    const statsY = 130
    const stats = [
      { label: t('stats.total_tasks'), value: filteredStats.value.total },
      { label: t('stats.completed_tasks'), value: filteredStats.value.completed },
      { label: t('stats.pending_tasks'), value: filteredStats.value.pending },
      { label: t('stats.overdue_tasks'), value: filteredStats.value.overdue }
    ]
    
    stats.forEach((stat, index) => {
      const x = 40 + (index * 200)
      doc.setFillColor(248, 250, 252)
      doc.rect(x, statsY, 170, 70, 'F')
      doc.setDrawColor(229, 231, 235)
      doc.rect(x, statsY, 170, 70, 'S')
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      doc.text(String(stat.value), x + 15, statsY + 40)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 116, 139)
      doc.text(stat.label, x + 15, statsY + 18)
    })

    // ─── COMPLETION RATE ───
    const rateY = 230
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(`${t('stats.completion_rate')}: ${completionRate.value}%`, 40, rateY)
    
    const barX = 40
    const barY = rateY + 12
    const barWidth = 500
    const barHeight = 24
    
    doc.setFillColor(229, 231, 235)
    doc.rect(barX, barY, barWidth, barHeight, 'F')
    doc.setFillColor(59, 130, 246)
    doc.rect(barX, barY, (barWidth * completionRate.value) / 100, barHeight, 'F')
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    const percentText = `${completionRate.value}%`
    const textWidth = doc.getTextWidth(percentText)
    doc.text(percentText, barX + barWidth / 2 - textWidth / 2, barY + 18)

    // ─── PRIORITY DISTRIBUTION ───
    const priorityY = 310
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(t('tasks.priority'), 40, priorityY)
    
    const priorities = [
      { label: t('tasks.high'), color: [239, 68, 68], count: priorityCounts.value.high || 0 },
      { label: t('tasks.medium'), color: [245, 158, 11], count: priorityCounts.value.medium || 0 },
      { label: t('tasks.low'), color: [59, 130, 246], count: priorityCounts.value.low || 0 }
    ]
    
    let pY = priorityY + 20
    priorities.forEach((p: any) => {
      const total = filteredStats.value.total || 1
      const percentage = (p.count / total) * 100
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(p.label, 40, pY + 8)
      
      doc.setFillColor(229, 231, 235)
      doc.rect(100, pY, 400, 18, 'F')
      doc.setFillColor(p.color[0], p.color[1], p.color[2])
      doc.rect(100, pY, (400 * percentage) / 100, 18, 'F')
      
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 116, 139)
      doc.text(`${p.count} (${Math.round(percentage)}%)`, 520, pY + 13)
      pY += 32
    })

    // ─── RECENT TASKS ───
    const tableY = pY + 20
    const recentTasks = completedTasks.value.slice(0, 8)
    
    if (recentTasks.length > 0) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(t('reports.recent_completed'), 40, tableY)
      
      const tableRows = recentTasks.map((task: any) => [
        task.title.length > 50 ? task.title.substring(0, 47) + '...' : task.title,
        t('tasks.' + task.priority),
        task.due_date ? formatDate(task.due_date) : t('common.n/a'),
        task.updated_at ? formatDate(task.updated_at) : t('common.n/a')
      ])

      autoTable(doc, {
        startY: tableY + 15,
        head: [
          [t('tasks.task_title'), t('tasks.priority'), t('tasks.due_date'), t('common.completed_at')]
        ],
        body: tableRows,
        theme: 'striped',
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: { fontSize: 9, cellPadding: 6 },
        columnStyles: {
          0: { cellWidth: 280 },
          1: { cellWidth: 80 },
          2: { cellWidth: 120 },
          3: { cellWidth: 120 }
        },
        margin: { left: 40, right: 40 }
      })
    }

    // ─── FOOTER ───
    const finalY = (doc as any).lastAutoTable?.finalY || doc.internal.pageSize.getHeight() - 60
    doc.setDrawColor(229, 231, 235)
    doc.line(40, finalY + 30, pageWidth - 40, finalY + 30)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(128, 128, 128)
    doc.text(`Generated by TaskFlow • ${now.toLocaleString()}`, 40, finalY + 45)

    const rangeLabel = selectedTimeRange.value === 'all' ? 'AllTime' : selectedTimeRange.value
    doc.save(`TaskFlow_Report_${rangeLabel}_${new Date().toISOString().split('T')[0]}.pdf`)
    showExportDropdown.value = false
    
  } catch (error) {
    console.error('PDF Export Error:', error)
    alert(t('common.error'))
  }
}

// ============================================
// CLICK OUTSIDE TO CLOSE DROPDOWN
// ============================================
const handleClickOutside = (event: MouseEvent) => {
  if (exportDropdownRef.value && !exportDropdownRef.value.contains(event.target as Node)) {
    showExportDropdown.value = false
  }
}

// ============================================
// LIFECYCLE
// ============================================
onMounted(async () => {
  await taskStore.fetchStats()
  await taskStore.fetchTasks()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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

/* ─── Print Styles ─── */
@media print {
  .no-print {
    display: none !important;
  }
}

/* ─── Animation ─── */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
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