<template>
  <div>
    <!-- Заголовок -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Сотрудники</h1>
      <p class="text-gray-600 mt-1">Управление пользователями системы</p>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8.5a6 6 0 01-6 6"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Всего сотрудников</p>
            <p class="text-2xl font-bold text-gray-800">{{ totalUsers }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Администраторов</p>
            <p class="text-2xl font-bold text-gray-800">{{ adminCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Отделов</p>
            <p class="text-2xl font-bold text-gray-800">{{ departments.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Поиск и фильтры -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по ФИО или Telegram..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
            />
          </div>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <select 
            v-model="selectedDepartment"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          >
            <option value="all">Все отделы</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
          
          <select 
            v-model="selectedRole"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          >
            <option value="all">Все роли</option>
            <option value="admin">Администраторы</option>
            <option value="user">Сотрудники</option>
          </select>
          
          <button 
            @click="refreshUsers"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Обновить
          </button>
        </div>
      </div>
    </div>

    <!-- Таблица пользователей -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">Список сотрудников</h3>
        <p class="text-gray-600 text-sm mt-1">Все зарегистрированные пользователи</p>
      </div>
      
      <div v-if="loading" class="p-8 text-center">
        <svg class="animate-spin h-8 w-8 text-accent-500 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-gray-600">Загрузка пользователей...</p>
      </div>
      
      <div v-else-if="filteredUsers.length === 0" class="p-8 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8.5a6 6 0 01-6 6"/>
        </svg>
        <h3 class="text-lg font-semibold text-gray-800 mt-4">Пользователи не найдены</h3>
        <p class="text-gray-600 mt-2" v-if="searchQuery || selectedDepartment !== 'all' || selectedRole !== 'all'">
          Попробуйте изменить параметры поиска
        </p>
        <p v-else class="text-gray-600 mt-2">В системе еще нет зарегистрированных пользователей</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center">
                  <span>ФИО</span>
                  <button @click="sortBy('fio')" class="ml-1">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                    </svg>
                  </button>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telegram</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Отдел</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата регистрации</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center">
                      <span class="text-accent-600 font-semibold">{{ getInitials(user.fio) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.fio }}</div>
                    <div class="text-sm text-gray-500">{{ user.username ? `@${user.username}` : 'Без username' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ user.telegram_id }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 text-xs font-medium rounded-full"
                      :class="getDepartmentClass(user.department)">
                  {{ user.department || 'Не указан' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="user.is_admin" class="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  Администратор
                </span>
                <span v-else class="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Сотрудник
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="editUser(user)"
                  class="text-accent-600 hover:text-accent-900 mr-4"
                >
                  Редактировать
                </button>
                <button 
                  v-if="!user.is_admin"
                  @click="toggleAdmin(user)"
                  class="text-green-600 hover:text-green-900"
                >
                  Сделать админом
                </button>
                <button 
                  v-else
                  @click="toggleAdmin(user)"
                  class="text-gray-600 hover:text-gray-900"
                >
                  Убрать админа
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Пагинация -->
        <div class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Показано {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} из {{ filteredUsers.length }} пользователей
            </div>
            <div class="flex space-x-2">
              <button 
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Назад
              </button>
              <span class="px-3 py-1 text-sm text-gray-700">
                Страница {{ currentPage }} из {{ totalPages }}
              </span>
              <button 
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперед
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-xl bg-white">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-800">
            {{ editingUser.id ? 'Редактировать пользователя' : 'Добавить пользователя' }}
          </h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ФИО *</label>
            <input
              v-model="editingUser.fio"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Telegram ID *</label>
            <input
              v-model="editingUser.telegram_id"
              type="number"
              required
              :disabled="!!editingUser.id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username Telegram</label>
            <input
              v-model="editingUser.username"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
              placeholder="@username"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Отдел *</label>
            <select
              v-model="editingUser.department"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
            >
              <option value="">Выберите отдел</option>
              <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
            </select>
          </div>
          
          <div>
            <label class="flex items-center">
              <input
                v-model="editingUser.is_admin"
                type="checkbox"
                class="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Администратор</span>
            </label>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50"
            >
              {{ saving ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import { ref, computed, onMounted } from 'vue'

// Состояние
const users = ref([])
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const selectedDepartment = ref('all')
const selectedRole = ref('all')
const showEditModal = ref(false)
const editingUser = ref({})
const currentPage = ref(1)
const itemsPerPage = 10
const sortField = ref('fio')
const sortDirection = ref('asc')

// Вычисляемые свойства
const totalUsers = computed(() => users.value.length)
const adminCount = computed(() => users.value.filter(u => u.is_admin).length)
const departments = computed(() => {
  const depts = new Set()
  users.value.forEach(user => {
    if (user.department) depts.add(user.department)
  })
  return Array.from(depts).sort()
})

const filteredUsers = computed(() => {
  let filtered = [...users.value]
  
  // Поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.fio.toLowerCase().includes(query) ||
      (user.username && user.username.toLowerCase().includes(query)) ||
      user.telegram_id.toString().includes(query)
    )
  }
  
  // Фильтр по отделу
  if (selectedDepartment.value !== 'all') {
    filtered = filtered.filter(user => user.department === selectedDepartment.value)
  }
  
  // Фильтр по роли
  if (selectedRole.value !== 'all') {
    if (selectedRole.value === 'admin') {
      filtered = filtered.filter(user => user.is_admin)
    } else {
      filtered = filtered.filter(user => !user.is_admin)
    }
  }
  
  // Сортировка
  filtered.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

// Методы
const getInitials = (fio) => {
  if (!fio) return '??'
  const parts = fio.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return fio.substring(0, 2).toUpperCase()
}

const getDepartmentClass = (department) => {
  const colors = {
    'IT': 'bg-blue-100 text-blue-800',
    'Отдел разработки': 'bg-blue-100 text-blue-800',
    'Маркетинг': 'bg-green-100 text-green-800',
    'Отдел маркетинга': 'bg-green-100 text-green-800',
    'Продажи': 'bg-purple-100 text-purple-800',
    'Бухгалтерия': 'bg-yellow-100 text-yellow-800',
    'Производство': 'bg-red-100 text-red-800',
    'Логистика': 'bg-indigo-100 text-indigo-800',
    'HR': 'bg-pink-100 text-pink-800',
    'Администрация': 'bg-gray-100 text-gray-800'
  }
  return colors[department] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const refreshUsers = async () => {
  await loadUsers()
}

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/users')
    const data = await response.json()
    
    if (data.success) {
      users.value = data.users || []
      console.log('Загружено пользователей:', users.value.length)
    } else {
      console.error('Ошибка загрузки пользователей:', data.message)
      users.value = []
    }
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error)
    users.value = []
  } finally {
    loading.value = false
  }
}

const editUser = (user = {}) => {
  editingUser.value = { ...user }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = {}
}

const saveUser = async () => {
  if (saving.value) return
  saving.value = true
  
  try {
    const userData = {
      telegram_id: parseInt(editingUser.value.telegram_id),
      first_name: editingUser.value.fio.split(' ')[0] || '',
      last_name: editingUser.value.fio.split(' ').slice(1).join(' ') || '',
      fio: editingUser.value.fio,
      username: editingUser.value.username || '',
      department: editingUser.value.department,
      is_admin: editingUser.value.is_admin || false
    }
    
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    
    const data = await response.json()
    
    if (data.success) {
      alert('Пользователь сохранен успешно!')
      await loadUsers()
      closeEditModal()
    } else {
      alert('Ошибка сохранения: ' + (data.message || 'Неизвестная ошибка'))
    }
  } catch (error) {
    console.error('Ошибка сохранения пользователя:', error)
    alert('Ошибка сохранения пользователя')
  } finally {
    saving.value = false
  }
}

const toggleAdmin = async (user) => {
  if (!confirm(`Вы уверены, что хотите ${user.is_admin ? 'убрать права администратора' : 'назначить администратором'} пользователя ${user.fio}?`)) {
    return
  }
  
  try {
    const userData = {
      telegram_id: user.telegram_id,
      first_name: user.first_name || user.fio.split(' ')[0] || '',
      last_name: user.last_name || user.fio.split(' ').slice(1).join(' ') || '',
      fio: user.fio,
      username: user.username || '',
      department: user.department || '',
      is_admin: !user.is_admin
    }
    
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    
    const data = await response.json()
    
    if (data.success) {
      alert(`Пользователь ${user.fio} теперь ${!user.is_admin ? 'администратор' : 'сотрудник'}`)
      await loadUsers()
    } else {
      alert('Ошибка изменения роли: ' + (data.message || 'Неизвестная ошибка'))
    }
  } catch (error) {
    console.error('Ошибка изменения роли:', error)
    alert('Ошибка изменения роли пользователя')
  }
}

// Инициализация
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}
</style>