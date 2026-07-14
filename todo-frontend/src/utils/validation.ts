/**
 * Custom Validation Rules for Todo App
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/

// URL validation regex
const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!email || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' })
    return errors
  }
  
  if (email.trim().length > 255) {
    errors.push({ field: 'email', message: 'Email must not exceed 255 characters' })
  }
  
  if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }
  
  return errors
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!password || password === '') {
    errors.push({ field: 'password', message: 'Password is required' })
    return errors
  }
  
  if (password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long' })
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' })
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' })
  }
  
  if (!/\d/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one number' })
  }
  
  return errors
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(password: string, confirmation: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!confirmation || confirmation === '') {
    errors.push({ field: 'password_confirmation', message: 'Password confirmation is required' })
    return errors
  }
  
  if (password !== confirmation) {
    errors.push({ field: 'password_confirmation', message: 'Passwords do not match' })
  }
  
  return errors
}

/**
 * Validate name/title
 */
export function validateName(name: string, fieldName: string = 'Name'): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: `${fieldName} is required` })
    return errors
  }
  
  if (name.trim().length < 2) {
    errors.push({ field: 'name', message: `${fieldName} must be at least 2 characters long` })
  }
  
  if (name.trim().length > 100) {
    errors.push({ field: 'name', message: `${fieldName} must not exceed 100 characters` })
  }
  
  // Check for valid characters (alphanumeric, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z0-9\s\-']*$/.test(name)) {
    errors.push({ field: 'name', message: `${fieldName} contains invalid characters` })
  }
  
  return errors
}

/**
 * Validate task title
 */
export function validateTaskTitle(title: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!title || title.trim() === '') {
    errors.push({ field: 'title', message: 'Task title is required' })
    return errors
  }
  
  if (title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Task title must be at least 3 characters long' })
  }
  
  if (title.trim().length > 255) {
    errors.push({ field: 'title', message: 'Task title must not exceed 255 characters' })
  }
  
  return errors
}

/**
 * Validate task description
 */
export function validateTaskDescription(description: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (description && description.trim().length > 1000) {
    errors.push({ field: 'description', message: 'Description must not exceed 1000 characters' })
  }
  
  return errors
}

/**
 * Validate task notes
 */
export function validateTaskNotes(notes: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (notes && notes.trim().length > 500) {
    errors.push({ field: 'notes', message: 'Notes must not exceed 500 characters' })
  }
  
  return errors
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function validateDate(date: string, fieldName: string = 'Date'): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!date || date.trim() === '') {
    return errors // Date is optional in most cases
  }
  
  // Check format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push({ field: 'date', message: `${fieldName} must be in format YYYY-MM-DD` })
    return errors
  }
  
  // Check if valid date
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    errors.push({ field: 'date', message: `${fieldName} is not a valid date` })
  }
  
  return errors
}

/**
 * Validate date is not in the past
 */
export function validateDateNotInPast(date: string, fieldName: string = 'Date'): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!date || date.trim() === '') {
    return errors
  }
  
  const dateObj = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (dateObj < today) {
    errors.push({ field: 'date', message: `${fieldName} cannot be in the past` })
  }
  
  return errors
}

/**
 * Validate end date is after start date
 */
export function validateDateRange(startDate: string, endDate: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!startDate || !endDate) {
    return errors
  }
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (end <= start) {
    errors.push({ field: 'end_date', message: 'End date must be after start date' })
  }
  
  return errors
}

/**
 * Validate priority
 */
export function validatePriority(priority: string): ValidationError[] {
  const errors: ValidationError[] = []
  const validPriorities = ['low', 'medium', 'high', 'urgent']
  
  if (!priority || priority.trim() === '') {
    return errors // Priority is optional (defaults to medium)
  }
  
  if (!validPriorities.includes(priority.toLowerCase())) {
    errors.push({ 
      field: 'priority', 
      message: `Priority must be one of: ${validPriorities.join(', ')}` 
    })
  }
  
  return errors
}

/**
 * Validate Register Form
 */
export function validateRegisterForm(data: {
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
}): ValidationResult {
  const errors: ValidationError[] = []
  
  errors.push(...validateName(data.name || '', 'Name'))
  errors.push(...validateEmail(data.email || ''))
  errors.push(...validatePassword(data.password || ''))
  errors.push(...validatePasswordConfirmation(data.password || '', data.password_confirmation || ''))
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate Login Form
 */
export function validateLoginForm(data: {
  email?: string
  password?: string
}): ValidationResult {
  const errors: ValidationError[] = []
  
  if (!data.email || data.email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }
  
  if (!data.password || data.password === '') {
    errors.push({ field: 'password', message: 'Password is required' })
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate Profile Update Form
 */
export function validateProfileForm(data: {
  name?: string
  email?: string
  current_password?: string
  new_password?: string
  password_confirmation?: string
}): ValidationResult {
  const errors: ValidationError[] = []
  
  if (data.name) {
    errors.push(...validateName(data.name, 'Name'))
  }
  
  if (data.email) {
    errors.push(...validateEmail(data.email))
  }
  
  // If changing password
  if (data.new_password) {
    if (!data.current_password || data.current_password === '') {
      errors.push({ field: 'current_password', message: 'Current password is required to change password' })
    }
    
    errors.push(...validatePassword(data.new_password))
    errors.push(...validatePasswordConfirmation(data.new_password, data.password_confirmation || ''))
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate Create Task Form
 */
export function validateCreateTaskForm(data: {
  title?: string
  description?: string
  notes?: string
  priority?: string
  due_date?: string
  due_time?: string
}): ValidationResult {
  const errors: ValidationError[] = []
  
  errors.push(...validateTaskTitle(data.title || ''))
  
  if (data.description) {
    errors.push(...validateTaskDescription(data.description))
  }
  
  if (data.notes) {
    errors.push(...validateTaskNotes(data.notes))
  }
  
  errors.push(...validatePriority(data.priority || ''))
  
  if (data.due_date) {
    errors.push(...validateDate(data.due_date, 'Due date'))
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Get error message for a specific field
 */
export function getFieldError(errors: ValidationError[], fieldName: string): string | null {
  const error = errors.find(e => e.field === fieldName)
  return error ? error.message : null
}

/**
 * Check if field has error
 */
export function hasFieldError(errors: ValidationError[], fieldName: string): boolean {
  return errors.some(e => e.field === fieldName)
}
