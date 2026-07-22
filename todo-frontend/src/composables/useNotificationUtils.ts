import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useI18n } from 'vue-i18n'

export function useNotificationUtils() {
  const themeStore = useThemeStore()
  const { t } = useI18n()
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

    if (seconds < 60) return t('common.just_now')
    
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
      return minutes === 1 
        ? t('common.minuteAgo')
        : t('common.minutesAgo', { minutes })
    }
    
    const hours = Math.floor(seconds / 3600)
    if (hours < 24) {
      return hours === 1
        ? t('common.hourAgo')
        : t('common.hoursAgo', { hours })
    }
    
    const days = Math.floor(seconds / 86400)
    if (days < 7) {
      return days === 1
        ? t('common.dayAgo')
        : t('common.daysAgo', { days })
    }

    const weeks = Math.floor(seconds / 604800)
    if (weeks < 4) {
      return weeks === 1
        ? t('common.weekAgo')
        : t('common.weeksAgo', { weeks })
    }

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
