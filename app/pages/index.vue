<!-- app/pages/index.vue - исправляем инпут -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-medium overflow-hidden w-full max-w-md border border-gray-200">
      <!-- Верхняя полоса акцентного цвета -->
      <div class="h-2 bg-accent-500"></div>
      
      <div class="p-8">
        <!-- Логотип -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-accent-50 to-white rounded-2xl mb-4 border border-gray-200">
            <div class="text-center">
              <div class="text-3xl font-bold text-accent-500">ET</div>
              <div class="text-sm font-medium text-gray-600 mt-1">ОБЕД</div>
            </div>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">etadmin</h1>
          <p class="text-gray-600">Добро пожаловать!</p>
        </div>

        <!-- Поле для кода доступа -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Код доступа
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              v-model="accessCode"
              type="password"
              maxlength="6"
              placeholder="******"
              class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-colors text-center text-xl font-mono tracking-widest bg-white"
              @input="formatCode"
              @keyup.enter="checkCode"
            />
          </div>
          <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
          <p v-else class="mt-2 text-xs text-gray-500">Введите код, выданный администратором</p>
        </div>

        <!-- Кнопка входа акцентного цвета -->
        <button
          @click="checkCode"
          :disabled="!isCodeValid"
          class="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center bg-accent-500 hover:bg-accent-600 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Войти</span>
          <span v-else class="flex items-center justify-center">
            <svg class="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Проверка...
          </span>
        </button>

        <!-- Информация -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-500 text-center">
            Система управления заказами обедов
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const accessCode = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const isCodeValid = computed(() => {
  return accessCode.value.length === 6
})

const formatCode = (e) => {
  const value = e.target.value.replace(/\D/g, '')
  accessCode.value = value
  errorMessage.value = ''
}

const checkCode = async () => {
  if (!isCodeValid.value) {
    errorMessage.value = 'Введите 6 цифр кода'
    return
  }

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))

  if (accessCode.value === '503344') {
    if (process.client) {
      localStorage.setItem('access_code', accessCode.value)
    }
    
    await router.push('/auth')
  } else {
    errorMessage.value = 'Неверный код доступа'
    accessCode.value = ''
  }

  isLoading.value = false
}

onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      const input = document.querySelector('input[type="password"]')
      if (input) input.focus()
    }, 100)
  }
})
</script>