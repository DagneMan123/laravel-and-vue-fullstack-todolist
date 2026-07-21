<template>
  <div class="relative group">
    <button
      class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
      :class="[
        'hover:bg-gray-100 dark:hover:bg-gray-700',
        isDark ? 'text-gray-300' : 'text-gray-600'
      ]"
      :title="$t('profile.language')"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948-.684l1.498-4.493a1 1 0 011.502-.684l1.498 4.493a1 1 0 00.948.684H19a2 2 0 012 2v1M3 5h16v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
      </svg>
      <span class="text-sm font-medium hidden sm:inline">{{ getLanguageName(currentLanguage) }}</span>
      <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      class="absolute right-0 mt-0 w-48 rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
      :class="isDark ? 'bg-[#1a1f2e] border border-gray-700' : 'bg-white border border-gray-200'"
    >
      <div class="py-2">
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="switchLanguage(lang.code as 'en' | 'am')"
          class="w-full px-4 py-2 text-left text-sm transition-colors flex items-center justify-between"
          :class="[
            currentLanguage === lang.code
              ? isDark
                ? 'bg-blue-600/20 text-blue-400'
                : 'bg-blue-50 text-blue-600'
              : isDark
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
        >
          <span>{{ lang.nativeName }}</span>
          <svg
            v-if="currentLanguage === lang.code"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useLanguage } from '@/composables/useLanguage'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const { currentLanguage, languages, switchLanguage, getLanguageName } = useLanguage()
</script>

<style scoped>
/* Smooth transitions for dropdown */
.group:hover > div {
  transition: all 0.2s ease-in-out;
}
</style>
