<template>
  <div>
    <!-- Заголовок и управление -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Заказы сотрудников</h1>
          <p class="text-gray-600 mt-1">Просмотр и управление заказами на неделю</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Выбор недели -->
          <div class="relative">
            <select 
              v-model="selectedWeek"
              @change="loadOrdersSummary"
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none appearance-none bg-white"
            >
              <option v-for="week in availableWeeks" :key="week.code" :value="week.code">
                {{ week.period }}
              </option>
            </select>
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          
          <!-- Кнопка экспорта -->
          <button 
            @click="exportToExcel"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Экспорт в Excel
          </button>
        </div>
      </div>
      
      <!-- Информация о неделе -->
      <div v-if="weekInfo" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <div>
            <p class="text-sm text-blue-700">
              <strong>Неделя:</strong> {{ weekInfo.week_period }} 
              • <strong>Всего заказов:</strong> {{ totalOrders }} 
              • <strong>Сотрудников:</strong> {{ departmentStats.reduce((sum, dept) => sum + dept.orders, 0) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Таблица итогов -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">Итоги по блюдам</h3>
        <p class="text-gray-600 text-sm mt-1">Количество заказов каждого блюда</p>
      </div>
      
      <div v-if="loading" class="p-8 text-center">
        <svg class="animate-spin h-8 w-8 text-accent-500 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-gray-600">Загрузка данных...</p>
      </div>
      
      <div v-else-if="orderTotals.length === 0" class="p-8 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h3 class="text-lg font-semibold text-gray-800 mt-4">Заказов нет</h3>
        <p class="text-gray-600 mt-2">На выбранную неделю заказов не поступало</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">День</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категория</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Блюдо</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Процент</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="(item, index) in orderTotals" :key="item.id">
              <!-- Если день меняется, добавляем разделитель -->
              <tr v-if="index > 0 && orderTotals[index-1].day !== item.day" class="bg-gray-50">
                <td colspan="5" class="px-6 py-3">
                  <div class="border-t border-gray-300"></div>
                </td>
              </tr>
              
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{ item.day }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-700">{{ item.category }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <span class="text-sm text-gray-700">{{ item.dish }}</span>
                    <span v-if="item.isStandalone" class="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      самостоятельное
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{ item.count }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-accent-500 h-2 rounded-full" 
                        :style="{ width: `${Math.min(item.percentage, 100)}%` }"
                      ></div>
                    </div>
                    <span class="ml-2 text-sm text-gray-600">{{ item.percentage }}%</span>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Статистика по отделам -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Статистика по отделам</h3>
      <div v-if="departmentStats.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div 
          v-for="dept in departmentStats" 
          :key="dept.name"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
        >
          <p class="text-sm font-medium text-gray-700 mb-1">{{ dept.name }}</p>
          <p class="text-2xl font-bold text-gray-900">{{ dept.orders }}</p>
          <p class="text-xs text-gray-500 mt-1">заказов ({{ dept.percentage }}%)</p>
        </div>
      </div>
      
      <!-- Круговые диаграммы по дням -->
      <div v-if="hasData" class="mt-8">
        <h4 class="text-md font-semibold text-gray-700 mb-4">Распределение по дням</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div 
            v-for="day in days" 
            :key="day"
            class="border border-gray-200 rounded-lg p-4"
          >
            <p class="text-sm font-medium text-gray-700 mb-2 text-center">{{ day }}</p>
            <div class="space-y-2">
              <div 
                v-for="item in getDayStats(day)"
                :key="item.category"
                class="flex items-center justify-between text-xs"
              >
                <span class="text-gray-600">{{ item.category }}:</span>
                <span class="font-medium">{{ item.total }} шт.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Общая статистика -->
    <div v-if="hasData" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 class="text-md font-semibold text-gray-700 mb-4">Итого по категориям</h4>
        <div class="space-y-3">
          <div v-for="cat in categoryTotals" :key="cat.name" class="flex items-center justify-between">
            <span class="text-sm text-gray-600">{{ cat.name }}:</span>
            <span class="font-medium">{{ cat.total }} заказов</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 class="text-md font-semibold text-gray-700 mb-4">Самостоятельные блюда</h4>
        <div class="space-y-3">
          <div v-for="item in standaloneDishes" :key="item.dish" class="flex items-center justify-between">
            <span class="text-sm text-gray-600">{{ item.dish }}:</span>
            <span class="font-medium">{{ item.count }} шт.</span>
          </div>
          <div v-if="standaloneDishes.length === 0" class="text-center py-2 text-gray-500">
            Нет самостоятельных блюд
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 class="text-md font-semibold text-gray-700 mb-4">Общая информация</h4>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Всего заказов:</span>
            <span class="font-medium">{{ totalOrders }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Уникальных блюд:</span>
            <span class="font-medium">{{ uniqueDishes }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Заполненных дней:</span>
            <span class="font-medium">{{ uniqueDays }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Среднее на сотрудника:</span>
            <span class="font-medium">{{ averagePerUser.toFixed(1) }} блюд</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import { ref, computed, onMounted } from 'vue'

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
const categories = ['Салат', 'Суп', 'Горячее', 'Гарнир']

const selectedWeek = ref('')
const orderTotals = ref([])
const departmentStats = ref([])
const weekInfo = ref(null)
const loading = ref(false)
const totalOrders = ref(0)
const availableWeeks = ref([])

// Вычисляемые свойства
const hasData = computed(() => orderTotals.value.length > 0)
const uniqueDishes = computed(() => {
  const dishes = new Set(orderTotals.value.map(item => item.dish))
  return dishes.size
})
const uniqueDays = computed(() => {
  const unique = new Set(orderTotals.value.map(item => item.day))
  return unique.size
})
const averagePerUser = computed(() => {
  if (departmentStats.value.length === 0) return 0
  const totalUsers = departmentStats.value.reduce((sum, dept) => sum + dept.orders, 0)
  const totalDishes = orderTotals.value.reduce((sum, item) => sum + item.count, 0)
  return totalDishes / totalUsers
})

const categoryTotals = computed(() => {
  const totals = {}
  orderTotals.value.forEach(item => {
    totals[item.category] = (totals[item.category] || 0) + item.count
  })
  
  return Object.entries(totals).map(([name, total]) => ({
    name,
    total
  })).sort((a, b) => b.total - a.total)
})

const standaloneDishes = computed(() => {
  return orderTotals.value
    .filter(item => item.isStandalone)
    .map(item => ({
      dish: item.dish,
      count: item.count,
      day: item.day
    }))
    .sort((a, b) => b.count - a.count)
})

// Методы
const getDayStats = (day) => {
  const dayItems = orderTotals.value.filter(item => item.day === day)
  const stats = {}
  
  dayItems.forEach(item => {
    stats[item.category] = (stats[item.category] || 0) + item.count
  })
  
  return Object.entries(stats).map(([category, total]) => ({
    category,
    total
  }))
}

const loadOrdersSummary = async () => {
  if (!selectedWeek.value) return
  
  loading.value = true
  try {
    const response = await fetch(`/api/admin/orders-summary?week_code=${selectedWeek.value}`)
    const data = await response.json()
    
    if (data.success) {
      orderTotals.value = data.summary || []
      departmentStats.value = data.departmentStats || []
      totalOrders.value = data.totalOrders || 0
      weekInfo.value = {
        week_code: data.week_code,
        week_period: data.week_period
      }
    } else {
      orderTotals.value = []
      departmentStats.value = []
      totalOrders.value = 0
      weekInfo.value = null
      console.error('Ошибка загрузки данных:', data.message)
    }
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
    orderTotals.value = []
    departmentStats.value = []
    totalOrders.value = 0
    weekInfo.value = null
  } finally {
    loading.value = false
  }
}

const getAvailableWeeks = async () => {
  try {
    const response = await fetch('/api/admin/available-weeks')
    const data = await response.json()
    
    if (data.success) {
      availableWeeks.value = data.weeks || []
      if (availableWeeks.value.length > 0 && !selectedWeek.value) {
        selectedWeek.value = availableWeeks.value[0].code
        await loadOrdersSummary()
      }
    }
  } catch (error) {
    console.error('Ошибка получения списка недель:', error)
  }
}

const exportToExcel = async () => {
  if (orderTotals.value.length === 0) {
    alert('Нет данных для экспорта')
    return
  }
  
  try {
    // Создаем CSV
    let csv = 'День;Категория;Блюдо;Количество;Процент;Самостоятельное\n'
    
    orderTotals.value.forEach(item => {
      csv += `${item.day};${item.category};${item.dish};${item.count};${item.percentage}%;${item.isStandalone ? 'Да' : 'Нет'}\n`
    })
    
    // Создаем blob и скачиваем
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `заказы_${selectedWeek.value}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    alert('Экспорт завершен успешно!')
  } catch (error) {
    console.error('Ошибка экспорта:', error)
    alert('Ошибка при экспорте данных')
  }
}

onMounted(() => {
  getAvailableWeeks()
})
</script>