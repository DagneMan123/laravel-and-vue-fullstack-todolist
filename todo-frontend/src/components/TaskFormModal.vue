<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div :class="['rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto', isDark ? 'bg-[#1a1f2e]' : 'bg-white']">
      
      <!-- Header -->
      <div class="sticky top-0 flex items-center justify-between p-6 border-b z-10" :class="isDark ? 'border-gray-700 bg-[#1a1f2e]' : 'border-gray-200 bg-white'">
        <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ task ? 'Edit Task' : 'New Task' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        
        <!-- Task Title -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">Task Title *</label>
          <input v-model="formData.title" type="text" required class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">Description</label>
          <textarea v-model="formData.description" rows="2" class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">Priority</label>
          <select v-model="formData.priority" class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">Category</label>
          <div class="flex gap-2">
            <select v-model="formData.category_id" class="flex-1 px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">No Category</option>
              <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <button type="button" @click="showCategoryModal = true" class="px-4 bg-gray-200 dark:bg-gray-700 rounded-lg">+</button>
          </div>
        </div>

        <!-- Start Date -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">Start Date</label>
          <input v-model="formData.start_date" type="date" class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <!-- Combined Due Date & Time -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">Due Date & Time</label>
          <input v-model="formData.due_datetime" type="datetime-local" class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button type="button" @click="$emit('close')" class="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">Cancel</button>
          <button type="submit" :disabled="loading" class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Task</button>
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
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useTaskStore } from '@/stores/tasks'
import { useCategoryStore } from '@/stores/categories'
import CategoryModal from './CategoryModal.vue'

const props = defineProps<{ task?: any }>()
const emit = defineEmits(['close', 'save'])
const themeStore = useThemeStore()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()

const isDark = computed(() => themeStore.isDark)
const loading = ref(false)
const showCategoryModal = ref(false)

const formData = ref({
  title: props.task?.title || '',
  description: props.task?.description || '',
  priority: props.task?.priority || 'medium',
  category_id: props.task?.category_id || '',
  start_date: props.task?.start_date || '',
  due_datetime: (() => {
    if (props.task?.due_date) {
      const date = props.task.due_date
      const time = props.task.due_time ? props.task.due_time : '00:00'
      return `${date}T${time}`
    }
    return ''
  })(),
})

const handleSubmit = async () => {
  loading.value = true
  try {
    // Parse datetime-local into separate date and time
    let due_date = null
    let due_time = null
    
    if (formData.value.due_datetime) {
      // datetime-local format is: YYYY-MM-DDTHH:mm
      const parts = formData.value.due_datetime.split('T')
      due_date = parts[0] // YYYY-MM-DD
      due_time = parts[1] || '00:00' // HH:mm
    }

    const cleanedData = {
      title: formData.value.title,
      description: formData.value.description || null,
      priority: formData.value.priority,
      category_id: formData.value.category_id || null,
      start_date: formData.value.start_date || null,
      due_date,
      due_time,
    }
    
    console.log('Sending task data:', cleanedData)
    
    const result = props.task 
      ? await taskStore.updateTask(props.task.id, cleanedData)
      : await taskStore.createTask(cleanedData)
    
    if (!result.success) {
      console.error('Task save failed:', taskStore.error)
      alert(`Error: ${taskStore.error}`)
      return
    }
    
    emit('save')
    emit('close')
  } finally {
    loading.value = false
  }
}

onMounted(() => categoryStore.fetchCategories())
</script>