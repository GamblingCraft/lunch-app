<template>
  <div class="mb-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-2">
      Добро пожаловать, {{ userName }}!
    </h2>
    <p class="text-gray-600">
      Отдел: {{ department }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  userName: string
  department: string
}>()
</script>
