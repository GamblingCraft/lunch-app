// server/api/users/index.post.ts
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Читаем текущих пользователей
    const usersData = await $fetch('/api/_data/users') || { users: [] }
    
    // Проверяем, нет ли уже такого пользователя
    const existingUser = usersData.users.find((u: any) => 
      u.telegram_id === body.telegram_id
    )
    
    if (existingUser) {
      return {
        success: false,
        message: 'Пользователь уже существует'
      }
    }
    
    // Добавляем нового пользователя
    usersData.users.push(body)
    
    // Сохраняем обратно
    await useStorage('data').setItem('users.json', usersData)
    
    return {
      success: true,
      message: 'Пользователь сохранен'
    }
  } catch (error) {
    console.error('Ошибка сохранения пользователя:', error)
    return {
      success: false,
      message: 'Ошибка сервера'
    }
  }
})