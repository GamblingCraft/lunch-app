<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Логотип и навигация -->
        <div class="flex items-center space-x-4">
          <NuxtLink to="/admin" class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <span class="text-white text-sm font-bold">ET</span>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-gray-800">ET Обед Админ</h1>
              <p class="text-xs text-gray-500">Система управления заказами</p>
            </div>
          </NuxtLink>
        </div>

        <!-- Правая часть -->
        <div class="flex items-center space-x-4">
          <!-- Профиль пользователя -->
          <div class="flex items-center space-x-3">
            <div class="text-right hidden md:block">
              <p class="text-sm font-medium text-gray-800">{{ user?.first_name || 'Администратор' }}</p>
              <p class="text-xs text-gray-500">Админ</p>
            </div>
            <button 
              @click="logout"
              class="text-sm text-accent-600 hover:text-accent-800"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const router = useRouter()
const user = ref(null)

onMounted(() => {
  if (process.client) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      user.value = JSON.parse(userStr)
    }
  }
})

const logout = () => {
  if (process.client) {
    localStorage.clear()
  }
  router.push('/')
}
</script>