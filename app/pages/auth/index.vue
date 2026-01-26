<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-xl shadow max-w-md w-full text-center">
      <h1 class="text-2xl font-bold mb-6">Авторизация</h1>

      <button
        @click="openTelegramAuth"
        class="w-full px-4 py-3 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b3]"
      >
        Войти через Telegram
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const config = useRuntimeConfig()

const botId = ref('')
const origin = ref('')

onMounted(() => {
  if (process.client) {
    origin.value = window.location.origin
    const token = config.public.telegramBotToken
    if (token?.includes(':')) {
      botId.value = token.split(':')[0]
    }
  }
})

const telegramAuthUrl = computed(() => {
  if (!botId.value || !origin.value) return '#'

  const returnTo = `${origin.value}/auth/callback`

  return `https://oauth.telegram.org/auth` +
    `?bot_id=${botId.value}` +
    `&origin=${encodeURIComponent(origin.value)}` +
    `&request_access=write` +
    `&return_to=${encodeURIComponent(returnTo)}`
})

const openTelegramAuth = () => {
  window.location.href = telegramAuthUrl.value
}
</script>
