<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          @click="handleClose"
        ></div>

        <!-- Modal -->
        <div
          class="relative w-full max-w-2xl animate-slide-up"
          :class="isDark ? 'bg-[#1a1f2e]' : 'bg-white'"
          style="border-radius: 1.25rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-6 border-b"
            :class="isDark ? 'border-gray-700' : 'border-gray-200'"
          >
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div
                class="w-3 h-3 rounded-full flex-shrink-0 animate-pulse"
                :class="task?.is_completed ? 'bg-emerald-500' : 'bg-blue-500'"
              ></div>
              <h2
                class="text-xl font-bold truncate"
                :class="[
                  isDark ? 'text-white' : 'text-gray-900',
                  task?.is_completed ? 'line-through opacity-60' : ''
                ]"
              >
                {{ task?.title || t('tasks.taskDetails') }}
              </h2>
            </div>
            <button
              @click="handleClose"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex-shrink-0"
            >
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-6">
            <!-- Description -->
            <div v-if="task?.description" class="space-y-1">
              <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {{ t('tasks.description') }}
              </p>
              <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                {{ task.description }}
              </p>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Priority -->
              <div class="flex items-center gap-3 p-3 rounded-lg border" :class="isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'">
                <span class="text-xl">{{ priorityEmoji }}</span>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {{ t('tasks.priority') }}
                  </p>
                  <p class="text-sm font-semibold capitalize" :class="priorityColor">
                    {{ task?.priority ? t('tasks.' + task.priority) : t('common.not_set') }}
                  </p>
                </div>
              </div>

              <!-- Status -->
              <div class="flex items-center gap-3 p-3 rounded-lg border" :class="isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'">
                <span class="text-xl">{{ task?.is_completed ? '✅' : '⏳' }}</span>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {{ t('tasks.status') }}
                  </p>
                  <p class="text-sm font-semibold" :class="task?.is_completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'">
                    {{ task?.is_completed ? t('tasks.completed') : t('tasks.pending') }}
                  </p>
                </div>
              </div>

              <!-- Start Date -->
              <div v-if="task?.start_date" class="flex items-center gap-3 p-3 rounded-lg border" :class="isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'">
                <span class="text-xl">📅</span>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {{ t('tasks.startdate') }}
                  </p>
                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ formatDateWithDayAndMonth(task.start_date) }}
                    <span v-if="task.start_time" class="font-normal text-gray-500 dark:text-gray-400">
                      {{ t('common.at') }} {{ formatTime(task.start_time) }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- Due Date -->
              <div v-if="task?.due_date" class="flex items-center gap-3 p-3 rounded-lg border" :class="isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'">
                <span class="text-xl">📅</span>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {{ t('tasks.dueDate') }}
                  </p>
                  <p class="text-sm font-semibold" :class="task?.is_overdue ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'">
                    {{ formatDateWithDayAndMonth(task.due_date) }}
                    <span v-if="task.due_time" class="font-normal text-gray-500 dark:text-gray-400">
                      {{ t('common.at') }} {{ formatTime(task.due_time) }}
                    </span>
                    <span v-if="task?.is_overdue" class="ml-2 text-xs font-bold text-red-600 dark:text-red-400 animate-pulse">⚠️ {{ t('tasks.overdue') }}</span>
                  </p>
                </div>
              </div>

              <!-- Category -->
              <div v-if="categoryName" class="flex items-center gap-3 p-3 rounded-lg border" :class="isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'">
                <span class="text-xl">🏷️</span>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {{ t('tasks.category') }}
                  </p>
                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ categoryName }}
                  </p>
                </div>
              </div>

              <!-- Created At -->
              <div class="flex items-center gap-3 p-3 rounded-lg border" :class="isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'">
                <span class="text-xl">🕐</span>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {{ t('common.created_at') }}
                  </p>
                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ getTimeAgo() }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
              <button
                @click="handleToggleComplete"
                class="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                :class="task?.is_completed
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50'"
              >
                <span>{{ task?.is_completed ? '↩️ ' + t('tasks.markAsPending') : '✅ ' + t('tasks.markAsComplete') }}</span>
              </button>
              <button
                @click="handleEdit"
                class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
              >
                ✏️ {{ t('common.edit') }}
              </button>
              <button
                @click="handleDelete"
                class="px-4 py-2.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center gap-2"
              >
                🗑️ {{ t('common.delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import type { Task } from '@/types'

// ─── Props ───
const props = defineProps<{
  show: boolean
  task: Task | null
}>()

// ─── Emits ───
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toggle', id: number): void
  (e: 'edit', task: Task): void
  (e: 'delete', id: number): void
}>()

// ─── i18n ───
const { t } = useI18n()

// ─── Stores ───
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

// ─── Computed ───
const categoryName = computed(() => props.task?.category_name || null)

const priorityEmoji = computed(() => {
  const emojis: Record<string, string> = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
    urgent: '🔴',
  }
  return emojis[props.task?.priority || 'medium'] || '🟡'
})

const priorityColor = computed(() => {
  const colors: Record<string, string> = {
    high: 'text-red-600 dark:text-red-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    low: 'text-green-600 dark:text-green-400',
    urgent: 'text-red-600 dark:text-red-400',
  }
  return colors[props.task?.priority || 'medium'] || 'text-gray-600 dark:text-gray-400'
})

// ─── Date Helper with Day & Month from your calendar structure ───
const formatDateWithDayAndMonth = (date: string): string => {
  if (!date) return t('common.no_data')
  
  const dateObj = new Date(date)
  const dayIndex = dateObj.getDay() // 0 = Sunday, 1 = Monday, etc.
  const monthIndex = dateObj.getMonth() // 0 = January, 1 = February, etc.
  const day = dateObj.getDate()
  const year = dateObj.getFullYear()
  
  // Get day and month names from your calendar structure
  const dayName = t(`calendar.${getDayKey(dayIndex)}`)
  const monthName = t(`calendar.months.${monthIndex}`)
  
  return `${dayName}, ${monthName} ${day}, ${year}`
}

// Helper function to map day index to translation key
const getDayKey = (index: number): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[index] || 'sunday'
}

const formatTime = (time: string): string => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const minute = minutes || '00'
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minute} ${period}`
}

// ─── Safe timeAgo function ───
const getTimeAgo = (): string => {
  if (!props.task) return t('common.recently')
  
  const dateStr = props.task.created_at || 
                  (props.task as any).createdAt || 
                  props.task.updated_at || 
                  (props.task as any).updatedAt || 
                  ''
  
  if (!dateStr) return t('common.recently')
  
  try {
    const past = new Date(dateStr)
    if (isNaN(past.getTime())) return t('common.recently')
    
    const now = new Date()
    const diff = now.getTime() - past.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)
    
    if (minutes < 1) return t('common.just_now')
    if (minutes < 60) return `${minutes}m ${t('common.ago')}`
    if (hours < 24) return `${hours}h ${t('common.ago')}`
    if (days < 7) return `${days}d ${t('common.ago')}`
    if (weeks < 4) return `${weeks}w ${t('common.ago')}`
    if (months < 12) return `${months}mo ${t('common.ago')}`
    return `${years}y ${t('common.ago')}`
  } catch (error) {
    return t('common.recently')
  }
}

// ─── Methods ───
const handleClose = () => {
  emit('close')
}

const handleToggleComplete = () => {
  if (props.task) {
    emit('toggle', props.task.id)
    setTimeout(() => emit('close'), 500)
  }
}

const handleEdit = () => {
  if (props.task) {
    emit('edit', props.task)
    emit('close')
  }
}

const handleDelete = () => {
  if (props.task && confirm(t('tasks.deleteConfirmation'))) {
    emit('delete', props.task.id)
    emit('close')
  }
}

// ─── Keyboard Shortcut ───
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleClose()
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.25s ease-out forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>