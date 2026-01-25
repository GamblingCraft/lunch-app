<!-- app/pages/cabinet/week-order.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Шапка -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-3">
            <button 
              @click="goBack"
              class="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-800">Заказ на неделю</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ user.fio }}</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Информация о неделе -->
      <div class="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ nextWeek.week_period }}</h2>
            <div class="flex items-center space-x-2">
              <p class="text-gray-600">Следующая неделя</p>
              <span class="px-2 py-1 rounded-full text-xs font-medium" 
                    :class="orderStatusClass">
                {{ orderStatusText }}
              </span>
            </div>
          </div>
          
          <div class="text-right">
            <p class="text-sm text-gray-500">Текущая неделя:</p>
            <p class="font-medium text-gray-700">
              {{ currentWeekCode }}
            </p>
          </div>
        </div>
      </div>

      <!-- Меню для заказа -->
      <div v-if="!loading" class="space-y-6">
        <!-- Информация о правилах заказа -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h1m0 0h-1m1 0v4m-3 0V9a1 1 0 011-1h1a1 1 0 011 1v7m-4 0h4"/>
            </svg>
            <div>
              <p class="text-sm text-blue-700">
                <strong>Как это работает:</strong> Вы выбираете блюда из меню на следующую неделю ({{ nextWeek.week_period }}). 
                Заказ будет доступен только в среду и четверг текущей недели.
              </p>
            </div>
          </div>
        </div>

        <!-- Проверка наличия меню -->
        <div v-if="hasMenu" class="space-y-4">
          <!-- Дни недели для заказа -->
          <div 
            v-for="day in days" 
            :key="day"
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <!-- Заголовок дня -->
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">{{ day }}</h3>
                <span v-if="hasOrderForDay(day)" class="text-sm text-green-600">
                  ✓ Заказ оформлен
                </span>
              </div>
            </div>

            <!-- Блюда на день -->
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div 
                  v-for="category in categories" 
                  :key="category"
                  class="space-y-3"
                >
                  <h4 class="font-medium text-gray-700 mb-2">{{ category }}</h4>
                  
                  <div v-if="getDishes(day, category).length > 0" class="space-y-2">
                    <div 
                      v-for="dish in getDishes(day, category)" 
                      :key="dish"
                      @click="toggleDish(day, category, dish)"
                      class="cursor-pointer p-3 border rounded-lg transition-all duration-200"
                      :class="{
                        'border-accent-500 bg-accent-50 text-accent-800': isDishSelected(day, category, dish),
                        'border-gray-200 hover:border-gray-300': !isDishSelected(day, category, dish)
                      }"
                    >
                      <div class="flex items-center justify-between">
                        <span class="text-gray-800">{{ dish.replace(' (самост.)', '') }}</span>
                        <svg 
                          v-if="isDishSelected(day, category, dish)"
                          class="w-5 h-5 text-accent-500" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <p v-if="dish.includes('(самост.)')" class="text-xs text-accent-600 mt-1">
                        Самостоятельное блюдо
                      </p>
                    </div>
                  </div>
                  
                  <div v-else class="text-center py-4 text-gray-400 bg-gray-50 rounded-lg">
                    <p class="text-sm">Блюда не добавлены</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Статистика и кнопка сохранения -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p class="text-gray-700 mb-1">
                  Итого выбрано блюд: <strong class="text-lg">{{ totalSelectedDishes }}</strong>
                </p>
                <p class="text-sm text-gray-500">
                  Заполнено дней: {{ selectedDaysCount }} из {{ days.length }}
                </p>
              </div>
              
              <div class="flex items-center space-x-4">
                <button 
                  @click="clearAllOrders"
                  class="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Очистить все
                </button>
                
                <button 
                  @click="saveOrder"
                  :disabled="saving"
                  class="px-6 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg 
                    v-if="saving"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ saving ? 'Сохранение...' : 'Сохранить заказ' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Если меню пустое -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div class="mb-6">
            <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          
          <h3 class="text-xl font-bold text-gray-800 mb-2">Меню еще не создано</h3>
          
          <p class="text-gray-600 mb-6">
            Администратор еще не добавил меню на неделю {{ nextWeek.week_period }}.
            Файл меню: <code class="bg-gray-100 px-2 py-1 rounded text-sm">data/menu/{{ nextWeek.week_code }}.json</code>
          </p>
          
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <p class="text-sm text-gray-700 font-medium mb-2">Текущая структура файлов меню:</p>
            <div class="text-left space-y-1 text-sm text-gray-600">
              <div v-for="file in menuFiles" :key="file" class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>{{ file }}</span>
              </div>
            </div>
          </div>
          
          <button 
            @click="goBack"
            class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Вернуться в кабинет
          </button>
        </div>
      </div>

      <!-- Загрузка -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block">
          <svg class="animate-spin h-8 w-8 text-accent-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">Загрузка меню...</p>
          <p class="text-sm text-gray-500 mt-1">
            Загрузка файла: data/menu/{{ nextWeek.week_code }}.json
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface User {
  id: number
  fio: string
  email: string
  department: string
  isAdmin: boolean
}

interface Week {
  week_code: string
  week_period: string
  is_current: boolean
}

interface Menu {
  [day: string]: {
    [category: string]: string[]
  }
}

interface SelectedDishes {
  [day: string]: {
    [category: string]: string
  }
}

const router = useRouter()
const user = ref<User>({
  id: 0,
  fio: '',
  email: '',
  department: '',
  isAdmin: false
})

const nextWeek = ref<Week>({
  week_code: '',
  week_period: '',
  is_current: false
})

const menu = ref<Menu>({})
const selectedDishes = ref<SelectedDishes>({})
const saving = ref(false)
const loading = ref(true)
const menuFiles = ref<string[]>([])
const currentWeekCode = ref('')
const apiData = ref<any>({})

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
const categories = ['Салат', 'Суп', 'Горячее', 'Гарнир']

// Вычисляемые свойства
const currentDayOfWeek = computed(() => {
  return new Date().getDay() // 0-воскресенье, 1-понедельник, 2-вторник, 3-среда, 4-четверг, 5-пятница, 6-суббота
})

// В ТЕСТОВОМ РЕЖИМЕ - разрешаем заказ всегда
const isOrderOpen = computed(() => {
  // Для тестов - всегда true
  // На продакшене: return currentDayOfWeek.value === 3 || currentDayOfWeek.value === 4
  return true
})

const orderStatusText = computed(() => {
  return 'Заказ открыт'
})

const orderStatusClass = computed(() => {
  return 'bg-green-100 text-green-800'
})

const hasMenu = computed(() => {
  // Проверяем, есть ли хотя бы одно блюдо в меню
  for (const day of days) {
    for (const category of categories) {
      const dishes = menu.value[day]?.[category]
      if (dishes && dishes.length > 0) {
        return true
      }
    }
  }
  return false
})

const totalSelectedDishes = computed(() => {
  let count = 0
  for (const day of days) {
    const dayOrder = selectedDishes.value[day]
    if (dayOrder) {
      count += Object.keys(dayOrder).length
    }
  }
  return count
})

const selectedDaysCount = computed(() => {
  return days.filter(day => hasOrderForDay(day)).length
})

// Методы
const getDishes = (day: string, category: string): string[] => {
  return menu.value[day]?.[category] || []
}

const isDishSelected = (day: string, category: string, dish: string): boolean => {
  return selectedDishes.value[day]?.[category] === dish
}

const hasOrderForDay = (day: string): boolean => {
  return !!selectedDishes.value[day] && Object.keys(selectedDishes.value[day]).length > 0
}

const toggleDish = (day: string, category: string, dish: string) => {
  if (!selectedDishes.value[day]) {
    selectedDishes.value[day] = {}
  }
  
  if (selectedDishes.value[day][category] === dish) {
    // Удаляем блюдо, если оно уже выбрано
    delete selectedDishes.value[day][category]
    
    // Удаляем день из selectedDishes, если в нем нет выбранных блюд
    if (Object.keys(selectedDishes.value[day]).length === 0) {
      delete selectedDishes.value[day]
    }
  } else {
    // Выбираем новое блюдо (заменяем старое, если было)
    selectedDishes.value[day][category] = dish
  }
}

const clearAllOrders = () => {
  selectedDishes.value = {}
}

const saveOrder = async () => {
  if (saving.value) return
  
  saving.value = true
  
  try {
    const orderData = {
      user_id: user.value.id,
      user_fio: user.value.fio,
      user_department: user.value.department,
      week_code: nextWeek.value.week_code,
      week_period: nextWeek.value.week_period,
      orders: selectedDishes.value,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('Сохранение заказа:', orderData)
    
    const response = await fetch('/api/orders/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        alert('Заказ успешно сохранен!')
        router.push('/cabinet')
      } else {
        alert(result.message || 'Ошибка сохранения заказа')
      }
    } else {
      alert('Ошибка сохранения заказа')
    }
  } catch (error) {
    console.error('Ошибка сохранения заказа:', error)
    alert('Ошибка сохранения заказа')
  } finally {
    saving.value = false
  }
}

// Функция для получения списка файлов меню (для отладки)
const getMenuFiles = async () => {
  try {
    // В реальном приложении нужно получать список файлов через API
    // Для демо просто показываем предполагаемые файлы
    const weeks = ['2026-W04', '2026-W05', '2026-W06', '2026-W07']
    menuFiles.value = weeks.map(w => `${w}.json`)
  } catch (error) {
    console.error('Ошибка получения списка файлов:', error)
    menuFiles.value = []
  }
}

onMounted(async () => {
  if (process.client) {
    user.value.id = Number(localStorage.getItem('user_id')) || 0
    user.value.fio = localStorage.getItem('user_fio') || 'Сотрудник'
    user.value.department = localStorage.getItem('user_department') || ''
  }

  try {
    // Загружаем меню на следующую неделю
    const response = await fetch('/api/menu/next')
    if (response.ok) {
      const data = await response.json()
      console.log('Данные от API:', data)
      
      apiData.value = data
      
      if (data.success) {
        nextWeek.value = data.week
        currentWeekCode.value = data.current_week_code || ''
        menu.value = data.menu || {}
        
        // Загружаем существующий заказ пользователя
        const orderResponse = await fetch(`/api/orders/my?userId=${user.value.id}&weekCode=${nextWeek.value.week_code}`)
        if (orderResponse.ok) {
          const orderData = await orderResponse.json()
          if (orderData.success && orderData.currentOrder) {
            selectedDishes.value = orderData.currentOrder.orders || {}
          }
        }
      }
    }
    
    // Получаем список файлов меню для отображения
    await getMenuFiles()
  } catch (error) {
    console.error('Ошибка загрузки меню:', error)
  } finally {
    loading.value = false
  }
})

const goBack = () => {
  router.push('/cabinet')
}
</script>