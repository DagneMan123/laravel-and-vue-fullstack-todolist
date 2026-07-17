import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

export function useNotificationUtils() {
  const themeStore = useThemeStore()
  const isDark = computed(() => themeStore.isDark)

  /**
   * Get type-specific styling classes for notification badges
   */
  const getTypeClasses = (type: string) => {
    const classes = {
      success: {
        badge: isDark.value 
          ? 'bg-green-900/30 text-green-400'
          : 'bg-green-100 text-green-700',
      },
      error: {
        badge: isDark.value 
          ? 'bg-red-900/30 text-red-400'
          : 'bg-red-100 text-red-700',
      },
      warning: {
        badge: isDark.value 
          ? 'bg-amber-900/30 text-amber-400'
          : 'bg-amber-100 text-amber-700',
      },
      info: {
        badge: isDark.value 
          ? 'bg-blue-900/30 text-blue-400'
          : 'bg-blue-100 text-blue-700',
      },
    }
    return classes[type as keyof typeof classes] || classes.info
  }

  /**
   * Get color for notification type indicator dot
   */
  const getNotificationColor = (type: string): string => {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-amber-500',
      info: 'bg-blue-500',
    }
    return colors[type as keyof typeof colors] || colors.info
  }

  /**
   * Format notification type for display
   */
  const formatType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  /**
   * Format timestamp to relative time (e.g., "2m ago")
   */
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  return {
    isDark,
    getTypeClasses,
    getNotificationColor,
    formatType,
    formatTime,
  }
}
