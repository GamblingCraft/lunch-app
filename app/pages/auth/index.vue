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
        </div>

        <!-- Telegram Button -->
        <div class="mb-6 p-4">
          <div class="mt-3">
            <div id="telegram-login-container"></div>
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
          <p class="text-xs text-gray-600">Bot Name: {{ botName }}</p>
          <p class="text-xs text-gray-600 truncate">Callback URL: {{ siteUrl }}/callback</p>
          <button 
            @click="checkBotStatus"
            class="mt-2 px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Проверить статус
          </button>
          <button 
            @click="initTelegramLogin"
            class="mt-2 ml-2 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            ↻ Обновить виджет
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
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAuth } from '#imports' // Nuxt 4 автоматически импортирует composables

const router = useRouter()
const auth = useAuth()

// Telegram bot credentials
const botId = '8208807830'
const botName = 'et_lunch_web_bot'
const siteUrl = window.location.origin

/**
 * Telegram login via script
 */
const initTelegramLogin = () => {
  if (!process.client) return

  console.log('Initializing Telegram login widget...')

  // Clear previous script
  const existingScript = document.getElementById('telegram-login-script')
  if (existingScript) {
    existingScript.remove()
  }

  // Clear container
  const container = document.getElementById('telegram-login-container')
  if (container) {
    container.innerHTML = ''
  }

  // Create new script
  const script = document.createElement('script')
  script.id = 'telegram-login-script'
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.async = true
  script.setAttribute('data-telegram-login', botName)
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-radius', '8')
  script.setAttribute('data-request-access', 'write')
  script.setAttribute('data-userpic', 'true')
  script.setAttribute('data-auth-url', `${siteUrl}/callback`)
  script.setAttribute('data-bot-id', botId)

  // Add to container
  const containerEl = document.getElementById('telegram-login-container')
  if (containerEl) {
    containerEl.appendChild(script)
  }

  script.onerror = (error) => {
    console.error('Failed to load Telegram widget:', error)
    const container = document.getElementById('telegram-login-container')
    if (container) {
      container.innerHTML = `
        <div class="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 font-medium">Ошибка загрузки Telegram виджета</p>
          <p class="text-red-500 text-sm mt-1">Проверьте подключение к интернету</p>
          <a 
            href="https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(siteUrl)}&request_access=write"
            class="mt-3 inline-block px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b3] transition-colors text-sm"
            target="_blank"
          >
            Войти через Telegram
          </a>
        </div>
      `
    }
  }
}

/**
 * Тестовые входы
 */
const loginAsAdmin = () => {
  // Используйте telegram_id из вашего users.json: 123456789
  const testAdminData = {
    id: '123456789',
    first_name: 'Администратор',
    last_name: 'Тест',
    username: 'admin_test',
    photo_url: '',
    auth_date: Math.floor(Date.now() / 1000).toString(),
    hash: 'test_hash_admin_123'
  }
  
  const params = new URLSearchParams(testAdminData)
  router.push(`/callback?${params.toString()}`)
}

const loginAsUser = () => {
  // Используйте telegram_id из вашего users.json: 111222333
  const testUserData = {
    id: '111222333',
    first_name: 'Сотрудник',
    last_name: 'Тест',
    username: 'employee_test',
    photo_url: '',
    auth_date: Math.floor(Date.now() / 1000).toString(),
    hash: 'test_hash_user_456'
  }
  
  const params = new URLSearchParams(testUserData)
  router.push(`/callback?${params.toString()}`)
}

/**
 * Отладка
 */
const checkBotStatus = () => {
  console.log('=== TELEGRAM BOT STATUS ===')
  console.log('Bot ID:', botId)
  console.log('Bot Name:', botName)
  console.log('Site URL:', siteUrl)
  
  alert(`Статус бота:\n\nID: ${botId}\nИмя: ${botName}\n\nCallback URL:\n${siteUrl}/callback`)
}

// Инициализируем при монтировании
onMounted(() => {
  console.log('Auth page mounted')
  initTelegramLogin()
})
</script>

<style scoped>
.shadow-medium {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>