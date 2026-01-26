<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const BOT_USERNAME = 'et_lunch_web_bot'
const AUTH_URL = 'https://et-obed.ru/auth/callback'

let scriptEl: HTMLScriptElement | null = null

onMounted(() => {
  if (document.getElementById('telegram-login-script')) return

  scriptEl = document.createElement('script')
  scriptEl.id = 'telegram-login-script'
  scriptEl.src = 'https://telegram.org/js/telegram-widget.js?22'
  scriptEl.async = true

  scriptEl.setAttribute('data-telegram-login', BOT_USERNAME)
  scriptEl.setAttribute('data-size', 'large')
  scriptEl.setAttribute('data-radius', '10')
  scriptEl.setAttribute('data-auth-url', AUTH_URL)
  scriptEl.setAttribute('data-request-access', 'write')

  document.getElementById('tg-login')?.appendChild(scriptEl)
})

onBeforeUnmount(() => {
  scriptEl?.remove()
  scriptEl = null
})
</script>

<template>
  <div id="tg-login"></div>
</template>
