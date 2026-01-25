<!-- app/layouts/admin.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Импорт вашего Header -->
    <AdminHeader />
    
    <div class="flex">
      <!-- Импорт вашего Sidebar -->
      <AdminSidebar />
      
      <!-- Основной контент -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
// Вариант 1: Используем ~/ для импорта из корня components/
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'

// Если вариант 1 не работает, попробуйте вариант 2:
// import AdminHeader from '../components/admin/AdminHeader.vue'
// import AdminSidebar from '../components/admin/AdminSidebar.vue'

console.log('✅ Layout admin загружен с компонентами')
</script>