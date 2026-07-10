import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category, CategoryFormData, PaginatedResponse } from '@/types'
import api from '@/services/api'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const pagination = ref({
    current_page: 1,
    total: 0,
    per_page: 50,
    last_page: 1,
  })
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | undefined>(undefined)

  const filters = ref({
    search: '',
    sort_by: 'created_at',
    sort_direction: 'desc',
  })

  async function fetchCategories(page: number = 1): Promise<void> {
    isLoading.value = true
    error.value = undefined

    try {
      const params = {
        page,
        per_page: pagination.value.per_page,
        search: filters.value.search,
        sort_by: filters.value.sort_by,
        sort_direction: filters.value.sort_direction,
      }

      const response = await api.get<PaginatedResponse<Category>>('/categories', { params })
      categories.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
        last_page: response.data.last_page,
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch categories'
      console.error('Error fetching categories:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createCategory(categoryData: CategoryFormData): Promise<{ success: boolean; category?: Category; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      const response = await api.post<{ category: Category }>('/categories', categoryData)
      categories.value.unshift(response.data.category)
      pagination.value.total += 1
      return { success: true, category: response.data.category }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create category'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateCategory(id: number, categoryData: Partial<CategoryFormData>): Promise<{ success: boolean; category?: Category; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      const response = await api.put<{ category: Category }>(`/categories/${id}`, categoryData)
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = response.data.category
      }
      return { success: true, category: response.data.category }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update category'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function deleteCategory(id: number): Promise<{ success: boolean; message?: string }> {
    isSubmitting.value = true
    error.value = undefined

    try {
      await api.delete(`/categories/${id}`)
      categories.value = categories.value.filter(c => c.id !== id)
      pagination.value.total -= 1
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete category'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  function setFilters(newFilters: any): void {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters(): void {
    filters.value = {
      search: '',
      sort_by: 'created_at',
      sort_direction: 'desc',
    }
  }

  return {
    categories,
    pagination,
    isLoading,
    isSubmitting,
    error,
    filters,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    setFilters,
    resetFilters,
  }
})
