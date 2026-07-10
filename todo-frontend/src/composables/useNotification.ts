import { ref } from 'vue'

export interface Notification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

const notifications = ref<Notification[]>([])
let idCounter = 0

export function useNotification() {
  function addNotification(
    type: Notification['type'],
    message: string,
    duration: number = 5000
  ): void {
    const id = ++idCounter
    notifications.value.push({ id, type, message, duration })

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }

  function removeNotification(id: number): void {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function success(message: string, duration?: number): void {
    addNotification('success', message, duration)
  }

  function error(message: string, duration?: number): void {
    addNotification('error', message, duration)
  }

  function warning(message: string, duration?: number): void {
    addNotification('warning', message, duration)
  }

  function info(message: string, duration?: number): void {
    addNotification('info', message, duration)
  }

  return {
    notifications,
    removeNotification,
    success,
    error,
    warning,
    info,
  }
}