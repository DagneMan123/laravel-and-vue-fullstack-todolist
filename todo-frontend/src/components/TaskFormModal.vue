<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div :class="['rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto', isDark ? 'bg-[#1a1f2e]' : 'bg-white']">
      
      <!-- Header -->
      <div class="sticky top-0 flex items-center justify-between p-6 border-b z-10" :class="isDark ? 'border-gray-700 bg-[#1a1f2e]' : 'border-gray-200 bg-white'">
        <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ task ? 'Edit Task' : 'New Task' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        
        <!-- Task Title -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">Task Title *</label>
          <input 
            v-model="formData.title" 
            type="text" 
            required 
            class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">Description</label>
          <textarea 
            v-model="formData.description" 
            rows="3" 
            class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">Priority</label>
          <select 
            v-model="formData.priority" 
            class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">Category</label>
          <div class="flex gap-2">
            <select 
              v-model="formData.category_id" 
              class="flex-1 px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">No Category</option>
              <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <button 
              type="button" 
              @click="showCategoryModal = true" 
              class="px-4 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              +
            </button>
          </div>
        </div>

        <!-- Start Date & Time -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">Start Date & Time</label>
          <input 
            v-model="formData.start_datetime" 
            type="datetime-local" 
            class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional - When the task begins</p>
        </div>

        <!-- Due Date & Time -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">Due Date & Time</label>
          <input 
            v-model="formData.due_datetime" 
            type="datetime-local" 
            class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            :min="formData.start_datetime || undefined"
          >
          <p v-if="errors.due_date" class="text-red-500 text-sm mt-1">{{ errors.due_date }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="loading" 
            class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : 'Save Task' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Category Modal -->
    <CategoryModal 
      v-if="showCategoryModal" 
      @close="showCategoryModal = false" 
      @created="categoryStore.fetchCategories()" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useTaskStore } from '@/stores/tasks'
import { useCategoryStore } from '@/stores/categories'
import CategoryModal from './CategoryModal.vue'

// ─── Props ───
const props = defineProps<{ 
  task?: any 
}>()

// ─── Emits ───
const emit = defineEmits(['close', 'save'])

// ─── Stores ───
const themeStore = useThemeStore()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()

const isDark = computed(() => themeStore.isDark)
const loading = ref(false)
const showCategoryModal = ref(false)
const errors = ref<Record<string, string>>({})

// ─── Form Data ───
const formData = ref({
  title: '',
  description: '',
  priority: 'medium',
  category_id: '',
  start_datetime: '',
  due_datetime: '',
})

// ─── Today's date for min attribute ───
const today = new Date().toISOString().split('T')[0]

// ─── Initialize form with task data ───
const initializeForm = () => {
  if (props.task) {
    // Combine start date and time
    let start_datetime = ''
    if (props.task.start_date) {
      const startTime = props.task.start_time || '00:00'
      start_datetime = `${props.task.start_date}T${startTime}`
    }

    // Combine due date and time
    let due_datetime = ''
    if (props.task.due_date) {
      const dueTime = props.task.due_time && props.task.due_time !== 'null' ? props.task.due_time : '00:00'
      due_datetime = `${props.task.due_date}T${dueTime}`
    }

    formData.value = {
      title: props.task.title || '',
      description: props.task.description || '',
      priority: props.task.priority || 'medium',
      category_id: props.task.category_id || '',
      start_datetime: start_datetime,
      due_datetime: due_datetime,
    }
  } else {
    formData.value = {
      title: '',
      description: '',
      priority: 'medium',
      category_id: '',
      start_datetime: '',
      due_datetime: '',
    }
  }
  errors.value = {}
}

// ─── Watch for task changes ───
watch(() => props.task, () => {
  initializeForm()
}, { immediate: true })

// ─── Handle Submit ───
const handleSubmit = async () => {
  // ─── Clear errors ───
  errors.value = {}
  
  // ─── Validation ───
  if (!formData.value.title.trim()) {
    errors.value.title = 'Please enter a task title'
    return
  }

  // ─── Parse start datetime ───
  let start_date = null
  let start_time = null
  if (formData.value.start_datetime) {
    const parts = formData.value.start_datetime.split('T')
    start_date = parts[0]
    // Extract HH:MM from datetime-local (format: HH:MM)
    start_time = parts[1] ? parts[1].substring(0, 5) : null
  }

  // ─── Parse due datetime ───
  let due_date = null
  let due_time = null
  if (formData.value.due_datetime) {
    const parts = formData.value.due_datetime.split('T')
    due_date = parts[0]
    // Extract HH:MM from datetime-local (format: HH:MM)
    due_time = parts[1] ? parts[1].substring(0, 5) : null
  }

  // ─── Validate due date is required ───
  if (!due_date) {
    errors.value.due_date = 'Due date is required'
    return
  }

  // ─── Validate due date cannot be before start date ───
  if (start_date && due_date && due_date < start_date) {
    errors.value.due_date = 'Due date cannot be before start date'
    return
  }

  loading.value = true
  
  try {
    // ─── Build clean data object ───
    const cleanedData: any = {
      title: formData.value.title.trim(),
      description: formData.value.description?.trim() || null,
      priority: formData.value.priority,
      category_id: formData.value.category_id || null,
      start_date: start_date,
      due_date: due_date,
    }

    // Only add times if they have values (not null)
    if (start_time) {
      cleanedData.start_time = start_time
    }
    if (due_time) {
      cleanedData.due_time = due_time
    }

    console.log('Sending task data:', cleanedData)
    
    // ─── Save task ───
    let result
    if (props.task?.id) {
      result = await taskStore.updateTask(props.task.id, cleanedData)
    } else {
      result = await taskStore.createTask(cleanedData)
    }
    
    // ─── Check result ───
    if (!result || !result.success) {
      console.error('Task save failed:', taskStore.error)
      alert(`Error: ${taskStore.error || 'Failed to save task'}`)
      return
    }
    
    // ─── Success ───
    emit('save')
    emit('close')
    
  } catch (error: any) {
    console.error('Error saving task:', error)
    alert(`Error: ${error.message || 'Something went wrong'}`)
  } finally {
    loading.value = false
  }
}

// ─── Lifecycle ───
onMounted(() => {
  initializeForm()
  categoryStore.fetchCategories()
})
</script>