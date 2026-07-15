<template>
  <div class="login-container" :class="{ 'dark-theme': themeStore.isDark }">
    <div class="absolute inset-0 overflow-hidden -z-10">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full filter blur-3xl opacity-30"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full filter blur-3xl opacity-30"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 dark-login">
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-primary-500/25 animate-float">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 class="mt-4 text-3xl font-bold gradient-text">Welcome Back</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to continue managing your tasks</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4" @input="validateOnInput">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input
              v-model="credentials.email"
              type="email"
              class="input-field"
              :class="{ 'border-red-500 dark:border-red-400': emailError }"
              placeholder="you@example.com"
              :disabled="authStore.isLoading"
            />
            <FormError :message="emailError" />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div class="relative">
              <input
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                class="input-field pr-10"
                :class="{ 'border-red-500 dark:border-red-400': passwordError }"
                placeholder="Enter your password"
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
            <FormError :message="passwordError" />
          </div>

          <!-- API Error -->
          <div v-if="authStore.error" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {{ authStore.error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn-primary w-full py-3 text-base"
            :disabled="authStore.isLoading"
          >
            <span v-if="authStore.isLoading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}
          </button>

          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <router-link to="/register" class="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Create one
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFormValidation } from '@/composables/useFormValidation'
import { useNotification } from '@/composables/useNotification'
import { useThemeStore } from '@/stores/theme'
import FormError from '@/components/FormError.vue'
import type { LoginCredentials } from '@/types'

const { success, error: notifyError } = useNotification()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const validation = useFormValidation()
const showPassword = ref(false)

const credentials = reactive<LoginCredentials>({
  email: '',
  password: '',
})

// Computed properties for field-specific validation errors
const emailError = computed(() => validation.getError('email'))
const passwordError = computed(() => validation.getError('password'))

const handleLogin = async () => {
  // Validate form before submitting
  if (!validation.validateLogin(credentials)) {
    return
  }

  const result = await authStore.login(credentials)
  if (result.success) {
    success('Welcome back! 🎉')
  } else {
    notifyError(result.message || 'Login failed')
  }
}

// Real-time validation as user types
const validateOnInput = () => {
  validation.validateLogin(credentials)
}
</script>


<style scoped>
.login-container {
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

.login-container.dark-theme {
  background: #0f1419;
}

.theme-toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.login-container.dark-theme .theme-toggle-btn {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.3);
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
}

.dark-login {
  background: white;
  transition: all 0.3s;
}

.login-container.dark-theme .dark-login {
  background: #1a1f2e;
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.login-container.dark-theme .gradient-text {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-container.dark-theme .text-gray-500 {
  color: #a0a0a0;
}

.login-container.dark-theme label {
  color: #c0c0c0;
}

.login-container.dark-theme .input-field {
  background: #0f1419;
  border-color: rgba(139, 92, 246, 0.2);
  color: #e0e0e0;
}

.login-container.dark-theme .input-field::placeholder {
  color: #666;
}

.login-container.dark-theme .input-field:focus {
  border-color: rgba(139, 92, 246, 0.5);
  ring: 2px rgba(139, 92, 246, 0.3);
}

.login-container.dark-theme .text-center {
  color: #e0e0e0;
}

.login-container.dark-theme .text-gray-600 {
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
