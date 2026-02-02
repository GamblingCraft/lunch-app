<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        
        <!-- Левая часть -->
        <CabinetUserBadge :initials="initials" />

        <!-- Правая часть -->
        <div class="flex items-center space-x-4">
          <span class="text-gray-600">
            {{ user.fio }}
          </span>

          <!-- Кнопка отзывов -->
          <NuxtLink
            to="/cabinet/feedback"
            class="relative p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>

            <span
              v-if="newRepliesCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ newRepliesCount }}
            </span>
          </NuxtLink>

          <button
            @click="$emit('logout')"
            class="text-sm text-accent-600 hover:text-accent-800"
          >
            Выйти
          </button>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import CabinetUserBadge from './CabinetUserBadge.vue'

defineProps<{
  user: {
    fio: string
  }
  initials: string
  newRepliesCount: number
}>()

defineEmits<{
  (e: 'logout'): void
}>()
</script>
