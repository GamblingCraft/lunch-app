<template>
  <div>
    <!-- Заголовок -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Отзывы сотрудников</h1>
      <p class="text-gray-600 mt-1">Оценки и предложения по питанию</p>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Средний рейтинг</p>
            <p class="text-2xl font-bold text-gray-800">{{ averageRating.toFixed(1) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Всего отзывов</p>
            <p class="text-2xl font-bold text-gray-800">{{ totalFeedback }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Отвечено</p>
            <p class="text-2xl font-bold text-gray-800">{{ repliedCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Новых</p>
            <p class="text-2xl font-bold text-gray-800">{{ newFeedbackCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры и поиск -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по ФИО, отделу или тексту..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
              @input="filterFeedback"
            />
          </div>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <select 
            v-model="selectedRating"
            @change="filterFeedback"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          >
            <option value="all">Все оценки</option>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
            <option value="0">Без оценки</option>
          </select>
          
          <select 
            v-model="selectedStatus"
            @change="filterFeedback"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новые</option>
            <option value="replied">С ответом</option>
          </select>
          
          <select 
            v-model="sortBy"
            @change="sortFeedback"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="rating-high">Высокий рейтинг</option>
            <option value="rating-low">Низкий рейтинг</option>
          </select>
          
          <button 
            @click="loadFeedback"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Обновить
          </button>
        </div>
      </div>
    </div>

    <!-- Список отзывов -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">Список отзывов</h3>
        <p class="text-gray-600 text-sm mt-1">Все отзывы сотрудников</p>
      </div>
      
      <div v-if="loading" class="p-8 text-center">
        <svg class="animate-spin h-8 w-8 text-accent-500 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-gray-600">Загрузка отзывов...</p>
      </div>
      
      <div v-else-if="filteredFeedback.length === 0" class="p-8 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h3 class="text-lg font-semibold text-gray-800 mt-4">Отзывы не найдены</h3>
        <p class="text-gray-600 mt-2" v-if="searchQuery || selectedRating !== 'all' || selectedStatus !== 'all'">
          Попробуйте изменить параметры поиска
        </p>
        <p v-else class="text-gray-600 mt-2">Отзывов еще нет</p>
      </div>
      
      <div v-else class="divide-y divide-gray-200">
        <div 
          v-for="feedback in paginatedFeedback" 
          :key="feedback.id"
          class="p-6 hover:bg-gray-50 transition-colors"
          :class="{ 'bg-yellow-50': feedback.status === 'new' }"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <div class="flex items-center flex-wrap gap-2">
                <span class="font-medium text-gray-900">{{ feedback.user_fio }}</span>
                <span v-if="feedback.department" class="text-sm text-gray-500">({{ feedback.department }})</span>
                <span class="text-gray-300">•</span>
                <span class="text-sm text-gray-500">{{ formatDate(feedback.created_at) }}</span>
                
                <!-- Статус -->
                <span v-if="feedback.status === 'new'" class="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  Новый
                </span>
                <span v-if="feedback.status === 'replied'" class="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                  Отвечено
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
            
            <div class="flex items-center space-x-2">
              <button 
                v-if="!feedback.reply && feedback.status !== 'replied'"
                @click="toggleReplyForm(feedback)"
                class="text-sm text-accent-600 hover:text-accent-800"
              >
                Ответить
              </button>
              <button 
                @click="deleteFeedback(feedback.id)"
                class="text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Текст отзыва -->
          <div class="mb-4">
            <p class="text-gray-700 whitespace-pre-wrap">{{ feedback.message }}</p>
          </div>
          
          <!-- Ответ администратора -->
          <div v-if="feedback.reply" class="mt-3 pl-4 border-l-2 border-accent-500 bg-accent-50 p-3 rounded">
            <div class="flex items-center mb-1">
              <span class="font-medium text-accent-700">{{ feedback.reply_user_fio || 'Администратор' }}:</span>
              <span class="ml-2 text-sm text-accent-600">{{ formatDate(feedback.reply_date) }}</span>
            </div>
            <p class="text-accent-800 whitespace-pre-wrap">{{ feedback.reply }}</p>
          </div>
          
          <!-- Форма ответа -->
          <div v-else-if="feedback.showReplyForm" class="mt-3">
            <textarea 
              v-model="feedback.replyInput"
              rows="3"
              placeholder="Введите ответ на отзыв..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm"
            ></textarea>
            <div class="mt-2 flex justify-end space-x-2">
              <button 
                @click="cancelReply(feedback)"
                class="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button 
                @click="sendReply(feedback)"
                :disabled="!feedback.replyInput?.trim() || sendingReply"
                class="px-3 py-1 text-sm bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ sendingReply ? 'Отправка...' : 'Отправить ответ' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Пагинация -->
      <div v-if="filteredFeedback.length > itemsPerPage" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            Показано {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredFeedback.length) }} из {{ filteredFeedback.length }} отзывов
          </div>
          <div class="flex space-x-2">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>
            <span class="px-3 py-1 text-sm text-gray-700">
              Страница {{ currentPage }} из {{ totalPages }}
            </span>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Вперед
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
  
})

import { ref, computed, onMounted } from 'vue'

// Состояние
const feedbackList = ref([])
const loading = ref(false)
const sendingReply = ref(false)
const searchQuery = ref('')
const selectedRating = ref('all')
const selectedStatus = ref('all')
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = 10

// Вычисляемые свойства
const totalFeedback = computed(() => feedbackList.value.length)
const averageRating = computed(() => {
  const rated = feedbackList.value.filter(f => f.rating !== null)
  if (rated.length === 0) return 0
  const sum = rated.reduce((acc, f) => acc + f.rating, 0)
  return sum / rated.length
})
const repliedCount = computed(() => feedbackList.value.filter(f => f.status === 'replied').length)
const newFeedbackCount = computed(() => feedbackList.value.filter(f => f.status === 'new').length)

const filteredFeedback = computed(() => {
  let result = [...feedbackList.value]
  
  // Поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(f => 
      f.user_fio.toLowerCase().includes(query) ||
      f.department.toLowerCase().includes(query) ||
      f.message.toLowerCase().includes(query) ||
      (f.reply && f.reply.toLowerCase().includes(query))
    )
  }
  
  // Фильтр по рейтингу
  if (selectedRating.value !== 'all') {
    const rating = parseInt(selectedRating.value)
    if (rating === 0) {
      result = result.filter(f => f.rating === null)
    } else {
      result = result.filter(f => f.rating === rating)
    }
  }
  
  // Фильтр по статусу
  if (selectedStatus.value !== 'all') {
    result = result.filter(f => f.status === selectedStatus.value)
  }
  
  // Сортировка
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'rating-high':
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case 'rating-low':
      result.sort((a, b) => (a.rating || 0) - (b.rating || 0))
      break
  }
  
  return result
})

const totalPages = computed(() => Math.ceil(filteredFeedback.value.length / itemsPerPage))
const paginatedFeedback = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredFeedback.value.slice(start, end)
})

// Методы
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const filterFeedback = () => {
  currentPage.value = 1
}

const sortFeedback = () => {
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const loadFeedback = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/feedback')
    
    if (response.success) {
      feedbackList.value = response.feedback.map(f => ({
        ...f,
        showReplyForm: false,
        replyInput: ''
      }))
      console.log(`Загружено ${feedbackList.value.length} отзывов`)
    } else {
      console.error('Ошибка загрузки отзывов:', response.message)
      feedbackList.value = []
    }
  } catch (error) {
    console.error('Ошибка загрузки отзывов:', error)
    feedbackList.value = []
  } finally {
    loading.value = false
  }
}

const toggleReplyForm = (feedback) => {
  feedbackList.value = feedbackList.value.map(f => {
    if (f.id === feedback.id) {
      return { ...f, showReplyForm: !f.showReplyForm }
    }
    return { ...f, showReplyForm: false }
  })
}

const cancelReply = (feedback) => {
  feedback.showReplyForm = false
  feedback.replyInput = ''
}

const sendReply = async (feedback) => {
  if (!feedback.replyInput?.trim()) return
  
  sendingReply.value = true
  
  try {
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}')
    
    const response = await $fetch('/api/feedback/reply', {
      method: 'POST',
      body: {
        feedback_id: feedback.id,
        reply_message: feedback.replyInput.trim(),
        reply_user_id: adminUser.id || 1,
        reply_user_fio: adminUser.fio || 'Администратор'
      }
    })
    
    if (response.success) {
      // Обновляем отзыв в списке
      const updatedFeedback = response.feedback
      feedbackList.value = feedbackList.value.map(f => 
        f.id === feedback.id ? {
          ...f,
          ...updatedFeedback,
          showReplyForm: false,
          replyInput: ''
        } : f
      )
      
      alert('Ответ успешно отправлен!')
    } else {
      alert('Ошибка отправки ответа: ' + (response.message || 'Неизвестная ошибка'))
    }
  } catch (error) {
    console.error('Ошибка отправки ответа:', error)
    alert('Ошибка отправки ответа')
  } finally {
    sendingReply.value = false
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
      feedbackList.value = feedbackList.value.filter(f => f.id !== feedbackId)
      alert('Отзыв удален')
    } else {
      alert('Ошибка удаления отзыва: ' + (response.message || 'Неизвестная ошибка'))
    }
  } catch (error) {
    console.error('Ошибка удаления отзыва:', error)
    alert('Ошибка удаления отзыва')
  }
}

// Инициализация
onMounted(() => {
  loadFeedback()
})
</script>