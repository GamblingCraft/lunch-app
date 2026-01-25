<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-medium overflow-hidden w-full max-w-md border border-gray-200">
      <div class="h-2 bg-accent-500"></div>
      
      <div class="p-8">
        <!-- Заголовок -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-50 to-white rounded-2xl mb-4 border border-gray-200">
            <svg class="w-10 h-10 text-accent-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.20-1.13-.31-1.09-.66.02-.18.27-.37.74-.56 2.83-1.23 4.72-2.06 5.68-2.45 2.7-1.15 3.26-1.35 3.63-1.35.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Авторизация</h1>
          <p class="text-gray-600 mb-2">Войдите через Telegram</p>
          <p class="text-sm text-gray-500 mb-4">Бот: @{{ botName || 'не указан' }}</p>
          
          <!-- Индикатор настроек -->
          <div class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Бот настроен
          </div>
        </div>

        <!-- Инструкция -->
        <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="mt-3">
            <button 
              @click="openTelegramAuth"
              class="w-full px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b3] transition-colors text-sm"
            >
              Открыть Telegram OAuth
            </button>
            <p class="text-xs text-blue-500 mt-1">
              Если появляется "Bot domain invalid", проверьте настройки в @BotFather
            </p>
          </div>
        </div>

        <!-- Тестовые кнопки -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-500 text-center mb-3">Тестовый вход:</p>
          <div class="flex flex-col space-y-2">
            <button 
              @click="loginAsAdmin"
              class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors text-sm"
            >
              Войти как Админ
            </button>
            <button 
              @click="loginAsUser"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Войти как Сотрудник
            </button>
          </div>
        </div>

        <!-- Отладка -->
        <div class="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p class="text-xs text-gray-500 mb-1">Отладка:</p>
          <p class="text-xs text-gray-600">Bot ID: {{ botId }}</p>
          <p class="text-xs text-gray-600">Current URL: {{ currentUrl }}</p>
          <button 
            @click="checkBotStatus"
            class="mt-2 px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Проверить статус
          </button>
        </div>

        <!-- Кнопка назад -->
        <button
          @click="router.back()"
          class="w-full mt-6 text-gray-600 hover:text-gray-800 py-2 text-sm"
        >
          ← Назад к вводу кода
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const config = useRuntimeConfig()

const botName = ref('')
const botId = ref('')
const currentUrl = ref('')
const loading = ref(false)

// Текущий URL
onMounted(() => {
  if (process.client) {
    currentUrl.value = window.location.origin
    checkBotConfiguration()
  }
})

const checkBotConfiguration = () => {
  const botFromConfig = config.public.telegramBotName
  const botToken = config.public.telegramBotToken
  
  botName.value = botFromConfig || ''
  
  if (botToken && botToken.includes(':')) {
    botId.value = botToken.split(':')[0]
  }
}

// Универсальный Telegram OAuth URL
const telegramAuthUrl = computed(() => {
  if (!botId.value) return '#'
  
  // Пробуем разные варианты origin
  const origins = [
    'http://127.0.0.1',
    'http://localhost',
    'http://localhost:3000',
    currentUrl.value
  ]
  
  const returnTo = `${currentUrl.value}/auth/callback`
  
  // Пробуем первый вариант, который должен работать
  const origin = origins[0]
  
  return `https://oauth.telegram.org/auth?bot_id=${botId.value}&origin=${encodeURIComponent(origin)}&request_access=write&return_to=${encodeURIComponent(returnTo)}&lang=ru`
})

const openTelegramAuth = () => {
  console.log('Пробуем OAuth с origin:', currentUrl.value)
  console.log('Full URL:', telegramAuthUrl.value)
  window.open(telegramAuthUrl.value, '_blank')
}

const checkBotStatus = async () => {
  const botToken = config.public.telegramBotToken
  if (!botToken) {
    alert('Токен бота не найден в конфигурации')
    return
  }
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
    const data = await response.json()
    
    if (data.ok) {
      alert(`✅ Бот доступен\nИмя: ${data.result.first_name}\nUsername: @${data.result.username}\nID: ${data.result.id}`)
    } else {
      alert(`❌ Ошибка: ${data.description}`)
    }
  } catch (error) {
    alert(`❌ Ошибка сети: ${error.message}`)
  }
}

// Проверяем, заполнены ли данные пользователя
const checkUserRegistration = async (telegramId) => {
  try {
    const response = await fetch(`/api/users/check?telegram_id=${telegramId}`)
    const result = await response.json()
    
    return result
  } catch (error) {
    console.error('Ошибка проверки пользователя:', error)
    return { success: false, user: null }
  }
}

// Обработка входа
const handleLogin = async (userData) => {
  if (loading.value) return
  loading.value = true
  
  const ADMIN_IDS = [123456789]
  
  const telegramUser = {
    telegram_id: userData.id,
    first_name: userData.first_name,
    last_name: userData.last_name || '',
    username: userData.username || '',
    photo_url: userData.photo_url || '',
    is_admin: ADMIN_IDS.includes(userData.id)
  }
  
  try {
    // Сохраняем Telegram данные в localStorage
    localStorage.setItem('telegram_user', JSON.stringify(telegramUser))
    localStorage.setItem('telegram_id', userData.id.toString())
    localStorage.setItem('is_admin', telegramUser.is_admin.toString())
    
    // Проверяем, есть ли пользователь в базе
    const checkResult = await checkUserRegistration(userData.id)
    
    if (checkResult.success && checkResult.user) {
      // Пользователь найден
      const user = checkResult.user
      
      // Проверяем, заполнены ли ФИО и отдел
      if (user.fio && user.department) {
        // Все данные заполнены - сохраняем и идем в кабинет
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('user_id', user.id.toString())
        localStorage.setItem('user_fio', user.fio)
        localStorage.setItem('user_department', user.department)
        
        console.log('Пользователь уже зарегистрирован:', user)
        
        setTimeout(() => {
          router.push(user.is_admin ? '/admin' : '/cabinet')
        }, 300)
      } else {
        // Нужно заполнить данные - переходим на регистрацию
        console.log('Пользователю нужно заполнить данные')
        router.push('/register')
      }
    } else {
      // Пользователь не найден - переходим на регистрацию
      console.log('Новый пользователь')
      router.push('/register')
    }
  } catch (error) {
    console.error('Ошибка входа:', error)
    // При ошибке все равно идем на регистрацию
    router.push('/register')
  } finally {
    loading.value = false
  }
}

// Тестовые логины
const loginAsAdmin = () => {
  const user = {
    id: 123456789,
    first_name: 'Администратор',
    last_name: 'Тест',
    username: 'admin_test',
    auth_date: Math.floor(Date.now() / 1000),
    hash: 'test_hash'
  }
  handleLogin(user)
}

const loginAsUser = () => {
  const user = {
    id: 111222333,
    first_name: 'Сотрудник',
    last_name: 'Тест',
    username: 'employee_test',
    auth_date: Math.floor(Date.now() / 1000),
    hash: 'test_hash_user'
  }
  handleLogin(user)
}
</script>