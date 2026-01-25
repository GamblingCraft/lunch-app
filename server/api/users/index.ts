// app/api/users/index.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const { telegram_id } = getQuery(event)
    
    // Путь к файлу пользователей
    const usersDir = path.join(process.cwd(), 'data', 'users')
    const usersFilePath = path.join(usersDir, 'users.json')
    
    // Проверяем существование файла
    if (!fs.existsSync(usersFilePath)) {
      return {
        success: true,
        message: 'База пользователей пуста',
        users: [],
        total: 0
      }
    }
    
    // Читаем пользователей
    let allUsers: any[] = []
    try {
      const fileContent = fs.readFileSync(usersFilePath, 'utf8')
      allUsers = JSON.parse(fileContent)
    } catch (error) {
      console.error('Ошибка чтения файла пользователей:', error)
      return {
        success: false,
        message: 'Ошибка чтения базы пользователей',
        users: [],
        total: 0
      }
    }
    
    // Если запрошен конкретный пользователь
    if (telegram_id) {
      const user = allUsers.find(u => {
        return u.telegram_id.toString() === telegram_id.toString()
      })
      
      if (!user) {
        return {
          success: false,
          message: 'Пользователь не найден',
          user: null
        }
      }
      
      return {
        success: true,
        user,
        total: allUsers.length
      }
    }
    
    // Возвращаем всех пользователей (без конфиденциальных данных если нужно)
    const safeUsers = allUsers.map(user => ({
      id: user.id,
      telegram_id: user.telegram_id,
      fio: user.fio,
      department: user.department,
      username: user.username,
      is_admin: user.is_admin,
      created_at: user.created_at,
      updated_at: user.updated_at
    }))
    
    return {
      success: true,
      users: safeUsers,
      total: allUsers.length
    }
  } catch (error) {
    console.error('Ошибка получения пользователей:', error)
    return {
      success: false,
      message: 'Ошибка сервера при получении пользователей',
      error: error instanceof Error ? error.message : 'Unknown error',
      users: [],
      total: 0
    }
  }
})