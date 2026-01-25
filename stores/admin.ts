import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  // Данные статистики
  const stats = ref({
    totalUsers: 0,
    totalOrders: 0,
    todayOrders: 0,
    pendingOrders: 0
  })

  // Загрузка данных
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Методы для загрузки данных
  const loadStats = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Здесь будет API запрос
      // Пока используем мок данные
      stats.value = {
        totalUsers: 245,
        totalOrders: 1205,
        todayOrders: 45,
        pendingOrders: 12
      }
    } catch (err) {
      error.value = 'Ошибка загрузки статистики'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    loading,
    error,
    loadStats
  }
})