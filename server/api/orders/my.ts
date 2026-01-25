// app/api/orders/my.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userId = query.userId || getCookie(event, 'user_id')
    
    if (!userId) {
      return {
        success: false,
        message: 'Пользователь не авторизован'
      }
    }
    
    // Путь к файлу заказов
    const ordersDir = path.join(process.cwd(), 'data')
    const ordersFilePath = path.join(ordersDir, 'orders.json')
    
    let orders: any[] = []
    
    // Читаем файл заказов
    if (fs.existsSync(ordersFilePath)) {
      try {
        const fileContent = fs.readFileSync(ordersFilePath, 'utf8')
        orders = JSON.parse(fileContent)
      } catch (error) {
        console.error('Ошибка чтения файла заказов:', error)
        orders = []
      }
    }
    
    // Определяем текущую неделю
    const getWeekCode = (date: Date): string => {
      const year = date.getFullYear()
      const firstDayOfYear = new Date(year, 0, 1)
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
      const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
      return `${year}-W${weekNumber.toString().padStart(2, '0')}`
    }
    
    const currentWeekCode = getWeekCode(new Date())
    
    // Находим заказ пользователя на текущую неделю
    const currentOrder = orders.find(order => 
      order.user_id === Number(userId) && order.week_code === currentWeekCode
    )
    
    // Находим заказ на следующую неделю, если передан weekCode
    const weekCode = query.weekCode as string
    let weekOrder = null
    if (weekCode) {
      weekOrder = orders.find(order => 
        order.user_id === Number(userId) && order.week_code === weekCode
      )
    }
    
    // Определяем сегодняшний день
    const today = new Date().getDay()
    const daysMap: Record<number, string> = {
      1: 'Понедельник',
      2: 'Вторник',
      3: 'Среда',
      4: 'Четверг',
      5: 'Пятница'
    }
    
    const todayName = daysMap[today]
    const todayOrder = currentOrder?.orders?.[todayName] || {}
    
    // История заказов (последние 4 недели)
    const userOrdersHistory = orders
      .filter(order => order.user_id === Number(userId))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4)
    
    return {
      success: true,
      currentOrder: currentOrder,
      weekOrder: weekOrder,
      todayOrder: todayOrder,
      todayName: todayName,
      history: userOrdersHistory,
      currentWeekCode: currentWeekCode,
      totalOrders: orders.length
    }
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
    return {
      success: false,
      message: 'Ошибка загрузки заказов',
      error: error.message
    }
  }
})