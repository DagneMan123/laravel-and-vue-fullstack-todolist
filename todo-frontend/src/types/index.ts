export interface User {
  id: number
  name: string
  email: string
  avatar: string
  created_at: string
  task_count?: number
}

export interface Task {
  id: number
  user_id: number
  activity_id?: number
  project_id?: number
  category_id?: number
  category_name?: string
  title: string
  description?: string
  notes?: string
  status?: string
  is_completed: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  start_date?: string
  start_time?: string
  due_date?: string
  due_time?: string
  completed_at?: string
  created_at: string
  updated_at: string
  is_overdue: boolean
  can_edit: boolean
}

export interface TaskFormData {
  title: string
  description?: string
  notes?: string
  activity_id?: number
  project_id?: number
  category_id?: number
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  start_date?: string
  due_date?: string
  due_time?: string
}

export interface Project {
  id: number
  user_id: number
  name: string
  description?: string
  start_date?: string
  end_date?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'active' | 'completed' | 'archived' | 'on_hold'
  color: string
  progress: number
  activities_count: number
  tasks_count: number
  completed_tasks_count: number
  created_at: string
  updated_at: string
}

export interface ProjectFormData {
  name: string
  description?: string
  start_date?: string
  end_date?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  status?: 'active' | 'completed' | 'archived' | 'on_hold'
  color?: string
}

export interface Activity {
  id: number
  project_id: number
  name: string
  description?: string
  due_date?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
  estimated_duration?: number
  is_archived: boolean
  tasks_count: number
  completed_tasks_count: number
  progress: number
  created_at: string
  updated_at: string
}

export interface ActivityFormData {
  project_id: number
  name: string
  description?: string
  due_date?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
  estimated_duration?: number
  is_archived?: boolean
}

export interface Category {
  id: number
  user_id: number
  name: string
  color: string
  tasks_count: number
  created_at: string
  updated_at: string
}

export interface CategoryFormData {
  name: string
  color?: string
}

export interface Notification {
  id: number
  user_id: number
  type: string
  title: string
  message: string
  title_params: Record<string, any>
  message_params: Record<string, any>
  is_read: boolean
  read_at?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ApiResponse<T = any> {
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  next_page_url: string | null
  prev_page_url: string | null
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
  upcoming: number
}

export interface TaskFilters {
  status: 'all' | 'pending' | 'completed' | null
  priority: 'all' | 'low' | 'medium' | 'high' | 'urgent' | null
  search: string
  sort_by: 'created_at' | 'title' | 'priority' | 'due_date' | 'is_completed'
  sort_direction: 'asc' | 'desc'
  dateFilter: 'all' | 'overdue' | 'today' | 'this_week' | 'next_week' | 'this_month'
}