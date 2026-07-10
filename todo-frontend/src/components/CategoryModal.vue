<template>
  <div class="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
    <div class="bg-white dark:bg-[#1a1f2e] p-6 rounded-lg w-full max-w-sm shadow-xl">
      <h3 class="text-xl font-bold mb-6 dark:text-white">New Category</h3>
      
      <!-- Category Name -->
      <label class="block text-sm font-medium mb-2 dark:text-gray-300">Category Name *</label>
      <input v-model="name" placeholder="e.g., Work, Personal, Shopping" 
             class="w-full p-3 border rounded-lg mb-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
      
      <!-- Category Color -->
      <label class="block text-sm font-medium mb-3 dark:text-gray-300">Category Color</label>
      <div class="flex flex-wrap gap-3 mb-8">
        <button v-for="c in colors" :key="c" @click="selectedColor = c"
                :class="['w-10 h-10 rounded-lg border-4 transition-all', selectedColor === c ? 'border-gray-400 scale-110' : 'border-transparent']"
                :style="{ backgroundColor: c }"></button>
      </div>

      <div class="flex gap-3">
        <button @click="$emit('close')" class="flex-1 p-3 bg-gray-200 dark:bg-gray-700 rounded-lg dark:text-white font-medium">Cancel</button>
        <button @click="save" class="flex-1 p-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Add Category</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCategoryStore } from '@/stores/categories'

const emit = defineEmits(['close', 'created'])
const categoryStore = useCategoryStore()

const name = ref('')
const selectedColor = ref('#ef4444') // Default color (Red)
const colors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
]

const save = async () => {
  if (name.value.trim()) {
    await categoryStore.createCategory({ 
      name: name.value, 
      color: selectedColor.value // የቀለም ቫልዩን ወደ Backend ይልካል
    })
    emit('created')
    emit('close')
  }
}
</script>