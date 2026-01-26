<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Шапка -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-3">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center mr-2">
                <span class="text-white text-sm font-bold">{{ getUserInitials() }}</span>
              </div>
              <h1 class="text-xl font-semibold text-gray-800">Личный кабинет</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ user.fio }}</span>
            
            <!-- Кнопка отзывов с бейджем -->
            <NuxtLink 
              to="/cabinet/feedback"
              class="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              
              <!-- Бейдж с количеством новых ответов -->
              <span 
                v-if="newRepliesCount > 0" 
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300"
                :class="{ 'scale-0': newRepliesCount === 0, 'scale-100': newRepliesCount > 0 }"
              >
                {{ newRepliesCount }}
              </span>
            </NuxtLink>
            
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <!-- Мои отзывы -->
        <NuxtLink to="/cabinet/feedback" class="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors p-6 block">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 relative">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              
              <!-- Бейдж с новыми ответами -->
              <span 
                v-if="newRepliesCount > 0" 
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center transition-all duration-300"
                :class="{ 'scale-0': newRepliesCount === 0, 'scale-100': newRepliesCount > 0 }"
              >
                {{ newRepliesCount }}
              </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">Мои отзывы</h3>
          </div>
          <p class="text-gray-600 mb-4">Ваши отзывы и ответы администрации</p>
          <span class="text-accent-600 hover:text-accent-800 font-medium inline-block">
            Посмотреть →
          </span>
        </NuxtLink>
      </div>

      <!-- Блок сегодняшнего обеда -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Ваш обед на сегодня ({{ todayName }})
        </h3>
        
        <div v-if="todayOrder && Object.keys(todayOrder).length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p class="mb-2">Вы еще не сделали заказ на сегодня</p>
          <NuxtLink to="/cabinet/week-order" class="text-accent-600 hover:text-accent-800 text-sm inline-block">
            Сделать заказ на неделю
          </NuxtLink>
        </div>
        
        <div v-if="user.department" class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-gray-700">
            <span class="font-medium">Время обеда:</span> {{ getLunchTime(user.department) }}
          </p>
        </div>
      </div>

      <!-- Форма отзыва -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Оставить отзыв о питании
        </h3>
        
        <!-- Рейтинг -->
        <div class="mb-4">
          <p class="text-sm text-gray-700 mb-2">Оцените питание (необязательно):</p>
          <div class="flex items-center">
            <div 
              v-for="star in 5" 
              :key="star"
              @click="feedbackRating = star"
              class="cursor-pointer mr-1"
            >
              <svg 
                class="w-8 h-8"
                :class="star <= feedbackRating ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <button 
              v-if="feedbackRating > 0"
              @click="feedbackRating = 0"
              class="ml-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Убрать оценку
            </button>
          </div>
        </div>
        
        <!-- Текст отзыва -->
        <textarea 
          v-model="feedbackMessage"
          placeholder="Поделитесь вашими впечатлениями о питании, предложениями или замечаниями..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-white mb-4"
          rows="4"
          maxlength="1000"
        ></textarea>
        
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">
            {{ feedbackMessage.length }}/1000 символов
          </span>
          <button 
            @click="submitFeedback"
            :disabled="!feedbackMessage.trim() || submittingFeedback"
            class="bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-accent-600 transition-colors focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg v-if="submittingFeedback" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ submittingFeedback ? 'Отправка...' : 'Отправить отзыв' }}
          </button>
        </div>
        
        <!-- Уведомление об успехе -->
        <div v-if="feedbackSuccess" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-sm text-green-700">Спасибо за ваш отзыв! Он будет рассмотрен администрацией.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from '#app'

const router = useRouter()

interface User {
  id: number
  fio: string
  email: string
  department: string
  isAdmin: boolean
  telegram_id?: number
}

interface TodayOrder {
  [category: string]: string
}

const user = ref<User>({
  id: 0,
  fio: '',
  email: '',
  department: '',
  isAdmin: false,
  telegram_id: 0
})

const todayOrder = ref<TodayOrder>({})
const todayName = ref('')
const feedbackMessage = ref('')
const feedbackRating = ref(0)
const submittingFeedback = ref(false)
const feedbackSuccess = ref(false)
const userFeedback = ref<any[]>([])
const loadingFeedback = ref(false)
const hasMarkedSeen = ref(false)

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
  'Производство': '12:00 - 13:00',
  'Администрация': '13:00 - 14:00',
  'Отдел разработки': '13:00 - 14:00',
  'Отдел маркетинга': '13:00 - 14:00'
}

const getLunchTime = (department: string): string => {
  return LUNCH_SCHEDULE[department] || 'по графику отдела'
}

const getUserInitials = (): string => {
  if (!user.value.fio) return '??'
  const parts = user.value.fio.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return user.value.fio.substring(0, 2).toUpperCase()
}

const newRepliesCount = computed(() => {
  return userFeedback.value.filter(f => 
    f.status === 'replied' && 
    !f.seen_by_user
  ).length
})

const loadUserFeedback = async (force = false) => {
  if (!user.value.id) return
  
  loadingFeedback.value = true
  try {
    const response = await $fetch('/api/feedback/user', {
      query: {
        user_id: user.value.id,
        _t: Date.now() // Добавляем timestamp для предотвращения кэширования
      }
    })
    
    if (response.success) {
      userFeedback.value = response.feedback
      console.log(`Загружено ${userFeedback.value.length} отзывов пользователя, новые ответы: ${newRepliesCount.value}`)
      
      // НЕ помечаем как прочитанные автоматически на главной странице
      // Пользователь должен сам зайти на страницу отзывов
    }
  } catch (error) {
    console.error('Ошибка загрузки отзывов:', error)
  } finally {
    loadingFeedback.value = false
  }
}

const submitFeedback = async () => {
  if (!feedbackMessage.value.trim()) {
    alert('Пожалуйста, введите отзыв')
    return
  }

  submittingFeedback.value = true
  feedbackSuccess.value = false

  try {
    const response = await $fetch('/api/feedback', {
      method: 'POST',
      body: {
        user_id: user.value.id,
        user_fio: user.value.fio,
        department: user.value.department,
        user_telegram_id: user.value.telegram_id,
        message: feedbackMessage.value.trim(),
        rating: feedbackRating.value || null
      }
    })

    if (response.success) {
      feedbackSuccess.value = true
      feedbackMessage.value = ''
      feedbackRating.value = 0
      
      // Перезагружаем список отзывов
      await loadUserFeedback()
      
      // Скрыть уведомление через 5 секунд
      setTimeout(() => {
        feedbackSuccess.value = false
      }, 5000)
    } else {
      alert('Ошибка при отправке отзыва: ' + (response.message || 'Неизвестная ошибка'))
    }
  } catch (error) {
    console.error('Ошибка отправки отзыва:', error)
    alert('Ошибка при отправке отзыва')
  } finally {
    submittingFeedback.value = false
  }
}

const loadTodayOrder = async () => {
  try {
    const today = new Date()
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    todayName.value = days[today.getDay()]
    
    // Загружаем текущий заказ пользователя
    const response = await $fetch('/api/orders/my', {
      query: {
        userId: user.value.id
      }
    })
    
    if (response.success && response.currentOrder) {
      const orders = response.currentOrder.orders || {}
      todayOrder.value = orders[todayName.value] || {}
    }
  } catch (error) {
    console.error('Ошибка загрузки заказа:', error)
  }
}

// Функция для периодической проверки новых ответов
const startPolling = () => {
  // Проверяем каждые 60 секунд
  setInterval(() => {
    if (user.value.id && !loadingFeedback.value) {
      loadUserFeedback()
    }
  }, 60000)
}

const logout = () => {
  if (process.client) {
    localStorage.clear()
  }
  router.push('/')
}

onMounted(async () => {
  // Загружаем данные пользователя
  if (process.client) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        user.value.id = userData.id || Number(localStorage.getItem('user_id')) || 0
        user.value.fio = userData.fio || localStorage.getItem('user_fio') || 'Сотрудник'
        user.value.department = userData.department || localStorage.getItem('user_department') || ''
        user.value.telegram_id = userData.telegram_id || Number(localStorage.getItem('telegram_id')) || 0
        user.value.isAdmin = userData.is_admin || localStorage.getItem('is_admin') === 'true'
      } catch (error) {
        console.error('Ошибка парсинга пользователя:', error)
      }
    }
  }

  await Promise.all([
    loadTodayOrder(),
    loadUserFeedback()
  ])
  
  // НЕ помечаем ответы как прочитанные при загрузке главной страницы
  // Пользователь должен зайти на страницу отзывов
  
  // Запускаем периодическую проверку
  startPolling()
})
</script>