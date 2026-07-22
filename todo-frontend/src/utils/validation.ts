/**
 * Custom Validation Rules for Todo App with Language Support
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

// Disposable email domains (common temp email services)
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  'throwaway.email',
  'guerrillamail.com',
  '10minutemail.com',
  'mailinator.com',
  'temp-mail.org',
  'maildrop.cc',
  'yopmail.com',
  'fakeinbox.com',
  'dispostable.com',
  'trashmail.com',
]

// Get i18n instance for translations
let i18n: any = null

export function setI18n(i18nInstance: any) {
  i18n = i18nInstance
}

function t(key: string, defaults: string = ''): string {
  if (i18n) {
    return i18n.global.t(key) || defaults
  }
  return defaults
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!email || email.trim() === '') {
    errors.push({ field: 'email', message: t('validation.required', 'Email is required') })
    return errors
  }
  
  if (email.trim().length > 255) {
    errors.push({ field: 'email', message: t('validation.emailTooLong', 'Email must not exceed 255 characters') })
  }
  
  if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: t('validation.invalidEmail', 'Please enter a valid email address') })
  }
  
  return errors
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!password || password === '') {
    errors.push({ field: 'password', message: t('validation.required', 'Password is required') })
    return errors
  }
  
  if (password.length < 8) {
    errors.push({ field: 'password', message: t('validation.passwordTooShort', 'Password must be at least 8 characters long') })
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push({ field: 'password', message: t('validation.passwordNoUppercase', 'Password must contain at least one uppercase letter') })
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push({ field: 'password', message: t('validation.passwordNoLowercase', 'Password must contain at least one lowercase letter') })
  }
  
  if (!/\d/.test(password)) {
    errors.push({ field: 'password', message: t('validation.passwordNoNumber', 'Password must contain at least one number') })
  }
  
  return errors
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(password: string, confirmation: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!confirmation || confirmation === '') {
    errors.push({ field: 'password_confirmation', message: t('validation.required', 'Password confirmation is required') })
    return errors
  }
  
  if (password !== confirmation) {
    errors.push({ field: 'password_confirmation', message: t('validation.passwordMismatch', 'Passwords do not match') })
  }
  
  return errors
}

/**
 * Validate name/title
 * Supports Unicode letters including Amharic, Arabic, Chinese, etc.
 */
export function validateName(name: string, fieldName: string = 'Name'): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: t('validation.nameRequired', `${fieldName} is required`) })
    return errors
  }
  
  if (name.trim().length < 2) {
    errors.push({ field: 'name', message: t('validation.nameTooShort', `${fieldName} must be at least 2 characters long`) })
  }
  
  if (name.trim().length > 100) {
    errors.push({ field: 'name', message: t('validation.nameTooLong', `${fieldName} must not exceed 100 characters`) })
  }
  
  // Check for valid characters using blacklist approach
  // Allow: Unicode letters, spaces, hyphens, apostrophes
  // Reject: dangerous characters like <, >, {, }, etc.
  const invalidCharactersRegex = /[<>{}[\]\\^`|]/
  if (invalidCharactersRegex.test(name)) {
    errors.push({ field: 'name', message: t('validation.nameInvalidChars', `${fieldName} contains invalid characters`) })
  }
  
  return errors
}

/**
 * Validate task title with language support
 */
export function validateTaskTitle(title: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!title || title.trim() === '') {
    errors.push({ field: 'title', message: t('tasks.taskTitleRequired', 'Task title is required') })
    return errors
  }
  
  if (title.trim().length < 3) {
    errors.push({ field: 'title', message: t('tasks.taskTitleTooShort', 'Task title must be at least 3 characters long') })
  }
  
  if (title.trim().length > 255) {
    errors.push({ field: 'title', message: t('tasks.taskTitleTooLong', 'Task title must not exceed 255 characters') })
  }
  
  return errors
}

/**
 * Validate task description with language support
 */
export function validateTaskDescription(description: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (description && description.trim().length > 1000) {
    errors.push({ field: 'description', message: t('tasks.descriptionTooLong', 'Description must not exceed 1000 characters') })
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
      message: t('tasks.invalidPriority', 'Please select a valid priority')
    })
  }
  
  return errors
}

/**
 * Validate email domain is not disposable/temporary
 */
export function validateEmailDomain(email: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!email) {
    return errors
  }
  
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) {
    return errors
  }
  
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    errors.push({
      field: 'email',
      message: t('validation.emailDisposable', 'Please use a permanent email address, not a temporary email service'),
    })
  }
  
  return errors
}

/**
 * Validate password doesn't contain common weak patterns
 */
export function validatePasswordPatterns(password: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!password) {
    return errors
  }
  
  // Check for sequential numbers
  if (/012|123|234|345|456|567|678|789|890/.test(password)) {
    errors.push({
      field: 'password',
      message: t('validation.passwordSequential', 'Password cannot contain sequential numbers like 123'),
    })
  }
  
  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push({
      field: 'password',
      message: t('validation.passwordRepeated', 'Password cannot contain repeated characters (aaa, 111, etc.)'),
    })
  }
  
  // Check for common weak patterns
  const commonPatterns = ['password', 'qwerty', 'admin', '12345']
  const lowerPassword = password.toLowerCase()
  for (const pattern of commonPatterns) {
    if (lowerPassword.includes(pattern)) {
      errors.push({
        field: 'password',
        message: t('validation.passwordCommon', 'Password is too common. Please choose a stronger password'),
      })
      break
    }
  }
  
  return errors
}

/**
 * Validate name doesn't have suspicious patterns
 */
export function validateNamePatterns(name: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!name) {
    return errors
  }
  
  // Check for any numbers
  if (/\d/.test(name)) {
    errors.push({
      field: 'name',
      message: t('validation.nameNoNumbers', 'Name cannot contain numbers'),
    })
  }
  
  // Check for repeated special characters
  if (/(.)\1{2,}/.test(name)) {
    errors.push({
      field: 'name',
      message: t('validation.nameInvalidChars', 'Name contains invalid repeated characters'),
    })
  }
  
  return errors
}

/**
 * Validate email is not already used (basic check)
 * Note: Full validation happens on backend
 */
export function validateEmailFormat(email: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!email) {
    return errors
  }
  
  // Check for common typos in popular email domains
  const commonTypos: { [key: string]: string[] } = {
    'gmail.com': ['gmial.com', 'gmai.com', 'gmil.com'],
    'yahoo.com': ['yaoo.com', 'yaho.com', 'yaho.co'],
    'outlook.com': ['outlok.com', 'outlo.com'],
    'hotmail.com': ['hotmial.com', 'hotmai.com'],
  }
  
  const domain = email.split('@')[1]?.toLowerCase()
  if (domain) {
    for (const [correctDomain, typos] of Object.entries(commonTypos)) {
      if (typos.includes(domain)) {
        errors.push({
          field: 'email',
          message: t('validation.emailTypo', `Did you mean ${correctDomain}?`).replace('{suggestion}', correctDomain),
        })
      }
    }
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
  
  // Basic validations
  errors.push(...validateName(data.name || '', 'Name'))
  errors.push(...validateNamePatterns(data.name || ''))
  
  errors.push(...validateEmail(data.email || ''))
  errors.push(...validateEmailDomain(data.email || ''))
  errors.push(...validateEmailFormat(data.email || ''))
  
  errors.push(...validatePassword(data.password || ''))
  errors.push(...validatePasswordPatterns(data.password || ''))
  
  errors.push(...validatePasswordConfirmation(data.password || '', data.password_confirmation || ''))
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate Login Form with Language Support
 */
export function validateLoginForm(data: {
  email?: string
  password?: string
}): ValidationResult {
  const errors: ValidationError[] = []
  
  if (!data.email || data.email.trim() === '') {
    errors.push({ field: 'email', message: t('auth.emailRequired', 'Email is required') })
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.push({ field: 'email', message: t('auth.invalidEmail', 'Please enter a valid email address') })
  }
  
  if (!data.password || data.password === '') {
    errors.push({ field: 'password', message: t('auth.passwordRequired', 'Password is required') })
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
    errors.push(...validateName(data.name, t('profile.firstName', 'First Name')))
    errors.push(...validateNamePatterns(data.name))
  }
  
  if (data.email) {
    errors.push(...validateEmail(data.email))
    errors.push(...validateEmailDomain(data.email))
  }
  
  // If changing password
  if (data.new_password) {
    if (!data.current_password || data.current_password === '') {
      errors.push({ field: 'current_password', message: t('validation.required', 'This field is required') })
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
 * Validate start date is not in the past
 */
export function validateStartDateNotInPast(startDate: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!startDate) {
    return errors // Optional field
  }
  
  const dateObj = new Date(startDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (dateObj < today) {
    errors.push({ field: 'start_date', message: t('tasks.startDateInPast', 'Start date cannot be in the past') })
  }
  
  return errors
}

/**
 * Validate due date is after or equal to start date
 */
export function validateDueDateAfterStartDate(startDate: string, dueDate: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!startDate || !dueDate) {
    return errors
  }
  
  const start = new Date(startDate)
  const due = new Date(dueDate)
  
  if (due < start) {
    errors.push({ field: 'due_date', message: t('tasks.dueDateBeforeStart', 'Due date must be after or equal to start date') })
  }
  
  return errors
}

/**
 * Validate urgent task deadline (within 48 hours)
 */
export function validateUrgentDeadline(priority: string, dueDate: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (priority !== 'urgent' || !dueDate) {
    return errors
  }
  
  const due = new Date(dueDate)
  const now = new Date()
  const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  if (hoursUntilDue > 48 * 24) { // More than 48 days in the future
    errors.push({ 
      field: 'due_date', 
      message: t('tasks.urgentDeadlineTooFar', 'Urgent tasks must have a deadline within 48 hours')
    })
  }
  
  return errors
}

/**
 * Validate high/urgent priority requires description with language support
 */
export function validateHighPriorityDescription(priority: string, description: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if ((priority === 'high' || priority === 'urgent') && (!description || description.trim() === '')) {
    if (priority === 'high') {
      errors.push({ 
        field: 'description', 
        message: t('tasks.highPriorityRequiresDescription', 'High priority tasks require a description')
      })
    } else if (priority === 'urgent') {
      errors.push({ 
        field: 'description', 
        message: t('tasks.urgentPriorityRequiresDescription', 'Urgent priority tasks require a description')
      })
    }
  }
  
  return errors
}

/**
 * Validate restricted keywords in title
 */
export function validateRestrictedKeywords(title: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  // List of restricted/offensive keywords
  const restrictedKeywords = [
    'spam',
    'scam',
    'inappropriate',
    'offensive',
    'banned',
  ]
  
  const lowerTitle = title.toLowerCase()
  for (const keyword of restrictedKeywords) {
    if (lowerTitle.includes(keyword)) {
      errors.push({ 
        field: 'title', 
        message: `Title contains restricted content. Please revise.` 
      })
      break
    }
  }
  
  return errors
}

/**
 * Validate no special characters except basic punctuation
 * Supports Unicode letters including Amharic, Arabic, Chinese, etc.
 */
export function validateTitleCharacters(title: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Allow Unicode letters (including Amharic, Arabic, etc.), numbers, spaces, and basic punctuation
  // Uses a blacklist approach - reject only clearly invalid/dangerous characters
  const invalidCharactersRegex = /[<>{}[\]\\^`|]/
  
  if (invalidCharactersRegex.test(title)) {
    errors.push({ 
      field: 'title', 
      message: 'Title contains invalid characters. Please use letters, numbers, and basic punctuation.' 
    })
  }
  
  return errors
}

/**
 * Validate Create Task Form (Advanced with Business Rules)
 */
export function validateCreateTaskForm(data: {
  title?: string
  description?: string
  notes?: string
  priority?: string
  due_date?: string
  due_time?: string
  start_date?: string
  start_time?: string
  category_id?: string | number
}): ValidationResult {
  const errors: ValidationError[] = []
  
  // Basic validations
  errors.push(...validateTaskTitle(data.title || ''))
  errors.push(...validateRestrictedKeywords(data.title || ''))
  errors.push(...validateTitleCharacters(data.title || ''))
  
  if (data.description) {
    errors.push(...validateTaskDescription(data.description))
  }
  
  if (data.notes) {
    errors.push(...validateTaskNotes(data.notes))
  }
  
  errors.push(...validatePriority(data.priority || ''))
  
  // Date validations
  if (data.due_date) {
    errors.push(...validateDate(data.due_date, 'Due date'))
  }
  
  // Business rule: Start date cannot be in the past
  if (data.start_date) {
    errors.push(...validateStartDateNotInPast(data.start_date))
  }
  
  // Business rule: Due date must be after or equal to start date
  if (data.start_date && data.due_date) {
    errors.push(...validateDueDateAfterStartDate(data.start_date, data.due_date))
  }
  
  // Business rule: Urgent tasks must have a near deadline
  if (data.priority && data.due_date) {
    errors.push(...validateUrgentDeadline(data.priority, data.due_date))
  }
  
  // Business rule: High/Urgent priority requires description
  if (data.priority && data.priority !== 'low' && data.priority !== 'medium') {
    errors.push(...validateHighPriorityDescription(data.priority, data.description || ''))
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Get urgent deadline hint (48 hours from now)
 */
export function getUrgentDeadlineHint(): string {
  const in48Hours = new Date(Date.now() + 48 * 60 * 60 * 1000)
  return in48Hours.toISOString().split('T')[0]
}

/**
 * Calculate hours until deadline
 */
export function calculateHoursUntilDeadline(dueDate: string): number {
  const due = new Date(dueDate)
  const now = new Date()
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60))
}

/**
 * Check if description warning should show (for high/urgent priority)
 */
export function shouldShowDescriptionWarning(priority: string): boolean {
  return priority === 'high' || priority === 'urgent'
}


/**
 * Get first error message for a field
 */
export function getFieldError(errors: ValidationError[], fieldName: string): string {
  const error = errors.find(e => e.field === fieldName)
  return error?.message || ''
}

/**
 * Check if field has error
 */
export function hasFieldError(errors: ValidationError[], fieldName: string): boolean {
  return errors.some(e => e.field === fieldName)
}
