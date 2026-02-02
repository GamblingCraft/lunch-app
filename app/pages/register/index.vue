<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-medium overflow-hidden w-full max-w-md border border-gray-200">
      <div class="h-2 bg-accent-500"></div>
      
      <div class="p-8">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-50 to-white rounded-2xl mb-4 border border-gray-200">
            <svg class="w-8 h-8 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Завершите регистрацию</h1>
          <p class="text-gray-600">Заполните ваши данные</p>
        </div>

        <!-- Информация о Telegram пользователе -->
        <div v-if="telegramUser" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-sm font-medium text-blue-700 mb-1">Ваш Telegram аккаунт:</p>
          <p class="text-blue-600">{{ telegramUser.first_name }} {{ telegramUser.last_name }}</p>
          <p v-if="telegramUser.username" class="text-sm text-blue-500">@{{ telegramUser.username }}</p>
          <p class="text-xs text-gray-500 mt-1">ID: {{ telegramUser.id }}</p>
        </div>

        <form @submit.prevent="completeRegistration" class="space-y-6">
          <!-- ФИО -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ФИО полностью *
            </label>
            <input
              v-model="form.fio"
              type="text"
              placeholder="Иванов Иван Иванович"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-white outline-none"
            />
          </div>

          <!-- Отдел -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Отдел *
            </label>
            <select
              v-model="form.department"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors bg-white outline-none"
            >
              <option value="">Выберите отдел</option>
              <option value="Администрация">Администрация</option>
              <option value="Отдел разработки">Отдел разработки</option>
              <option value="Отдел тестирования">Отдел тестирования</option>
              <option value="Отдел дизайна">Отдел дизайна</option>
              <option value="Отдел маркетинга">Отдел маркетинга</option>
              <option value="Склад">Склад</option>
              <option value="Отдел продаж">Отдел продаж</option>
              <option value="Отдел поддержки">Отдел поддержки</option>
              <option value="Логистика">Логистика</option>
              <option value="Бухгалтерия">Бухгалтерия</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Производство">Производство</option>
            </select>
          </div>

          <button
            type="submit"
            :disabled="!isFormValid || loading"
            class="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 bg-accent-500 hover:bg-accent-600 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Сохранение...' : 'Завершить регистрацию' }}
          </button>
        </form>

        <!-- Кнопка назад -->
        <button
          @click="goBackToAuth"
          class="w-full mt-4 text-gray-600 hover:text-gray-800 py-2 text-sm"
        >
          ← Назад к авторизации
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const isClient = typeof window !== 'undefined'

const telegramUser = ref(null)
const form = ref({
  fio: '',
  department: ''
})
const loading = ref(false)

const isFormValid = computed(() => {
  return form.value.fio.trim().length > 0 && 
         form.value.department.length > 0
})

const goBackToAuth = () => {
  // Очищаем временные данные
  if (isClient) {
    localStorage.removeItem('telegram_register_data')
  }
  router.push('/auth')
}

const completeRegistration = async () => {
  if (!isFormValid.value || loading.value) return
  
  loading.value = true

  if (!telegramUser.value) {
    alert('Ошибка: данные Telegram не найдены')
    loading.value = false
    return
  }

  // Подготавливаем данные для API
  const userData = {
    telegram_id: Number(telegramUser.value.id),
    first_name: telegramUser.value.first_name || '',
    last_name: telegramUser.value.last_name || '',
    username: telegramUser.value.username || '',
    photo_url: telegramUser.value.photo_url || '',
    fio: form.value.fio.trim(),
    department: form.value.department,
    is_admin: false // Новые пользователи не админы
  }

  try {
    console.log('📤 Отправка данных регистрации:', userData)
    
    // Используем ваш существующий API endpoint
    const response = await $fetch('/api/users/register', {
      method: 'POST',
      body: userData
    })
    
    console.log('✅ Результат регистрации:', response)

    if (response.success) {
      // Сохраняем пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('is_admin', 'false')
      localStorage.setItem('user_id', response.user.id.toString())
      
      // Очищаем временные данные
      localStorage.removeItem('telegram_register_data')
      localStorage.removeItem('telegram_auth_data')
      
      alert('🎉 Регистрация успешно завершена!')
      
      // Перенаправляем в кабинет
      setTimeout(() => {
        router.push('/cabinet')
      }, 500)
    } else {
      alert('❌ Ошибка регистрации: ' + (response.message || 'Неизвестная ошибка'))
      loading.value = false
    }
  } catch (error) {
    console.error('💥 Ошибка сохранения:', error)
    alert('❌ Ошибка при сохранении данных. Попробуйте снова.')
    loading.value = false
  }
}

onMounted(() => {
  if (!isClient) return

  console.log('🔍 Проверка данных регистрации...')
  
  // Получаем данные Telegram для регистрации
  const telegramRegisterData = localStorage.getItem('telegram_register_data')
  
  console.log('📦 Данные из localStorage:', telegramRegisterData)
  
  if (!telegramRegisterData) {
    console.error('❌ Данные для регистрации не найдены')
    alert('Данные для регистрации не найдены. Пожалуйста, авторизуйтесь через Telegram.')
    router.push('/auth')
    return
  }

  try {
    const data = JSON.parse(telegramRegisterData)
    console.log('📋 Парсинг данных:', data)
    
    telegramUser.value = {
      id: data.id,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      username: data.username || '',
      photo_url: data.photo_url || ''
    }
    
    console.log('👤 Telegram пользователь:', telegramUser.value)
    
    // Автозаполняем ФИО из Telegram данных
    if (telegramUser.value.first_name || telegramUser.value.last_name) {
      const telegramName = `${telegramUser.value.first_name || ''} ${telegramUser.value.last_name || ''}`.trim()
      if (telegramName && !form.value.fio) {
        form.value.fio = telegramName
        console.log('✏️ Автозаполнение ФИО:', telegramName)
      }
    }
  } catch (error) {
    console.error('❌ Ошибка парсинга Telegram данных:', error)
    alert('Ошибка загрузки данных регистрации')
    router.push('/auth')
  }
})
</script>