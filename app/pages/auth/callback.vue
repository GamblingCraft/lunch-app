<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-xl shadow max-w-md w-full text-center">
      <p class="text-gray-700">Авторизация через Telegram…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  if (!process.client) return

  // Telegram OAuth возвращает данные в hash
  const hash = window.location.hash.replace('#', '')
  const params = new URLSearchParams(hash)

  const telegramId = params.get('id')
  const firstName = params.get('first_name')

  if (!telegramId || !firstName) {
    await navigateTo('/auth', { replace: true })
    return
  }

  const telegramUser = {
    telegram_id: Number(telegramId),
    first_name: firstName,
    last_name: params.get('last_name') || '',
    username: params.get('username') || '',
    photo_url: params.get('photo_url') || '',
    is_admin: false
  }

  // Сохраняем Telegram-пользователя
  authStore.setUser(telegramUser)

  try {
    const res: any = await $fetch('/api/users/check', {
      query: { telegram_id: telegramId }
    })

    // Пользователь есть и данные заполнены
    if (res?.success && res.user?.fio && res.user?.department) {
      authStore.setUser(res.user)

      await navigateTo(
        res.user.is_admin ? '/admin' : '/cabinet',
        { replace: true }
      )
      return
    }

    // Нет данных — регистрация
    await navigateTo('/register', { replace: true })

  } catch (e) {
    // При любой ошибке — регистрация
    await navigateTo('/register', { replace: true })
  }
})
</script>
