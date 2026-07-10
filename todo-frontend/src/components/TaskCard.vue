<template>
  <div
    class="card card-hover p-4 group transition-all duration-300"
    :class="task.is_completed ? 'opacity-60' : ''"
  >
    <div class="flex items-start gap-3">
      <!-- Checkbox -->
      <div class="pt-1 flex-shrink-0">
        <label class="relative cursor-pointer">
          <input
            type="checkbox"
            :checked="task.is_completed"
            @change="emit('toggle', task.id)"
            class="sr-only"
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
      <div class="flex-1 min-w-0">
        <div class="space-y-2">
          <!-- Row 1: Title with Edit/Delete Buttons -->
          <div class="flex items-start justify-between gap-3">
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-gray-50 break-words leading-tight flex-1"
              :class="{ 'line-through text-gray-400 dark:text-gray-600': task.is_completed }"
            >
              {{ task.title }}
            </h3>
            
            <!-- Action Buttons (Hidden by default, visible on group hover) -->
            <div class="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                @click="emit('edit', task)"
                class="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-150"
                title="Edit task"
                aria-label="Edit task"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="handleDelete"
                class="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150"
                title="Delete task"
                aria-label="Delete task"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Row 2: Description (1 line) -->
          <p v-if="task.description" class="text-xs text-gray-600 dark:text-gray-300 break-words line-clamp-1">
            {{ task.description }}
          </p>

          <!-- Row 3: Due Date & Time (ALWAYS VISIBLE - PRIMARY) -->
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
              <span>{{ formatDate(task.due_date) }}</span>
              <span v-if="task.due_time" class="font-semibold">{{ formatTime(task.due_time) }}</span>
            </span>
          </div>

          <!-- Row 4: Status & Category & Priority (PROFESSIONAL ORDER) -->
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Status Badge (Done/Pending) -->
            <span 
              class="text-xs px-1.5 py-0.5 rounded-full border font-medium transition-colors"
              :class="task.is_completed
                ? 'bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
                : 'bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50'"
            >
              {{ task.is_completed ? '✓ Done' : '○ Pending' }}
            </span>

            <!-- Category Badge (Always Show if assigned) -->
            <span v-if="categoryName" class="text-xs px-2 py-0.5 rounded-full border font-medium inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/25 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50 flex-shrink-0">
              <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
              </svg>
              {{ categoryName }}
            </span>

            <!-- Overdue Badge (if applicable) -->
            <span v-if="task.is_overdue" class="text-xs px-1.5 py-0.5 rounded-full border font-medium bg-red-50 dark:bg-red-900/25 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50">
              ⚠️ Overdue
            </span>
          </div>

          <!-- Row 5: Secondary Details (Hidden by default, visible on group hover) -->
          <div class="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 overflow-hidden">
            <div class="overflow-hidden min-h-0 space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <!-- Priority & Start Date Row -->
              <div class="flex items-center gap-2 flex-wrap">
                <!-- Priority Badge -->
                <span class="text-xs font-medium px-2 py-0.5 rounded-full border inline-flex items-center gap-1 flex-shrink-0" :class="priorityClasses">
                  <span>{{ priorityEmoji }}</span>
                  <span class="capitalize">{{ task.priority }}</span>
                </span>

                <!-- Start Date Badge -->
                <span v-if="task.start_date" class="text-xs font-medium px-2 py-0.5 rounded-full border inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 flex-shrink-0">
                  <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  {{ formatDate(task.start_date) }}
                </span>
              </div>

              <!-- Time Ago -->
              <div class="text-xs text-gray-500 dark:text-gray-400 italic">
                Created {{ timeAgo(task.created_at) }}
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
import type { Task } from '@/types'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'edit', task: Task): void
  (e: 'delete', id: number): void
}>()

const categoryName = computed(() => props.task.category_name || null)

const priorityClasses = computed(() => {
  const classes: Record<string, string> = {
    high: 'bg-red-50 dark:bg-red-900/25 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50',
    medium: 'bg-yellow-50 dark:bg-yellow-900/25 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50',
    low: 'bg-green-50 dark:bg-green-900/25 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/50',
    urgent: 'bg-red-50 dark:bg-red-900/25 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50',
  }
  return classes[props.task.priority] || 'bg-gray-50 dark:bg-gray-900/25 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800/50'
})

const priorityEmoji = computed(() => {
  const emojis: Record<string, string> = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
    urgent: '🔴',
  }
  return emojis[props.task.priority] || '🟡'
})

const formatDate = (date: string): string => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
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
  const now = new Date()
  const past = new Date(date)
  const diff = now.getTime() - past.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

const handleDelete = (): void => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete', props.task.id)
  }
}
</script>
