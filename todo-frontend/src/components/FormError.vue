<template>
  <div v-if="message" class="mt-1 flex items-center gap-2 text-sm text-red-500">
    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.172l-6.687-6.687a1 1 0 00-1.414 1.414l8.1 8.1a1 1 0 001.414 0l8.1-8.1z" clip-rule="evenodd" />
    </svg>
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string | null
}>()
</script>
