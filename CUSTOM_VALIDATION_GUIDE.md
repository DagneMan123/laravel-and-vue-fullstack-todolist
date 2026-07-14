# Custom Validation Guide

This document explains how to use the custom validation system implemented across the Todo App.

## Overview

Custom validation has been implemented for:
- ✅ Register Form
- ✅ Login Form
- ✅ Create Task Form
- ✅ Profile Update Form

## Files Structure

```
src/
├── utils/
│   └── validation.ts           # All validation rules and functions
├── composables/
│   └── useFormValidation.ts    # Vue composable for form validation
├── components/
│   └── FormError.vue           # Reusable error display component
└── stores/
    ├── auth.ts                  # Updated with validation
    └── tasks.ts                 # Updated with validation
```

## Validation Rules

### Email Validation
- Required field
- Valid email format (must include @)
- Max 255 characters

### Password Validation
- Required field
- Minimum 8 characters
- Must contain uppercase letter (A-Z)
- Must contain lowercase letter (a-z)
- Must contain number (0-9)

Example valid password: `MyPassword123`
Example invalid password: `mypassword` (no uppercase, no number)

### Name Validation
- Required field
- Minimum 2 characters
- Maximum 100 characters
- Only alphanumeric, spaces, hyphens, apostrophes

### Task Title Validation
- Required field
- Minimum 3 characters
- Maximum 255 characters

### Task Description
- Optional field
- Maximum 1000 characters if provided

### Task Notes
- Optional field
- Maximum 500 characters if provided

### Priority Validation
- Must be one of: `low`, `medium`, `high`, `urgent`
- Optional (defaults to medium)

### Date Validation
- Optional field
- Format: YYYY-MM-DD
- Must be a valid date

## How to Use

### 1. Using in Vue Components (with Composable)

```vue
<template>
  <form @submit.prevent="handleRegister">
    <!-- Email field -->
    <div class="mb-4">
      <input 
        v-model="form.email" 
        type="email"
        placeholder="Email"
        :class="{ 'border-red-500': validation.hasError('email') }"
      />
      <FormError :message="validation.getError('email')" />
    </div>

    <!-- Password field -->
    <div class="mb-4">
      <input 
        v-model="form.password" 
        type="password"
        placeholder="Password"
        :class="{ 'border-red-500': validation.hasError('password') }"
      />
      <FormError :message="validation.getError('password')" />
    </div>

    <!-- Submit button -->
    <button 
      type="submit"
      :disabled="validation.hasErrors || isSubmitting"
    >
      Register
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'
import FormError from '@/components/FormError.vue'

const validation = useFormValidation()
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

async function handleRegister() {
  // Validate before submitting
  if (!validation.validateRegister(form)) {
    return
  }
  
  // If validation passes, submit to API
  // ...
}
</script>
```

### 2. Using Direct Validation Functions

```typescript
import {
  validateEmail,
  validatePassword,
  validateTaskTitle,
  validateCreateTaskForm,
} from '@/utils/validation'

// Validate individual fields
const emailErrors = validateEmail('user@example.com')
if (emailErrors.length > 0) {
  console.log('Email errors:', emailErrors)
}

// Validate entire form
const result = validateCreateTaskForm({
  title: 'My Task',
  description: 'Task description',
  priority: 'high',
  due_date: '2026-07-20',
})

if (result.isValid) {
  // Form is valid, proceed
} else {
  // Handle errors
  console.log(result.errors)
}
```

### 3. Using Auth Store with Validation

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Login with automatic validation
const result = await authStore.login({
  email: 'user@example.com',
  password: 'Password123',
})

if (!result.success) {
  // Check validation errors
  if (authStore.validationErrors.length > 0) {
    console.log('Validation failed:', authStore.validationErrors)
  } else {
    console.log('API error:', authStore.error)
  }
}
```

### 4. Using Task Store with Validation

```typescript
import { useTaskStore } from '@/stores/tasks'

const taskStore = useTaskStore()

// Create task with automatic validation
const result = await taskStore.createTask({
  title: 'Important Task',
  description: 'Do something',
  priority: 'high',
  due_date: '2026-07-20',
})

if (!result.success) {
  // Check validation errors
  if (taskStore.validationErrors.length > 0) {
    // Show validation errors to user
    taskStore.validationErrors.forEach(err => {
      console.log(`${err.field}: ${err.message}`)
    })
  }
}
```

## Error Structure

Each error has the following structure:

```typescript
interface ValidationError {
  field: string      // Field name (e.g., 'email', 'password')
  message: string    // Human-readable error message
}
```

## FormError Component Usage

The `FormError` component displays validation errors:

```vue
<FormError :message="getFieldError('email')" />

<!-- With custom styling -->
<FormError 
  :message="getFieldError('email')"
  class="text-red-600 font-semibold"
/>
```

## Validation Methods in useFormValidation Composable

```typescript
// Validate entire register form
validateRegister(data: any): boolean

// Validate entire login form
validateLogin(data: any): boolean

// Validate entire profile form
validateProfile(data: any): boolean

// Validate entire task form
validateCreateTask(data: any): boolean

// Get single field error message
getError(fieldName: string): string | null

// Check if field has error
hasError(fieldName: string): boolean

// Get all errors for a field
getFieldErrors(fieldName: string): string[]

// Clear all errors
clearErrors(): void

// Set custom errors
setErrors(errors: ValidationError[]): void
```

## Best Practices

1. **Always validate before submitting**: Call validation method before API request
2. **Clear errors on new attempt**: Validation is automatically cleared when form is reused
3. **Show errors near fields**: Use FormError component right below input fields
4. **Disable submit while validating**: Use `isSubmitting` ref from store
5. **Check both types of errors**:
   - Validation errors (client-side)
   - API errors (server-side)

## Example: Complete Login Form

```vue
<template>
  <div class="login-form">
    <!-- Email -->
    <div class="form-group">
      <label>Email</label>
      <input 
        v-model="form.email" 
        type="email"
        @blur="validateField('email')"
        :class="{ 'has-error': validation.hasError('email') }"
      />
      <FormError :message="validation.getError('email')" />
    </div>

    <!-- Password -->
    <div class="form-group">
      <label>Password</label>
      <input 
        v-model="form.password" 
        type="password"
        @blur="validateField('password')"
        :class="{ 'has-error': validation.hasError('password') }"
      />
      <FormError :message="validation.getError('password')" />
    </div>

    <!-- API Error -->
    <div v-if="authStore.error" class="api-error">
      {{ authStore.error }}
    </div>

    <!-- Submit -->
    <button 
      @click="handleLogin"
      :disabled="authStore.isLoading"
    >
      {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFormValidation } from '@/composables/useFormValidation'
import FormError from '@/components/FormError.vue'

const authStore = useAuthStore()
const validation = useFormValidation()

const form = reactive({
  email: '',
  password: '',
})

function validateField(field: string) {
  if (field === 'email') {
    validation.setErrors(validateEmail(form.email))
  }
}

async function handleLogin() {
  const result = await authStore.login(form)
  
  if (result.success) {
    // Redirect handled by store
  }
}
</script>
```

## Password Requirements Display

Help users understand password requirements:

```vue
<template>
  <div class="password-requirements">
    <ul>
      <li :class="{ met: hasMinLength }">✓ At least 8 characters</li>
      <li :class="{ met: hasUppercase }">✓ One uppercase letter</li>
      <li :class="{ met: hasLowercase }">✓ One lowercase letter</li>
      <li :class="{ met: hasNumber }">✓ One number</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  password: string
}>()

const hasMinLength = computed(() => props.password.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(props.password))
const hasLowercase = computed(() => /[a-z]/.test(props.password))
const hasNumber = computed(() => /\d/.test(props.password))
</script>

<style scoped>
.password-requirements ul {
  list-style: none;
}

.password-requirements li {
  color: #ccc;
  transition: color 0.2s;
}

.password-requirements li.met {
  color: #10b981;
}
</style>
```

## Testing Validation

```typescript
import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validateRegisterForm,
} from '@/utils/validation'

describe('Validation', () => {
  it('should validate email correctly', () => {
    const validEmail = validateEmail('test@example.com')
    expect(validEmail).toHaveLength(0)

    const invalidEmail = validateEmail('invalid-email')
    expect(invalidEmail).toHaveLength(1)
  })

  it('should validate password correctly', () => {
    const validPassword = validatePassword('ValidPass123')
    expect(validPassword).toHaveLength(0)

    const weakPassword = validatePassword('weak')
    expect(weakPassword.length).toBeGreaterThan(0)
  })

  it('should validate register form', () => {
    const result = validateRegisterForm({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'ValidPass123',
      password_confirmation: 'ValidPass123',
    })

    expect(result.isValid).toBe(true)
  })
})
```

## Customizing Validation Rules

To add custom validation rules, edit `src/utils/validation.ts`:

```typescript
export function validateCustomField(value: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!value) {
    errors.push({ field: 'custom', message: 'This field is required' })
  }
  
  if (value.length < 5) {
    errors.push({ field: 'custom', message: 'Minimum 5 characters' })
  }
  
  return errors
}
```

Then use it in your form validation function.
