<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    @click.self="handleClose"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"></div>
    
    <!-- Modal -->
    <div class="relative bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary-500/25">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V7" />
          </svg>
        </div>
        <h3 class="mt-4 text-2xl font-bold gradient-text">Reset Password</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
          <input
            v-model="email"
            type="email"
            class="input-field"
            :class="{ 'border-red-500 dark:border-red-400': error }"
            placeholder="Enter your email"
            :disabled="loading"
            @input="error = ''"
          />
          <p v-if="error" class="mt-1 text-sm text-red-500 dark:text-red-400">{{ error }}</p>
          <p v-if="success" class="mt-1 text-sm text-green-500 dark:text-green-400">
            ✅ Reset link sent! Check your email.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            @click="handleClose"
            class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition font-medium"
            :disabled="loading || !email"
          >
            <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

// Reset state when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    email.value = ''
    error.value = ''
    success.value = false
  }
})

const handleClose = () => {
  if (!loading.value) {
    emit('close')
  }
}

const handleSubmit = async () => {
  error.value = ''
  success.value = false
  
  // Validate email
  if (!email.value) {
    error.value = 'Email is required'
    return
  }
  
  if (!isValidEmail(email.value)) {
    error.value = 'Please enter a valid email address'
    return
  }
  
  loading.value = true
  
  try {
    // Simulate API call - Replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    success.value = true
    email.value = ''
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      emit('success')
      emit('close')
    }, 3000)
    
  } catch (err) {
    error.value = 'Failed to send reset link. Please try again.'
  } finally {
    loading.value = false
  }
}

const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out forwards;
}

.gradient-text {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-text-fill-color: transparent;
}

.input-field {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
  color: #1f2937;
}

.dark .input-field {
  background: #0f1419;
  border-color: rgba(139, 92, 246, 0.2);
  color: #e0e0e0;
}

.input-field:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.dark .input-field:focus {
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.dark .text-gray-500 {
  color: #a0a0a0;
}

.dark label {
  color: #c0c0c0;
}
</style>