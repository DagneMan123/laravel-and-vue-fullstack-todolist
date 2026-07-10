import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  // Watch for changes to isDark and update DOM and storage
  watch(isDark, (value) => {
    localStorage.setItem('theme', value ? 'dark' : 'light')
    updateTheme(value)
    // Dispatch custom event for cross-tab/component communication
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { isDark: value } }))
  }, { immediate: true })

  function updateTheme(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add('dark-mode')
      document.documentElement.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark'
    } else {
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  // Listen for storage changes (when theme changes in another tab/window)
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      isDark.value = e.newValue === 'dark'
      updateTheme(isDark.value)
    }
  })

  return {
    isDark,
    toggleTheme
  }
})
