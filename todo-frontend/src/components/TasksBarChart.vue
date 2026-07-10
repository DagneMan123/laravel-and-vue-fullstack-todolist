<template>
  <div :class="[
    'w-full p-3 sm:p-6 rounded-lg border',
    isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200'
  ]">
    <h3 class="text-base sm:text-lg font-bold mb-3 sm:mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
      Tasks by Priority
    </h3>
    
    <div v-if="loading" class="flex items-center justify-center h-48 sm:h-80">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2" :class="isDark ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>
    
    <div v-else class="overflow-x-auto">
      <div class="min-w-full">
        <Bar
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
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useThemeStore } from '@/stores/theme'
import api from '@/services/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const priorityData = ref<any>(null)
const loading = ref(true)

// Fetch real data from backend
async function fetchPriorityData() {
  try {
    loading.value = true
    const response = await api.get('/tasks/chart/priority')
    priorityData.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch priority data:', error)
    priorityData.value = null
  } finally {
    loading.value = false
  }
}

const chartData = computed(() => {
  if (!priorityData.value) {
    return {
      labels: ['High', 'Medium', 'Low'],
      datasets: [],
    }
  }

  return {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Total Tasks',
        data: [
          priorityData.value.high.total,
          priorityData.value.medium.total,
          priorityData.value.low.total,
        ],
        // 🔴 ማብራሪያው (Legend) ላይ ካለው ጋር እንዲገጥም ሁሉም ቱታል ታስኮች ቀይ ብቻ ሆኑ
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        borderWidth: 1.5,
        borderRadius: 4,
        hoverBackgroundColor: '#dc2626',
      },
      {
        label: 'Completed',
        data: [
          priorityData.value.high.completed,
          priorityData.value.medium.completed,
          priorityData.value.low.completed,
        ],
        // 🟢 ማብራሪያው (Legend) ላይ ካለው ጋር እንዲገጥም ሁሉም የተጠናቀቁት አረንጓዴ ብቻ ሆኑ
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1.5,
        borderRadius: 4,
        hoverBackgroundColor: '#059669',
      },
    ],
  }
})

const chartOptions = computed(() => {
  return {
    indexAxis: 'x' as const,
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: isDark.value ? '#e5e7eb' : '#374151',
          usePointStyle: true, // 🟢 ካሬውን ወደ ክብ በመቀየር ይበልጥ ዘመናዊ መልክ ይሰጠዋል
          pointStyle: 'circle',
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
            return ' ' + context.dataset.label + ': ' + context.parsed.y + ' tasks'
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark.value ? 'rgba(75, 85, 99, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: isDark.value ? '#9ca3af' : '#6b7280',
          stepSize: 1,   // 🔢 ቁጥሮቹ 0, 1, 2, 3 እያሉ በሙሉ ቁጥር ብቻ እንዲጨምሩ ያደርጋል
          precision: 0,  // 🛑 የነጥብ ቁጥሮችን (0.2, 0.4...) ያጠፋል
          font: {
            size: 11,
          },
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
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
    },
  }
})

onMounted(() => {
  fetchPriorityData()
})
</script>