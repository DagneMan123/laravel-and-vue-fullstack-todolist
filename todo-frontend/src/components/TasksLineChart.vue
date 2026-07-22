<template>
  <div :class="[
    'w-full p-3 sm:p-6 rounded-lg border',
    isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200'
  ]">
    <h3 class="text-base sm:text-lg font-bold mb-3 sm:mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
      {{ $t('charts.taskCompletionTrend') }}
    </h3>
    
    <div v-if="loading" class="flex items-center justify-center h-48 sm:h-80">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2" :class="isDark ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>
    
    <div v-else class="overflow-x-auto">
      <div class="min-w-full">
        <Line
          :data="chartData"
          :options="chartOptions"
          class="max-h-48 sm:max-h-80"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { useThemeStore } from '@/stores/theme'
import api from '@/services/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const { t } = useI18n()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const trendData = ref<any[]>([])
const loading = ref(true)

// Fetch real data from backend
async function fetchTrendData() {
  try {
    loading.value = true
    const response = await api.get('/tasks/chart/trend?days=7')
    trendData.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch trend data:', error)
    trendData.value = []
  } finally {
    loading.value = false
  }
}

// Format date with month translation
const formatDateWithMonth = (dateString: string): string => {
  if (!dateString) return ''
  
  const dateObj = new Date(dateString)
  const monthIndex = dateObj.getMonth()
  const day = dateObj.getDate()
  
  // Get translated month name from calendar structure
  const monthName = t(`calendar.months.${monthIndex}`)
  
  return `${monthName} ${day}`
}

const chartData = computed(() => {
  // Use the labels from API or generate fallback data
  const labels = trendData.value.length > 0
    ? trendData.value.map(item => formatDateWithMonth(item.label))
    : ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7']
  
  const completedData = trendData.value.length > 0
    ? trendData.value.map(item => item.completed)
    : [3, 5, 2, 7, 4, 6, 8]
  
  const pendingData = trendData.value.length > 0
    ? trendData.value.map(item => item.pending)
    : [5, 3, 6, 1, 4, 2, 0]

  return {
    labels,
    datasets: [
      {
        label: t('charts.completedTasks'),
        data: completedData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      },
      {
        label: t('charts.pendingTasks'),
        data: pendingData,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      },
    ],
  }
})

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: isDark.value ? '#e5e7eb' : '#374151',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: isDark.value ? '#111827' : '#fff',
        titleColor: isDark.value ? '#f3f4f6' : '#111827',
        bodyColor: isDark.value ? '#e5e7eb' : '#374151',
        borderColor: isDark.value ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || ''
            const value = context.parsed.y || 0
            return `${label}: ${value}`
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark.value ? 'rgba(75, 85, 99, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: isDark.value ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
          },
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: isDark.value ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  }
})

onMounted(() => {
  fetchTrendData()
})
</script>