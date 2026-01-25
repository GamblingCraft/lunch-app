// server/api/users/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  try {
    // Читаем файл users.json
    const usersData = await $fetch('/api/_data/users')
    
    if (!usersData || !usersData.users) {
      return { exists: false, user: null }
    }
    
    const user = usersData.users.find((u: any) => 
      u.telegram_id === parseInt(id)
    )
    
    return {
      exists: !!user,
      user: user || null
    }
  } catch (error) {
    console.error('Ошибка чтения пользователя:', error)
    return {
      exists: false,
      user: null,
      error: 'Ошибка сервера'
    }
  }
})