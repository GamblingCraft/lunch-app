// server/api/_data/users.get.ts
export default defineEventHandler(async () => {
  try {
    // Читаем файл напрямую
    const users = await useStorage('data').getItem('users.json')
    return users || { users: [] }
  } catch (error) {
    console.error('Ошибка чтения users.json:', error)
    return { users: [] }
  }
})