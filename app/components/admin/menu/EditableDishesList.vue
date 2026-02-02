<!-- components/admin/menu/EditableDishesList.vue -->
<template>
  <div class="space-y-2">
    <div 
      v-for="(dish, index) in dishes" 
      :key="index"
      class="flex items-center justify-between group hover:bg-gray-50 p-1 rounded"
    >
      <!-- Режим редактирования -->
      <div v-if="editingIndex === index" class="flex items-center flex-1 mr-2">
        <input
          v-model="editValue"
          @keyup.enter="saveEdit(index)"
          @keyup.escape="cancelEdit"
          @blur="saveEdit(index)"
          class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          type="text"
          ref="editInput"
        />
        <button
          @click="saveEdit(index)"
          class="ml-2 p-1 text-green-600 hover:text-green-800"
          title="Сохранить"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </button>
        <button
          @click="cancelEdit"
          class="ml-1 p-1 text-gray-600 hover:text-gray-800"
          title="Отмена"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Режим отображения -->
      <div v-else class="flex items-center justify-between flex-1">
        <span 
          @dblclick="startEdit(index)"
          class="text-sm text-gray-700 cursor-pointer hover:text-gray-900 flex-1"
          :class="{ 'text-accent-600': isStandalone(dish) }"
          :title="isStandalone(dish) ? 'Самостоятельное блюдо' : ''"
        >
          {{ dish }}
          <span v-if="isStandalone(dish)" class="ml-1 text-xs text-gray-500">(самост.)</span>
        </span>
        <button
          @click="$emit('remove', { day, category, dishName: dish })"
          class="opacity-0 group-hover:opacity-100 ml-2 p-1 text-red-600 hover:text-red-800"
          title="Удалить"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Если нет блюд -->
    <div v-if="dishes.length === 0" class="text-sm text-gray-400 italic">
      Нет блюд
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  dishes: {
    type: Array,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['remove', 'update'])

const editingIndex = ref(-1)
const editValue = ref('')
const editInput = ref(null)

const isStandalone = (dishName) => {
  return dishName.includes('(самост.)')
}

const startEdit = async (index) => {
  editingIndex.value = index
  editValue.value = props.dishes[index]
  
  await nextTick()
  if (editInput.value) {
    editInput.value.focus()
    editInput.value.select()
  }
}

const saveEdit = (index) => {
  const newName = editValue.value.trim()
  const oldName = props.dishes[index]
  
  if (newName && newName !== oldName) {
    emit('update', {
      day: props.day,
      category: props.category,
      oldName: oldName,
      newName: newName
    })
  }
  
  editingIndex.value = -1
  editValue.value = ''
}

const cancelEdit = () => {
  editingIndex.value = -1
  editValue.value = ''
}
</script>