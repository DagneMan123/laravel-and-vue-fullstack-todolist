<template>
  <div class="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
    <div class="bg-white dark:bg-[#1a1f2e] p-6 rounded-lg w-full max-w-sm shadow-xl">
      <h3 class="text-xl font-bold mb-6 dark:text-white">
        {{ $t('categories.new_category') }}
      </h3>
      
      <!-- Category Name -->
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">
        {{ $t('categories.category_name') }} 
      </label>
      <input 
        v-model="name" 
        :placeholder="$t('categories.category_name_required')" 
        class="w-full p-3 border rounded-lg mb-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
      >
      
      <!-- Category Color -->
      <label class="block text-sm font-medium mb-3 dark:text-gray-300">
        {{ $t('categories.color') }}
      </label>
      <div class="flex flex-wrap gap-3 mb-8">
        <button 
          v-for="c in colors" 
          :key="c" 
          @click="selectedColor = c"
          :class="['w-10 h-10 rounded-lg border-4 transition-all', selectedColor === c ? 'border-gray-400 scale-110' : 'border-transparent']"
          :style="{ backgroundColor: c }"
        ></button>
      </div>

      <div class="flex gap-3">
        <button 
          @click="$emit('close')" 
          class="flex-1 p-3 bg-gray-200 dark:bg-gray-700 rounded-lg dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {{ $t('common.cancel') }}
        </button>
        <button 
          @click="save" 
          :disabled="!name.trim() || isLoading"
          class="flex-1 p-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          {{ isLoading ? $t('common.saving') : $t('categories.add_category') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCategoryStore } from '@/stores/categories'

const { t } = useI18n()

const emit = defineEmits<{
  close: []
  created: []
}>()

const categoryStore = useCategoryStore()

const name = ref('')
const isLoading = ref(false)
const selectedColor = ref('#ef4444') // Default color (Red)

const colors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
]

const save = async () => {
  if (!name.value.trim()) {
    alert(t('categories.category_name_required'))
    return
  }

  isLoading.value = true
  try {
    const result = await categoryStore.createCategory({ 
      name: name.value.trim(), 
      color: selectedColor.value
    })
    
    if (result.success) {
      emit('created')
      emit('close')
    } else {
      alert(result.message || t('common.error'))
    }
  } catch (error) {
    console.error('Error creating category:', error)
    alert(t('common.error'))
  } finally {
    isLoading.value = false
  }
}
</script>