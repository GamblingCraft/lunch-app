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
            <h1 class="text-xl font-semibold text-gray-800">Мои заказы</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ user.fio }}</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Заказ на текущую неделю -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Текущая неделя: {{ currentWeek?.week_period }}</h2>
        
        <div v-if="currentOrder" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <!-- Дни недели с заказами -->
          <div 
            v-for="day in days" 
            :key="day"
            class="border-b border-gray-200 last:border-b-0"
          >
            <div class="px-6 py-4 hover:bg-gray-50">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-gray-800">{{ day }}</h3>
                <span class="text-sm text-gray-500">
                  {{ getOrderStatus(day) }}
                </span>
              </div>
              
              <div v-if="currentOrder.orders[day]" class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div 
                  v-for="(dish, category) in currentOrder.orders[day]" 
                  :key="category"
                  class="bg-gray-50 rounded-lg p-3"
                >
                  <p class="text-sm text-gray-500 mb-1">{{ category }}</p>
                  <p class="font-medium text-gray-800">{{ dish }}</p>
                </div>
              </div>
              
              <div v-else class="text-center py-2 text-gray-500 bg-gray-50 rounded-lg">
                <p class="text-sm">Заказ на этот день не сделан</p>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p class="text-gray-600 mb-2">У вас нет заказа на текущую неделю</p>
          <NuxtLink to="/cabinet/week-order" class="text-accent-600 hover:text-accent-800">
            Сделать заказ на следующую неделю →
          </NuxtLink>
        </div>
      </div>

      <!-- История заказов -->
      <div>
        <h3 class="text-xl font-bold text-gray-800 mb-4">История заказов</h3>
        
        <div v-if="history.length > 0" class="space-y-4">
          <div 
            v-for="order in history" 
            :key="order.week_code"
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-semibold text-gray-800">{{ order.week_code }}</h4>
              <span class="text-sm text-gray-500">
                {{ new Date(order.created_at).toLocaleDateString('ru-RU') }}
              </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div 
                v-for="day in days" 
                :key="day"
                class="text-center"
              >
                <p class="text-sm font-medium text-gray-700 mb-1">{{ day }}</p>
                <div v-if="order.orders[day]" class="space-y-1">
                  <p v-for="(dish, category) in order.orders[day]" 
                     :key="category"
                     class="text-xs text-gray-600 truncate"
                  >
                    {{ dish }}
                  </p>
                </div>
                <p v-else class="text-xs text-gray-400">—</p>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          <p>История заказов пуста</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
  is_current: boolean
}

interface Order {
  week_code: string
  orders: {
    [day: string]: {
      [category: string]: string
    }
  }
  created_at: string
}

const router = useRouter()
const user = ref<User>({
  id: 0,
  fio: '',
  email: '',
  department: '',
  isAdmin: false
})

const currentOrder = ref<Order | null>(null)
const currentWeek = ref<Week | null>(null)
const history = ref<Order[]>([])
const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']

onMounted(async () => {
  if (process.client) {
    user.value.id = Number(localStorage.getItem('user_id')) || 0
    user.value.fio = localStorage.getItem('user_fio') || 'Сотрудник'
  }

  try {
    const response = await fetch(`/api/orders/my?userId=${user.value.id}`)
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        currentOrder.value = data.currentOrder || null
        currentWeek.value = data.currentWeek || null
        history.value = data.history || []
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
  }
})

const getOrderStatus = (day: string): string => {
  if (!currentOrder.value || !currentOrder.value.orders[day]) {
    return 'Не заказано'
  }
  
  // Проверяем, сегодня ли этот день
  const today = new Date().getDay()
  const daysMap: Record<number, string> = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница'
  }
  
  const todayName = daysMap[today]
  if (day === todayName) {
    return 'Сегодня'
  }
  
  // Проверяем, прошел ли уже день
  const dayIndex = days.indexOf(day)
  if (dayIndex < today - 1) {
    return 'Заказ получен'
  }
  
  return 'Ожидается'
}

const goBack = () => {
  router.push('/cabinet')
}
</script>