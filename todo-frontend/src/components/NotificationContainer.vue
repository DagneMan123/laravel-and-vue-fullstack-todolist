<template>
  <div 
    class="fixed top-4 right-4 z-50 space-y-3 pointer-events-none"
    :style="{ 
      width: 'calc(100% - 2rem)',
      maxWidth: '28rem'
    }"
  >
    <TransitionGroup name="notification" tag="div" class="space-y-3">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'pointer-events-auto flex items-start gap-4 p-4 rounded-lg shadow-lg border backdrop-blur-sm animate-slide-in',
          'transition-all duration-300 ease-out',
          notificationClasses[notification.type]
        ]"
        role="alert"
        :aria-live="notification.type === 'error' ? 'assertive' : 'polite'"
        :aria-atomic="true"
      >
        <!-- Icon Container -->
        <div class="flex-shrink-0 mt-0.5">
          <component :is="getIcon(notification.type)" class="w-5 h-5" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium leading-snug">
            {{ notification.message }}
          </p>
        </div>

        <!-- Close Button -->
        <button
          @click="removeNotification(notification.id)"
          class="flex-shrink-0 transition-colors opacity-70 hover:opacity-100 p-1 -mr-1"
          :aria-label="`Close notification`"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Progress Bar -->
        <div 
          v-if="notification.duration && notification.duration > 0"
          class="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg animate-progress"
          :style="{ '--duration': `${notification.duration}ms` }"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'
import { defineComponent, h } from 'vue'

const { notifications, removeNotification } = useNotification()

// SVG Icon Components
const CheckCircleIcon = defineComponent({
  render: () =>
    h(
      'svg',
      { fill: 'currentColor', viewBox: '0 0 20 20' },
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
        'clip-rule': 'evenodd',
      })
    ),
})

const XCircleIcon = defineComponent({
  render: () =>
    h(
      'svg',
      { fill: 'currentColor', viewBox: '0 0 20 20' },
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
        'clip-rule': 'evenodd',
      })
    ),
})

const ExclamationIcon = defineComponent({
  render: () =>
    h(
      'svg',
      { fill: 'currentColor', viewBox: '0 0 20 20' },
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
        'clip-rule': 'evenodd',
      })
    ),
})

const InfoIcon = defineComponent({
  render: () =>
    h(
      'svg',
      { fill: 'currentColor', viewBox: '0 0 20 20' },
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
        'clip-rule': 'evenodd',
      })
    ),
})

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return XCircleIcon
    case 'warning':
      return ExclamationIcon
    case 'info':
      return InfoIcon
    default:
      return InfoIcon
  }
}

const notificationClasses = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(calc(100% + 1rem));
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-progress {
  animation: progress var(--duration, 5000ms) linear;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(calc(100% + 1rem));
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(calc(100% + 1rem));
}

.notification-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 640px) {
  .animate-slide-in {
    animation: slideInMobile 0.3s ease-out;
  }

  @keyframes slideInMobile {
    from {
      transform: translateX(calc(100% + 0.5rem));
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
}
</style>