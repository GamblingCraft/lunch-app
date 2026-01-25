<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <!-- Заголовок -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Итоги заказов</h2>
        <p class="text-gray-600 mt-1">Статистика по заказам на неделю: {{ selectedWeek.week_period }}</p>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="exportToExcel"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Экспорт
        </button>
      </div>
    </div>

    <!-- Выбор недели -->
    <div class="mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <select 
          v-model="selectedWeekCode" 
          @change="loadTotals"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
        >
          <option v-for="week in weeks" :key="week.week_code" :value="week.week_code">
            {{ week.week_period }}
          </option>
        </select>
        
        <!-- Фильтры -->
        <select 
          v-model="selectedDay"
          @change="filterTotals"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
        >
          <option value="all">Все дни</option>
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>
        
        <select 
          v-model="selectedCategory"
          @change="filterTotals"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
        >
          <option value="all">Все категории</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>
    </div>

    <!-- Таблица итогов -->
    <div class="overflow-x-auto">
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
          <template v-for="day in filteredDays" :key="day">
            <template v-for="category in filteredCategories" :key="category">
              <tr v-for="dish in getDishesForDayCategory(day, category)" :key="`${day}-${category}-${dish.name}`">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{ day }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-700">{{ category }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-700">{{ dish.name }}</span>
                  <span v-if="dish.isStandalone" class="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    самостоятельное
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{ dish.count }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-accent-500 h-2 rounded-full" 
                        :style="{ width: `${calculatePercentage(dish.count)}%` }"
                      ></div>
                    </div>
                    <span class="ml-2 text-sm text-gray-600">{{ calculatePercentage(dish.count) }}%</span>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
        <tfoot class="bg-gray-50">
          <tr>
            <td colspan="3" class="px-6 py-4 text-sm font-medium text-gray-900">Итого:</td>
            <td class="px-6 py-4 text-sm font-bold text-gray-900">{{ totalOrders }}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-600">100%</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Сводка по отделам -->
    <div class="mt-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Сводка по отделам</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          v-for="dept in departmentStats" 
          :key="dept.name"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <p class="text-sm font-medium text-gray-700">{{ dept.name }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ dept.orders }}</p>
          <p class="text-xs text-gray-500 mt-1">заказов</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
const categories = ['Салат', 'Суп', 'Горячее', 'Гарнир']

// Текущая неделя
const selectedWeekCode = ref('2024-W45')
const selectedWeek = computed(() => weeks.value.find(w => w.week_code === selectedWeekCode.value))

const weeks = ref([
  {
    week_code: '2024-W45',
    week_period: '11.11.2024 - 17.11.2024'
  },
  {
    week_code: '2024-W46',
    week_period: '18.11.2024 - 24.11.2024'
  }
])

// Фильтры
const selectedDay = ref('all')
const selectedCategory = ref('all')

// Данные заказов (мок)
const orderTotals = ref([
  { day: 'Понедельник', category: 'Салат', name: 'Цезарь с курицей', count: 45, isStandalone: false },
  { day: 'Понедельник', category: 'Салат', name: 'Овощной микс', count: 32, isStandalone: false },
  { day: 'Понедельник', category: 'Суп', name: 'Борщ', count: 67, isStandalone: false },
  { day: 'Понедельник', category: 'Горячее', name: 'Курица с овощами', count: 52, isStandalone: false },
  { day: 'Понедельник', category: 'Горячее', name: 'Рыба на гриле', count: 28, isStandalone: false },
  { day: 'Понедельник', category: 'Гарнир', name: 'Рис', count: 40, isStandalone: false },
  { day: 'Понедельник', category: 'Гарнир', name: 'Гречка', count: 35, isStandalone: false },
  { day: 'Вторник', category: 'Салат', name: 'Греческий', count: 38, isStandalone: false },
  { day: 'Вторник', category: 'Горячее', name: 'Плов (самост.)', count: 48, isStandalone: true },
  // ... остальные данные
])

const departmentStats = ref([
  { name: 'IT', orders: 45 },
  { name: 'Маркетинг', orders: 32 },
  { name: 'Продажи', orders: 56 },
  { name: 'Бухгалтерия', orders: 28 },
  { name: 'Производство', orders: 67 },
  { name: 'Логистика', orders: 39 },
  { name: 'HR', orders: 22 }
])

// Отфильтрованные дни и категории
const filteredDays = computed(() => {
  return selectedDay.value === 'all' ? days : [selectedDay.value]
})

const filteredCategories = computed(() => {
  return selectedCategory.value === 'all' ? categories : [selectedCategory.value]
})

// Общее количество заказов
const totalOrders = computed(() => {
  return orderTotals.value.reduce((sum, item) => sum + item.count, 0)
})

const getDishesForDayCategory = (day, category) => {
  return orderTotals.value.filter(item => 
    item.day === day && 
    item.category === category
  )
}

const calculatePercentage = (count) => {
  if (totalOrders.value === 0) return 0
  return Math.round((count / totalOrders.value) * 100)
}

const filterTotals = () => {
  console.log('Фильтруем по:', { day: selectedDay.value, category: selectedCategory.value })
}

const loadTotals = () => {
  console.log('Загружаем итоги для недели:', selectedWeekCode.value)
}

const exportToExcel = () => {
  console.log('Экспортируем в Excel')
}

onMounted(() => {
  loadTotals()
})
</script>