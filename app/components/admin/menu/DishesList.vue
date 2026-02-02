<!-- app/components/admin/DishesList.vue -->
<template>
  <div class="space-y-2 min-h-[40px]">
    <div 
      v-for="dish in dishes" 
      :key="dish"
      class="flex items-center justify-between group p-2 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div class="flex items-center">
        <span class="text-sm text-gray-700">{{ dish }}</span>
        <span 
          v-if="dish.includes('(самост.)') || dish.toLowerCase().includes('самост')" 
          class="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
        >
          самостоятельное
        </span>
      </div>
      <button 
        @click="$emit('remove', { day, category, dishName: dish })"
        class="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity p-1"
        title="Удалить блюдо"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    
    <!-- Если нет блюд -->
    <div v-if="dishes.length === 0" class="text-sm text-gray-400 italic p-2">
      Нет блюд
    </div>
  </div>
</template>

<script setup>
defineProps({
  dishes: {
    type: Array,
    default: () => []
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

defineEmits(['remove'])
</script>