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
            <span class="text-gray-600">{{ userFio }}</span>
            <span v-if="userDepartment" class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {{ userDepartment }}
            </span>
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
            <!-- Заголовок дня с кнопкой ночной смены -->
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center space-x-3">
                  <h3 class="text-lg font-semibold text-gray-800">{{ day }}</h3>
                  <span v-if="isDayNightShift(day)" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                    Ночная смена
                  </span>
                </div>
                
             <!-- Кнопка ночной смены -->
              <div v-if="showNightShiftOption && hasOrderForDay(day)">
                <button
                  @click="toggleNightShiftForDay(day)"
                  type="button"
                  class="px-3 py-1.5 text-sm rounded-lg transition-all duration-200 flex items-center"
                  :class="{
                    'bg-blue-500 text-white hover:bg-blue-600': isDayNightShift(day),
                    'bg-gray-200 text-gray-700 hover:bg-gray-300': !isDayNightShift(day)
                  }"
                >
                  <!-- Меняем местами условия для иконок -->
                  <svg v-if="isDayNightShift(day)" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                  </svg>
                  <svg v-else class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                  </svg>
                  <!-- Меняем местами и текст -->
                  {{ isDayNightShift(day) ? 'Ночная смена' : 'Дневная смена' }}
                </button>
              </div>
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
                      class="cursor-pointer"
                    >
                      <div 
                        @click="toggleDish(day, category, dish)"
                        class="p-3 border rounded-lg transition-all duration-200"
                        :class="{
                          'border-accent-500 bg-accent-50': isDishSelected(day, category, dish),
                          'border-gray-200 hover:border-gray-300': !isDishSelected(day, category, dish)
                        }"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-2">
                            <span class="text-gray-800 font-medium">{{ dish.replace(' (самост.)', '') }}</span>
                          <span v-if="isDishSelected(day, category, dish) && isHalfPortion(day, category, dish)" 
                                class="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                            ½ порции
                          </span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <!-- Кнопка половинной порции -->
                            <button
                              v-if="isDishSelected(day, category, dish)"
                              @click.stop="toggleHalfPortion(day, category)"
                              type="button"
                              class="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                              :class="{
                                'bg-purple-100 text-purple-600 hover:bg-purple-200': isHalfPortion(day, category),
                                'bg-gray-100 text-gray-600 hover:bg-gray-200': !isHalfPortion(day, category)
                              }"
                              title="Половина порции (0.5 блюда)"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                              </svg>
                            </button>
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
                        </div>
                        
                        <!-- Метка самостоятельного блюда -->
                        <p v-if="dish.includes('(самост.)')" class="text-xs text-accent-600 mt-1">
                          Самостоятельное блюдо
                        </p>
                      </div>
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
                  Итого выбрано блюд: <strong class="text-lg">{{ totalSelectedDishes.toFixed(1) }}</strong>
                  <span v-if="nightShiftDaysCount > 0" class="ml-2 text-blue-600">
                    (ночных дней: {{ nightShiftDaysCount }})
                  </span>
                </p>
                <p class="text-sm text-gray-500">
                  Полных порций: {{ fullPortionsCount }}, половинных: {{ halfPortionsCount }}
                </p>
                <p class="text-sm text-gray-500">
                  Заполнено дней: {{ selectedDaysCount }} из {{ days.length }}
                </p>
                <div v-if="showNightShiftOption && nightShiftDaysCount > 0" class="mt-2">
                  <p class="text-sm text-blue-600">
                    <svg class="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                    Дни ночной смены: {{ nightShiftDaysList.join(', ') }}
                  </p>
                </div>
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
          </p>
            
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
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#app'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

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

interface SelectedDish {
  dish: string
  isNightShift?: boolean
  isHalfPortion?: boolean // true = 0.5 порции, false/undefined = 1 порция
}

interface SelectedDishes {
  [day: string]: {
    [category: string]: SelectedDish
    _nightShift?: boolean // Флаг ночной смены для всего дня
  }
}

// Используем computed свойство для получения данных пользователя из auth store
const userFio = computed(() => {
  if (authStore.user?.fio) {
    return authStore.user.fio
  }
  
  // Fallback: пробуем получить из localStorage
  if (process.client) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        return userData.fio || 'Сотрудник'
      } catch {
        return 'Сотрудник'
      }
    }
  }
  
  return 'Сотрудник'
})

const userDepartment = computed(() => {
  if (authStore.user?.department) {
    return authStore.user.department
  }
  
  if (process.client) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        return userData.department || ''
      } catch {
        return ''
      }
    }
  }
  
  return ''
})

const userId = computed(() => {
  if (authStore.user?.id) {
    return authStore.user.id
  }
  
  if (process.client) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        return userData.id || 0
      } catch {
        return 0
      }
    }
  }
  
  return 0
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
const currentWeekCode = ref('')

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
const categories = ['Салат', 'Суп', 'Горячее', 'Гарнир']

// Отделы, которым разрешена отметка ночной смены
const nightShiftDepartments = ['Склад', 'Колл-центр', 'Охрана', 'Логистика', 'Отдел Маркетинга']

// Вычисляемые свойства
const currentDayOfWeek = computed(() => {
  return new Date().getDay()
})

const isOrderOpen = computed(() => {
  return true // Для тестов всегда открыт
})

const orderStatusText = computed(() => {
  return 'Заказ открыт'
})

const orderStatusClass = computed(() => {
  return 'bg-green-100 text-green-800'
})

const hasMenu = computed(() => {
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

const showNightShiftOption = computed(() => {
  return nightShiftDepartments.includes(userDepartment.value)
})

// Подсчет порций с учетом половинных
const totalSelectedDishes = computed(() => {
  let count = 0
  for (const day of days) {
    const dayOrder = selectedDishes.value[day]
    if (dayOrder) {
      // Не считаем служебное поле _nightShift
      for (const category in dayOrder) {
        if (category !== '_nightShift') {
          const dish = dayOrder[category]
          if (dish.isHalfPortion) {
            count += 0.5 // Половина порции
          } else {
            count += 1 // Полная порция
          }
        }
      }
    }
  }
  return count
})

const fullPortionsCount = computed(() => {
  let count = 0
  for (const day of days) {
    const dayOrder = selectedDishes.value[day]
    if (dayOrder) {
      for (const category in dayOrder) {
        if (category !== '_nightShift') {
          const dish = dayOrder[category]
          if (!dish.isHalfPortion) {
            count++
          }
        }
      }
    }
  }
  return count
})

const halfPortionsCount = computed(() => {
  let count = 0
  for (const day of days) {
    const dayOrder = selectedDishes.value[day]
    if (dayOrder) {
      for (const category in dayOrder) {
        if (category !== '_nightShift') {
          const dish = dayOrder[category]
          if (dish.isHalfPortion) {
            count++
          }
        }
      }
    }
  }
  return count
})

const nightShiftDaysCount = computed(() => {
  let count = 0
  for (const day of days) {
    if (selectedDishes.value[day]?._nightShift) {
      count++
    }
  }
  return count
})

const nightShiftDaysList = computed(() => {
  return days.filter(day => selectedDishes.value[day]?._nightShift)
})

const selectedDaysCount = computed(() => {
  return days.filter(day => hasOrderForDay(day)).length
})

// Методы
const getDishes = (day: string, category: string): string[] => {
  return menu.value[day]?.[category] || []
}

const isDishSelected = (day: string, category: string, dish: string): boolean => {
  return selectedDishes.value[day]?.[category]?.dish === dish
}

const isHalfPortion = (day: string, category: string, dish: string): boolean => {
  const selectedDish = selectedDishes.value[day]?.[category]
  // Проверяем, что это именно выбранное блюдо и у него включена половинная порция
  return selectedDish?.dish === dish && !!selectedDish?.isHalfPortion
}

const isDayNightShift = (day: string): boolean => {
  return !!selectedDishes.value[day]?._nightShift
}

const hasOrderForDay = (day: string): boolean => {
  const dayOrder = selectedDishes.value[day]
  if (!dayOrder) return false
  
  // Проверяем, есть ли обычные блюда (не служебные поля)
  const regularDishes = Object.keys(dayOrder).filter(key => key !== '_nightShift')
  return regularDishes.length > 0
}

const toggleDish = (day: string, category: string, dish: string) => {
  if (!selectedDishes.value[day]) {
    selectedDishes.value[day] = {}
  }
  
  if (selectedDishes.value[day][category]?.dish === dish) {
    // Удаляем блюдо, если оно уже выбрано
    delete selectedDishes.value[day][category]
    
    // Удаляем день если нет выбранных блюд и служебных полей
    if (Object.keys(selectedDishes.value[day]).length === 0 || 
        (Object.keys(selectedDishes.value[day]).length === 1 && '_nightShift' in selectedDishes.value[day])) {
      delete selectedDishes.value[day]
    }
  } else {
    // Выбираем новое блюдо (по умолчанию полная порция)
    selectedDishes.value[day][category] = {
      dish: dish,
      isHalfPortion: false
    }
  }
}

const toggleHalfPortion = (day: string, category: string) => {
  if (selectedDishes.value[day]?.[category]) {
    selectedDishes.value[day][category].isHalfPortion = !selectedDishes.value[day][category].isHalfPortion
  }
}

const toggleNightShiftForDay = (day: string) => {
  if (!selectedDishes.value[day]) {
    selectedDishes.value[day] = {}
  }
  
  // Переключаем флаг ночной смены
  selectedDishes.value[day]._nightShift = !selectedDishes.value[day]._nightShift
  
  // Если нет блюд, но есть флаг ночной смены - удаляем день
  if (selectedDishes.value[day]._nightShift && !hasOrderForDay(day)) {
    delete selectedDishes.value[day]
  }
}

const clearAllOrders = () => {
  selectedDishes.value = {}
}

const saveOrder = async () => {
  if (saving.value) return
  
  saving.value = true
  
  try {
    // Преобразуем данные для сохранения
    const ordersToSave: Record<string, Record<string, string>> = {}
    
    for (const day in selectedDishes.value) {
      ordersToSave[day] = {}
      const isNightShift = selectedDishes.value[day]._nightShift || false
      
      for (const category in selectedDishes.value[day]) {
        // Пропускаем служебное поле
        if (category === '_nightShift') continue
        
        const selectedDish = selectedDishes.value[day][category]
        let dishName = selectedDish.dish
        
        // Добавляем метку ночной смены к названию блюда
        if (isNightShift) {
          dishName += ' (ночь)'
        }
        
        // Добавляем метку половинной порции
        if (selectedDish.isHalfPortion) {
          dishName += ' [½]'
        }
        
        ordersToSave[day][category] = dishName
      }
    }
    
    const orderData = {
      user_id: userId.value,
      user_fio: userFio.value,
      user_department: userDepartment.value,
      week_code: nextWeek.value.week_code,
      week_period: nextWeek.value.week_period,
      orders: ordersToSave,
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
        const nightCount = nightShiftDaysCount.value
        const totalDishes = totalSelectedDishes.value.toFixed(1)
        const halfCount = halfPortionsCount.value
        
        let message = `Заказ успешно сохранен!\nВсего блюд: ${totalDishes}`
        if (nightCount > 0) message += `\nНочных дней: ${nightCount}`
        if (halfCount > 0) message += `\nПоловинных порций: ${halfCount}`
        
        alert(message)
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

onMounted(async () => {
  // Загружаем пользователя из store
  if (process.client) {
    authStore.loadUser()
  }

  try {
    // Загружаем меню на следующую неделю
    const response = await fetch('/api/menu/next')
    if (response.ok) {
      const data = await response.json()
      console.log('Данные от API:', data)
      
      if (data.success) {
        nextWeek.value = data.week
        currentWeekCode.value = data.current_week_code || ''
        menu.value = data.menu || {}
        
        // Загружаем существующий заказ пользователя на следующую неделю
        const currentUserId = userId.value
        if (currentUserId && nextWeek.value.week_code) {
          console.log(`🔍 Загрузка заказа для недели: ${nextWeek.value.week_code}`)
          
          const orderResponse = await fetch(`/api/orders/my?userId=${currentUserId}&weekCode=${nextWeek.value.week_code}`)
          
          if (orderResponse.ok) {
            const orderData = await orderResponse.json()
            
            if (orderData.success && orderData.weekOrder) {
              // Восстанавливаем заказ из API
              const savedOrders = orderData.weekOrder.orders || {}
              const restoredOrders: SelectedDishes = {}
              
              for (const day in savedOrders) {
                restoredOrders[day] = {}
                let dayHasNightShift = false
                
                for (const category in savedOrders[day]) {
                  const dishName = savedOrders[day][category]
                  const isNightShift = dishName.includes('(ночь)')
                  const isHalfPortion = dishName.includes('[½]')
                  
                  // Удаляем метки из названия
                  let cleanDishName = dishName
                    .replace(' (ночь)', '')
                    .replace(' [½]', '')
                  
                  restoredOrders[day][category] = {
                    dish: cleanDishName,
                    isHalfPortion: isHalfPortion
                  }
                  
                  if (isNightShift) {
                    dayHasNightShift = true
                  }
                }
                
                // Устанавливаем флаг ночной смены для дня
                if (dayHasNightShift) {
                  restoredOrders[day]._nightShift = true
                }
              }
              
              selectedDishes.value = restoredOrders
              console.log('✅ Загружен существующий заказ на следующую неделю')
            } else {
              console.log('ℹ️ Заказа на следующую неделю еще нет')
              selectedDishes.value = {}
            }
          }
        }
      }
    }
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