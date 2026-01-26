<script setup lang="ts">
import { useRouter } from '#imports'

const router = useRouter()

const checkLocalStorage = () => {
  if (process.client) {
    console.log('📦 LocalStorage содержимое:')
    console.log('telegram_auth_data:', localStorage.getItem('telegram_auth_data'))
    console.log('user:', localStorage.getItem('user'))
    alert('Проверьте консоль браузера (F12)')
  }
}

onMounted(async () => {
  if (!process.client) return

  try {
    console.log('📞 Callback page mounted')
    console.log('📋 URL params:', window.location.search)
    
    // Получаем данные из URL
    const telegramData = Object.fromEntries(
      new URLSearchParams(window.location.search)
    )
    
    console.log('🤖 Telegram data received:', telegramData)

    // Отправляем на сервер для проверки
    console.log('📤 Sending to /api/auth...')
    const res: any = await $fetch('/api/auth', {
      method: 'POST',
      body: telegramData,
      onRequestError({ error }: any) {
        console.error('❌ Ошибка запроса:', error)
      },
      onResponseError({ response }: any) {
        console.error('❌ Ошибка ответа:', response.status, response._data)
      }
    })

    console.log('📥 Server response:', res)

    // Сохраняем telegram данные
    localStorage.setItem('telegram_auth_data', JSON.stringify(telegramData))

    // Редиректы на основе ответа
    if (res.status === 'new') {
      console.log('👤 New user, redirecting to register')
      // Сохраняем telegram данные для регистрации
      localStorage.setItem('telegram_register_data', JSON.stringify({
        ...telegramData,
        telegramId: telegramData.id,
        telegramData: res.telegramData
      }))
      await router.replace('/register')
      return
    }

    if (res.role === 'admin') {
      console.log('👑 Admin user, redirecting to admin panel')
      // Сохраняем данные пользователя
      localStorage.setItem('user', JSON.stringify(res.user))
      localStorage.setItem('is_admin', 'true')
      localStorage.setItem('user_id', res.user.id)
      await router.replace('/admin')
      return
    }

    if (res.role === 'user') {
      console.log('👨‍💼 Regular user, redirecting to cabinet')
      // Сохраняем данные пользователя
      localStorage.setItem('user', JSON.stringify(res.user))
      localStorage.setItem('is_admin', 'false')
      localStorage.setItem('user_id', res.user.id)
      await router.replace('/cabinet')
      return
    }

    console.log('❓ Unknown role, redirecting to auth')
    await router.replace('/auth')
  } catch (e: any) {
    console.error('💥 Auth error:', e)
    alert('Ошибка авторизации. Попробуйте снова.')
    await router.replace('/auth')
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="text-center">
      <!-- Spinner -->
      <div class="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      
      <h1 class="text-2xl font-bold text-gray-800 mb-2">
        Авторизация через Telegram
      </h1>
      <p class="text-gray-600 mb-4">
        Проверяем данные...
      </p>
      <p class="text-sm text-gray-500">
        Это займет всего несколько секунд
      </p>
    </div>
    
    <!-- Debug info -->
    <div v-if="process.client" class="mt-8 p-4 bg-gray-100 rounded-lg max-w-md">
      <p class="text-sm font-medium text-gray-700 mb-2">Отладка:</p>
      <p class="text-xs text-gray-600">URL Params: {{ window.location.search }}</p>
      <button 
        @click="checkLocalStorage"
        class="mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded"
      >
        Проверить localStorage
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>