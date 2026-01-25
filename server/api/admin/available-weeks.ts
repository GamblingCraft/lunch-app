// app/api/admin/available-weeks.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json')
    
    console.log('Проверяем файл заказов:', ordersFilePath)
    
    if (!fs.existsSync(ordersFilePath)) {
      console.log('Файл заказов не найден')
      return {
        success: true,
        weeks: [],
        message: 'Заказов нет'
      }
    }
    
    // Читаем заказы
    let allOrders: any[] = []
    try {
      const fileContent = fs.readFileSync(ordersFilePath, 'utf8')
      allOrders = JSON.parse(fileContent)
      console.log(`Загружено ${allOrders.length} заказов`)
    } catch (error) {
      console.error('Ошибка чтения файла заказов:', error)
      return {
        success: false,
        message: 'Ошибка чтения заказов',
        weeks: []
      }
    }
    
    // Получаем уникальные недели
    const weekMap = new Map()
    
    allOrders.forEach(order => {
      if (order.week_code && order.week_period) {
        if (!weekMap.has(order.week_code)) {
          weekMap.set(order.week_code, {
            code: order.week_code,
            period: order.week_period,
            orders: 1,
            last_order: order.updated_at
          })
        } else {
          const existing = weekMap.get(order.week_code)
          existing.orders++
          if (new Date(order.updated_at) > new Date(existing.last_order)) {
            existing.last_order = order.updated_at
          }
        }
      }
    })
    
    const weeks = Array.from(weekMap.values())
      .sort((a, b) => b.code.localeCompare(a.code)) // Сортируем по убыванию (новые недели сверху)
    
    console.log(`Найдено ${weeks.length} недель с заказами:`, weeks.map(w => w.code))
    
    return {
      success: true,
      weeks,
      total: weeks.length
    }
  } catch (error) {
    console.error('Ошибка получения списка недель:', error)
    return {
      success: false,
      message: 'Ошибка получения списка недель',
      error: error instanceof Error ? error.message : 'Unknown error',
      weeks: []
    }
  }
})