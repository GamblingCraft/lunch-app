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
            <h1 class="text-xl font-semibold text-gray-800">Мои отзывы</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ user.fio }}</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Статистика -->
      <div class="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-800">{{ totalFeedback }}</p>
            <p class="text-sm text-gray-600">Всего отзывов</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-800">{{ repliedCount }}</p>
            <p class="text-sm text-gray-600">С ответом</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-800">{{ averageRating.toFixed(1) }}/5</p>
            <p class="text-sm text-gray-600">Средний рейтинг</p>
          </div>
        </div>
      </div>

      <!-- Форма нового отзыва -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Оставить новый отзыв</h2>
        
        <!-- Рейтинг -->
        <div class="mb-4">
          <p class="text-sm text-gray-700 mb-2">Оцените питание:</p>
          <div class="flex items-center">
            <div 
              v-for="star in 5" 
              :key="star"
              @click="newFeedback.rating = star"
              class="cursor-pointer mr-1"
            >
              <svg 
                class="w-8 h-8"
                :class="star <= newFeedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <button 
              v-if="newFeedback.rating > 0"
              @click="newFeedback.rating = 0"
              class="ml-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Убрать оценку
            </button>
          </div>
        </div>
        
        <!-- Текст отзыва -->
        <textarea 
          v-model="newFeedback.message"
          placeholder="Поделитесь вашими впечатлениями о питании, предложениями или замечаниями..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-white mb-4"
          rows="4"
          maxlength="1000"
        ></textarea>
        
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">
            {{ newFeedback.message.length }}/1000 символов
          </span>
          <button 
            @click="submitNewFeedback"
            :disabled="!newFeedback.message.trim() || submitting"
            class="bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-accent-600 transition-colors focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ submitting ? 'Отправка...' : 'Отправить отзыв' }}
          </button>
        </div>
        
        <!-- Уведомление об успехе -->
        <div v-if="successMessage" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-sm text-green-700">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Список отзывов -->
      <div class="space-y-6">
        <div v-if="loading" class="text-center py-12">
          <svg class="animate-spin h-8 w-8 text-accent-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">Загрузка отзывов...</p>
        </div>
        
        <div v-else-if="userFeedback.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
          </svg>
          <h3 class="text-lg font-semibold text-gray-800 mt-4">У вас еще нет отзывов</h3>
          <p class="text-gray-600 mt-2">Оставьте свой первый отзыв о питании!</p>
        </div>
        
        <div v-else v-for="feedback in userFeedback" :key="feedback.id" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <!-- Заголовок отзыва -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <div class="flex items-center flex-wrap gap-2">
                <span class="text-sm text-gray-500">{{ formatDate(feedback.created_at) }}</span>
                
                <!-- Статус -->
                <span v-if="feedback.status === 'new'" class="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  На рассмотрении
                </span>
                <span v-if="feedback.status === 'replied'" class="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                  Ответ получен
                </span>
              </div>
              
              <!-- Рейтинг -->
              <div v-if="feedback.rating !== null" class="flex items-center mt-1">
                <div class="flex">
                  <div v-for="i in 5" :key="i" class="text-yellow-400">
                    <svg v-if="i <= feedback.rating" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <svg v-else class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>
                <span class="ml-2 text-sm font-medium text-gray-700">{{ feedback.rating }}/5</span>
              </div>
              <div v-else class="text-sm text-gray-500 mt-1">Без оценки</div>
            </div>
            
            <button 
              @click="deleteFeedback(feedback.id)"
              class="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
          
          <!-- Текст отзыва -->
          <div class="mb-4">
            <p class="text-gray-700 whitespace-pre-wrap">{{ feedback.message }}</p>
          </div>
          
          <!-- Ответ администратора -->
          <div v-if="feedback.reply" class="mt-4 pl-4 border-l-2 border-accent-500 bg-accent-50 p-4 rounded-lg">
            <div class="flex items-center mb-2">
              <svg class="w-4 h-4 text-accent-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="text-sm font-medium text-accent-700">
                  Ответ от {{ feedback.reply_user_fio || 'Администратора' }}
                </p>
                <p class="text-xs text-accent-600">{{ formatDate(feedback.reply_date) }}</p>
              </div>
            </div>
            <p class="text-accent-800 whitespace-pre-wrap mt-2">{{ feedback.reply }}</p>
          </div>
          
          <!-- Новый ответ (если только что получен) -->
          <div v-else-if="feedback.status === 'replied' && !feedback.seen_by_user" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h1m0 0h-1m1 0v4m2-10V5a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-8z"/>
              </svg>
              <p class="text-sm text-blue-700">Получен новый ответ от администрации!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#app'

const router = useRouter()

// Данные пользователя
const user = ref({
  id: 0,
  fio: '',
  department: ''
})

// Отзывы
const userFeedback = ref([])
const loading = ref(false)
const submitting = ref(false)

// Новый отзыв
const newFeedback = ref({
  rating: 0,
  message: ''
})

const successMessage = ref('')

// Вычисляемые свойства
const totalFeedback = computed(() => userFeedback.value.length)
const repliedCount = computed(() => userFeedback.value.filter(f => f.status === 'replied').length)
const averageRating = computed(() => {
  const rated = userFeedback.value.filter(f => f.rating !== null)
  if (rated.length === 0) return 0
  const sum = rated.reduce((acc, f) => acc + f.rating, 0)
  return sum / rated.length
})

// Методы
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goBack = () => {
  router.push('/cabinet')
}

const loadUserFeedback = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/feedback/user', {
      query: {
        user_id: user.value.id
      }
    })
    
    if (response.success) {
      // Сортируем по дате (новые сверху)
      userFeedback.value = response.feedback.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at)
      })
      console.log(`Загружено ${userFeedback.value.length} отзывов пользователя`)
      
      // Помечаем новые ответы как прочитанные
      await markAsSeen()
    } else {
      console.error('Ошибка загрузки отзывов:', response.message)
      userFeedback.value = []
    }
  } catch (error) {
    console.error('Ошибка загрузки отзывов:', error)
    userFeedback.value = []
  } finally {
    loading.value = false
  }
}

const markAsSeen = async () => {
  // Находим непрочитанные отзывы с ответами
  const unseenReplies = userFeedback.value.filter(f => 
    f.status === 'replied' && !f.seen_by_user
  ).map(f => f.id)
  
  if (unseenReplies.length === 0) return
  
  try {
    await $fetch('/api/feedback/mark-seen', {
      method: 'POST',
      body: {
        feedback_ids: unseenReplies,
        user_id: user.value.id
      }
    })
    
    // Обновляем локально
    userFeedback.value = userFeedback.value.map(f => {
      if (unseenReplies.includes(f.id)) {
        return { ...f, seen_by_user: true }
      }
      return f
    })
  } catch (error) {
    console.error('Ошибка отметки прочтения:', error)
  }
}

const submitNewFeedback = async () => {
  if (!newFeedback.value.message.trim()) {
    alert('Пожалуйста, введите отзыв')
    return
  }

  submitting.value = true
  successMessage.value = ''

  try {
    const response = await $fetch('/api/feedback', {
      method: 'POST',
      body: {
        user_id: user.value.id,
        user_fio: user.value.fio,
        department: user.value.department,
        message: newFeedback.value.message.trim(),
        rating: newFeedback.value.rating || null
      }
    })

    if (response.success) {
      successMessage.value = 'Спасибо за ваш отзыв! Он будет рассмотрен администрацией.'
      
      // Сбрасываем форму
      newFeedback.value = {
        rating: 0,
        message: ''
      }
      
      // Перезагружаем список отзывов
      await loadUserFeedback()
      
      // Скрыть уведомление через 5 секунд
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    } else {
      alert('Ошибка при отправке отзыва: ' + (response.message || 'Неизвестная ошибка'))
    }
  } catch (error) {
    console.error('Ошибка отправки отзыва:', error)
    alert('Ошибка при отправке отзыва')
  } finally {
    submitting.value = false
  }
}

const deleteFeedback = async (feedbackId) => {
  if (!confirm('Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить.')) {
    return
  }
  
  try {
    const response = await $fetch(`/api/feedback/${feedbackId}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      userFeedback.value = userFeedback.value.filter(f => f.id !== feedbackId)
      alert('Отзыв удален')
    } else {
      alert('Ошибка удаления отзыва: ' + (response.message || 'Неизвестная ошибка'))
    }
  } catch (error) {
    console.error('Ошибка удаления отзыва:', error)
    alert('Ошибка удаления отзыва')
  }
}

onMounted(() => {
  // Загружаем данные пользователя
  if (process.client) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        user.value.id = userData.id || Number(localStorage.getItem('user_id')) || 0
        user.value.fio = userData.fio || localStorage.getItem('user_fio') || 'Сотрудник'
        user.value.department = userData.department || localStorage.getItem('user_department') || ''
      } catch (error) {
        console.error('Ошибка парсинга пользователя:', error)
      }
    }
  }
  
  if (user.value.id) {
    loadUserFeedback()
  } else {
    router.push('/cabinet')
  }
})
</script>