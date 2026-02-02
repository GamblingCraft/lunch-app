<template>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  if (process.client) {
    authStore.loadUser()
    
    if (!authStore.isAuthenticated) {
      return navigateTo('/auth')
    }
    
    if (!authStore.isAdmin) {
      console.warn('Попытка доступа к админке без прав')
      return navigateTo('/cabinet')
    }
  }
})
</script>