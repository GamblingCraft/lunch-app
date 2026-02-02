<template>
  <div>
    <!-- Заголовок -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Управление меню</h1>
        <p class="text-gray-600 mt-1">Создание и редактирование меню для сотрудников</p>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Кнопка импорта из Excel -->
        <button 
          @click="showImportModal = true"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Импорт из Excel
        </button>
        
        <!-- Кнопка создания новой недели -->
        <button 
          @click="showCreateWeekModal = true"
          class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Новая неделя
        </button>
      </div>
    </div>

    <!-- Выбор недели -->
    <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-800">Меню на неделю</h2>
          <p class="text-gray-600 text-sm mt-1">Выберите неделю для редактирования</p>
        </div>
        
        <div class="flex items-center gap-3">
          <select 
            v-model="selectedWeekCode" 
            @change="loadWeekMenu"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 min-w-[250px]"
          >
            <option v-for="week in weeks" :key="week.week_code" :value="week.week_code">
              {{ week.week_period }} {{ week.is_current ? '(текущая)' : '' }}
            </option>
          </select>
          
          <button 
            @click="openAddModal"
            class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Добавить блюдо
          </button>
        </div>
      </div>
      
      <!-- Статус недели -->
      <div v-if="currentWeek" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-blue-700">{{ currentWeek.week_period }}</p>
            <p class="text-sm text-blue-600">
              Код недели: {{ currentWeek.week_code }}
              <span v-if="currentWeek.is_current" class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                Текущая неделя
              </span>
            </p>
          </div>
          <div class="text-sm text-gray-600">
            Блюд в меню: {{ totalDishesCount }}
            <span v-if="isSaving" class="ml-2 text-accent-600">
              <svg class="inline w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              сохранение...
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Таблица меню -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">День недели</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Салат</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Суп</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Горячее</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Гарнир</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="day in days" :key="day" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ day }}</div>
              </td>
              <td class="px-6 py-4">
                <EditableDishesList 
                  :dishes="getDishes(day, 'Салат')" 
                  :day="day"
                  category="Салат"
                  @remove="removeDish"
                  @update="updateDishName"
                />
              </td>
              <td class="px-6 py-4">
                <EditableDishesList 
                  :dishes="getDishes(day, 'Суп')" 
                  :day="day"
                  category="Суп"
                  @remove="removeDish"
                  @update="updateDishName"
                />
              </td>
              <td class="px-6 py-4">
                <EditableDishesList 
                  :dishes="getDishes(day, 'Горячее')" 
                  :day="day"
                  category="Горячее"
                  @remove="removeDish"
                  @update="updateDishName"
                />
              </td>
              <td class="px-6 py-4">
                <EditableDishesList 
                  :dishes="getDishes(day, 'Гарнир')" 
                  :day="day"
                  category="Гарнир"
                  @remove="removeDish"
                  @update="updateDishName"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Итоги -->
      <div class="p-4 bg-gray-50 border-t border-gray-200">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-700">Всего блюд в меню: <strong>{{ totalDishesCount }}</strong></span>
          <button 
            @click="saveMenu"
            :disabled="isSaving"
            class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'Сохранение...' : 'Сохранить изменения' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно импорта из Excel -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Импорт меню из Excel</h3>
            <button @click="showImportModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input 
                type="file" 
                ref="fileInput"
                accept=".xlsx,.xls"
                @change="handleFileUpload"
                class="hidden"
              />
              
              <div v-if="!excelData" class="space-y-3">
                <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-sm text-gray-600">Выберите файл Excel с меню</p>
                <button 
                  @click="$refs.fileInput.click()"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Выбрать файл
                </button>
                <p class="text-xs text-gray-500 mt-2">Поддерживаются файлы .xlsx и .xls</p>
              </div>
              
              <div v-else class="space-y-3">
                <svg class="w-12 h-12 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-sm font-medium text-gray-700">Файл загружен</p>
                <p class="text-xs text-gray-600">{{ excelData.fileName }}</p>
                <div class="flex justify-center space-x-3">
                  <button 
                    @click="excelData = null"
                    class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Загрузить другой
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="excelData?.parsedData" class="border border-gray-200 rounded-lg p-4">
              <p class="font-medium text-gray-700 mb-2">Превью импорта:</p>
              <div class="text-sm text-gray-600 space-y-1">
                <div v-for="(dishes, day) in excelData.parsedData" :key="day" class="border-b border-gray-100 pb-1">
                  <span class="font-medium">{{ day }}:</span>
                  <span class="ml-2">
                    {{ Object.values(dishes).flat().length }} блюд
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="excelData" class="flex items-center">
              <input 
                v-model="importReplaceExisting"
                type="checkbox"
                id="replaceExisting"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="replaceExisting" class="ml-2 block text-sm text-gray-700">
                Заменить существующее меню
              </label>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="showImportModal = false"
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Отмена
            </button>
            <button 
              @click="importFromExcel"
              :disabled="!excelData || isImporting"
              type="button"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isImporting ? 'Импорт...' : 'Импортировать' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания новой недели -->
    <div v-if="showCreateWeekModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Создать новую неделю</h3>
            <button @click="showCreateWeekModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Дата начала недели</label>
              <input 
                v-model="newWeekDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                :min="minDate"
              />
              <p class="text-xs text-gray-500 mt-1">Неделя будет начинаться с ближайшего понедельника</p>
            </div>
            
            <div v-if="generatedWeek" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="font-medium text-blue-700">Будет создана неделя:</p>
              <p class="text-sm text-blue-600">
                {{ generatedWeek.week_period }}<br>
                Код: {{ generatedWeek.week_code }}
              </p>
            </div>
            
            <div class="flex items-center">
              <input 
                v-model="copyFromCurrent"
                type="checkbox"
                id="copyWeek"
                class="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
              />
              <label for="copyWeek" class="ml-2 block text-sm text-gray-700">
                Скопировать меню из текущей недели
              </label>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="showCreateWeekModal = false"
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Отмена
            </button>
            <button 
              @click="createNewWeek"
              :disabled="!newWeekDate || isCreatingWeek"
              type="button"
              class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isCreatingWeek ? 'Создание...' : 'Создать неделю' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно добавления блюда -->
    <AddDishModal 
      v-if="showAddModal"
      :days="days"
      :categories="categories"
      @save="handleAddDish"
      @close="closeAddModal"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import { ref, computed, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import AddDishModal from '@/components/admin/menu/AddDishModal.vue'
import EditableDishesList from '@/components/admin/menu/EditableDishesList.vue'

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
const categories = ['Салат', 'Суп', 'Горячее', 'Гарнир']

// Состояние
const weeks = ref([])
const selectedWeekCode = ref('')
const currentWeek = ref(null)
const menuData = ref({})
const showAddModal = ref(false)
const showCreateWeekModal = ref(false)
const showImportModal = ref(false)
const newWeekDate = ref('')
const copyFromCurrent = ref(true)
const isSaving = ref(false)
const isCreatingWeek = ref(false)
const isImporting = ref(false)
const importReplaceExisting = ref(false)
const excelData = ref(null)

// Вычисляемые свойства
const totalDishesCount = computed(() => {
  let count = 0
  for (const day of days) {
    for (const category of categories) {
      const dishes = menuData.value[day]?.[category]
      if (dishes && Array.isArray(dishes)) {
        count += dishes.length
      }
    }
  }
  return count
})

const generatedWeek = computed(() => {
  if (!newWeekDate.value) return null
  
  try {
    const date = new Date(newWeekDate.value)
    const weekCode = generateWeekCode(date)
    return {
      week_code: weekCode,
      week_period: getWeekPeriod(weekCode)
    }
  } catch (error) {
    console.error('Error generating week:', error)
    return null
  }
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Функции для работы с неделями
function generateWeekCode(date) {
  const targetDate = date || new Date()
  const year = targetDate.getFullYear()
  const firstDayOfYear = new Date(year, 0, 1)
  const pastDaysOfYear = (targetDate.getTime() - firstDayOfYear.getTime()) / 86400000
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`
}

function getWeekPeriod(weekCode) {
  if (!weekCode) return ''
  
  try {
    const [year, week] = weekCode.split('-W').map(Number)
    const januaryFirst = new Date(year, 0, 1)
    const daysOffset = (week - 1) * 7
    const monday = new Date(januaryFirst)
    monday.setDate(januaryFirst.getDate() + daysOffset - januaryFirst.getDay() + 1)
    
    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)
    
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    }
    
    return `${formatDate(monday)} - ${formatDate(friday)}`
  } catch (error) {
    return weekCode
  }
}

// Методы
const getDishes = (day, category) => {
  return menuData.value[day]?.[category] || []
}

const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

// Импорт из Excel
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    
    // Преобразуем данные Excel в JSON
    const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
    
    // Парсим данные в структуру меню
    const parsedData = parseExcelData(data)
    
    excelData.value = {
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(2) + ' KB',
      parsedData: parsedData
    }
    
  } catch (error) {
    console.error('Ошибка чтения файла:', error)
    alert('Ошибка при чтении файла Excel')
  }
}

const parseExcelData = (data) => {
  const parsedMenu = {}
  let currentDay = null
  
  // Проходим по всем строкам Excel
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    
    // Пропускаем пустые строки
    if (!row || row.every(cell => !cell)) continue
    
    // Определяем день недели (строка начинается с дня недели)
    const firstCell = row[0]?.toString().trim()
    
    if (days.includes(firstCell)) {
      currentDay = firstCell
      if (!parsedMenu[currentDay]) {
        parsedMenu[currentDay] = {}
        categories.forEach(cat => {
          parsedMenu[currentDay][cat] = []
        })
      }
      continue
    }
    
    // Если есть текущий день, парсим блюда
    if (currentDay && row[0]) {
      const categoryName = row[0]?.toString().trim()
      
      if (categories.includes(categoryName) || categoryName.includes('Горячее/гарнир')) {
        // Определяем категорию
        let category = categoryName
        
        // Обработка объединенных категорий - ТОЛЬКО ГОРЯЧЕЕ
        if (categoryName === 'Горячее/гарнир') {
          category = 'Горячее'
          // Берем оба блюда как горячее (если их два)
          const dish1 = row[1]?.toString().trim()
          const dish2 = row[2]?.toString().trim()
          
          if (dish1) parsedMenu[currentDay][category].push(dish1)
          if (dish2) parsedMenu[currentDay][category].push(dish2)
          
          // Гарнир в этот день оставляем пустым
        } else {
          // Обычные категории
          const dish1 = row[1]?.toString().trim()
          const dish2 = row[2]?.toString().trim()
          
          if (dish1) parsedMenu[currentDay][category].push(dish1)
          if (dish2) parsedMenu[currentDay][category].push(dish2)
        }
      }
    }
  }
  
  return parsedMenu
}

const importFromExcel = async () => {
  if (!excelData.value?.parsedData) return
  
  isImporting.value = true
  
  try {
    if (importReplaceExisting.value) {
      // Заменяем существующее меню
      menuData.value = excelData.value.parsedData
    } else {
      // Добавляем к существующему меню
      for (const day in excelData.value.parsedData) {
        if (!menuData.value[day]) {
          menuData.value[day] = {}
        }
        
        for (const category in excelData.value.parsedData[day]) {
          if (!menuData.value[day][category]) {
            menuData.value[day][category] = []
          }
          
          // Добавляем только уникальные блюда
          const newDishes = excelData.value.parsedData[day][category]
          const existingDishes = menuData.value[day][category]
          
          newDishes.forEach(dish => {
            if (!existingDishes.includes(dish)) {
              existingDishes.push(dish)
            }
          })
        }
      }
    }
    
    // Закрываем модальное окно и сбрасываем данные
    showImportModal.value = false
    excelData.value = null
    importReplaceExisting.value = false
    
    // Автоматически сохраняем
    await saveMenu()
    
    alert('Меню успешно импортировано!')
    
  } catch (error) {
    console.error('Ошибка импорта:', error)
    alert('Ошибка при импорте меню')
  } finally {
    isImporting.value = false
  }
}

// Функция обновления названия блюда
const updateDishName = ({ day, category, oldName, newName }) => {
  if (!menuData.value[day] || !menuData.value[day][category]) return
  
  const dishes = menuData.value[day][category]
  const index = dishes.indexOf(oldName)
  
  if (index !== -1) {
    dishes[index] = newName.trim()
  }
}

const loadWeeks = async () => {
  try {
    const response = await fetch('/api/weeks')
    if (response.ok) {
      const data = await response.json()
      weeks.value = data.weeks || []
      
      if (weeks.value.length > 0) {
        const currentWeekObj = weeks.value.find(w => w.is_current) || weeks.value[0]
        selectedWeekCode.value = currentWeekObj.week_code
        currentWeek.value = currentWeekObj
        await loadWeekMenu()
      } else {
        await createCurrentWeek()
      }
    } else {
      await createCurrentWeek()
    }
  } catch (error) {
    console.error('Ошибка загрузки недель:', error)
    await createCurrentWeek()
  }
}

const createCurrentWeek = async () => {
  const currentWeekCode = generateWeekCode()
  const currentWeekPeriod = getWeekPeriod(currentWeekCode)
  
  const newWeek = {
    id: 1,
    week_code: currentWeekCode,
    week_period: currentWeekPeriod,
    is_current: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  weeks.value = [newWeek]
  selectedWeekCode.value = currentWeekCode
  currentWeek.value = newWeek
  
  menuData.value = initializeEmptyMenu()
}

const loadWeekMenu = async () => {
  if (!selectedWeekCode.value) return
  
  currentWeek.value = weeks.value.find(w => w.week_code === selectedWeekCode.value) || {
    week_code: selectedWeekCode.value,
    week_period: getWeekPeriod(selectedWeekCode.value)
  }
  
  try {
    const response = await fetch(`/api/menu/${selectedWeekCode.value}`)
    if (response.ok) {
      const data = await response.json()
      menuData.value = data.menu || initializeEmptyMenu()
    } else {
      menuData.value = initializeEmptyMenu()
    }
  } catch (error) {
    console.error('Ошибка загрузки меню:', error)
    menuData.value = initializeEmptyMenu()
  }
}

const initializeEmptyMenu = () => {
  const emptyMenu = {}
  days.forEach(day => {
    emptyMenu[day] = {}
    categories.forEach(category => {
      emptyMenu[day][category] = []
    })
  })
  return emptyMenu
}

const addDish = (dishData) => {
  const { day, category, name, isStandalone } = dishData
  
  if (!menuData.value[day]) {
    menuData.value[day] = {}
  }
  if (!menuData.value[day][category]) {
    menuData.value[day][category] = []
  }
  
  let dishName = name.trim()
  if (isStandalone && !dishName.includes('(самост.)')) {
    dishName += ' (самост.)'
  }
  
  if (!menuData.value[day][category].includes(dishName)) {
    menuData.value[day][category].push(dishName)
  }
  
  showAddModal.value = false
}

const handleAddDish = (dishData) => {
  addDish(dishData)
}

const removeDish = ({ day, category, dishName }) => {
  if (menuData.value[day] && menuData.value[day][category]) {
    const index = menuData.value[day][category].indexOf(dishName)
    if (index !== -1) {
      menuData.value[day][category].splice(index, 1)
    }
  }
}

const createNewWeek = async () => {
  if (!newWeekDate.value || !generatedWeek.value) return
  
  isCreatingWeek.value = true
  
  try {
    const existingWeek = weeks.value.find(w => w.week_code === generatedWeek.value.week_code)
    if (existingWeek) {
      alert('Неделя с таким кодом уже существует!')
      return
    }
    
    const newWeek = {
      id: weeks.value.length + 1,
      week_code: generatedWeek.value.week_code,
      week_period: generatedWeek.value.week_period,
      is_current: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    let menuToCopy = menuData.value
    if (!copyFromCurrent.value || !selectedWeekCode.value) {
      menuToCopy = initializeEmptyMenu()
    }
    
    const saveResponse = await fetch(`/api/menu/${newWeek.week_code}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        menu: menuToCopy,
        created_at: new Date().toISOString()
      })
    })
    
    if (!saveResponse.ok) {
      throw new Error('Failed to save week menu')
    }
    
    weeks.value.push(newWeek)
    
    await fetch('/api/weeks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weeks: weeks.value })
    })
    
    selectedWeekCode.value = newWeek.week_code
    await loadWeekMenu()
    
    showCreateWeekModal.value = false
    newWeekDate.value = ''
    
    alert('Новая неделя успешно создана!')
    
  } catch (error) {
    console.error('Ошибка создания недели:', error)
    alert('Ошибка при создании недели')
  } finally {
    isCreatingWeek.value = false
  }
}

const saveMenu = async () => {
  if (!selectedWeekCode.value) {
    alert('Не выбрана неделя для сохранения')
    return
  }
  
  isSaving.value = true
  
  try {
    const saveResponse = await fetch(`/api/menu/${selectedWeekCode.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        menu: menuData.value,
        created_at: currentWeek.value?.created_at || new Date().toISOString()
      })
    })
    
    if (saveResponse.ok) {
      const result = await saveResponse.json()
      console.log('Menu saved:', result)
      alert('Меню успешно сохранено!')
      
      if (currentWeek.value) {
        currentWeek.value.updated_at = new Date().toISOString()
      }
      
    } else {
      throw new Error('Failed to save menu')
    }
    
  } catch (error) {
    console.error('Ошибка сохранения меню:', error)
    alert('Ошибка при сохранении меню')
  } finally {
    isSaving.value = false
  }
}

// Инициализация
onMounted(() => {
  loadWeeks()
})
</script>