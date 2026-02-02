<!-- app/layouts/admin.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <AdminHeader />
    <div class="flex">
      <AdminSidebar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '~/components/admin/layout/AdminHeader.vue'
import AdminSidebar from '~/components/admin/layout/AdminSidebar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  if (process.client) {
    authStore.loadUser()
    
    if (!authStore.isAuthenticated) {
      return navigateTo('/auth')
    }
    
    if (!authStore.isAdmin) {
      return navigateTo('/cabinet')
    }
  }
})
</script>