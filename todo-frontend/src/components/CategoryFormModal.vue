<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div :class="[
      'rounded-lg max-w-md w-full',
      isDark ? 'bg-[#1a1f2e]' : 'bg-white'
    ]">
      <div class="flex items-center justify-between p-6 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
        <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ category ? $t('categories.edit_category') : $t('categories.new_category') }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Category Name -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ $t('categories.category_name') }} <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.name"
            type="text"
            required
            :placeholder="$t('categories.enter_category_name')"
            :class="[
              'w-full px-4 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none',
              isDark
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            ]"
          >
        </div>

        <!-- Category Color -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ $t('categories.color') }}
          </label>
          <div class="flex gap-2 flex-wrap mb-2">
            <button
              v-for="color in colors"
              :key="color"
              type="button"
              @click="formData.color = color"
              class="w-10 h-10 rounded-lg border-2 transition-all hover:scale-105"
              :class="formData.color === color ? 'border-white shadow-lg scale-110' : 'border-transparent'"
              :style="{ backgroundColor: color }"
            />
          </div>
          <input 
            v-model="formData.color"
            type="color"
            class="w-full h-10 rounded-lg cursor-pointer"
            :class="isDark ? 'bg-gray-800' : 'bg-gray-50'"
          >
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4">
          <button 
            type="button"
            @click="$emit('close')"
            :class="[
              'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            ]"
          >
            {{ $t('common.cancel') }}
          </button>
          <button 
            type="submit"
            :disabled="loading || !formData.name.trim()"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ loading ? $t('common.saving') : (category ? $t('common.update') : $t('common.create')) }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useCategoryStore } from '@/stores/categories'
import type { Category, CategoryFormData } from '@/types'

const { t } = useI18n()

const props = defineProps<{
  category?: Category | null
}>()

const emit = defineEmits<{
  close: []
  save: []
}>()

const themeStore = useThemeStore()
const categoryStore = useCategoryStore()

const isDark = computed(() => themeStore.isDark)
const loading = ref(false)

const colors = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
  '#10b981', '#06b6d4', '#6366f1', '#ef4444'
]

const formData = ref<CategoryFormData>({
  name: '',
  color: '#3b82f6',
})

// Watch for category changes
watch(() => props.category, (category) => {
  if (category) {
    formData.value = {
      name: category.name,
      color: category.color
    }
  } else {
    formData.value = {
      name: '',
      color: '#3b82f6'
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    alert(t('categories.category_name_required'))
    return
  }

  loading.value = true
  try {
    let result
    if (props.category) {
      result = await categoryStore.updateCategory(props.category.id, {
        name: formData.value.name.trim(),
        color: formData.value.color
      })
    } else {
      result = await categoryStore.createCategory({
        name: formData.value.name.trim(),
        color: formData.value.color
      })
    }
    
    if (result.success) {
      emit('save')
    } else {
      alert(result.message || t('common.error'))
    }
  } catch (error) {
    console.error('Error saving category:', error)
    alert(t('common.error'))
  } finally {
    loading.value = false
  }
}
</script>