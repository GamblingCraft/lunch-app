// app/api/orders/save.ts - обновленная версия
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    console.log('📦 ПОЛНЫЕ ДАННЫЕ ЗАКАЗА:', JSON.stringify(body, null, 2))
    
    const { 
      user_id, 
      user_fio, 
      user_department, 
      week_code, 
      week_period, 
      orders 
    } = body
    
    if (!user_id || !week_code || !orders) {
      console.error('❌ Нет user_id, week_code или orders')
      return {
        success: false,
        message: 'Недостаточно данных для сохранения заказа'
      }
    }
    
    // Проверяем формат week_code
    if (!/^\d{4}-W\d{2}$/.test(week_code)) {
      console.error('❌ Неверный формат week_code:', week_code)
      return {
        success: false,
        message: 'Неверный формат week_code. Ожидается: ГГГГ-WНН'
      }
    }
    
    // Путь к файлу заказов недели
    const ordersDir = path.join(process.cwd(), 'data', 'orders')
    const weekFilePath = path.join(ordersDir, `${week_code}.json`)
    
    console.log('💾 Путь сохранения:', weekFilePath)
    
    // Создаем папку, если не существует
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir, { recursive: true })
      console.log('📁 Создана папка:', ordersDir)
    }
    
    let weekOrders: Record<string, any> = {}
    
    // Читаем существующие заказы недели
    if (fs.existsSync(weekFilePath)) {
      try {
        const fileContent = fs.readFileSync(weekFilePath, 'utf8')
        weekOrders = JSON.parse(fileContent)
        console.log(`📄 Файл существует. Заказов: ${Object.keys(weekOrders).length}`)
        console.log('📋 Текущие user_id в файле:', Object.keys(weekOrders))
      } catch (error) {
        console.error('❌ Ошибка чтения файла:', error)
        weekOrders = {}
      }
    } else {
      console.log(`📄 Файл не существует, создаем новый`)
    }
    
    // Создаем/обновляем заказ
    const userIdStr = String(user_id)
    const orderData = {
      user_id: userIdStr,
      user_fio,
      user_department,
      week_code,
      week_period,
      orders,
      created_at: body.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log(`👤 Сохраняем заказ для user_id: ${userIdStr}`)
    console.log('🍽️  Данные заказа:', {
      week_code,
      ordersCount: Object.keys(orders).length,
      orders
    })
    
    // Сохраняем под ключом user_id
    weekOrders[userIdStr] = orderData
    
    console.log(`📊 После добавления: ${Object.keys(weekOrders).length} заказов`)
    
    // Сохраняем в файл недели
    fs.writeFileSync(
      weekFilePath, 
      JSON.stringify(weekOrders, null, 2),
      'utf8'
    )
    
    // Проверяем, что записалось
    if (fs.existsSync(weekFilePath)) {
      const savedContent = fs.readFileSync(weekFilePath, 'utf8')
      const parsedContent = JSON.parse(savedContent)
      console.log(`✅ Проверка: в файле ${Object.keys(parsedContent).length} заказов`)
    } else {
      console.error('❌ Файл не был создан!')
    }
    
    console.log(`✅ Заказ сохранен. Всего заказов в ${week_code}: ${Object.keys(weekOrders).length}`)
    
    // Также сохраняем в общий файл для обратной совместимости
    await backupToGlobalFile(orderData)
    
    return {
      success: true,
      message: 'Заказ сохранен',
      order: orderData,
      savedTo: weekFilePath,
      totalOrders: Object.keys(weekOrders).length
    }
  } catch (error: any) {
    console.error('🔥 Критическая ошибка сохранения заказа:', error)
    return {
      success: false,
      message: 'Ошибка сохранения заказа: ' + error.message,
      error: error.message
    }
  }
})

async function backupToGlobalFile(orderData: any) {
  try {
    const allOrdersFilePath = path.join(process.cwd(), 'data', 'orders.json')
    console.log(`💾 Резервное копирование в: ${allOrdersFilePath}`)
    
    let allOrders: any[] = []
    
    if (fs.existsSync(allOrdersFilePath)) {
      try {
        const fileContent = fs.readFileSync(allOrdersFilePath, 'utf8')
        allOrders = JSON.parse(fileContent)
        console.log(`📄 Общий файл прочитан: ${allOrders.length} заказов`)
      } catch (error) {
        console.error('❌ Ошибка чтения общего файла:', error)
        allOrders = []
      }
    } else {
      console.log('📄 Общий файл не существует, создаем новый')
    }
    
    // Ищем старый заказ
    const userIdStr = String(orderData.user_id)
    const existingOrderIndex = allOrders.findIndex(order => 
      String(order.user_id) === userIdStr && 
      order.week_code === orderData.week_code
    )
    
    console.log(`🔍 Поиск старого заказа: user_id=${userIdStr}, week=${orderData.week_code}, index=${existingOrderIndex}`)
    
    if (existingOrderIndex !== -1) {
      allOrders[existingOrderIndex] = orderData
      console.log('🔄 Заказ обновлен в общем файле')
    } else {
      allOrders.push(orderData)
      console.log('➕ Заказ добавлен в общий файл')
    }
    
    // Сохраняем общий файл
    fs.writeFileSync(
      allOrdersFilePath,
      JSON.stringify(allOrders, null, 2),
      'utf8'
    )
    
    // Проверяем сохранение
    if (fs.existsSync(allOrdersFilePath)) {
      const savedContent = fs.readFileSync(allOrdersFilePath, 'utf8')
      const parsedContent = JSON.parse(savedContent)
      console.log(`✅ Общий файл сохранен: ${parsedContent.length} заказов`)
    }
    
    console.log('✅ Заказ сохранен в общий файл orders.json')
  } catch (error) {
    console.error('❌ Ошибка резервного копирования:', error)
  }
}