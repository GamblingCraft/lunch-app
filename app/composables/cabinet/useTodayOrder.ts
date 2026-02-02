// app/composables/useTodayOrder.ts
import { ref } from 'vue'

export interface TodayOrder {
  [category: string]: string
}

export function useTodayOrder(userId: number) {
  const todayOrder = ref<TodayOrder>({})
  const todayName = ref('')
  const loading = ref(false)

  const loadTodayOrder = async () => {
    if (!userId) return

    loading.value = true
    try {
      const today = new Date()
      const days = [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота'
      ]
      todayName.value = days[today.getDay()]

      const response = await $fetch('/api/orders/my', {
        query: { userId }
      })

      if (response?.success && response.currentOrder) {
        const orders = response.currentOrder.orders || {}
        todayOrder.value = orders[todayName.value] || {}
      } else {
        todayOrder.value = {}
      }
    } catch (e) {
      console.error('Ошибка загрузки обеда:', e)
      todayOrder.value = {}
    } finally {
      loading.value = false
    }
  }

  return {
    todayOrder,
    todayName,
    loading,
    loadTodayOrder
  }
}
