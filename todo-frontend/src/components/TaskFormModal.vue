<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div :class="['rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto', isDark ? 'bg-[#1a1f2e]' : 'bg-white']">
      
      <!-- Header -->
      <div class="sticky top-0 flex items-center justify-between p-6 border-b z-10" :class="isDark ? 'border-gray-700 bg-[#1a1f2e]' : 'border-gray-200 bg-white'">
        <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ task ? $t('tasks.editTask') : $t('tasks.createTask') }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4" @input="validateOnInput">
        
        <!-- Task Title -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">{{ $t('tasks.taskTitle') }} </label>
          <input 
            v-model="formData.title" 
            type="text" 
            class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            :class="{ 'border-red-500 dark:border-red-400': titleError }"
            :placeholder="$t('tasks.enterTaskTitle')"
          >
          <FormError :message="titleError" />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ $t('tasks.description') }}
            <span v-if="shouldShowDescriptionWarning" class="text-red-500">*</span>
          </label>
          <textarea 
            v-model="formData.description" 
            rows="3" 
            class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            :class="{ 'border-red-500 dark:border-red-400': descriptionError }"
            :placeholder="$t('tasks.enterDescription')"
          ></textarea>
          <FormError :message="descriptionError" />
          <!-- Warning for High/Urgent priority without description -->
          <div v-if="shouldShowDescriptionWarning && !hasDescription" class="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
            <p class="text-xs text-yellow-700 dark:text-yellow-300">
              ⚠️ {{ formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1) }} {{ $t('tasks.priority') }} {{ $t('tasks.tasks') }} {{ $t('tasks.description') }}
            </p>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $t('validation.max') }} 1000 {{ $t('validation.minLength') }}</p>
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">{{ $t('tasks.priority') }}</label>
          <select 
            v-model="formData.priority" 
            class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="low">{{ $t('tasks.low') }}</option>
            <option value="medium">{{ $t('tasks.medium') }}</option>
            <option value="high">{{ $t('tasks.high') }}</option>
            <option value="urgent">{{ $t('common.error') }}</option>
          </select>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">{{ $t('tasks.category') }}</label>
          <div class="flex gap-2">
            <select 
              v-model="formData.category_id" 
              class="flex-1 px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">{{ $t('tasks.allcategories') }}</option>
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
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">{{ $t('tasks.startdate') }} & {{ $t('tasks.starttime') }}</label>
          <input 
            v-model="formData.start_datetime" 
            type="datetime-local" 
            class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            :class="{ 'border-red-500 dark:border-red-400': startDateError }"
            :min="today + 'T00:00'"
          >
          <FormError :message="startDateError" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1"></p>
        </div>

        <!-- Due Date & Time -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ $t('tasks.dueDate') }} & {{ $t('tasks.dueTime') }} *
            <span v-if="formData.priority === 'urgent'" class="text-red-500 text-xs ml-1">(48-hour rule)</span>
          </label>
          <input 
            v-model="formData.due_datetime" 
            type="datetime-local" 
            class="w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            :class="{ 'border-red-500 dark:border-red-400': dueDateError }"
            :min="formData.start_datetime || (today + 'T00:00')"
          >
          <FormError :message="dueDateError" />
          
          <!-- Urgent task deadline hint -->
          <div v-if="formData.priority === 'urgent'" :class="['mt-2 p-2 rounded border', hoursUntilDeadline !== null && hoursUntilDeadline <= 48 && hoursUntilDeadline > 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700']">
            <p :class="['text-xs', hoursUntilDeadline !== null && hoursUntilDeadline <= 48 && hoursUntilDeadline > 0 ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300']">
              ⏰ {{ urgentDeadlineMessage }}
            </p>
          </div>
          
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1"> 
            <span v-if="formData.priority === 'urgent'" class="block text-orange-600 dark:text-orange-400">Urgent tasks deadline: within 48 hours</span>
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {{ $t('common.cancel') }}
          </button>
          <button 
            type="submit" 
            :disabled="loading" 
            class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? $t('common.loading') : (task ? $t('tasks.updateTask') : $t('tasks.createTask')) }}
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
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useTaskStore } from '@/stores/tasks'
import { useCategoryStore } from '@/stores/categories'
import { useFormValidation } from '@/composables/useFormValidation'
import { 
  calculateHoursUntilDeadline, 
  getUrgentDeadlineHint,
  shouldShowDescriptionWarning as checkShouldShowDescriptionWarning
} from '@/utils/validation'
import FormError from './FormError.vue'
import CategoryModal from './CategoryModal.vue'

// ─── i18n ───
const { t } = useI18n()

// ─── Props ───
const props = defineProps<{ 
  task?: any 
}>()

// ─── Emits ───
const emit = defineEmits(['close', 'save'])

// ─── Stores & Composables ───
const themeStore = useThemeStore()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()
const validation = useFormValidation()

const isDark = computed(() => themeStore.isDark)
const loading = ref(false)
const showCategoryModal = ref(false)

// ─── Form Data ───
const formData = ref({
  title: '',
  description: '',
  priority: 'medium',
  category_id: '',
  start_datetime: '',
  due_datetime: '',
})

// ─── Computed validation errors ───
const titleError = computed(() => validation.getError('title'))
const descriptionError = computed(() => validation.getError('description'))
const dueDateError = computed(() => validation.getError('due_date'))
const startDateError = computed(() => validation.getError('start_date'))

// ─── Computed warnings and helpers ───
const urgentDeadlineHint = computed(() => getUrgentDeadlineHint())
const hoursUntilDeadline = computed(() => {
  if (!formData.value.due_datetime) return null
  const dueDate = formData.value.due_datetime.split('T')[0]
  return calculateHoursUntilDeadline(dueDate)
})

const shouldShowDescriptionWarning = computed(() => {
  return checkShouldShowDescriptionWarning(formData.value.priority)
})

const hasDescription = computed(() => {
  return formData.value.description && formData.value.description.trim() !== ''
})

const urgentDeadlineMessage = computed(() => {
  if (formData.value.priority !== 'urgent') return ''
  if (hoursUntilDeadline.value === null) return 'Please set a deadline'
  if (hoursUntilDeadline.value > 48) return `Must be within 48 hours (Deadline hint: ${urgentDeadlineHint.value})`
  if (hoursUntilDeadline.value > 0) return `${hoursUntilDeadline.value} hours until deadline`
  return 'Deadline has passed!'
})

// ─── Today's date for min attribute ───
const today = new Date().toISOString().split('T')[0]

// ─── Initialize form with task data ───
const initializeForm = () => {
  if (props.task) {
    let start_datetime = ''
    if (props.task.start_date) {
      const startTime = props.task.start_time || '00:00'
      start_datetime = `${props.task.start_date}T${startTime}`
    }

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
  validation.clearErrors()
}

// ─── Watch for task changes ───
watch(() => props.task, () => {
  initializeForm()
}, { immediate: true })

// ─── Real-time validation with advanced business rules ───
const validateOnInput = () => {
  const startDate = formData.value.start_datetime ? formData.value.start_datetime.split('T')[0] : ''
  const dueDate = formData.value.due_datetime ? formData.value.due_datetime.split('T')[0] : ''
  
  validation.validateCreateTask({
    title: formData.value.title,
    description: formData.value.description,
    priority: formData.value.priority,
    due_date: dueDate,
    start_date: startDate,
  })
}

// ─── Handle Submit ───
const handleSubmit = async () => {
  // ─── Comprehensive validation with all business rules ───
  const startDate = formData.value.start_datetime ? formData.value.start_datetime.split('T')[0] : ''
  const dueDate = formData.value.due_datetime ? formData.value.due_datetime.split('T')[0] : ''
  
  const taskValidation = {
    title: formData.value.title,
    description: formData.value.description,
    priority: formData.value.priority,
    due_date: dueDate,
    start_date: startDate,
    start_time: formData.value.start_datetime ? formData.value.start_datetime.split('T')[1]?.substring(0, 5) : '',
    due_time: formData.value.due_datetime ? formData.value.due_datetime.split('T')[1]?.substring(0, 5) : '',
  }

  if (!validation.validateCreateTask(taskValidation)) {
    return
  }

  loading.value = true
  
  try {
    // ─── Parse datetime fields ───
    let start_date = null
    let start_time = null
    if (formData.value.start_datetime) {
      const parts = formData.value.start_datetime.split('T')
      start_date = parts[0]
      start_time = parts[1] ? parts[1].substring(0, 5) : null
    }

    let due_date = null
    let due_time = null
    if (formData.value.due_datetime) {
      const parts = formData.value.due_datetime.split('T')
      due_date = parts[0]
      due_time = parts[1] ? parts[1].substring(0, 5) : null
    }

    // ─── Build clean data object ───
    const cleanedData: any = {
      title: formData.value.title.trim(),
      description: formData.value.description?.trim() || null,
      priority: formData.value.priority,
      category_id: formData.value.category_id || null,
      start_date: start_date,
      due_date: due_date,
    }

    if (start_time) {
      cleanedData.start_time = start_time
    }
    if (due_time) {
      cleanedData.due_time = due_time
    }

    let result
    if (props.task?.id) {
      result = await taskStore.updateTask(props.task.id, cleanedData)
    } else {
      result = await taskStore.createTask(cleanedData)
    }
    
    if (!result || !result.success) {
      return
    }
    
    emit('save')
    emit('close')
    
  } catch (error: any) {
    console.error('Error saving task:', error)
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