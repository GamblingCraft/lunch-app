<template>
  <NuxtLink
    :to="to"
    class="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors p-6 block"
  >
    <div class="flex items-center space-x-3 mb-4">
      <div
        class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 relative"
      >
        <slot name="icon" />

        <!-- Бейдж -->
        <span
          v-if="badge && badge > 0"
          class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center transition-all duration-300"
        >
          {{ badge }}
        </span>
      </div>

      <h3 class="text-lg font-semibold text-gray-800">
        {{ title }}
      </h3>
    </div>

    <p class="text-gray-600 mb-4">
      {{ description }}
    </p>

    <!-- Визуальная ссылка -->
    <span class="text-accent-600 hover:text-accent-800 font-medium inline-block">
      {{ linkText }} →
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  to: string
  linkText: string
  badge?: number
}>()
</script>
