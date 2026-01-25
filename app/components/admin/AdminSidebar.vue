<!-- app/components/admin/AdminSidebar.vue -->
<template>
  <aside class="bg-white border-r border-gray-200 w-64 flex-shrink-0 min-h-[calc(100vh-64px)] overflow-y-auto">
    <nav class="py-6">
      <!-- Навигация -->
      <div class="px-4 mb-6">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Навигация</h2>
        <ul class="space-y-1">
          <li v-for="item in navigationItems" :key="item.name">
            <NuxtLink 
              :to="item.path"
              :class="[
                'flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
                route.path === item.path ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              <span class="w-5 h-5 mr-3" v-html="item.icon"></span>
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      
      <!-- Управление -->
      <div class="px-4">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Управление</h2>
        <ul class="space-y-1">
          <li v-for="item in adminItems" :key="item.name">
            <NuxtLink 
              :to="item.path"
              :class="[
                'flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
                route.path === item.path ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              <span class="w-5 h-5 mr-3" v-html="item.icon"></span>
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from '#app'

const route = useRoute()

// SVG иконки как строки
const DashboardIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`

const MenuIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`

const OrdersIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`

const UsersIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 4.5l-2.5 2.5m-2.5-2.5l2.5-2.5"/></svg>`

const ReportsIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`

const SettingsIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`

const FeedbackIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>`

// Пункты меню
const navigationItems = ref([
  { name: 'Дашборд', path: '/admin', icon: DashboardIcon },
  { name: 'Меню', path: '/admin/menu', icon: MenuIcon },
  { name: 'Заказы', path: '/admin/orders', icon: OrdersIcon },
  { name: 'Отзывы', path: '/admin/feedback', icon: FeedbackIcon },
  { name: 'Пользователи', path: '/admin/users', icon: UsersIcon },
])

const adminItems = ref([
  { name: 'Отчеты', path: '/admin/reports', icon: ReportsIcon },
  { name: 'Настройки', path: '/admin/settings', icon: SettingsIcon },
])
</script>