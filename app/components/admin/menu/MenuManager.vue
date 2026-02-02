<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <!-- Заголовок -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Управление меню</h2>
        <p class="text-gray-600 mt-1">Настройка меню на неделю: {{ currentWeek.week_period || 'неделя' }}</p>
      </div>
      <button 
        @click="showAddDishModal = true"
        class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        Добавить блюдо
      </button>
    </div>

    <!-- Выбор недели -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Неделя меню:</label>
      <select 
        v-model="selectedWeek" 
        @change="loadMenu"
        class="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
      >
        <option v-for="week in weeks" :key="week.week_code" :value="week.week_code">
          {{ week.week_period }}
        </option>
      </select>
    </div>

    <!-- Таблица меню -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">День</th>
            <th v-for="category in categories" :key="category" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ category }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="day in days" :key="day">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ day }}</div>
            </td>
            <td v-for="category in categories" :key="`${day}-${category}`" class="px-6 py-4">
              <div class="space-y-1">
                <div 
                  v-for="dish in getDishes(day, category)" 
                  :key="dish.id"
                  class="flex items-center justify-between group"
                >
                  <span class="text-sm text-gray-700">{{ dish.name }}</span>
                  <button 
                    @click="removeDish(day, category, dish.name)"
                    class="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <div v-if="getDishes(day, category).length === 0" class="text-sm text-gray-400 italic">
                  Нет блюд
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button 
                @click="editDayMenu(day)"
                class="text-accent-600 hover:text-accent-800 mr-3"
              >
                Редактировать
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно добавления блюда -->
    <div v-if="showAddDishModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Добавить блюдо в меню</h3>
          
          <div class="space-y-4">
            <!-- День недели -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">День недели</label>
              <select 
                v-model="newDish.day"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
              </select>
            </div>

            <!-- Категория -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Категория</label>
              <select 
                v-model="newDish.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>

            <!-- Название блюда -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Название блюда</label>
              <input 
                v-model="newDish.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                placeholder="Введите название блюда"
              />
            </div>

            <!-- Самостоятельное блюдо -->
            <div class="flex items-center">
              <input 
                v-model="newDish.isStandalone"
                type="checkbox"
                id="standalone"
                class="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
              />
              <label for="standalone" class="ml-2 block text-sm text-gray-700">
                Самостоятельное блюдо (не требует гарнира)
              </label>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="showAddDishModal = false"
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Отмена
            </button>
            <button 
              @click="addDish"
              type="button"
              class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
const categories = ['Салат', 'Суп', 'Горячее', 'Гарнир']

// Текущая неделя
const currentWeek = ref({
  week_code: '2024-W45',
  week_period: '11.11.2024 - 17.11.2024'
})

const weeks = ref([
  currentWeek.value,
  {
    week_code: '2024-W46',
    week_period: '18.11.2024 - 24.11.2024'
  }
])

const selectedWeek = ref(currentWeek.value.week_code)

// Меню
const menu = ref({
  'Понедельник': {
    'Салат': ['Цезарь с курицей', 'Овощной микс'],
    'Суп': ['Борщ', 'Грибной крем-суп'],
    'Горячее': ['Курица с овощами', 'Рыба на гриле'],
    'Гарнир': ['Рис', 'Гречка', 'Картофельное пюре']
  },
  'Вторник': {
    'Салат': ['Греческий', 'Винегрет'],
    'Суп': ['Солянка', 'Куриный суп'],
    'Горячее': ['Тефтели', 'Плов'],
    'Гарнир': ['Макароны', 'Овощи на гриле']
  },
  // ... остальные дни
})

// Новое блюдо
const showAddDishModal = ref(false)
const newDish = ref({
  day: 'Понедельник',
  category: 'Салат',
  name: '',
  isStandalone: false
})

const getDishes = (day, category) => {
  if (menu.value[day] && menu.value[day][category]) {
    return menu.value[day][category].map(name => ({
      id: `${day}-${category}-${name}`,
      name,
      isStandalone: name.includes('(самост.)')
    }))
  }
  return []
}

const loadMenu = () => {
  // Здесь будет загрузка меню с сервера
  console.log('Загружаем меню для недели:', selectedWeek.value)
}

const addDish = () => {
  if (!newDish.value.name.trim()) return
  
  const day = newDish.value.day
  const category = newDish.value.category
  let dishName = newDish.value.name.trim()
  
  if (newDish.value.isStandalone && !dishName.includes('(самост.)')) {
    dishName += ' (самост.)'
  }
  
  if (!menu.value[day]) {
    menu.value[day] = {}
  }
  if (!menu.value[day][category]) {
    menu.value[day][category] = []
  }
  
  // Проверяем, нет ли уже такого блюда
  if (!menu.value[day][category].includes(dishName)) {
    menu.value[day][category].push(dishName)
  }
  
  // Сбрасываем форму
  newDish.value = {
    day: 'Понедельник',
    category: 'Салат',
    name: '',
    isStandalone: false
  }
  showAddDishModal.value = false
}

const removeDish = (day, category, dishName) => {
  if (menu.value[day] && menu.value[day][category]) {
    const index = menu.value[day][category].indexOf(dishName)
    if (index !== -1) {
      menu.value[day][category].splice(index, 1)
    }
  }
}

const editDayMenu = (day) => {
  // Редактирование меню на день
  console.log('Редактируем день:', day)
}

onMounted(() => {
  loadMenu()
})
</script>