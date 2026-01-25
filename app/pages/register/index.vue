<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-medium overflow-hidden w-full max-w-md border border-gray-200">
      <!-- Верхняя полоса акцентного цвета -->
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const form = ref({
  fio: '',
  department: ''
})
const loading = ref(false)

const isFormValid = computed(() => {
  return form.value.fio.trim().length > 0 && 
         form.value.department.length > 0
})

const completeRegistration = async () => {
  if (!isFormValid.value || loading.value) return
  
  loading.value = true

  // Получаем данные Telegram из localStorage
  let telegramData = null
  if (process.client) {
    const userStr = localStorage.getItem('telegram_user')
    if (userStr) {
      telegramData = JSON.parse(userStr)
    }
  }

  if (!telegramData) {
    console.error('Нет данных Telegram')
    await router.push('/auth')
    loading.value = false
    return
  }

  // Создаем полные данные пользователя
  const userData = {
    telegram_id: telegramData.telegram_id,
    first_name: telegramData.first_name,
    last_name: telegramData.last_name || '',
    username: telegramData.username || '',
    photo_url: telegramData.photo_url || '',
    fio: form.value.fio.trim(),
    department: form.value.department,
    is_admin: telegramData.is_admin || false
  }

  try {
    // Сохраняем через API
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    
    const result = await response.json()
    console.log('Результат регистрации:', result)

    if (result.success) {
      // Сохраняем в localStorage
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('user_id', result.user.id.toString())
      localStorage.setItem('user_fio', result.user.fio)
      localStorage.setItem('user_department', result.user.department)
      localStorage.setItem('telegram_id', result.user.telegram_id.toString())
      localStorage.setItem('is_admin', result.user.is_admin.toString())
      
      // Перенаправляем в кабинет
      setTimeout(() => {
        router.push(result.user.is_admin ? '/admin' : '/cabinet')
      }, 300)
    } else {
      alert('Ошибка регистрации: ' + (result.message || 'Неизвестная ошибка'))
      loading.value = false
    }
  } catch (error) {
    console.error('Ошибка сохранения:', error)
    
    // Если API не работает, сохраняем в localStorage и идем дальше
    if (process.client) {
      const fallbackUser = {
        id: Date.now(),
        telegram_id: telegramData.telegram_id,
        fio: form.value.fio.trim(),
        department: form.value.department,
        is_admin: telegramData.is_admin || false
      }
      
      localStorage.setItem('user', JSON.stringify(fallbackUser))
      localStorage.setItem('user_id', fallbackUser.id.toString())
      localStorage.setItem('user_fio', form.value.fio.trim())
      localStorage.setItem('user_department', form.value.department)
      localStorage.setItem('telegram_id', telegramData.telegram_id.toString())
      localStorage.setItem('is_admin', (telegramData.is_admin || false).toString())
    }
    
    // Перенаправляем
    setTimeout(() => {
      router.push(telegramData.is_admin ? '/admin' : '/cabinet')
    }, 300)
  }
}

onMounted(() => {
  // Проверяем, есть ли данные Telegram
  if (process.client) {
    const telegramUser = localStorage.getItem('telegram_user')
    if (!telegramUser) {
      router.push('/auth')
      return
    }
    
    // Пробуем заполнить ФИО из Telegram данных
    try {
      const user = JSON.parse(telegramUser)
      if (user.first_name || user.last_name) {
        const telegramName = `${user.first_name || ''} ${user.last_name || ''}`.trim()
        if (telegramName) {
          form.value.fio = telegramName
        }
      }
    } catch (error) {
      console.error('Ошибка парсинга Telegram данных:', error)
    }
  }
})
</script>