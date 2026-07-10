export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'No due date'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Date(dateObj).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'No due date'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isToday(dateObj)) return 'Today'
  if (isTomorrow(dateObj)) return 'Tomorrow'
  
  return format(dateObj, 'MMM dd, yyyy')
}

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(dateObj)
}

export const isOverdue = (dueDate: string | null | undefined): boolean => {
  if (!dueDate) return false
  const now = new Date()
  const due = new Date(dueDate)
  now.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return due < now
}

export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
  const colors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-red-600 bg-red-50 border-red-200',
  }
  return colors[priority]
}

export const getPriorityBadgeColor = (priority: 'low' | 'medium' | 'high'): string => {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  }
  return colors[priority]
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
