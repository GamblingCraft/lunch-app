<template>
  <div class="min-h-screen bg-gray-50">
    <CabinetHeader
      :user="user"
      :initials="getUserInitials(user.fio)"
      :newRepliesCount="newRepliesCount"
      @logout="logout"
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CabinetWelcome
        :userName="getUserName(user.fio)"
        :department="user.department"
      />

      <CabinetActionsGrid :newRepliesCount="newRepliesCount" />

      <TodayLunchBlock/>

      
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#app'
import { useAuthStore } from '@/stores/auth'

import { getUserInitials, getUserName } from '~/utils/cabinet/userUtils'

import CabinetHeader from '~/components/cabinet/layout/CabinetHeader.vue'
import CabinetWelcome from '~/components/cabinet/dashboard/CabinetWelcome.vue'
import CabinetActionsGrid from '~/components/cabinet/dashboard/CabinetActionsGrid.vue'
import TodayLunchBlock from '~/components/cabinet/today/TodayLunchBlock.vue'

import { useTodayOrder } from '~/composables/cabinet/useTodayOrder'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  if (process.client) {
    authStore.loadUser()
    
    if (!authStore.isAuthenticated) {
      return navigateTo('/auth')
    }
    
    if (authStore.isAdmin) {
      console.warn('Админ пытается зайти в кабинет пользователя')
      return navigateTo('/admin')
    }
  }
})

interface User {
  id: number
  fio: string
  email: string
  department: string
  isAdmin: boolean
  telegram_id?: number
}

const user = ref<User>({
  id: 0,
  fio: '',
  email: '',
  department: '',
  isAdmin: false,
  telegram_id: 0
})

const { todayOrder, todayName, loadTodayOrder } = useTodayOrder()

// feedback (пока оставляем здесь)
const userFeedback = ref<any[]>([])
const loadingFeedback = ref(false)

const newRepliesCount = computed(() =>
  userFeedback.value.filter((f: any) => f.status === 'replied' && !f.seen_by_user).length
)

const loadUserFeedback = async () => {
  if (!user.value.id) return
  loadingFeedback.value = true
  try {
    const response: any = await $fetch('/api/feedback/user', {
      query: { user_id: user.value.id, _t: Date.now() }
    })
    if (response?.success) userFeedback.value = response.feedback || []
  } catch (e) {
    console.error('Ошибка загрузки отзывов:', e)
  } finally {
    loadingFeedback.value = false
  }
}

const startPolling = () => {
  setInterval(() => {
    if (user.value.id && !loadingFeedback.value) loadUserFeedback()
  }, 60000)
}

const logout = () => {
  if (process.client) localStorage.clear()
  router.push('/')
}

onMounted(async () => {
  if (process.client) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        user.value = {
          id: userData.id || Number(localStorage.getItem('user_id')) || 0,
          fio: userData.fio || localStorage.getItem('user_fio') || '',
          email: userData.email || '',
          department: userData.department || localStorage.getItem('user_department') || '',
          isAdmin: userData.is_admin || localStorage.getItem('is_admin') === 'true',
          telegram_id: userData.telegram_id || Number(localStorage.getItem('telegram_id')) || 0
        }
      } catch (e) {
        console.error('Ошибка парсинга пользователя:', e)
      }
    }
  }

  if (user.value.id) {
    await Promise.all([
      loadTodayOrder(user.value.id),
      loadUserFeedback()
    ])
  }

  startPolling()
})
</script>
