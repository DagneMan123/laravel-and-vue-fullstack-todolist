<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div :class="[
      'rounded-lg max-w-md w-full',
      isDark ? 'bg-[#1a1f2e]' : 'bg-white'
    ]">
      <div class="flex items-center justify-between p-6 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
        <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ category ? 'Edit Category' : 'New Category' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
            Category Name *
          </label>
          <input 
            v-model="formData.name"
            type="text"
            required
            :class="[
              'w-full px-4 py-2 rounded-lg border transition-colors',
              isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
            ]"
          >
        </div>

        <div>
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
            Color
          </label>
          <div class="flex gap-2 flex-wrap mb-2">
            <button
              v-for="color in colors"
              :key="color"
              type="button"
              @click="formData.color = color"
              class="w-10 h-10 rounded-lg border-2 transition-all"
              :class="formData.color === color ? 'border-white shadow-lg' : 'border-transparent'"
              :style="{ backgroundColor: color }"
            />
          </div>
          <input 
            v-model="formData.color"
            type="color"
            class="w-full h-10 rounded-lg cursor-pointer"
          >
        </div>

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
            Cancel
          </button>
          <button 
            type="submit"
            :disabled="loading"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useCategoryStore } from '@/stores/categories'
import type { Category, CategoryFormData } from '@/types'

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

const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1']

const formData = ref<CategoryFormData>({
  name: props.category?.name || '',
  color: props.category?.color || '#3b82f6',
})

const handleSubmit = async () => {
  loading.value = true
  try {
    if (props.category) {
      await categoryStore.updateCategory(props.category.id, formData.value)
    } else {
      await categoryStore.createCategory(formData.value)
    }
    emit('save')
  } finally {
    loading.value = false
  }
}
</script>
