<template>
  <div class="card p-4 space-y-4">
    <!-- Search -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">Search</label>
      <input
        v-model="localFilters.search"
        @input="debouncedUpdate"
        type="text"
        placeholder="Search tasks..."
        class="input-field"
      />
    </div>

    <!-- Status Filter -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
      <select v-model="localFilters.status" @change="handleUpdate" class="input-field">
        <option :value="null">All Tasks</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Priority Filter -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
      <select v-model="localFilters.priority" @change="handleUpdate" class="input-field">
        <option :value="null">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <!-- Sort -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
      <select v-model="localFilters.sort_by" @change="handleUpdate" class="input-field mb-2">
        <option value="created_at">Created Date</option>
        <option value="due_date">Due Date</option>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
      </select>
      <select v-model="localFilters.sort_direction" @change="handleUpdate" class="input-field">
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>

    <!-- Reset Button -->
    <button @click="handleReset" class="btn-secondary w-full">
      Reset Filters
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TaskFilters } from '@/types'
import { debounce } from '@/utils/helpers'

interface Props {
  filters: TaskFilters
}

const props = defineProps<Props>()
const emit = defineEmits<{
  update: [filters: TaskFilters]
  reset: []
}>()

const localFilters = ref<TaskFilters>({ ...props.filters })

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

const handleUpdate = () => {
  emit('update', localFilters.value)
}

const debouncedUpdate = debounce(() => {
  handleUpdate()
}, 500)

const handleReset = () => {
  localFilters.value = {
    status: 'all',
    priority: 'all',
    search: '',
    sort_by: 'created_at',
    sort_direction: 'desc',
  }
  emit('reset')
}
</script>
