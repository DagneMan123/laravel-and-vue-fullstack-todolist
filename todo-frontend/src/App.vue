<template>
  <div id="app" class="app-container">
    <router-view />
    <NotificationContainer />
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import NotificationContainer from '@/components/NotificationContainer.vue'


const authStore = useAuthStore()
const themeStore = useThemeStore()

onMounted(() => {
  authStore.checkAuth()
  // Theme is automatically initialized in the store
})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>