// server/api/orders/today.get.ts
import { promises as fs } from 'fs'
import path from 'path'
import fsSync from 'fs'

export default defineEventHandler(async (event) => {
  const { userId } = getQuery(event)
  
  if (!userId) return { success: false, message: 'Требуется ID пользователя' }
  
  try {
    const today = new Date()
    const todayDay = today.getDay()
    
    const daysMap = { 1: 'Понедельник', 2: 'Вторник', 3: 'Среда', 4: 'Четверг', 5: 'Пятница' }
    const todayKey = daysMap[todayDay as keyof typeof daysMap]
    
    if (!todayKey) return { success: true, todayOrder: {}, todayName: todayKey }
    
    // Получаем номер недели
    const getWeekNumber = (date: Date): number => {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
    }
    
    const weekNumber = getWeekNumber(today)
    const year = today.getFullYear()
    const weekCode = `${year}-W${weekNumber.toString().padStart(2, '0')}`
    
    // Проверяем файл заказов
    const weekFilePath = path.join(process.cwd(), 'data', 'orders', `${weekCode}.json`)
    
    if (!fsSync.existsSync(weekFilePath)) {
      return { success: true, todayOrder: {}, weekCode, todayName: todayKey }
    }
    
    // Читаем и ищем заказ
    const fileContent = await fs.readFile(weekFilePath, 'utf-8')
    const weekOrders = JSON.parse(fileContent)
    const userOrder = weekOrders[String(userId)] || weekOrders[userId]
    
    if (!userOrder) return { success: true, todayOrder: {}, weekCode, todayName: todayKey }
    
    const todayOrder = userOrder.orders?.[todayKey] || {}
    
    return { 
      success: true, 
      todayOrder,
      weekCode,
      todayName: todayKey
    }
    
  } catch (error) {
    return { success: false, message: 'Ошибка сервера', todayOrder: {} }
  }
})