<template>
  <div class="flex items-center">
    <div
      class="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center mr-2"
    >
      <span class="text-white text-sm font-bold">
        ET
      </span>
    </div>

    <h1 class="text-xl font-semibold text-gray-800">
      Личный кабинет
    </h1>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  initials: string
}>()
</script>
