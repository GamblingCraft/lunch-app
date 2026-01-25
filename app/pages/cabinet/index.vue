<!-- app/pages/cabinet/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Шапка -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-3">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center mr-2">
                <span class="text-white text-sm font-bold">ET</span>
              </div>
              <h1 class="text-xl font-semibold text-gray-800">Личный кабинет</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ user.fio }}</span>
            <button 
              @click="logout"
              class="text-sm text-accent-600 hover:text-accent-800"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Контент -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Добро пожаловать, {{ userName }}!</h2>
        <p class="text-gray-600">Отдел: {{ user.department }}</p>
      </div>

      <!-- Карточки функций -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Мои заказы -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">Мои заказы</h3>
          </div>
          <p class="text-gray-600 mb-4">Ваш обед на сегодня и история заказов</p>
          <NuxtLink to="/cabinet/my-orders" class="text-accent-600 hover:text-accent-800 font-medium inline-block">
            Посмотреть →
          </NuxtLink>
        </div>

        <!-- Заказ на неделю -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">Заказ на неделю</h3>
          </div>
          <p class="text-gray-600 mb-4">Выбор блюд на следующую неделю</p>
          <NuxtLink to="/cabinet/week-order" class="text-accent-600 hover:text-accent-800 font-medium inline-block">
            Сделать заказ →
          </NuxtLink>
        </div>

        <!-- Меню -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">Посмотреть меню</h3>
          </div>
          <p class="text-gray-600 mb-4">Актуальное меню на текущую неделю</p>
          <NuxtLink to="/cabinet/menu" class="text-accent-600 hover:text-accent-800 font-medium inline-block">
            Открыть меню →
          </NuxtLink>
        </div>
      </div>

      <!-- Блок сегодняшнего обеда -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Ваш обед на сегодня ({{ todayName }})
        </h3>
        
        <div v-if="todayOrder && Object.keys(todayOrder).length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div 
            v-for="(dish, category) in todayOrder" 
            :key="category"
            class="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <p class="text-sm text-gray-500 mb-1">{{ category }}</p>
            <p class="font-medium text-gray-800">{{ dish }}</p>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-500">
          <p>Вы еще не сделали заказ на сегодня</p>
          <NuxtLink to="/cabinet/my-orders" class="text-accent-600 hover:text-accent-800 text-sm mt-2 inline-block">
            Посмотреть мои заказы
          </NuxtLink>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-gray-700">
            <span class="font-medium">Время обеда:</span> {{ getLunchTime(user.department) }}
          </p>
        </div>
      </div>

      <!-- Отзыв -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Оставить отзыв
        </h3>
        <textarea 
          v-model="feedback"
          placeholder="Поделитесь вашими впечатлениями о питании..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-colors bg-white mb-4"
          rows="3"
        ></textarea>
        <button 
          @click="submitFeedback"
          class="bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-accent-600 transition-colors focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
        >
          Отправить отзыв
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface User {
  id: number
  fio: string
  email: string
  department: string
  isAdmin: boolean
}

interface TodayOrder {
  [category: string]: string
}

const router = useRouter()
const user = ref<User>({
  id: 0,
  fio: '',
  email: '',
  department: '',
  isAdmin: false
})

const todayOrder = ref<TodayOrder>({})
const todayName = ref('')
const feedback = ref('')

const userName = computed(() => {
  const parts = user.value.fio.split(' ')
  return parts[1] || parts[0] || 'Сотрудник'
})

// График обедов
const LUNCH_SCHEDULE: Record<string, string> = {
  'Логистика': '12:00 - 13:00',
  'Маркетинг': '13:00 - 14:00',
  'Продажи': '12:00 - 13:00',
  'Бухгалтерия': '15:00 - 16:00',
  'IT': '13:00 - 14:00',
  'HR': '13:00 - 14:00',
  'Производство': '12:00 - 13:00'
}

const getLunchTime = (department: string): string => {
  return LUNCH_SCHEDULE[department] || 'по графику отдела'
}

onMounted(async () => {
  // Загружаем данные пользователя
  if (process.client) {
    user.value.id = Number(localStorage.getItem('user_id')) || 0
    user.value.fio = localStorage.getItem('user_fio') || 'Сотрудник'
    user.value.email = localStorage.getItem('user_email') || ''
    user.value.department = localStorage.getItem('user_department') || ''
    user.value.isAdmin = localStorage.getItem('user_is_admin') === 'true'
  }

  try {
    // Загружаем заказ на сегодня
    const response = await fetch(`/api/orders/my?userId=${user.value.id}`)
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        todayOrder.value = data.todayOrder || {}
        todayName.value = data.todayName || ''
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки заказа:', error)
  }
})

const submitFeedback = async () => {
  if (!feedback.value.trim()) {
    alert('Пожалуйста, введите отзыв')
    return
  }

  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.value.id,
        userFio: user.value.fio,
        department: user.value.department,
        feedback: feedback.value,
        createdAt: new Date().toISOString()
      })
    })

    if (response.ok) {
      alert('Отзыв отправлен! Спасибо за обратную связь.')
      feedback.value = ''
    } else {
      alert('Ошибка при отправке отзыва')
    }
  } catch (error) {
    console.error('Ошибка отправки отзыва:', error)
    alert('Ошибка при отправке отзыва')
  }
}

const logout = () => {
  if (process.client) {
    localStorage.clear()
  }
  router.push('/')
}
</script>