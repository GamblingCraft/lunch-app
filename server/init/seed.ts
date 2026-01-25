import { departmentsStorage } from '../storage/departments'
import { weeksStorage } from '../storage/weeks'

// Инициализация базовых данных
export async function seedInitialData() {
  console.log('Seeding initial data...')
  
  // Создаем отделы по умолчанию
  const defaultDepartments = [
    { name: 'Логистика', lunch_start: '12:00', lunch_end: '13:00' },
    { name: 'Маркетинг', lunch_start: '13:00', lunch_end: '14:00' },
    { name: 'Продажи', lunch_start: '12:00', lunch_end: '13:00' },
    { name: 'Бухгалтерия', lunch_start: '15:00', lunch_end: '16:00' },
    { name: 'IT', lunch_start: '13:00', lunch_end: '14:00' },
    { name: 'HR', lunch_start: '13:00', lunch_end: '14:00' },
    { name: 'Производство', lunch_start: '12:00', lunch_end: '13:00' }
  ]
  
  const existingDepts = departmentsStorage.getAll()
  if (existingDepts.length === 0) {
    defaultDepartments.forEach(dept => {
      departmentsStorage.addDepartment(dept.name, dept.lunch_start, dept.lunch_end)
    })
    console.log('Created default departments')
  }
  
  // Автоматически устанавливаем текущую и следующую неделю
  weeksStorage.autoSetWeeks()
  console.log('Weeks initialized')
  
  // Создаем тестового админа если нет пользователей
  const users = require('../../data/users.json').users
  if (users.length === 0) {
    // Тестового админа создадим через API при первой авторизации
    console.log('No users found. First user will be created on login.')
  }
  
  console.log('Initial data seeding complete!')
}

// Запуск инициализации при старте сервера
if (import.meta.main) {
  seedInitialData()
}