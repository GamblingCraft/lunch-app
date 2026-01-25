<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <!-- Заголовок -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Отзывы сотрудников</h2>
        <p class="text-gray-600 mt-1">Оценки и предложения по питанию</p>
      </div>
      <div class="flex items-center">
        <div class="mr-4">
          <div class="text-2xl font-bold text-gray-900">{{ averageRating }}</div>
          <div class="flex items-center mt-1">
            <div v-for="i in 5" :key="i" class="text-yellow-400">
              <svg v-if="i <= Math.round(averageRating)" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="mb-6 flex flex-wrap gap-4">
      <select 
        v-model="selectedRating"
        @change="filterFeedback"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
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
        v-model="sortBy"
        @change="sortFeedback"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
      >
        <option value="newest">Сначала новые</option>
        <option value="oldest">Сначала старые</option>
        <option value="rating-high">Высокий рейтинг</option>
        <option value="rating-low">Низкий рейтинг</option>
      </select>
    </div>

    <!-- Список отзывов -->
    <div class="space-y-4">
      <div 
        v-for="feedback in filteredFeedback" 
        :key="feedback.id"
        class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <div class="flex items-center">
              <span class="font-medium text-gray-900">{{ feedback.user }}</span>
              <span class="mx-2 text-gray-300">•</span>
              <span class="text-sm text-gray-500">{{ feedback.department }}</span>
              <span class="mx-2 text-gray-300">•</span>
              <span class="text-sm text-gray-500">{{ formatDate(feedback.date) }}</span>
            </div>
            
            <!-- Рейтинг -->
            <div v-if="feedback.rating" class="flex items-center mt-1">
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
        <p class="text-gray-700 mt-2">{{ feedback.message }}</p>
        
        <!-- Ответ администратора -->
        <div v-if="feedback.reply" class="mt-3 pl-4 border-l-2 border-accent-500 bg-accent-50 p-3 rounded">
          <div class="flex items-center mb-1">
            <span class="font-medium text-accent-700">Ответ администратора:</span>
            <span class="ml-2 text-sm text-accent-600">{{ formatDate(feedback.replyDate) }}</span>
          </div>
          <p class="text-accent-800">{{ feedback.reply }}</p>
        </div>
        
        <!-- Форма ответа -->
        <div v-else class="mt-3">
          <textarea 
            v-model="feedback.replyInput"
            rows="2"
            placeholder="Ответить на отзыв..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm"
          ></textarea>
          <div class="mt-2 flex justify-end">
            <button 
              @click="sendReply(feedback)"
              :disabled="!feedback.replyInput"
              class="px-3 py-1 text-sm bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отправить ответ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Пагинация -->
    <div class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-500">
        Показано {{ filteredFeedback.length }} из {{ feedbackList.length }} отзывов
      </div>
      <div class="flex space-x-2">
        <button 
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Назад
        </button>
        <span class="px-3 py-1 text-sm text-gray-700">
          Страница {{ currentPage }}
        </span>
        <button 
          @click="nextPage"
          :disabled="currentPage * itemsPerPage >= filteredFeedback.length"
          class="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Вперед
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})
import { ref, computed, onMounted } from 'vue'

// Данные отзывов (мок)
const feedbackList = ref([
  {
    id: 1,
    user: 'Иванов Иван',
    department: 'IT',
    date: '2024-11-20',
    rating: 5,
    message: 'Отличное питание! Особенно понравилась курица с овощами в понедельник. Спасибо!',
    reply: 'Спасибо за отзыв! Рады, что вам понравилось.',
    replyDate: '2024-11-21'
  },
  {
    id: 2,
    user: 'Петрова Мария',
    department: 'Маркетинг',
    date: '2024-11-19',
    rating: 4,
    message: 'В целом хорошо, но хотелось бы больше овощных салатов в меню.',
    replyInput: ''
  },
  {
    id: 3,
    user: 'Сидоров Алексей',
    department: 'Продажи',
    date: '2024-11-18',
    rating: null,
    message: 'Можно ли сделать более разнообразные супы?',
    replyInput: ''
  },
  {
    id: 4,
    user: 'Козлова Анна',
    department: 'Бухгалтерия',
    date: '2024-11-17',
    rating: 5,
    message: 'Все очень вкусно, продолжайте в том же духе!',
    reply: 'Благодарим за высокую оценку!',
    replyDate: '2024-11-18'
  },
  {
    id: 5,
    user: 'Николаев Дмитрий',
    department: 'Производство',
    date: '2024-11-16',
    rating: 3,
    message: 'Порции могли бы быть больше, особенно для сотрудников производства.',
    replyInput: ''
  }
])

const selectedRating = ref('all')
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = 10

// Средний рейтинг
const averageRating = computed(() => {
  const rated = feedbackList.value.filter(f => f.rating)
  if (rated.length === 0) return 0
  const sum = rated.reduce((acc, f) => acc + f.rating, 0)
  return (sum / rated.length).toFixed(1)
})

// Отфильтрованные отзывы
const filteredFeedback = computed(() => {
  let result = [...feedbackList.value]
  
  // Фильтр по рейтингу
  if (selectedRating.value !== 'all') {
    const rating = parseInt(selectedRating.value)
    if (rating === 0) {
      result = result.filter(f => f.rating === null)
    } else {
      result = result.filter(f => f.rating === rating)
    }
  }
  
  // Сортировка
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.date) - new Date(a.date))
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.date) - new Date(b.date))
      break
    case 'rating-high':
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case 'rating-low':
      result.sort((a, b) => (a.rating || 0) - (b.rating || 0))
      break
  }
  
  // Пагинация
  const start = (currentPage.value - 1) * itemsPerPage
  return result.slice(start, start + itemsPerPage)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const filterFeedback = () => {
  currentPage.value = 1
}

const sortFeedback = () => {
  currentPage.value = 1
}

const deleteFeedback = (id) => {
  if (confirm('Удалить этот отзыв?')) {
    feedbackList.value = feedbackList.value.filter(f => f.id !== id)
  }
}

const sendReply = (feedback) => {
  if (!feedback.replyInput.trim()) return
  
  feedback.reply = feedback.replyInput
  feedback.replyDate = new Date().toISOString().split('T')[0]
  feedback.replyInput = ''
  
  console.log('Отправлен ответ на отзыв:', feedback.id)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value * itemsPerPage < feedbackList.value.length) {
    currentPage.value++
  }
}
</script>