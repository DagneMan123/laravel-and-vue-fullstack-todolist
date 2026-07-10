<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 max-w-md w-full pointer-events-none">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="pointer-events-auto"
      >
        <div
          class="p-4 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/20 flex items-start gap-3"
          :class="notificationClasses[notification.type]"
        >
          <span class="text-xl flex-shrink-0">{{ icons[notification.type] }}</span>
          <p class="flex-1 text-sm font-medium text-white">{{ notification.message }}</p>
          <button
            @click="removeNotification(notification.id)"
            class="text-white/70 hover:text-white transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'

const { notifications, removeNotification } = useNotification()

const icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
}

const notificationClasses = {
  success: 'bg-gradient-to-r from-emerald-500 to-teal-500',
  error: 'bg-gradient-to-r from-red-500 to-rose-500',
  warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  info: 'bg-gradient-to-r from-blue-500 to-indigo-500',
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>