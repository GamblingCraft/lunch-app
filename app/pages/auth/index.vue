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
          <div class="mt-3 flex justify-center">
            <div id="telegram-login-container"></div>
          </div>
        </div>

        <!-- Тестовые кнопки -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex flex-col space-y-2">
            <button 
              @click="loginAsAdmin"
              class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors text-sm"
            >
              A
            </button>
            <button 
              @click="loginAsUser"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              U
            </button>
          </div>
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

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Telegram bot credentials
const botId = '8208807830'
const botName = 'et_lunch_web_bot'
const isClient = typeof window !== 'undefined'
const siteUrl = ref('')

/**
 * Тестовые данные пользователей (соответствуют вашему users.json)
 */
const loginAsAdmin = async () => {
  try {
    // Тестовые данные администратора
    const adminUser = {
      id: 1769162359485,
      telegram_id: 123456789,
      first_name: 'Администратор',
      last_name: 'Тест',
      username: 'admin_test',
      photo_url: '',
      fio: 'АдминОбед',
      department: 'Администрация',
      is_admin: true, // Это важное поле!
      created_at: '2026-01-23T09:59:19.485Z',
      updated_at: '2026-01-23T09:59:19.485Z'
    }

    // Сохраняем пользователя в store
    authStore.setUser(adminUser)
    
    console.log('Тестовый вход как администратор:', adminUser)
    
    setTimeout(() => {
      router.push('/admin')
    }, 300)
    
  } catch (error) {
    console.error('Ошибка при входе администратора:', error)
    alert('Произошла ошибка при входе администратора')
  }
}

// Внутри loginAsUser():
const loginAsUser = async () => {
  try {
    // Тестовые данные сотрудника
    const employeeUser = {
      id: 1769162269002,
      telegram_id: 111222333,
      first_name: 'Дик',
      last_name: 'Егор Владимирович',
      username: 'employee_test',
      photo_url: '',
      fio: 'Дик Егор Владимирович',
      department: 'Склад',
      is_admin: false, // Это важное поле!
      created_at: '2026-01-23T09:57:49.002Z',
      updated_at: '2026-01-26T05:32:19.571Z'
    }

    // Сохраняем пользователя в store
    authStore.setUser(employeeUser)
    
    console.log('Тестовый вход как сотрудник:', employeeUser)
    
    setTimeout(() => {
      router.push('/cabinet')
    }, 300)
    
  } catch (error) {
    console.error('Ошибка при входе сотрудника:', error)
    alert('Произошла ошибка при входе сотрудника')
  }
}

/**
 * Инициализация URL сайта
 */
const initSiteUrl = () => {
  if (isClient) {
    siteUrl.value = window.location.origin
  }
}

/**
 * Инициализация Telegram виджета
 */
const initTelegramLogin = () => {
  if (!isClient) return

  console.log('Initializing Telegram login widget...')
  
  // Очистка предыдущего скрипта
  const existingScript = document.getElementById('telegram-login-script')
  if (existingScript) {
    existingScript.remove()
  }

  // Очистка контейнера
  const container = document.getElementById('telegram-login-container')
  if (container) {
    container.innerHTML = ''
  }

  // Создание нового скрипта
  const script = document.createElement('script')
  script.id = 'telegram-login-script'
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.async = true
  script.setAttribute('data-telegram-login', botName)
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-radius', '8')
  script.setAttribute('data-request-access', 'write')
  script.setAttribute('data-userpic', 'true')
  script.setAttribute('data-auth-url', `${siteUrl.value}/auth/callback`)
  script.setAttribute('data-bot-id', botId)

  // Добавление в контейнер
  const containerEl = document.getElementById('telegram-login-container')
  if (containerEl) {
    containerEl.appendChild(script)
  }

  script.onload = () => {
    console.log('Telegram widget loaded successfully')
  }

  script.onerror = (error) => {
    console.error('Failed to load Telegram widget:', error)
  }
}

/**
 * Проверка авторизации при загрузке
 */
const checkAuthStatus = () => {
  if (isClient) {
    // Загружаем пользователя из localStorage
    authStore.loadUser()
    
    // Если пользователь уже авторизован, редиректим
    if (authStore.isAuthenticated) {
      console.log('Пользователь уже авторизован, редирект...')
      if (authStore.isAdmin) {
        router.push('/admin')
      } else {
        router.push('/cabinet')
      }
    }
  }
}

// Инициализация при монтировании
onMounted(() => {
  console.log('Auth page mounted')
  initSiteUrl()
  checkAuthStatus()
  initTelegramLogin()
})
</script>

<style scoped>
.shadow-medium {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>