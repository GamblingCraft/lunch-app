<script setup lang="ts">
import { useRouter } from '#imports'
import { useAuth } from '#imports'

const router = useRouter()
const auth = useAuth()

onMounted(async () => {
  try {
    console.log('Callback page mounted')
    console.log('URL params:', window.location.search)
    
    // Получаем данные из URL
    const telegramData = Object.fromEntries(
      new URLSearchParams(window.location.search)
    )
    
    console.log('Telegram data received:', telegramData)

    // Отправляем на сервер для проверки
    const res: any = await $fetch('/api/auth', {
      method: 'POST',
      body: telegramData
    })

    console.log('Server response:', res)

    if (res.status === 'new') {
      console.log('New user, redirecting to register')
      // Сохраняем telegram данные для регистрации
      localStorage.setItem('telegram_register_data', JSON.stringify({
        ...telegramData,
        telegramId: telegramData.id
      }))
      await router.replace('/register')
      return
    }

    if (res.user) {
      // Сохраняем пользователя через composable
      auth.login(res.user)
    }

    // Редиректы на основе ответа
    if (res.role === 'admin') {
      console.log('Admin user, redirecting to admin panel')
      await router.replace('/admin')
      return
    }

    if (res.role === 'user') {
      console.log('Regular user, redirecting to cabinet')
      await router.replace('/cabinet')
      return
    }

    console.log('Unknown role, redirecting to auth')
    await router.replace('/auth')
  } catch (e) {
    console.error('Auth error:', e)
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