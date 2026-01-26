import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.is_admin || false)

  const loadUser = () => {
    if (process.client) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        user.value = JSON.parse(userStr)
      }
    }
  }

  const setUser = (userData: any) => {
    user.value = userData
    if (process.client) {
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('telegram_id', userData.telegram_id?.toString() || '')
      localStorage.setItem('is_admin', userData.is_admin?.toString() || 'false')
    }
  }

  const logout = () => {
    user.value = null
    if (process.client) {
      localStorage.clear()
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    loadUser,
    setUser,
    logout
  }
})