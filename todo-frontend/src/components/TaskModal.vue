<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleClose"
        ></div>

        <div class="relative w-full max-w-md animate-scale-in">
          <div class="card p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-bold gradient-text">
                  {{ isEditing ? 'Edit Task' : 'Create New Task' }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ isEditing ? 'Update your task details' : 'Add a new task to your list' }}
                </p>
              </div>
              <button
                @click="handleClose"
                class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Title <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  required
                  class="input-field"
                  :class="{ 'input-field-error': errors.title }"
                  placeholder="Enter task title..."
                  :disabled="isLoading"
                />
                <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Description
                </label>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  class="input-field resize-none"
                  placeholder="Enter task description (optional)..."
                  :disabled="isLoading"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="priority in priorities"
                    :key="priority.value"
                    type="button"
                    @click="formData.priority = priority.value"
                    class="py-2.5 rounded-xl text-sm font-medium transition-all"
                    :class="formData.priority === priority.value
                      ? priority.activeClass
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
                  >
                    {{ priority.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Due Date
                </label>
                <input
                  v-model="formData.due_date"
                  type="date"
                  class="input-field"
                  :disabled="isLoading"
                  :min="today"
                />
              </div>

              <div class="flex gap-3 pt-2">
                <button
                  type="button"
                  @click="handleClose"
                  class="btn-secondary flex-1"
                  :disabled="isLoading"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn-primary flex-1"
                  :disabled="!isValid || isLoading"
                >
                  <span v-if="isLoading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  {{ isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Task, TaskFormData } from '@/types'

const props = defineProps<{
  show: boolean
  task?: Task | null
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: TaskFormData): void
}>()

const today = new Date().toISOString().split('T')[0]

const priorities = [
  { value: 'low' as const, label: '🟢 Low', activeClass: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' },
  { value: 'medium' as const, label: '🟡 Medium', activeClass: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25' },
  { value: 'high' as const, label: '🔴 High', activeClass: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25' },
]

const formData = ref<TaskFormData>({
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
})

const errors = ref<Record<string, string>>({})

const isEditing = computed(() => !!props.task)
const isValid = computed(() => formData.value.title.trim().length > 0)

watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.value = {
      title: newTask.title,
      description: newTask.description || '',
      priority: newTask.priority,
      due_date: newTask.due_date || '',
    }
  } else {
    formData.value = {
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
    }
  }
  errors.value = {}
}, { immediate: true })

const handleSubmit = () => {
  errors.value = {}
  
  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required'
    return
  }

  emit('save', {
    title: formData.value.title.trim(),
    description: formData.value.description || undefined,
    priority: formData.value.priority,
    due_date: formData.value.due_date || undefined,
  })
}

const handleClose = () => {
  emit('close')
}
</script><template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleClose"
        ></div>

        <div class="relative w-full max-w-md animate-scale-in">
          <div class="card p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-bold gradient-text">
                  {{ isEditing ? 'Edit Task' : 'Create New Task' }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ isEditing ? 'Update your task details' : 'Add a new task to your list' }}
                </p>
              </div>
              <button
                @click="handleClose"
                class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Title <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  required
                  class="input-field"
                  :class="{ 'input-field-error': errors.title }"
                  placeholder="Enter task title..."
                  :disabled="isLoading"
                />
                <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Description
                </label>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  class="input-field resize-none"
                  placeholder="Enter task description (optional)..."
                  :disabled="isLoading"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="priority in priorities"
                    :key="priority.value"
                    type="button"
                    @click="formData.priority = priority.value"
                    class="py-2.5 rounded-xl text-sm font-medium transition-all"
                    :class="formData.priority === priority.value
                      ? priority.activeClass
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
                  >
                    {{ priority.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Start Date
                </label>
                <input
                  v-model="formData.start_date"
                  type="date"
                  class="input-field"
                  :disabled="isLoading"
                  :min="today"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Due Date
                </label>
                <input
                  v-model="formData.due_date"
                  type="date"
                  class="input-field"
                  :disabled="isLoading"
                  :min="formData.start_date || today"
                />
                <p v-if="errors.due_date" class="text-red-500 text-sm mt-1">{{ errors.due_date }}</p>
              </div>

              <div class="flex gap-3 pt-2">
                <button
                  type="button"
                  @click="handleClose"
                  class="btn-secondary flex-1"
                  :disabled="isLoading"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn-primary flex-1"
                  :disabled="!isValid || isLoading"
                >
                  <span v-if="isLoading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  {{ isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Task, TaskFormData } from '@/types'

const props = defineProps<{
  show: boolean
  task?: Task | null
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: TaskFormData): void
}>()

const today = new Date().toISOString().split('T')[0]

const priorities = [
  { value: 'low' as const, label: '🟢 Low', activeClass: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' },
  { value: 'medium' as const, label: '🟡 Medium', activeClass: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25' },
  { value: 'high' as const, label: '🔴 High', activeClass: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25' },
]

// 💡 3. formData ውስጥ start_date ተጨምሯል
const formData = ref<TaskFormData>({
  title: '',
  description: '',
  priority: 'medium',
  start_date: '',
  due_date: '',
})

const errors = ref<Record<string, string>>({})

const isEditing = computed(() => !!props.task)
const isValid = computed(() => formData.value.title.trim().length > 0)

// 💡 4. ታስክ ኤዲት ሲደረግ start_date እንዲሞላ ተደርጓል
watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.value = {
      title: newTask.title,
      description: newTask.description || '',
      priority: newTask.priority,
      start_date: newTask.start_date || '',
      due_date: newTask.due_date || '',
    }
  } else {
    formData.value = {
      title: '',
      description: '',
      priority: 'medium',
      start_date: '',
      due_date: '',
    }
  }
  errors.value = {}
}, { immediate: true })

const handleSubmit = () => {
  errors.value = {}
  
  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required'
    return
  }

  // 💡 5. የ Due date ቀን ከ Start date ቀድሞ ከመጣ በፍሮንትአንድ መከላከያ
  if (formData.value.start_date && formData.value.due_date && formData.value.due_date < formData.value.start_date) {
    errors.value.due_date = 'Due date cannot be before start date'
    return
  }

  // 💡 6. ለአባይ ኤፒአይ (API) እንዲላክ ተጨምሯል
  emit('save', {
    title: formData.value.title.trim(),
    description: formData.value.description || undefined,
    priority: formData.value.priority,
    start_date: formData.value.start_date || undefined,
    due_date: formData.value.due_date || undefined,
  })
}

const handleClose = () => {
  emit('close')
}
</script>