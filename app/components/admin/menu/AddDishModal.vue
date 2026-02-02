<!-- app/components/admin/AddDishModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Добавить блюдо</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- День недели -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">День недели</label>
            <select 
              v-model="day"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            >
              <option v-for="dayOption in days" :key="dayOption" :value="dayOption">{{ dayOption }}</option>
            </select>
          </div>

          <!-- Категория -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Категория</label>
            <select 
              v-model="category"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            >
              <option v-for="categoryOption in categories" :key="categoryOption" :value="categoryOption">{{ categoryOption }}</option>
            </select>
          </div>

          <!-- Название блюда -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Название блюда</label>
            <input 
              v-model="name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Например: Цезарь с курицей"
            />
          </div>

          <!-- Самостоятельное блюдо -->
          <div class="flex items-center">
            <input 
              v-model="isStandalone"
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
            @click="closeModal"
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            Отмена
          </button>
          <button 
            @click="saveDish"
            :disabled="!name || !name.trim()"
            type="button"
            class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  days: {
    type: Array,
    default: () => ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
  },
  categories: {
    type: Array,
    default: () => ['Салат', 'Суп', 'Горячее', 'Гарнир']
  }
})

const emit = defineEmits(['save', 'close'])

// Используем простые ref вместо реактивного объекта
const day = ref(props.days[0])
const category = ref(props.categories[0])
const name = ref('')
const isStandalone = ref(false)

// Сбрасываем форму при открытии
watch(() => props.days, () => {
  day.value = props.days[0]
  category.value = props.categories[0]
  name.value = ''
  isStandalone.value = false
}, { immediate: true })

const saveDish = () => {
  console.log('Save dish clicked')
  
  if (!name.value || !name.value.trim()) {
    console.log('Dish name is empty')
    return
  }
  
  const dishData = {
    day: day.value,
    category: category.value,
    name: name.value.trim(),
    isStandalone: isStandalone.value
  }
  
  console.log('Emitting save with data:', dishData)
  
  emit('save', dishData)
  
  // Сброс формы
  name.value = ''
  isStandalone.value = false
}

const closeModal = () => {
  console.log('Closing modal')
  emit('close')
}
</script>