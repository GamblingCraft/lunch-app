<!-- components/cabinet/today/TodayLunchBlock.vue -->
<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
    <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
      <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      Ваш обед на сегодня ({{ todayName }})
    </h3>

    <!-- Загрузка -->
    <div v-if="loading" class="text-center py-6">
      <svg class="animate-spin h-8 w-8 text-accent-500 mx-auto" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-2 text-gray-600">Загрузка заказа...</p>
    </div>

    <!-- ЕСТЬ ЗАКАЗ -->
    <div
      v-else-if="hasOrder"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="(dish, category) in todayOrder"
        :key="category"
        class="bg-gray-50 rounded-lg p-4 border border-gray-200"
      >
        <p class="text-sm text-gray-500 mb-1">{{ category }}</p>
        <p class="font-medium text-gray-800">{{ dish }}</p>
      </div>
    </div>

    <!-- НЕТ ЗАКАЗА — ПУСТОЕ СОСТОЯНИЕ -->
    <div
      v-else
      class="text-center py-8 text-gray-500"
    >
      <svg
        class="w-12 h-12 mx-auto text-gray-400 mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>

      <p class="mb-2">
        Вы еще не сделали заказ на сегодня
      </p>

      <NuxtLink
        to="/cabinet/week-order"
        class="text-accent-600 hover:text-accent-800 text-sm inline-block"
      >
        Сделать заказ на неделю
      </NuxtLink>
    </div>

    <!-- ВРЕМЯ ОБЕДА -->
    <div
      v-if="department && !loading"
      class="mt-4 pt-4 border-t border-gray-200"
    >
      <p class="text-gray-700">
        <span class="font-medium">Время обеда:</span>
        {{ getLunchTime(department) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { getLunchTime } from '~/utils/cabinet/lunchSchedule'

const authStore = useAuthStore()

// Состояние
const todayOrder = ref<Record<string, string> | null>(null)
const loading = ref(true)

// Данные пользователя
const department = computed(() => {
  return authStore.user?.department || ''
})

// Сегодняшний день
const todayName = computed(() => {
  const today = new Date().getDay()
  const daysMap: Record<number, string> = {
    0: 'Воскресенье',
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота'
  }
  return daysMap[today] || 'Сегодня'
})

// Проверка наличия заказа
const hasOrder = computed(() => {
  if (!todayOrder.value) return false
  const keys = Object.keys(todayOrder.value)
  return keys.length > 0 && keys.some(key => todayOrder.value![key]?.trim())
})

// Загрузка заказа на сегодня
const loadTodayOrder = async () => {
  if (!authStore.user?.id) {
    loading.value = false
    return
  }

  loading.value = true
  
  try {
    const response = await $fetch(`/api/orders/today?userId=${authStore.user.id}`)
    
    if (response.success) {
      todayOrder.value = response.todayOrder || {}
    }
  } catch (err) {
    console.error('Ошибка загрузки заказа:', err)
    todayOrder.value = {}
  } finally {
    loading.value = false
  }
}

// Загружаем при монтировании
onMounted(() => {
  // Даем время на загрузку пользователя
  setTimeout(() => {
    loadTodayOrder()
  }, 100)
})
</script>