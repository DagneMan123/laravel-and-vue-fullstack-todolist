<template>
  <AppLayout>
    <div class="p-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Categories</h1>
          <p class="mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Organize your tasks with custom categories</p>
        </div>
        <button 
          @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Category
        </button>
      </div>

      <div v-if="categoryStore.categories.length === 0" class="text-center py-12">
        <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">No categories yet.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="category in categoryStore.categories" 
          :key="category.id"
          :class="[
            'p-6 rounded-lg border transition-all hover:shadow group',
            isDark 
              ? 'bg-[#1a1f2e] border-gray-700'
              : 'bg-white border-gray-200'
          ]"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: category.color }" />
              <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ category.name }}
              </h3>
            </div>
            <span class="text-xs font-medium px-2 py-1 rounded-full" :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'">
              {{ category.tasks_count }} tasks
            </span>
          </div>

          <div class="flex gap-2">
            <button 
              @click="editCategory(category)"
              class="flex-1 px-3 py-2 bg-blue-600/20 text-blue-600 rounded-lg hover:bg-blue-600/30 text-sm font-medium transition-colors"
            >
              Edit
            </button>
            <button 
              @click="deleteCategory(category.id)"
              class="flex-1 px-3 py-2 bg-red-600/20 text-red-600 rounded-lg hover:bg-red-600/30 text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <CategoryFormModal 
        v-if="showCreateModal"
        :category="editingCategory"
        @close="showCreateModal = false"
        @save="handleSave"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useCategoryStore } from '@/stores/categories'
import type { Category } from '@/types'
import AppLayout from '@/layouts/AppLayout.vue'
import CategoryFormModal from '@/components/CategoryFormModal.vue'

const themeStore = useThemeStore()
const categoryStore = useCategoryStore()

const isDark = computed(() => themeStore.isDark)
const showCreateModal = ref(false)
const editingCategory = ref<Category | null>(null)

const editCategory = (category: Category) => {
  editingCategory.value = category
  showCreateModal.value = true
}

const deleteCategory = async (id: number) => {
  if (confirm('Delete this category?')) {
    await categoryStore.deleteCategory(id)
  }
}

const handleSave = async () => {
  editingCategory.value = null
  showCreateModal.value = false
  await categoryStore.fetchCategories()
}

onMounted(async () => {
  await categoryStore.fetchCategories()
})
</script>
