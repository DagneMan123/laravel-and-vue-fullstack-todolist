<template>
  <AppLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Calendar</h1>
          <p class="mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">View your tasks and deadlines</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Calendar -->
        <div class="lg:col-span-2">
          <div :class="[
            'rounded-xl border shadow-sm p-6',
            isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200'
          ]">
            <!-- Calendar Header -->
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ currentMonth }}
              </h2>
              <div class="flex gap-2">
                <button 
                  @click="prevMonth"
                  class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  @click="nextMonth"
                  class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Day Headers -->
            <div class="grid grid-cols-7 gap-2 mb-4">
              <div 
                v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
                :key="day"
                class="text-center text-xs font-semibold uppercase"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ day }}
              </div>
            </div>

            <!-- Calendar Grid -->
            <div class="grid grid-cols-7 gap-2">
              <div 
                v-for="day in calendarDays"
                :key="day.fullDate"
                :class="[
                  'p-2 rounded-lg text-sm cursor-pointer transition-all min-h-[85px] flex flex-col justify-between border',
                  day.isCurrentMonth
                    ? day.isToday
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : isDark ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    : isDark ? 'bg-gray-900/30 border-transparent text-gray-600 opacity-40' : 'bg-gray-100 border-transparent text-gray-400 opacity-50'
                ]"
              >
                <span class="font-bold text-xs">{{ day.date }}</span>
                
                <div class="space-y-1 overflow-hidden mt-1">
                  <div 
                    v-for="task in day.tasks.slice(0, 2)"
                    :key="task.id"
                    class="text-[10px] px-1.5 py-0.5 rounded truncate font-medium block w-full border"
                    :class="[
                      day.isToday 
                        ? 'bg-white text-gray-900 border-white' 
                        : task.priority === 'high'
                          ? 'bg-red-600/20 text-red-400 border-red-500/30'
                          : task.priority === 'medium'
                            ? 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                    ]"
                    :title="task.title"
                    @click.stop="editTask(task)"
                  >
                    {{ task.title }}
                  </div>
                  <p 
                    v-if="day.tasks.length > 2"
                    class="text-[9px] text-gray-500 px-1"
                  >
                    +{{ day.tasks.length - 2 }} more
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Tasks Sidebar -->
        <div :class="[
          'rounded-xl border shadow-sm p-6',
          isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200'
        ]">
          <h3 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">Upcoming</h3>
          
          <div v-if="upcomingTasks.length === 0" class="text-center text-sm py-8 text-gray-500">
            No upcoming tasks
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="task in upcomingTasks"
              :key="task.id"
              :class="[
                'p-3 rounded-lg text-sm transition-colors cursor-pointer border-l-4',
                isDark ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100',
                task.priority === 'high' ? 'border-red-600' : task.priority === 'medium' ? 'border-yellow-600' : 'border-blue-600'
              ]"
              @click="editTask(task)"
            >
              <p class="font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">{{ task.title }}</p>
              <p v-if="task.due_date" class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                📅 {{ new Date(task.due_date).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Form Modal -->
      <TaskFormModal 
        v-if="showCreateModal"
        :task="editingTask"
        @close="closeCreateModal"
        @save="handleSave"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useTaskStore } from '@/stores/tasks'
import type { Task } from '@/types'
import AppLayout from '@/layouts/AppLayout.vue'
import TaskFormModal from '@/components/TaskFormModal.vue'

const themeStore = useThemeStore()
const taskStore = useTaskStore()

const isDark = computed(() => themeStore.isDark)

// Calendar States
const currentDate = ref(new Date())
const showCreateModal = ref(false)
const editingTask = ref<Task | null>(null)

const currentMonth = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
})

// Calendar Days Logic
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days = []
  const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 }

  const getTasksForDate = (y: number, m: number, d: number) => {
    return taskStore.tasks
      .filter(task => {
        if (!task.due_date || task.is_completed) return false
        const taskDate = new Date(task.due_date)
        return taskDate.getFullYear() === y && 
               taskDate.getMonth() === m && 
               taskDate.getDate() === d
      })
      .sort((a, b) => {
        const weightA = priorityWeight[a.priority?.toLowerCase()] || 0
        const weightB = priorityWeight[b.priority?.toLowerCase()] || 0
        return weightB - weightA
      })
  }

  // Previous month's days
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevMonthDate = daysInPrevMonth - i
    const prevMonthIndex = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    days.push({ 
      date: prevMonthDate, 
      isCurrentMonth: false, 
      isToday: false,
      tasks: getTasksForDate(prevYear, prevMonthIndex, prevMonthDate),
      fullDate: `${prevYear}-${String(prevMonthIndex + 1).padStart(2, '0')}-${String(prevMonthDate).padStart(2, '0')}`
    })
  }

  // Current month's days
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year
    days.push({ 
      date: i, 
      isCurrentMonth: true, 
      isToday,
      tasks: getTasksForDate(year, month, i),
      fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    })
  }

  // Next month's days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonthIndex = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    days.push({ 
      date: i, 
      isCurrentMonth: false, 
      isToday: false,
      tasks: getTasksForDate(nextYear, nextMonthIndex, i),
      fullDate: `${nextYear}-${String(nextMonthIndex + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    })
  }

  return days
})

// Upcoming Tasks
const upcomingTasks = computed(() => {
  return taskStore.tasks
    .filter(t => t.due_date && !t.is_completed)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5)
})

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const editTask = (task: Task) => {
  editingTask.value = task
  showCreateModal.value = true
}

const closeCreateModal = () => {
  editingTask.value = null
  showCreateModal.value = false
}

const handleSave = async () => {
  closeCreateModal()
  await taskStore.fetchTasks()
}

onMounted(async () => {
  await taskStore.fetchTasks()
})
</script>
