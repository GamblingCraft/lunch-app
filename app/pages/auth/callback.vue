<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-lg font-medium text-gray-700">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const message = ref('Завершаем авторизацию...')

onMounted(async () => {
  if (!process.client) return

  try {
    // 1. Забираем hash от Telegram
    const hashString = window.location.hash.replace('#', '')
    const params = new URLSearchParams(hashString)

    const authData = {
      id: params.get('id'),
      first_name: params.get('first_name'),
      last_name: params.get('last_name') || '',
      username: params.get('username') || '',
      photo_url: params.get('photo_url') || '',
      auth_date: params.get('auth_date'),
      hash: params.get('hash')
    }

    // 2. Минимальная проверка
    if (!authData.id || !authData.first_name) {
      message.value = 'Ошибка авторизации. Повторите вход.'
      setTimeout(() => router.push('/auth'), 1000)
      return
    }

    // 3. Сохраняем Telegram-данные
    const telegramUser = {
      telegram_id: authData.id,
      first_name: authData.first_name,
      last_name: authData.last_name,
      username: authData.username,
      photo_url: authData.photo_url
    }

    localStorage.setItem('telegram_user', JSON.stringify(telegramUser))
    localStorage.setItem('telegram_id', authData.id.toString())

    // 4. Проверяем пользователя в системе
    const res = await fetch(`/api/users/check?telegram_id=${authData.id}`)
    const result = await res.json()

    // 5. Роутинг — ГАРАНТИРОВАННЫЙ
    if (result?.success && result.user) {
      // пользователь есть
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('user_id', result.user.id.toString())

      if (result.user.fio) {
        localStorage.setItem('user_fio', result.user.fio)
      }
      if (result.user.department) {
        localStorage.setItem('user_department', result.user.department)
      }

      message.value = 'Вход выполнен. Переходим…'

      setTimeout(() => {
        router.push(result.user.is_admin ? '/admin' : '/cabinet')
      }, 500)
    } else {
      // новый пользователь
      message.value = 'Переходим к регистрации…'
      setTimeout(() => router.push('/register'), 500)
    }

  } catch (e) {
    console.error('Telegram callback error:', e)
    message.value = 'Ошибка. Возврат к авторизации…'
    setTimeout(() => router.push('/auth'), 1000)
  }
})
</script
>