<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-lg font-medium text-gray-700">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<<script setup>
import { onMounted } from 'vue'
import { useRouter } from '#app'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  if (!process.client) return

  try {
    const hash = window.location.hash.replace('#', '')
    const params = new URLSearchParams(hash)

    const authData = {
      telegram_id: params.get('id'),
      first_name: params.get('first_name'),
      last_name: params.get('last_name') || '',
      username: params.get('username') || '',
      photo_url: params.get('photo_url') || ''
    }

    if (!authData.telegram_id || !authData.first_name) {
      return router.push('/auth')
    }

    // Проверяем пользователя
    const res = await fetch(`/api/users/check?telegram_id=${authData.telegram_id}`)
    const result = await res.json()

    if (result?.success && result.user) {
      // 🔥 ВАЖНО: кладём пользователя в Pinia
      authStore.setUser(result.user)

      // пользователь есть, но не заполнен
      if (!result.user.fio || !result.user.department) {
        return router.push('/register')
      }

      // полный профиль
      return router.push(result.user.is_admin ? '/admin' : '/cabinet')
    }

    // новый пользователь
    authStore.setUser({
      telegram_id: authData.telegram_id,
      first_name: authData.first_name,
      last_name: authData.last_name,
      username: authData.username,
      photo_url: authData.photo_url,
      is_admin: false
    })

    return router.push('/register')

  } catch (e) {
    console.error('Auth callback error:', e)
    return router.push('/auth')
  }
})
</>
