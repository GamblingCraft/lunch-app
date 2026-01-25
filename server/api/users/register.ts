// app/api/users/register.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    console.log('Получены данные для регистрации:', body)
    
    const { 
      telegram_id,
      first_name,
      last_name = '',
      username = '',
      photo_url = '',
      fio = '',
      department = '',
      is_admin = false
    } = body
    
    // Проверяем обязательные поля
    if (!telegram_id) {
      return {
        success: false,
        message: 'Не указан Telegram ID'
      }
    }
    
    if (!first_name && !fio) {
      return {
        success: false,
        message: 'Не указано имя пользователя'
      }
    }
    
    // Путь к файлу пользователей
    const usersDir = path.join(process.cwd(), 'data', 'users')
    const usersFilePath = path.join(usersDir, 'users.json')
    
    // Создаем папку, если не существует
    if (!fs.existsSync(usersDir)) {
      fs.mkdirSync(usersDir, { recursive: true })
      console.log('Создана папка:', usersDir)
    }
    
    let allUsers: any[] = []
    
    // Читаем существующих пользователей
    if (fs.existsSync(usersFilePath)) {
      try {
        const fileContent = fs.readFileSync(usersFilePath, 'utf8')
        allUsers = JSON.parse(fileContent)
        console.log(`Загружено ${allUsers.length} пользователей`)
      } catch (error) {
        console.error('Ошибка чтения файла пользователей:', error)
        allUsers = []
      }
    } else {
      console.log('Файл users.json не существует, создаем новый')
    }
    
    // Проверяем, есть ли уже пользователь
    const existingUserIndex = allUsers.findIndex(user => {
      return user.telegram_id.toString() === telegram_id.toString()
    })
    
    console.log(`Поиск пользователя с telegram_id: ${telegram_id}, найден индекс: ${existingUserIndex}`)
    
    // Формируем ФИО
    let finalFio = fio
    if (!finalFio.trim() && first_name) {
      finalFio = `${first_name} ${last_name}`.trim()
    }
    
    // Проверяем, что ФИО заполнено
    if (!finalFio.trim()) {
      return {
        success: false,
        message: 'ФИО обязательно для заполнения'
      }
    }
    
    // Проверяем, что отдел заполнен
    if (!department.trim()) {
      return {
        success: false,
        message: 'Отдел обязателен для заполнения'
      }
    }
    
    const now = new Date().toISOString()
    
    const userData = {
      id: existingUserIndex !== -1 ? allUsers[existingUserIndex].id : Date.now(),
      telegram_id: Number(telegram_id),
      first_name: first_name || finalFio.split(' ')[0] || '',
      last_name: last_name || finalFio.split(' ').slice(1).join(' ') || '',
      username: username || '',
      photo_url: photo_url || '',
      fio: finalFio,
      department: department,
      is_admin: Boolean(is_admin),
      created_at: existingUserIndex !== -1 ? allUsers[existingUserIndex].created_at : now,
      updated_at: now
    }
    
    console.log('Данные пользователя для сохранения:', userData)
    
    if (existingUserIndex !== -1) {
      // Обновляем существующего пользователя
      allUsers[existingUserIndex] = userData
      console.log(`Обновлен пользователь с ID: ${userData.id}`)
    } else {
      // Добавляем нового пользователя
      allUsers.push(userData)
      console.log(`Добавлен новый пользователь с ID: ${userData.id}`)
    }
    
    // Сохраняем в файл
    try {
      fs.writeFileSync(
        usersFilePath, 
        JSON.stringify(allUsers, null, 2),
        'utf8'
      )
      console.log(`Файл сохранен: ${usersFilePath}`)
      
      // Читаем обратно для проверки
      const verifyContent = fs.readFileSync(usersFilePath, 'utf8')
      const verifyUsers = JSON.parse(verifyContent)
      console.log(`Проверка: в файле ${verifyUsers.length} пользователей`)
      
    } catch (error) {
      console.error('Ошибка сохранения файла:', error)
      throw error
    }
    
    return {
      success: true,
      message: existingUserIndex !== -1 ? 'Пользователь обновлен' : 'Пользователь зарегистрирован',
      user: userData,
      isNew: existingUserIndex === -1,
      totalUsers: allUsers.length
    }
  } catch (error) {
    console.error('Ошибка регистрации пользователя:', error)
    return {
      success: false,
      message: 'Ошибка регистрации пользователя',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})