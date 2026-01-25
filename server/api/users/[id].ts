// app/api/users/[id].ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'id')
    
    if (!userId) {
      return {
        success: false,
        message: 'Не указан ID пользователя'
      }
    }
    
    // Путь к файлу пользователей
    const usersFilePath = path.join(process.cwd(), 'data', 'users', 'users.json')
    
    // Проверяем существование файла
    if (!fs.existsSync(usersFilePath)) {
      return {
        success: false,
        message: 'База пользователей пуста'
      }
    }
    
    // Читаем пользователей
    const fileContent = fs.readFileSync(usersFilePath, 'utf8')
    const allUsers = JSON.parse(fileContent)
    
    // Ищем пользователя по ID
    const user = allUsers.find(u => u.id.toString() === userId.toString())
    
    if (!user) {
      return {
        success: false,
        message: 'Пользователь не найден'
      }
    }
    
    return {
      success: true,
      user
    }
  } catch (error) {
    console.error('Ошибка получения пользователя:', error)
    return {
      success: false,
      message: 'Ошибка получения пользователя',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})