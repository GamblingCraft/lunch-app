import { JSONStorage } from '../utils/storage'

export interface User {
  id: string
  telegram_id: number | null
  fio: string
  department: string | null
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

class UsersStorage extends JSONStorage<User> {
  constructor() {
    super('users.json')
  }
  
  // Найти пользователя по Telegram ID
  findByTelegramId(telegramId: number): User | undefined {
    return this.find(user => user.telegram_id === telegramId)
  }
  
  // Создать или обновить пользователя из Telegram данных
  upsertFromTelegram(telegramData: {
    id: number
    first_name: string
    last_name?: string
    username?: string
    photo_url?: string
  }, isAdmin: boolean = false): User {
    const existing = this.findByTelegramId(telegramData.id)
    
    if (existing) {
      // Обновляем существующего пользователя
      return this.update(existing.id, {
        fio: `${telegramData.first_name} ${telegramData.last_name || ''}`.trim(),
        updated_at: new Date().toISOString()
      }) || existing
    }
    
    // Создаем нового пользователя
    const fio = `${telegramData.first_name} ${telegramData.last_name || ''}`.trim()
    
    return this.create({
      telegram_id: telegramData.id,
      fio,
      department: null,
      role: isAdmin ? 'admin' : 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }
  
  // Получить всех пользователей с пагинацией
  getAllUsers(page: number = 1, limit: number = 20) {
    const users = this.getAll()
    const start = (page - 1) * limit
    const end = start + limit
    
    return {
      users: users.slice(start, end),
      total: users.length,
      page,
      totalPages: Math.ceil(users.length / limit)
    }
  }
  
  // Получить пользователей по отделу
  getByDepartment(department: string): User[] {
    return this.filter(user => user.department === department)
  }
  
  // Обновить отдел пользователя
  updateDepartment(userId: string, department: string): User | null {
    return this.update(userId, {
      department,
      updated_at: new Date().toISOString()
    })
  }
}

export const usersStorage = new UsersStorage()