<template>
  <div class="register-container" :class="{ 'dark-theme': themeStore.isDark }">
    <!-- Gradient background accent -->
    <div class="absolute inset-0 overflow-hidden -z-10">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full filter blur-3xl opacity-30"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full filter blur-3xl opacity-30"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 dark-register">
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-primary-500/25 animate-float">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold gradient-text">Create Account</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Join and start managing your tasks</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="input-field"
              placeholder="Your name"
              :disabled="authStore.isLoading"
              @input="validateName"
              pattern="[a-zA-Z\s]*"
              title="Full name can only contain letters and spaces"
            />
            <p v-if="nameError" class="text-xs text-red-600 dark:text-red-400 mt-1">{{ nameError }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="input-field"
              placeholder="your@email.com"
              :disabled="authStore.isLoading"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div class="relative">
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pr-10"
                placeholder="••••••••"
                :disabled="authStore.isLoading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition"
                :disabled="authStore.isLoading"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
            <div class="relative">
              <input
                v-model="formData.password_confirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="input-field pr-10"
                placeholder="••••••••"
                :disabled="authStore.isLoading"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition"
                :disabled="authStore.isLoading"
              >
                <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="authStore.error" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {{ authStore.error }}
          </div>

          <button
            type="submit"
            class="btn-primary w-full py-3 text-base"
            :disabled="authStore.isLoading"
          >
            <span v-if="authStore.isLoading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ authStore.isLoading ? 'Creating Account...' : 'Sign Up' }}
          </button>

          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <router-link to="/login" class="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Sign In
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'
import { useThemeStore } from '@/stores/theme'
import type { RegisterData } from '@/types'

const { success, error: notifyError } = useNotification()
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const nameError = ref('')

const formData = reactive<RegisterData>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

// Validate name - only letters and spaces
const validateName = (event: Event) => {
  const input = event.target as HTMLInputElement
  const name = input.value
  
  // Allow only letters (a-z, A-Z) and spaces
  const isValid = /^[a-zA-Z\s]*$/.test(name)
  
  if (!isValid) {
    nameError.value = 'Full name can only contain letters and spaces'
    // Remove invalid characters
    formData.name = name.replace(/[^a-zA-Z\s]/g, '')
  } else {
    nameError.value = ''
  }
}

const handleRegister = async () => {
  // Validate name before submitting
  if (!formData.name.trim()) {
    notifyError('Full name is required')
    return
  }
  
  if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
    notifyError('Full name can only contain letters and spaces')
    return
  }

  const result = await authStore.register(formData)
  if (result.success) {
    // Silently redirect to login page
    router.push('/login')
  } else {
    notifyError(result.message || 'Registration failed')
  }
}
</script>


<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: white;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s;
}

.register-container.dark-theme {
  background: #0f1419;
}

.dark-register {
  background: white;
  transition: all 0.3s;
}

.register-container.dark-theme .dark-register {
  background: #1a1f2e;
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.register-container.dark-theme .gradient-text {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.register-container.dark-theme .text-gray-500 {
  color: #a0a0a0;
}

.register-container.dark-theme label {
  color: #c0c0c0;
}

.register-container.dark-theme .input-field {
  background: #0f1419;
  border-color: rgba(139, 92, 246, 0.2);
  color: #e0e0e0;
}

.register-container.dark-theme .input-field::placeholder {
  color: #666;
}

.register-container.dark-theme .input-field:focus {
  border-color: rgba(139, 92, 246, 0.5);
  ring: 2px rgba(139, 92, 246, 0.3);
}

.register-container.dark-theme .text-center {
  color: #e0e0e0;
}

.register-container.dark-theme .text-gray-600 {
  color: #a0a0a0;
}

.input-field {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
