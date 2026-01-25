<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-medium overflow-hidden w-full max-w-md border border-gray-200">
      <div class="h-2 bg-accent-500"></div>
      
      <div class="p-8 text-center">
        <div class="mb-6">
          <div v-if="loading" class="inline-flex items-center justify-center w-16 h-16 mb-4">
            <svg class="animate-spin h-12 w-12 text-accent-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div v-else class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-50 to-white rounded-2xl mb-4 border border-gray-200">
            <svg v-if="success" class="w-10 h-10 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <svg v-else class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <h1 class="text-2xl font-bold text-gray-800 mb-2">
            {{ loading ? 'Обработка...' : success ? 'Успешно!' : 'Ошибка' }}
          </h1>
          
          <p class="text-gray-600 mb-4">
            {{ message }}
          </p>
          
          <button 
            v-if="!loading"
            @click="continueToApp"
            class="w-full px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
          >
            {{ success ? 'Продолжить' : 'Вернуться' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const loading = ref(true)
const success = ref(false)
const message = ref('Обработка авторизации...')

const processTelegramAuth = () => {
  if (process.client) {
    // Парсим данные из URL hash
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    
    const authData = {
      id: params.get('id'),
      first_name: params.get('first_name'),
      last_name: params.get('last_name') || '',
      username: params.get('username') || '',
      photo_url: params.get('photo_url') || '',
      auth_date: params.get('auth_date'),
      hash: params.get('hash')
    }
    
    if (authData.id && authData.first_name) {
      // Вызываем ту же функцию handleLogin что и в auth/index.vue
      const handleLogin = async (userData) => {
        const ADMIN_IDS = [123456789]
        
        const telegramUser = {
          telegram_id: userData.id,
          first_name: userData.first_name,
          last_name: userData.last_name || '',
          username: userData.username || '',
          photo_url: userData.photo_url || '',
          is_admin: ADMIN_IDS.includes(parseInt(userData.id))
        }
        
        // Сохраняем Telegram данные
        localStorage.setItem('telegram_user', JSON.stringify(telegramUser))
        localStorage.setItem('telegram_id', userData.id.toString())
        localStorage.setItem('is_admin', telegramUser.is_admin.toString())
        
        // Проверяем регистрацию
        try {
          const response = await fetch(`/api/users/check?telegram_id=${userData.id}`)
          const result = await response.json()
          
          if (result.success && result.user && result.user.fio && result.user.department) {
            // Пользователь уже зарегистрирован
            localStorage.setItem('user', JSON.stringify(result.user))
            localStorage.setItem('user_id', result.user.id.toString())
            localStorage.setItem('user_fio', result.user.fio)
            localStorage.setItem('user_department', result.user.department)
            
            success.value = true
            message.value = 'Авторизация успешна!'
            
            setTimeout(() => {
              router.push(result.user.is_admin ? '/admin' : '/cabinet')
            }, 1000)
          } else {
            // Нужна регистрация
            success.value = true
            message.value = 'Переходим к заполнению данных...'
            
            setTimeout(() => {
              router.push('/register')
            }, 1000)
          }
        } catch (error) {
          // При ошибке API тоже идем на регистрацию
          success.value = true
          message.value = 'Переходим к заполнению данных...'
          
          setTimeout(() => {
            router.push('/register')
          }, 1000)
        }
      }
      
      handleLogin(authData)
    } else {
      // Некорректные данные
      success.value = false
      message.value = 'Ошибка авторизации. Неполные данные от Telegram.'
    }
    
    loading.value = false
  }
}

const continueToApp = () => {
  if (success.value) {
    router.push('/auth')
  } else {
    router.push('/')
  }
}

onMounted(() => {
  processTelegramAuth()
})
</script>