<!-- app/layouts/cabinet.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Шапка кабинета -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <!-- Левая часть: логотип и навигация -->
          <div class="flex items-center space-x-6">
            <!-- Логотип -->
            <NuxtLink to="/cabinet" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-sm font-bold">ET</span>
              </div>
              <span class="text-lg font-semibold text-gray-800 hidden sm:inline">Личный кабинет</span>
            </NuxtLink>
            
            <!-- Навигация (только для десктопа) -->
            <nav class="hidden md:flex items-center space-x-1">
              <NuxtLink 
                to="/cabinet" 
                class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="isActive('/cabinet') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
              >
                Главная
              </NuxtLink>
              <NuxtLink 
                to="/cabinet/menu" 
                class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="isActive('/cabinet/menu') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
              >
                Меню
              </NuxtLink>
              <NuxtLink 
                to="/cabinet/week-order" 
                class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="isActive('/cabinet/week-order') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
              >
                Заказ
              </NuxtLink>
              <NuxtLink 
                to="/cabinet/my-orders" 
                class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="isActive('/cabinet/my-orders') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
              >
                Мои заказы
              </NuxtLink>
            </nav>
          </div>
          
          <!-- Правая часть: информация пользователя -->
          <div class="flex items-center space-x-4">
            <div class="hidden sm:block text-right">
              <p class="text-sm font-medium text-gray-800">{{ user.fio }}</p>
              <p class="text-xs text-gray-500">{{ user.department }}</p>
            </div>
            
            <!-- Аватар пользователя -->
            <div class="relative">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-gray-700 font-medium">
                  {{ getUserInitials(user.fio) }}
                </span>
              </div>
              
              <!-- Выпадающее меню -->
              <div class="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-800">{{ user.fio }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                </div>
                <button 
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Выйти
                </button>
              </div>
            </div>
            
            <!-- Кнопка выхода для мобильных -->
            <button 
              @click="logout"
              class="md:hidden text-sm text-gray-600 hover:text-gray-800"
            >
              Выйти
            </button>
          </div>
        </div>
        
        <!-- Мобильная навигация -->
        <nav class="md:hidden flex items-center justify-around py-3 border-t border-gray-200 mt-2">
          <NuxtLink 
            to="/cabinet" 
            class="flex flex-col items-center"
            :class="isActive('/cabinet') ? 'text-accent-600' : 'text-gray-500'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="text-xs mt-1">Главная</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/cabinet/menu" 
            class="flex flex-col items-center"
            :class="isActive('/cabinet/menu') ? 'text-accent-600' : 'text-gray-500'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span class="text-xs mt-1">Меню</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/cabinet/week-order" 
            class="flex flex-col items-center"
            :class="isActive('/cabinet/week-order') ? 'text-accent-600' : 'text-gray-500'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-xs mt-1">Заказ</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/cabinet/my-orders" 
            class="flex flex-col items-center"
            :class="isActive('/cabinet/my-orders') ? 'text-accent-600' : 'text-gray-500'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span class="text-xs mt-1">Заказы</span>
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Контент страницы -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Футер -->
    <footer class="bg-white border-t border-gray-200 mt-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-accent-500 rounded flex items-center justify-center">
                <span class="text-white text-xs font-bold">ET</span>
              </div>
              <span class="text-sm text-gray-600">Employee Lunch Order System</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">© 2026 Все права защищены</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <a href="#" class="text-sm text-gray-600 hover:text-gray-800">Помощь</a>
            <a href="#" class="text-sm text-gray-600 hover:text-gray-800">Обратная связь</a>
            <a href="#" class="text-sm text-gray-600 hover:text-gray-800">Контакты</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface User {
  id: number
  fio: string
  email: string
  department: string
  isAdmin: boolean
}

const router = useRouter()
const route = useRoute()
const user = ref<User>({
  id: 0,
  fio: '',
  email: '',
  department: '',
  isAdmin: false
})

// Проверяем активен ли маршрут
const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Получаем инициалы пользователя
const getUserInitials = (fio: string): string => {
  if (!fio) return '??'
  
  const parts = fio.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  
  return fio.substring(0, 2).toUpperCase()
}

onMounted(() => {
  // Загружаем данные пользователя
  if (process.client) {
    user.value.id = Number(localStorage.getItem('user_id')) || 0
    user.value.fio = localStorage.getItem('user_fio') || 'Сотрудник'
    user.value.email = localStorage.getItem('user_email') || ''
    user.value.department = localStorage.getItem('user_department') || ''
    user.value.isAdmin = localStorage.getItem('user_is_admin') === 'true'
    
    // Проверяем авторизацию
    if (!user.value.id) {
      router.push('/')
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