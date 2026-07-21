<template>
  <AppLayout>
    <div class="p-4 sm:p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ $t('profile.myProfile') }}</h1>
        <p class="mt-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ $t('profile.personalInformation') }}</p>
      </div>

      <!-- Profile Card -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Profile Form -->
        <div class="lg:col-span-2">
          <!-- Personal Information Section -->
          <div :class="['rounded-xl border shadow-sm p-6 mb-6', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
            <h2 class="text-lg font-bold mb-6" :class="isDark ? 'text-white' : 'text-gray-900'">{{ $t('profile.personalInformation') }}</h2>

            <div class="space-y-4">
              <!-- Name Field -->
              <div>
                <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700']">{{ $t('profile.firstName') }}</label>
                <input 
                  v-model="form.name"
                  type="text"
                  :placeholder="$t('auth.enterFirstName')"
                  @input="validateName"
                  pattern="[a-zA-Z\s]*"
                  :title="$t('validation.invalidName')"
                  :class="[
                    'w-full px-4 py-2 rounded-lg border transition-colors',
                    nameError ? 'border-red-500' : isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                  ]"
                />
                <p v-if="nameError" class="text-xs text-red-600 dark:text-red-400 mt-1">{{ nameError }}</p>
              </div>

              <!-- Email Field -->
              <div>
                <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700']">{{ $t('profile.email') }}</label>
                <input 
                  v-model="form.email"
                  type="email"
                  :placeholder="$t('auth.enterEmail')"
                  :class="[
                    'w-full px-4 py-2 rounded-lg border transition-colors',
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                  ]"
                />
                <p v-if="form.email !== authStore.user?.email" class="text-xs mt-1" :class="isDark ? 'text-yellow-400' : 'text-yellow-600'">
                  {{ $t('profile.emailWillUpdate') }}
                </p>
              </div>

              <!-- Member Since -->
              <div>
                <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700']">{{ $t('profile.accountCreated') }}</label>
                <div :class="[
                  'w-full px-4 py-2 rounded-lg border bg-opacity-50',
                  isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-600'
                ]">
                  {{ formatDate(authStore.user?.created_at) }}
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button 
                  @click="saveProfile"
                  :disabled="isLoading"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? $t('profile.saving') : $t('profile.updateProfile') }}
                </button>
                <button 
                  @click="resetForm"
                  class="px-6 py-2 border rounded-lg font-medium text-sm transition-colors"
                  :class="isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'"
                >
                  {{ $t('common.cancel') }}
                </button>
              </div>

              <!-- Status Messages -->
              <div v-if="successMessage" class="mt-4 p-3 rounded-lg bg-green-600/20 text-green-400 text-sm border border-green-600/30">
                {{ successMessage }}
              </div>
              <div v-if="errorMessage" class="mt-4 p-3 rounded-lg bg-red-600/20 text-red-400 text-sm border border-red-600/30">
                {{ errorMessage }}
              </div>
            </div>
          </div>

          <!-- Account Statistics Section -->
          <div :class="['rounded-xl border shadow-sm p-6', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
            <h2 class="text-lg font-bold mb-6" :class="isDark ? 'text-white' : 'text-gray-900'">{{ $t('profile.accountActivity') }}</h2>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <!-- Total Tasks -->
              <div :class="['p-4 rounded-lg', isDark ? 'bg-gray-800/50' : 'bg-gray-50']">
                <p class="text-xs font-medium uppercase tracking-wide" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ $t('dashboard.totalTasks') }}</p>
                <p class="text-2xl font-bold mt-2" :class="isDark ? 'text-white' : 'text-gray-900'">{{ taskStats.total }}</p>
              </div>

              <!-- Completed Tasks -->
              <div :class="['p-4 rounded-lg', isDark ? 'bg-green-600/20' : 'bg-green-50']">
                <p class="text-xs font-medium uppercase tracking-wide" :class="isDark ? 'text-green-400' : 'text-green-600'">{{ $t('dashboard.completed') }}</p>
                <p class="text-2xl font-bold mt-2" :class="isDark ? 'text-green-400' : 'text-green-600'">{{ taskStats.completed }}</p>
              </div>

              <!-- Pending Tasks -->
              <div :class="['p-4 rounded-lg', isDark ? 'bg-yellow-600/20' : 'bg-yellow-50']">
                <p class="text-xs font-medium uppercase tracking-wide" :class="isDark ? 'text-yellow-400' : 'text-yellow-600'">{{ $t('dashboard.pending') }}</p>
                <p class="text-2xl font-bold mt-2" :class="isDark ? 'text-yellow-400' : 'text-yellow-600'">{{ taskStats.pending }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Avatar & Quick Actions Sidebar -->
        <div>
          <!-- Avatar Card -->
          <div :class="['rounded-xl border shadow-sm p-6 mb-6 text-center', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
            <img 
              :src="authStore.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'"
              :alt="authStore.user?.name"
              class="w-24 h-24 rounded-full mx-auto mb-4 border-4"
              :class="isDark ? 'border-gray-700' : 'border-gray-200'"
            />
            <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ authStore.user?.name }}</h3>
            <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ authStore.user?.email }}</p>
            
            <!-- Badge -->
            <div class="mt-4 inline-block px-3 py-1 rounded-full text-xs font-medium" :class="isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'">
              {{ $t('profile.activeUser') }}
            </div>
          </div>

          <!-- Quick Actions -->
          <div :class="['rounded-xl border shadow-sm p-6', isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200']">
            <h3 class="text-sm font-bold mb-4 uppercase tracking-wide" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ $t('profile.quickActions') }}</h3>
            
            <div class="space-y-2">
              <button 
                @click="goToDashboard"
                :class="[
                  'w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                  isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4V8" />
                </svg>
                {{ $t('profile.goToDashboard') }}
              </button>

              <button 
                @click="goToTasks"
                :class="[
                  'w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                  isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {{ $t('profile.viewAllTasks') }}
              </button>

              <button 
                @click="handleLogout"
                :class="[
                  'w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                  isDark ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' : 'bg-red-50 text-red-600 hover:bg-red-100'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {{ $t('common.logout') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import AppLayout from '@/layouts/AppLayout.vue'
import api from '@/services/api'
import router from '@/router'

const { t } = useI18n()

const themeStore = useThemeStore()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const isDark = computed(() => themeStore.isDark)

// Form States
const form = ref({
  name: '',
  email: ''
})

// UI States
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const nameError = ref('')

// Task Statistics
const taskStats = ref({
  total: 0,
  completed: 0,
  pending: 0,
  overdue: 0,
  upcoming: 0
})

// Format date helper
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Initialize form with current user data
const initializeForm = () => {
  if (authStore.user) {
    form.value = {
      name: authStore.user.name,
      email: authStore.user.email
    }
  }
}

// Calculate task statistics
const calculateStats = () => {
  const tasks = taskStore.tasks
  taskStats.value = {
    total: tasks.length,
    completed: tasks.filter(t => t.is_completed).length,
    pending: tasks.filter(t => !t.is_completed).length,
    overdue: tasks.filter(t => !t.is_completed && t.is_overdue).length,
    upcoming: tasks.filter(t => !t.is_completed && t.due_date && new Date(t.due_date) > new Date()).length
  }
}

// Validate name - only letters and spaces
const validateName = (event: Event) => {
  const input = event.target as HTMLInputElement
  const name = input.value
  
  // Allow only letters (a-z, A-Z) and spaces
  const isValid = /^[a-zA-Z\s]*$/.test(name)
  
  if (!isValid) {
    nameError.value = 'Full name can only contain letters and spaces'
    // Remove invalid characters
    form.value.name = name.replace(/[^a-zA-Z\s]/g, '')
  } else {
    nameError.value = ''
  }
}

// Save profile
const saveProfile = async () => {
  // Validate name before saving
  if (!form.value.name.trim()) {
    errorMessage.value = 'Full name is required'
    return
  }
  
  if (!/^[a-zA-Z\s]+$/.test(form.value.name.trim())) {
    errorMessage.value = 'Full name can only contain letters and spaces'
    return
  }

  isLoading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await api.put('/auth/profile', {
      name: form.value.name,
      email: form.value.email
    })

    // Update auth store with new user data
    if (response.data.user) {
      authStore.user = response.data.user
      // Persist the updated user data to localStorage
      authStore.persistUser(response.data.user)
    }

    successMessage.value = 'Profile updated successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

    // Update form with latest data to ensure consistency
    if (authStore.user) {
      form.value.name = authStore.user.name
      form.value.email = authStore.user.email
    }
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Failed to update profile'
    console.error('Profile update error:', err)
  } finally {
    isLoading.value = false
  }
}

// Reset form to original values
const resetForm = () => {
  initializeForm()
  successMessage.value = ''
  errorMessage.value = ''
}

// Navigation helpers
const goToDashboard = () => {
  router.push('/dashboard')
}

const goToTasks = () => {
  router.push('/tasks')
}

// Logout handler
const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await authStore.logout()
  }
}

// Lifecycle
onMounted(async () => {
  initializeForm()
  await taskStore.fetchTasks()
  calculateStats()
})
</script>
