// app/api/orders/save.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const { 
      user_id, 
      user_fio, 
      user_department, 
      week_code, 
      week_period, 
      orders 
    } = body
    
    if (!user_id || !week_code || !orders) {
      return {
        success: false,
        message: 'Недостаточно данных для сохранения заказа'
      }
    }
    
    // Путь к файлу заказов
    const ordersDir = path.join(process.cwd(), 'data')
    const ordersFilePath = path.join(ordersDir, 'orders.json')
    
    // Создаем папку, если не существует
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir, { recursive: true })
    }
    
    let allOrders: any[] = []
    
    // Читаем существующие заказы
    if (fs.existsSync(ordersFilePath)) {
      try {
        const fileContent = fs.readFileSync(ordersFilePath, 'utf8')
        allOrders = JSON.parse(fileContent)
      } catch (error) {
        console.error('Ошибка чтения файла заказов:', error)
        allOrders = []
      }
    }
    
    // Проверяем, есть ли уже заказ пользователя на эту неделю
    const existingOrderIndex = allOrders.findIndex(order => 
      order.user_id === user_id && order.week_code === week_code
    )
    
    const orderData = {
      user_id,
      user_fio,
      user_department,
      week_code,
      week_period,
      orders,
      created_at: body.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    if (existingOrderIndex !== -1) {
      // Обновляем существующий заказ
      allOrders[existingOrderIndex] = {
        ...allOrders[existingOrderIndex],
        ...orderData
      }
    } else {
      // Добавляем новый заказ
      allOrders.push(orderData)
    }
    
    // Сохраняем в файл
    fs.writeFileSync(
      ordersFilePath, 
      JSON.stringify(allOrders, null, 2),
      'utf8'
    )
    
    return {
      success: true,
      message: 'Заказ сохранен',
      order: orderData,
      totalOrders: allOrders.length
    }
  } catch (error) {
    console.error('Ошибка сохранения заказа:', error)
    return {
      success: false,
      message: 'Ошибка сохранения заказа',
      error: error.message
    }
  }
})