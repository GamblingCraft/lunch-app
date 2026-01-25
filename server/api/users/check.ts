// app/api/users/check.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const { telegram_id } = getQuery(event)
    
    if (!telegram_id) {
      return {
        success: false,
        message: 'Не указан telegram_id',
        user: null,
        hasFullData: false
      }
    }
    
    // Путь к файлу пользователей
    const usersDir = path.join(process.cwd(), 'data', 'users')
    const usersFilePath = path.join(usersDir, 'users.json')
    
    // Проверяем существование файла
    if (!fs.existsSync(usersFilePath)) {
      return {
        success: false,
        message: 'База пользователей пуста',
        user: null,
        hasFullData: false
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
        user: null,
        hasFullData: false
      }
    }
    
    // Ищем пользователя
    const user = allUsers.find(u => {
      // Сравниваем как число и как строку
      const id1 = Number(telegram_id)
      const id2 = Number(u.telegram_id)
      return id1 === id2 || telegram_id.toString() === u.telegram_id.toString()
    })
    
    if (!user) {
      return {
        success: false,
        message: 'Пользователь не найден',
        user: null,
        hasFullData: false
      }
    }
    
    // Проверяем заполненность данных
    const hasFullData = !!(user.fio && user.department)
    
    return {
      success: true,
      message: hasFullData ? 'Пользователь найден, данные заполнены' : 'Пользователь найден, требуется заполнение данных',
      user,
      hasFullData,
      totalUsers: allUsers.length
    }
  } catch (error) {
    console.error('Ошибка проверки пользователя:', error)
    return {
      success: false,
      message: 'Ошибка сервера при проверке пользователя',
      error: error instanceof Error ? error.message : 'Unknown error',
      user: null,
      hasFullData: false
    }
  }
})