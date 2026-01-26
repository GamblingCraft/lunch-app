<script setup lang="ts">
import { useRouter } from '#imports'

const router = useRouter()

onMounted(async () => {
  try {
    const telegramData = Object.fromEntries(
      new URLSearchParams(window.location.search)
    )

    const res: any = await $fetch('/api/auth', {
      method: 'POST',
      body: telegramData
    })

    if (res.status === 'new') {
      await router.replace('/register')
      return
    }

    if (res.role === 'admin') {
      await router.replace('/admin')
      return
    }

    if (res.role === 'user') {
      await router.replace('/cabinet')
      return
    }

    await router.replace('/auth')
  } catch (e) {
    console.error(e)
    await router.replace('/auth')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <span>Авторизация…</span>
  </div>
</template>
