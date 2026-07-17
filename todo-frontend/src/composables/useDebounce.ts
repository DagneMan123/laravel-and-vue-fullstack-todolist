/**
 * Debounce function to prevent duplicate rapid requests
 */
export function useDebounce() {
  const debounceMap = new Map<string, NodeJS.Timeout>()

  /**
   * Debounce a function call by key
   * @param key - Unique identifier for the debounce
   * @param fn - Function to debounce
   * @param delay - Delay in milliseconds (default: 1000ms)
   */
  function debounce(key: string, fn: () => void, delay: number = 1000): void {
    // Clear existing timeout for this key
    if (debounceMap.has(key)) {
      clearTimeout(debounceMap.get(key))
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      fn()
      debounceMap.delete(key)
    }, delay)

    debounceMap.set(key, timeout)
  }

  /**
   * Cancel a debounced function
   */
  function cancel(key: string): void {
    if (debounceMap.has(key)) {
      clearTimeout(debounceMap.get(key))
      debounceMap.delete(key)
    }
  }

  /**
   * Clear all debounced functions
   */
  function clearAll(): void {
    debounceMap.forEach(timeout => clearTimeout(timeout))
    debounceMap.clear()
  }

  return {
    debounce,
    cancel,
    clearAll,
  }
}
