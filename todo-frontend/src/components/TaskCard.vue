<template>
  <div
    class="task-card group transition-all duration-300"
    :class="[
      task.is_completed ? 'opacity-60' : '',
      viewMode === 'grid' ? 'task-card-grid' : 'task-card-list'
    ]"
  >
    <div class="flex items-start gap-3" :class="viewMode === 'grid' ? 'flex-col' : ''">
      <!-- Checkbox -->
      <div class="pt-1 flex-shrink-0" :class="viewMode === 'grid' ? 'self-start' : ''">
        <label class="relative cursor-pointer">
          <input
            type="checkbox"
            :checked="task.is_completed"
            @change="emit('toggle', task.id)"
            class="sr-only peer"
          />
          <div
            class="w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center"
            :class="task.is_completed 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500 shadow-lg shadow-emerald-500/30' 
              : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-400'"
          >
            <svg
              v-if="task.is_completed"
              class="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </label>
      </div>

      <!-- Main Content -->
      <div class="flex-1 min-w-0" :class="viewMode === 'grid' ? 'w-full' : ''">
        <div class="space-y-2">
          <!-- Title -->
          <div class="flex items-start justify-between gap-3">
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-gray-50 break-words leading-tight flex-1"
              :class="[
                { 'line-through text-gray-400 dark:text-gray-600': task.is_completed },
                viewMode === 'grid' ? 'text-base' : ''
              ]"
            >
              {{ task.title }}
            </h3>
            
            <!-- Action Buttons -->
            <div class="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                @click="emit('edit', task)"
                class="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-150"
                :title="$t('tasks.editTask')"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="handleDelete"
                class="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150"
                :title="$t('tasks.deleteTask')"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Description -->
          <p v-if="task.description" class="text-xs text-gray-600 dark:text-gray-300 break-words line-clamp-1">
            {{ task.description }}
          </p>

          <!-- Due Date & Time (ALWAYS VISIBLE) -->
          <div v-if="task.due_date" class="flex items-center gap-2">
            <span 
              class="text-xs font-medium px-2.5 py-1 rounded-full border transition-colors duration-200 inline-flex items-center gap-1.5"
              :class="task.is_overdue 
                ? 'bg-red-50 dark:bg-red-900/25 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50' 
                : 'bg-amber-50 dark:bg-amber-900/25 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'"
            >
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM4 5a2 2 0 012-2 1 1 0 000 2h8a1 1 0 100-2 2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
              </svg>
              <span>{{ $t('tasks.dueDate') }}: {{ formatDateWithMonth(task.due_date) }}</span>
              <span v-if="task.due_time" class="font-semibold">{{ formatTime(task.due_time) }}</span>
              <span v-else class="text-gray-400 dark:text-gray-500">{{ $t('tasks.no_time_set') }}</span>
            </span>
          </div>

          <!-- Status & Category Badges (ALWAYS VISIBLE) -->
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Status Badge -->
            <span 
              class="text-xs px-1.5 py-0.5 rounded-full border font-medium transition-colors"
              :class="task.is_completed
                ? 'bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
                : 'bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50'"
            >
              {{ task.is_completed ? '✓ ' + $t('tasks.completed') : '○ ' + $t('tasks.pending') }}
            </span>

            <!-- Category Badge -->
            <span v-if="categoryName" class="text-xs px-2 py-0.5 rounded-full border font-medium inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/25 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50 flex-shrink-0">
              <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
              </svg>
              {{ categoryName }}
            </span>

            <!-- Overdue Badge -->
            <span v-if="task.is_overdue" class="text-xs px-1.5 py-0.5 rounded-full border font-medium bg-red-50 dark:bg-red-900/25 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50">
              ⚠️ {{ $t('tasks.overdue') }}
            </span>
          </div>

          <!-- HOVER SECTION: Priority & Start Date (Hidden by default) -->
          <div class="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-40">
            <div class="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
              
              <!-- Priority Badge (ON HOVER) -->
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium px-2 py-0.5 rounded-full border inline-flex items-center gap-1 flex-shrink-0" :class="priorityClasses">
                  <span>{{ priorityEmoji }}</span>
                  <span class="capitalize">{{ $t('tasks.' + task.priority) }}</span>
                </span>
              </div>

              <!-- Start Date & Time (ON HOVER) -->
              <div v-if="task.start_date" class="flex items-center gap-2">
                <span 
                  class="text-xs font-medium px-2.5 py-1 rounded-full border transition-colors duration-200 inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50"
                >
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1 4.5 4.5 0 11-4.814 6.98z" />
                  </svg>
                  <span>{{ $t('tasks.startdate') }}: {{ formatDateWithMonth(task.start_date) }}</span>
                  <span v-if="task.start_time" class="font-semibold">{{ formatTime(task.start_time) }}</span>
                  <span v-else class="text-gray-400 dark:text-gray-500">{{ $t('tasks.no_time_set') }}</span>
                </span>
              </div>

              <!-- Created At -->
              <div class="text-xs text-gray-500 dark:text-gray-400 italic flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ $t('common.created_at') }}: {{ timeAgo(task.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Task } from '@/types'

// ─── i18n ───
const { t } = useI18n()

// ─── Props ───
const props = defineProps<{
  task: Task
  viewMode?: 'list' | 'grid'
}>()

// ─── Emits ───
const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'edit', task: Task): void
  (e: 'delete', id: number): void
}>()

// ─── Computed ───
const categoryName = computed(() => props.task.category_name || null)

const priorityClasses = computed(() => {
  const classes: Record<string, string> = {
    high: 'bg-red-50 dark:bg-red-900/25 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50',
    medium: 'bg-yellow-50 dark:bg-yellow-900/25 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50',
    low: 'bg-green-50 dark:bg-green-900/25 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/50',
  }
  return classes[props.task.priority] || 'bg-gray-50 dark:bg-gray-900/25 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800/50'
})

const priorityEmoji = computed(() => {
  const emojis: Record<string, string> = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  }
  return emojis[props.task.priority] || '🟡'
})

// ─── Date Helpers with Month Translation ───
const formatDateWithMonth = (date: string): string => {
  if (!date) return ''
  
  const dateObj = new Date(date)
  const monthIndex = dateObj.getMonth()
  const day = dateObj.getDate()
  const year = dateObj.getFullYear()
  
  // Get translated month name from calendar structure
  const monthName = t(`calendar.months.${monthIndex}`)
  
  return `${monthName} ${day}, ${year}`
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

const timeAgo = (date: string): string => {
  if (!date) return ''
  const now = new Date()
  const past = new Date(date)
  const diff = now.getTime() - past.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return t('common.just_now')
  if (minutes < 60) return `${minutes}m ${t('common.ago')}`
  if (hours < 24) return `${hours}h ${t('common.ago')}`
  if (days < 7) return `${days}d ${t('common.ago')}`
  return formatDateWithMonth(date)
}

// ─── Methods ───
const handleDelete = (): void => {
  if (confirm(t('tasks.deleteConfirmation'))) {
    emit('delete', props.task.id)
  }
}
</script>

<style scoped>
/* ─── Base Card Styles ─── */
.task-card {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.dark .task-card {
  background: #1a1f2e;
  border-color: #374151;
}

.task-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-color: #3b82f6;
}

.dark .task-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
}

.task-card-list {
  width: 100%;
}

.task-card-grid {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ─── Hover Section ─── */
.max-h-0 {
  max-height: 0;
}

.group-hover\:max-h-40:hover {
  max-height: 10rem;
}

/* ─── Line Clamp ─── */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ─── Checkbox Animation ─── */
.peer:checked ~ div {
  animation: checkPop 0.2s ease-in-out;
}

@keyframes checkPop {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* ─── Mobile Responsive ─── */
@media (max-width: 640px) {
  .task-card {
    padding: 0.75rem;
  }
  
  .task-card-grid {
    height: auto;
  }
}
</style>