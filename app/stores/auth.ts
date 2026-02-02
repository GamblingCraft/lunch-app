// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  
  const isAuthenticated = computed(() => {
    if (!user.value) {
      // Проверяем localStorage как fallback
      if (process.client) {
        const userStr = localStorage.getItem('user')
        return !!userStr
      }
      return false
    }
    return true
  })
  
  const isAdmin = computed(() => {
    if (user.value?.is_admin) {
      return true
    }
    
    // Проверяем localStorage как fallback
    if (process.client) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          return userData.is_admin === true
        } catch {
          return false
        }
      }
    }
    
    return false
  })

  const loadUser = () => {
    if (process.client) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          user.value = JSON.parse(userStr)
        } catch (error) {
          console.error('Ошибка загрузки пользователя из localStorage:', error)
          user.value = null
        }
      }
    }
  }

  const setUser = (userData: any) => {
    user.value = userData
    if (process.client) {
      localStorage.setItem('user', JSON.stringify(userData))
      // Дополнительные проверки
      if (userData.is_admin) {
        localStorage.setItem('is_admin', 'true')
      } else {
        localStorage.setItem('is_admin', 'false')
      }
    }
  }

  const logout = () => {
    user.value = null
    if (process.client) {
      localStorage.removeItem('user')
      localStorage.removeItem('telegram_id')
      localStorage.removeItem('is_admin')
      localStorage.removeItem('auth_timestamp')
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