<!-- app/pages/cabinet/menu.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Шапка -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-3">
            <button 
              @click="goBack"
              class="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-800">Актуальное меню</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ user.fio }}</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Информация о неделе -->
      <div class="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ week.week_period }}</h2>
            <div class="flex items-center space-x-2">
              <p class="text-gray-600">Текущая неделя</p>
              <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Актуально
              </span>
            </div>
          </div>
          
          <div class="text-right">
            <p class="text-sm text-gray-500">Обновлено</p>
            <p class="font-medium text-gray-700">
              {{ formatDate(week.updated_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Таблица меню -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">День недели</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Салат</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Суп</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Горячее</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Гарнир</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="day in days" 
                :key="day"
                :class="{
                  'bg-blue-50': isToday(day)
                }"
                class="transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">{{ day }}</div>
                    <span v-if="isToday(day)" class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Сегодня
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <span 
                      v-for="(dish, index) in getDishes(day, 'Салат')" 
                      :key="index"
                      class="block text-sm text-gray-800"
                    >
                      {{ dish }}
                    </span>
                    <span 
                      v-if="getDishes(day, 'Салат').length === 0"
                      class="text-sm text-gray-400"
                    >
                      —
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <span 
                      v-for="(dish, index) in getDishes(day, 'Суп')" 
                      :key="index"
                      class="block text-sm text-gray-800"
                    >
                      {{ dish }}
                    </span>
                    <span 
                      v-if="getDishes(day, 'Суп').length === 0"
                      class="text-sm text-gray-400"
                    >
                      —
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <span 
                      v-for="(dish, index) in getDishes(day, 'Горячее')" 
                      :key="index"
                      class="block text-sm text-gray-800"
                    >
                      {{ dish }}
                    </span>
                    <span 
                      v-if="getDishes(day, 'Горячее').length === 0"
                      class="text-sm text-gray-400"
                    >
                      —
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <span 
                      v-for="(dish, index) in getDishes(day, 'Гарнир')" 
                      :key="index"
                      class="block text-sm text-gray-800"
                    >
                      {{ dish }}
                    </span>
                    <span 
                      v-if="getDishes(day, 'Гарнир').length === 0"
                      class="text-sm text-gray-400"
                    >
                      —
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Итоги -->
        <div class="p-4 bg-gray-50 border-t border-gray-200">
          <div class="flex items-center justify-between text-sm">
            <div>
              <span class="text-gray-700">Всего блюд: <strong>{{ totalDishesCount }}</strong></span>
              <span class="ml-4 text-gray-700">
                Доступно дней: <strong>{{ availableDays }}</strong>
              </span>
            </div>
            <div class="text-gray-600">
              <span v-if="userOrderExists" class="text-green-600 mr-2">
                ✓ Ваш заказ оформлен
              </span>
              <span v-else class="text-yellow-600">
                ⚠ Заказ не оформлен
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Подсказка -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h1m0 0h-1m1 0v4m-3 0V9a1 1 0 011-1h1a1 1 0 011 1v7m-4 0h4"/>
          </svg>
          <div>
            <p class="text-sm text-blue-700">
              <strong>Внимание!</strong> Вы смотрите меню текущей недели. 
              
            </p>
            <div class="mt-2">
              <NuxtLink 
                to="/cabinet/week-order" 
                class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                Сделать заказ на следующую неделю
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#app'
import { useAuthStore } from '@/stores/auth'


interface User {
  id: number
  fio: string
  email: string
  department: string
  isAdmin: boolean
}

interface Week {
  week_code: string
  week_period: string
  updated_at: string
  created_at: string
  is_current: boolean
}

interface Menu {
  [day: string]: {
    [category: string]: string[]
  }
}

const router = useRouter()
const user = ref<User>({
  id: 0,
  fio: '',
  email: '',
  department: '',
  isAdmin: false
})

const week = ref<Week>({
  week_code: '',
  week_period: '',
  updated_at: '',
  created_at: '',
  is_current: false
})

const menu = ref<Menu>({})
const userOrderExists = ref(false)
const loading = ref(true)

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
const categories = ['Салат', 'Суп', 'Горячее', 'Гарнир']

// Вычисляемые свойства
const totalDishesCount = computed(() => {
  let count = 0
  for (const day of days) {
    for (const category of categories) {
      const dishes = menu.value[day]?.[category]
      if (dishes && Array.isArray(dishes)) {
        count += dishes.length
      }
    }
  }
  return count
})

const availableDays = computed(() => {
  return days.filter(day => {
    const dayMenu = menu.value[day]
    if (!dayMenu) return false
    
    return categories.some(category => {
      const dishes = dayMenu[category]
      return dishes && dishes.length > 0
    })
  }).length
})

// Методы
const getDishes = (day: string, category: string): string[] => {
  return menu.value[day]?.[category] || []
}

const isToday = (day: string): boolean => {
  const today = new Date().getDay()
  const daysMap: Record<number, string> = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница'
  }
  
  const todayName = daysMap[today]
  return day === todayName
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

onMounted(async () => {
  if (process.client) {
    user.value.id = Number(localStorage.getItem('user_id')) || 0
    user.value.fio = localStorage.getItem('user_fio') || 'Сотрудник'
    user.value.department = localStorage.getItem('user_department') || ''
  }

  try {
    // Загружаем текущее меню
    const response = await fetch('/api/menu/current')
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        week.value = data.week
        menu.value = data.menu
      }
    }

    // Проверяем, есть ли заказ пользователя
    const orderResponse = await fetch(`/api/orders/my?userId=${user.value.id}`)
    if (orderResponse.ok) {
      const orderData = await orderResponse.json()
      userOrderExists.value = !!orderData.success && !!orderData.currentOrder
    }
  } catch (error) {
    console.error('Ошибка загрузки меню:', error)
  } finally {
    loading.value = false
  }
})

const goBack = () => {
  router.push('/cabinet')
}
</script>