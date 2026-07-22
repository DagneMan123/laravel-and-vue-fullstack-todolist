<template>
  <AppLayout>
    <div class="p-4 sm:p-6">
      
      <!-- ========== TASK LIST VIEW ========== -->
      <div v-if="!showCalendarView">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ t('tasks.allTasks') }}
            </h1>
            <p class="mt-1 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              {{ t('layout.searchProjectsAndTasks') }}
            </p>
          </div>
          
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <button 
              @click="toggleCalendarView"
              :class="[
                'flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors w-full sm:w-auto',
                isDark 
                  ? 'bg-[#1a1f2e] text-gray-200 border-gray-700 hover:bg-gray-800' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              {{ t('tasks.calendar') }}
            </button>

            <button 
              @click="openCreateModal"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ t('tasks.addNewTask') }}
            </button>
          </div>
        </div>

        <!-- ===== MOBILE FILTERS TOGGLE ===== -->
        <div class="block sm:hidden mb-4">
          <button 
            @click="showMobileFilters = !showMobileFilters"
            class="w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors"
            :class="[
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' 
                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
            ]"
          >
            <span class="font-medium text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              {{ t('tasks.filterBy') }} & {{ t('tasks.sortBy') }}
              <span v-if="hasActiveFilters" class="ml-1 px-1.5 py-0.5 text-[10px] bg-blue-600 text-white rounded-full">{{ t('common.active') }}</span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showMobileFilters }">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

        <!-- ===== FILTERS ===== -->
        <div 
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 mb-6"
          :class="[
            'sm:grid',
            showMobileFilters ? 'grid' : 'hidden sm:grid'
          ]"
        >
          <div class="relative w-full">
            <input 
              v-model="searchQuery"
              @input="applyFilters"
              type="search"
              :placeholder="t('layout.searchProjectsAndTasks')"
              :class="[
                'w-full px-4 py-2 text-sm rounded-lg border transition-colors',
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              ]"
            >
          </div>
          
          <div class="relative w-full">
            <select 
              v-model="filterStatus" 
              @change="applyFilters" 
              :class="[
                'w-full px-4 py-2 text-sm rounded-lg border transition-colors appearance-none',
                isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              ]"
            >
              <option value="all">{{ t('common.noData') }}</option>
              <option value="pending">{{ t('tasks.pending') }}</option>
              <option value="completed">{{ t('tasks.completed') }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </div>

          <div class="relative w-full">
            <select 
              v-model="filterPriority" 
              @change="applyFilters" 
              :class="[
                'w-full px-4 py-2 text-sm rounded-lg border transition-colors appearance-none',
                isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              ]"
            >
              <option value="all">{{ t('common.Priority') }}</option>
              <option value="low">{{ t('tasks.low') }}</option>
              <option value="medium">{{ t('tasks.medium') }}</option>
              <option value="high">{{ t('tasks.high') }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </div>

          <div class="relative w-full">
            <select 
              v-model="filterDateRange" 
              @change="applyFilters" 
              :class="[
                'w-full px-4 py-2 text-sm rounded-lg border transition-colors appearance-none',
                isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              ]"
            >
              <option value="all">{{ t('common.All Date') }}</option>
              <option value="overdue">{{ t('tasks.overdue') }}</option>
              <option value="today">{{ t('tasks.today') }}</option>
              <option value="this_week">{{ t('tasks.thisWeek') }}</option>
              <option value="next_week">{{ t('tasks.nextweek') }}</option>
              <option value="this_month">{{ t('tasks.thisMonth') }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </div>

          <div class="relative w-full">
            <select 
              v-model="sortBy" 
              @change="applyFilters" 
              :class="[
                'w-full px-4 py-2 text-sm rounded-lg border transition-colors appearance-none',
                isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              ]"
            >
              <option value="created_at">{{ t('common.newest') }}</option>
              <option value="due_date">{{ t('tasks.dueDate') }}</option>
              <option value="start_date">{{ t('tasks.startdate') }}</option>
              <option value="priority">{{ t('tasks.priority') }}</option>
              <option value="title">{{ t('tasks.taskTitle') }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </div>

          <button 
            @click="resetFilters" 
            :class="[
              'px-4 py-2 text-sm rounded-lg border transition-colors font-medium w-full',
              isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
            ]"
          >
            {{ t('common.reset') }} {{ t('tasks.filterBy') }}
          </button>
        </div>

        <!-- ===== VIEW MODE DROPDOWN ===== -->
        <div class="flex justify-end mb-6">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('tasks.view') }}:</span>
              <div class="relative">
                <select
                  v-model="viewMode"
                  @change="handleViewChange"
                  class="appearance-none px-3 py-1.5 pr-7 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="[
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <option value="list">📋 {{ t('tasks.listview') }}</option>
                  <option value="grid">📊 {{ t('tasks.gridview') }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <span 
                class="text-xs px-2 py-0.5 rounded-full"
                :class="viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'"
              >
               {{ viewMode === 'list' ? '📋 ' + t('tasks.list') : '📊 ' + t('tasks.grid') }}
              </span>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400">
           {{ filteredTasks.length }} {{ filteredTasks.length === 1 ? t('tasks.task') : t('tasks.tasks') }}
           </span>
          </div>
        </div>

        <!-- ===== TASK LIST (LIST VIEW) ===== -->
        <div v-if="viewMode === 'list' && filteredTasks.length > 0" class="space-y-2.5">
          <TaskCard
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            view-mode="list"
            @toggle="handleToggleComplete"
            @edit="editTask"
            @delete="deleteTask"
          />
        </div>

        <!-- ===== TASK GRID (GRID VIEW) ===== -->
        <div v-else-if="viewMode === 'grid' && filteredTasks.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TaskCard
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            view-mode="grid"
            @toggle="handleToggleComplete"
            @edit="editTask"
            @delete="deleteTask"
          />
        </div>

        <!-- ===== EMPTY STATE ===== -->
        <div v-if="filteredTasks.length === 0" class="text-center py-16 border-2 border-dashed rounded-xl" :class="isDark ? 'border-gray-800' : 'border-gray-100'">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7 12a5 5 0 1110 0A5 5 0 017 12z" />
          </svg>
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
            {{ t('tasks.noTasks') }}
          </p>
        </div>
      </div>

      <!-- ========== CALENDAR VIEW ========== -->
      <div v-else class="animate-fadeIn">
        <!-- Calendar Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ t('calendar.calendar') }}
            </h1>
            <p class="mt-1 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              {{ t('calendar.subtitle') }}
            </p>
          </div>
          
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <button 
              @click="toggleCalendarView"
              class="px-4 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-full sm:w-auto"
              :class="[
                isDark 
                  ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
              {{ t('tasks.allTasks') }}
            </button>

            <button 
              @click="openCreateModal"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ t('tasks.addNewTask') }}
            </button>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Calendar -->
          <div :class="[
            'lg:col-span-2 p-6 rounded-xl border',
            isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200 shadow-sm'
          ]">
            <!-- Calendar Navigation -->
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ currentMonth }}
              </h2>
              <div class="flex gap-2 items-center">
                <button 
                  @click="goToToday" 
                  class="px-3 py-1 text-xs rounded-lg border transition-colors"
                  :class="[
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' 
                      : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ t('tasks.today') }}
                </button>
                <button 
                  @click="prevMonth" 
                  class="px-3 py-1 rounded-lg border transition-colors"
                  :class="[
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' 
                      : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  ←
                </button>
                <button 
                  @click="nextMonth" 
                  class="px-3 py-1 rounded-lg border transition-colors"
                  :class="[
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' 
                      : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  →
                </button>
              </div>
            </div>
            
            <!-- Calendar Days Grid -->
            <div class="grid grid-cols-7 gap-1.5">
              <div 
                v-for="day in dayHeaders" 
                :key="day" 
                class="text-center text-xs font-bold uppercase tracking-wider py-1"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ day.substring(0, 3) }}
              </div>
              
              <div 
                v-for="day in calendarDays" 
                :key="day.fullDate" 
                :class="[
                  'p-1.5 rounded-lg text-sm cursor-pointer transition-all min-h-[80px] flex flex-col border',
                  day.isCurrentMonth
                    ? day.isToday
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20'
                      : isDark 
                        ? 'bg-gray-800/50 border-gray-700/60 hover:bg-gray-700/50 text-gray-200' 
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-800'
                    : isDark 
                      ? 'bg-gray-900/40 border-transparent text-gray-600 opacity-40' 
                      : 'bg-gray-100/70 border-transparent text-gray-400 opacity-50'
                ]"
                @click="handleDayClick(day.fullDate)"
              >
                <!-- Date and Task Count -->
                <div class="flex justify-between items-start w-full">
                  <span class="font-bold text-xs">{{ day.date }}</span>
                  <span 
                    v-if="day.totalTaskCount > 0" 
                    class="text-[9px] px-1.5 py-0.5 rounded-full"
                    :class="[
                      day.isToday 
                        ? 'bg-white/30 text-white' 
                        : isDark 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-200 text-gray-700'
                    ]"
                  >
                    {{ day.totalTaskCount }}
                  </span>
                </div>
                
                <!-- Task Indicators -->
                <div class="flex-1 space-y-0.5 overflow-hidden mt-1 w-full">
                  <div 
                    v-for="task in day.sortedTasks.slice(0, 3)" 
                    :key="task.id" 
                    class="text-[9px] px-1 py-0.5 rounded truncate font-medium block w-full border cursor-pointer hover:opacity-80 transition-opacity"
                    :class="[
                      day.isToday 
                        ? 'bg-white text-gray-900 border-white' 
                        : task.priority === 'high'
                          ? 'bg-red-600/20 text-red-400 border-red-500/30'
                          : task.priority === 'medium'
                            ? 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                    ]"
                    :title="getTaskTooltip(task)"
                    @click.stop="openTaskDetail(task)"
                  >
                    <span v-if="isStartDate(task, day.fullDate) && isDueDate(task, day.fullDate)" class="mr-0.5">⚡</span>
                    <span v-else-if="isStartDate(task, day.fullDate)" class="mr-0.5">▶</span>
                    <span v-else-if="isDueDate(task, day.fullDate)" class="mr-0.5">●</span>
                    <span v-else class="mr-0.5">━</span>
                    
                    <span class="truncate">{{ task.title }}</span>
                    
                    <span v-if="isDueDate(task, day.fullDate) && task.due_time" class="ml-0.5 text-[7px] opacity-70 font-mono">
                      {{ formatTimeShort(task.due_time) }}
                    </span>
                    <span v-else-if="isStartDate(task, day.fullDate) && task.start_time" class="ml-0.5 text-[7px] opacity-70 font-mono">
                      {{ formatTimeShort(task.start_time) }}
                    </span>
                  </div>
                  
                  <div 
                    v-if="day.sortedTasks.length > 3" 
                    class="text-[8px] text-center opacity-60"
                    :class="day.isToday ? 'text-white' : ''"
                  >
                    +{{ day.sortedTasks.length - 3 }} {{ t('calendar.more') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Calendar Legend -->
            <div class="mt-4 pt-4 border-t flex flex-wrap gap-4 text-xs" :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'">
              <div class="flex items-center gap-1.5">
                <span class="inline-block w-3 h-3 rounded-full bg-red-500/40 border border-red-500/30"></span>
                <span>{{ t('tasks.high') }} {{ t('tasks.priority') }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="inline-block w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/30"></span>
                <span>{{ t('tasks.medium') }} {{ t('tasks.priority') }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="inline-block w-3 h-3 rounded-full bg-blue-500/40 border border-blue-500/30"></span>
                <span>{{ t('tasks.low') }} {{ t('tasks.priority') }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="inline-block w-3 h-3 rounded-full bg-blue-600"></span>
                <span>{{ t('tasks.today') }}</span>
              </div>
              <div class="flex items-center gap-1.5 ml-0 md:ml-auto">
                <span class="text-green-400">▶</span>
                <span>{{ t('tasks.startdate') }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-orange-400">●</span>
                <span>{{ t('tasks.dueDate') }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-purple-400">⚡</span>
                <span>{{ t('calendar.same_day') }}</span>
              </div>
            </div>
          </div>

          <!-- Upcoming Tasks Sidebar with FULL MONTH NAMES -->
          <div :class="[
            'p-6 rounded-xl border',
            isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200 shadow-sm'
          ]">
            <h3 class="text-lg font-bold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ t('calendar.upcoming') }}
            </h3>
            
            <div v-if="upcomingTasks.length === 0" class="text-center text-sm py-12" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ t('calendar.no_upcoming') }}
            </div>
            
            <div v-else class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              <div 
                v-for="task in upcomingTasks" 
                :key="task.id" 
                :class="[
                  'p-3 rounded-lg text-sm transition-colors cursor-pointer border',
                  isDark ? 'bg-gray-800/60 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100',
                  task.priority === 'high' 
                    ? 'border-red-500/30' 
                    : task.priority === 'medium' 
                      ? 'border-yellow-500/30' 
                      : 'border-blue-500/30'
                ]"
                @click="openTaskDetail(task)"
              >
                <p class="font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ task.title }}
                </p>
                
                <div class="flex flex-col gap-0.5 mt-1.5 text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  <!-- START DATE WITH TIME -->
                  <div v-if="task.start_date" class="flex items-center gap-1.5">
                    <span class="text-green-400">▶</span>
                    <span>{{ t('tasks.startdate') }}: {{ formatDateWithMonth(task.start_date) }}</span>
                    <span v-if="task.start_time" class="font-semibold text-gray-400">{{ formatTime(task.start_time) }}</span>
                  </div>
                  
                  <!-- DUE DATE WITH TIME -->
                  <div v-if="task.due_date" class="flex items-center gap-1.5">
                    <span :class="isOverdue(task) ? 'text-red-400' : 'text-orange-400'">●</span>
                    <span :class="isOverdue(task) ? 'text-red-400 font-medium' : ''">
                      {{ t('tasks.dueDate') }}: {{ formatDateWithMonth(task.due_date) }}
                    </span>
                    <span v-if="task.due_time" class="font-semibold text-gray-400">{{ formatTime(task.due_time) }}</span>
                    <span v-if="isOverdue(task)" class="text-red-400 font-bold ml-1">⚠️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Form Modal -->
      <TaskFormModal 
        v-if="showCreateModal"
        :task="editingTask"
        @close="closeCreateModal"
        @save="handleSave"
      />

      <!-- Task Detail Modal -->
      <TaskDetailModal
        :show="showTaskDetail"
        :task="selectedTask"
        @close="closeTaskDetail"
        @toggle="handleToggleComplete"
        @edit="editTask"
        @delete="deleteTask"
      />

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useTaskStore } from '@/stores/tasks'
import type { Task } from '@/types'
import AppLayout from '@/layouts/AppLayout.vue'
import TaskFormModal from '@/components/TaskFormModal.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskDetailModal from '@/components/TaskDetailModal.vue'

const { t } = useI18n()
const themeStore = useThemeStore()
const taskStore = useTaskStore()

const isDark = computed(() => themeStore.isDark)

// ─── State ───
const showCalendarView = ref(false)
const showCreateModal = ref(false)
const showMobileFilters = ref(false)
const editingTask = ref<Task | null>(null)
const currentDate = ref(new Date())
const viewMode = ref<'list' | 'grid'>('list')
const showTaskDetail = ref(false)
const selectedTask = ref<Task | null>(null)

// ─── Day Headers ───
const dayHeaders = computed(() => [
  t('calendar.sunday'),
  t('calendar.monday'),
  t('calendar.tuesday'),
  t('calendar.wednesday'),
  t('calendar.thursday'),
  t('calendar.friday'),
  t('calendar.saturday')
])

// ─── Current Month with Translation ───
const currentMonth = computed(() => {
  const monthIndex = currentDate.value.getMonth()
  const year = currentDate.value.getFullYear()
  const monthName = t(`calendar.months.${monthIndex}`)
  return `${monthName} ${year}`
})

// ─── Format Date with Month Translation ───
const formatDateWithMonth = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = date.getDate()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()
  const monthName = t(`calendar.months.${monthIndex}`)
  return `${monthName} ${day}, ${year}`
}

const formatTime = (time: string): string => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const minute = minutes || '00'
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minute} ${period}`
}

// ─── Load saved view preference ───
onMounted(() => {
  const savedMode = localStorage.getItem('taskViewMode') as 'list' | 'grid' | null
  if (savedMode && (savedMode === 'list' || savedMode === 'grid')) {
    viewMode.value = savedMode
  }
})

watch(viewMode, (newMode) => {
  localStorage.setItem('taskViewMode', newMode)
})

// ─── Filters ───
const searchQuery = ref('')
const filterStatus = ref('all')
const filterPriority = ref('all')
const filterDateRange = ref('all')
const sortBy = ref('created_at')

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' ||
         filterStatus.value !== 'all' ||
         filterPriority.value !== 'all' ||
         filterDateRange.value !== 'all' ||
         sortBy.value !== 'created_at'
})

// ─── Status Helpers ───
const isTaskPending = (task: Task): boolean => {
  return task.is_completed === false || task.is_completed === undefined
}

const isTaskCompleted = (task: Task): boolean => {
  return task.is_completed === true
}

// ─── Sort Helpers ───
const getPriorityWeight = (priority: string): number => {
  const priorityMap: Record<string, number> = { 
    high: 0, 
    medium: 1, 
    low: 2 
  }
  return priorityMap[priority?.toLowerCase?.()] ?? 3
}

// ─── Format Time Short ───
const formatTimeShort = (time: string): string => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const minute = minutes || '00'
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minute}${period}`
}

// ─── Filtered Tasks ───
const filteredTasks = computed(() => {
  let tasks = [...taskStore.tasks]

  if (filterStatus.value === 'pending') {
    tasks = tasks.filter(task => isTaskPending(task))
  } else if (filterStatus.value === 'completed') {
    tasks = tasks.filter(task => isTaskCompleted(task))
  }

  if (filterPriority.value !== 'all') {
    tasks = tasks.filter(task => task.priority === filterPriority.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    tasks = tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      (task.description?.toLowerCase().includes(query) || false)
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  const startOfNextWeek = new Date(endOfWeek)
  startOfNextWeek.setDate(endOfWeek.getDate() + 1)
  startOfNextWeek.setHours(0, 0, 0, 0)

  const endOfNextWeek = new Date(startOfNextWeek)
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6)

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  startOfMonth.setHours(0, 0, 0, 0)

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  endOfMonth.setHours(23, 59, 59, 999)

  switch (filterDateRange.value) {
    case 'overdue':
      tasks = tasks.filter(task => {
        if (!task.due_date || isTaskCompleted(task)) return false
        const dueDate = new Date(task.due_date)
        dueDate.setHours(0, 0, 0, 0)
        return dueDate < today
      })
      break

    case 'today':
      tasks = tasks.filter(task => {
        const dueDate = task.due_date ? new Date(task.due_date) : null
        const startDate = task.start_date ? new Date(task.start_date) : null
        
        if (dueDate) {
          dueDate.setHours(0, 0, 0, 0)
          if (dueDate.getTime() === today.getTime()) return true
        }
        if (startDate) {
          startDate.setHours(0, 0, 0, 0)
          if (startDate.getTime() === today.getTime()) return true
        }
        return false
      })
      break

    case 'this_week':
      tasks = tasks.filter(task => {
        const dueDate = task.due_date ? new Date(task.due_date) : null
        const startDate = task.start_date ? new Date(task.start_date) : null
        
        if (dueDate) {
          dueDate.setHours(0, 0, 0, 0)
          if (dueDate >= startOfWeek && dueDate <= endOfWeek) return true
        }
        if (startDate) {
          startDate.setHours(0, 0, 0, 0)
          if (startDate >= startOfWeek && startDate <= endOfWeek) return true
        }
        return false
      })
      break

    case 'next_week':
      tasks = tasks.filter(task => {
        const dueDate = task.due_date ? new Date(task.due_date) : null
        const startDate = task.start_date ? new Date(task.start_date) : null
        
        if (dueDate) {
          dueDate.setHours(0, 0, 0, 0)
          if (dueDate >= startOfNextWeek && dueDate <= endOfNextWeek) return true
        }
        if (startDate) {
          startDate.setHours(0, 0, 0, 0)
          if (startDate >= startOfNextWeek && startDate <= endOfNextWeek) return true
        }
        return false
      })
      break

    case 'this_month':
      tasks = tasks.filter(task => {
        const dueDate = task.due_date ? new Date(task.due_date) : null
        const startDate = task.start_date ? new Date(task.start_date) : null
        
        if (dueDate) {
          dueDate.setHours(0, 0, 0, 0)
          if (dueDate >= startOfMonth && dueDate <= endOfMonth) return true
        }
        if (startDate) {
          startDate.setHours(0, 0, 0, 0)
          if (startDate >= startOfMonth && startDate <= endOfMonth) return true
        }
        return false
      })
      break

    case 'all':
    default:
      break
  }

  switch (sortBy.value) {
    case 'created_at':
      tasks.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA
      })
      break

    case 'due_date':
      tasks.sort((a, b) => {
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      })
      break

    case 'start_date':
      tasks.sort((a, b) => {
        if (!a.start_date) return 1
        if (!b.start_date) return -1
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      })
      break

    case 'priority':
      tasks.sort((a, b) => getPriorityWeight(a.priority) - getPriorityWeight(b.priority))
      break

    case 'title':
      tasks.sort((a, b) => a.title.localeCompare(b.title))
      break

    default:
      break
  }

  return tasks
})

const isOverdue = (task: Task): boolean => {
  if (!task.due_date || isTaskCompleted(task)) return false
  const dueDate = new Date(task.due_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)
  return dueDate < today
}

const isStartDate = (task: Task, dateString: string): boolean => {
  if (!task.start_date) return false
  const startDate = new Date(task.start_date)
  const checkDate = new Date(dateString)
  return startDate.getFullYear() === checkDate.getFullYear() &&
         startDate.getMonth() === checkDate.getMonth() &&
         startDate.getDate() === checkDate.getDate()
}

const isDueDate = (task: Task, dateString: string): boolean => {
  if (!task.due_date) return false
  const dueDate = new Date(task.due_date)
  const checkDate = new Date(dateString)
  return dueDate.getFullYear() === checkDate.getFullYear() &&
         dueDate.getMonth() === checkDate.getMonth() &&
         dueDate.getDate() === checkDate.getDate()
}

const getTaskTooltip = (task: Task): string => {
  let tooltip = task.title
  if (task.start_date) {
    tooltip += `\n▶ ${t('tasks.startdate')}: ${formatDateWithMonth(task.start_date)}`
  }
  if (task.due_date) {
    tooltip += `\n● ${t('tasks.dueDate')}: ${formatDateWithMonth(task.due_date)}`
  }
  if (task.priority) {
    tooltip += `\n${t('tasks.priority')}: ${task.priority.toUpperCase()}`
  }
  return tooltip
}

// ─── Calendar Logic ───
const getTasksForDate = (year: number, month: number, day: number): Task[] => {
  return filteredTasks.value.filter(task => {
    if (isTaskCompleted(task)) return false
    
    const dueDate = task.due_date ? new Date(task.due_date) : null
    const startDate = task.start_date ? new Date(task.start_date) : null
    
    let appearsOnDate = false
    
    if (startDate) {
      const startMatch = startDate.getFullYear() === year && 
                         startDate.getMonth() === month && 
                         startDate.getDate() === day
      if (startMatch) appearsOnDate = true
    }
    
    if (dueDate && !appearsOnDate) {
      const dueMatch = dueDate.getFullYear() === year && 
                       dueDate.getMonth() === month && 
                       dueDate.getDate() === day
      if (dueMatch) appearsOnDate = true
    }
    
    return appearsOnDate
  })
}

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const today = new Date()

  const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 }
  const days = []

  for (let i = firstDay - 1; i >= 0; i--) {
    const date = daysInPrevMonth - i
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const tasks = getTasksForDate(prevYear, prevMonth, date)
    
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      tasks,
      sortedTasks: [...tasks].sort((a, b) => 
        (priorityWeight[b.priority?.toLowerCase()] || 0) - 
        (priorityWeight[a.priority?.toLowerCase()] || 0)
      ),
      totalTaskCount: tasks.length,
      fullDate: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = today.getDate() === i && 
                    today.getMonth() === month && 
                    today.getFullYear() === year
    const tasks = getTasksForDate(year, month, i)
    
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday,
      tasks,
      sortedTasks: [...tasks].sort((a, b) => 
        (priorityWeight[b.priority?.toLowerCase()] || 0) - 
        (priorityWeight[a.priority?.toLowerCase()] || 0)
      ),
      totalTaskCount: tasks.length,
      fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    })
  }

  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    const tasks = getTasksForDate(nextYear, nextMonth, i)
    
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      tasks,
      sortedTasks: [...tasks].sort((a, b) => 
        (priorityWeight[b.priority?.toLowerCase()] || 0) - 
        (priorityWeight[a.priority?.toLowerCase()] || 0)
      ),
      totalTaskCount: tasks.length,
      fullDate: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    })
  }

  return days
})

// ─── Upcoming Tasks ───
const upcomingTasks = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return filteredTasks.value
    .filter(task => {
      if (isTaskCompleted(task)) return false
      if (!task.due_date) return false
      const dueDate = new Date(task.due_date)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate >= today
    })
    .sort((a, b) => {
      const dateA = new Date(a.due_date!)
      const dateB = new Date(b.due_date!)
      return dateA.getTime() - dateB.getTime()
    })
    .slice(0, 5)
})

// ─── Calendar Navigation ───
const prevMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(), 
    currentDate.value.getMonth() - 1, 
    1
  )
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(), 
    currentDate.value.getMonth() + 1, 
    1
  )
}

const goToToday = () => {
  currentDate.value = new Date()
}

// ─── View Toggle ───
const toggleCalendarView = async () => {
  showCalendarView.value = !showCalendarView.value
  
  if (showCalendarView.value) {
    await taskStore.fetchTasks()
  }
}

// ─── View Mode ───
const handleViewChange = () => {
  localStorage.setItem('taskViewMode', viewMode.value)
}

const applyFilters = () => {
  taskStore.fetchTasks()
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = 'all'
  filterPriority.value = 'all'
  filterDateRange.value = 'all'
  sortBy.value = 'created_at'
  showMobileFilters.value = false
  applyFilters()
}

// ─── Task Detail Modal ───
const openTaskDetail = (task: Task) => {
  selectedTask.value = task
  showTaskDetail.value = true
}

const closeTaskDetail = () => {
  showTaskDetail.value = false
  selectedTask.value = null
}

// ─── Modal Handlers ───
const openCreateModal = () => {
  editingTask.value = null
  showCreateModal.value = true
}

const editTask = (task: Task) => {
  editingTask.value = task
  showCreateModal.value = true
  closeTaskDetail()
}

const closeCreateModal = () => {
  editingTask.value = null
  showCreateModal.value = false
}

const handleDayClick = (dateString: string) => {
  const selectedDate = new Date(dateString)
  const formattedDate = selectedDate.toISOString().split('T')[0]
  
  editingTask.value = {
    start_date: formattedDate,
    due_date: formattedDate
  } as Partial<Task> as Task
  
  showCreateModal.value = true
}

// ─── Task Actions ───
const handleToggleComplete = async (id: number) => {
  await taskStore.toggleComplete(id)
  await taskStore.fetchTasks()
  await taskStore.fetchStats()
  closeTaskDetail()
}

const deleteTask = async (id: number) => {
  if (confirm(t('tasks.deleteConfirmation'))) {
    const result = await taskStore.deleteTask(id)
    if (result.success) {
      await taskStore.fetchTasks()
      await taskStore.fetchStats()
      closeTaskDetail()
    }
  }
}

const handleSave = async () => {
  closeCreateModal()
  await taskStore.fetchTasks()
  await taskStore.fetchStats()
}

// ─── Lifecycle ───
onMounted(() => {
  taskStore.fetchTasks()
  taskStore.fetchStats()
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.22s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
}

select::-ms-expand {
  display: none;
}

@media (max-width: 640px) {
  select, input, button {
    min-height: 44px;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>