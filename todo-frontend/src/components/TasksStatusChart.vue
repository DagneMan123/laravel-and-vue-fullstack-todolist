<template>
  <div :class="[
    'w-full p-3 sm:p-6 rounded-lg border',
    isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200'
  ]">
    <h3 class="text-base sm:text-lg font-bold mb-3 sm:mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
      Task Status Overview
    </h3>
    <div class="flex items-center justify-center">
      <div class="w-full">
        <Doughnut
          :data="chartData"
          :options="chartOptions"
          class="max-h-48 sm:max-h-80 max-w-xs sm:max-w-sm mx-auto"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useThemeStore } from '@/stores/theme'
import { useTaskStore } from '@/stores/tasks'

ChartJS.register(ArcElement, Tooltip, Legend)

const themeStore = useThemeStore()
const taskStore = useTaskStore()

const isDark = computed(() => themeStore.isDark)

const chartData = computed(() => {
  const completed = taskStore.stats?.completed || 0
  const pending = taskStore.stats?.pending || 0
  const overdue = taskStore.stats?.overdue || 0

  return {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [completed, pending, overdue],
        backgroundColor: [
          '#10b981',
          '#f59e0b',
          '#ef4444',
        ],
        borderColor: [
          '#059669',
          '#d97706',
          '#dc2626',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#059669',
          '#d97706',
          '#dc2626',
        ],
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
        position: 'bottom' as const,
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
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          }
        }
      },
    },
  }
})
</script>
