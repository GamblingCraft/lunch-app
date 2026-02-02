// utils/cabinet/orders/migrateToWeekly.ts
import fs from 'fs'
import path from 'path'

/**
 * Утилита для миграции заказов в новую структуру
 * Запустите: npx tsx utils/cabinet/orders/migrateToWeekly.ts
 */
export async function migrateToWeekly(): Promise<void> {
  try {
    const oldFilePath = path.join(process.cwd(), 'data', 'orders.json')
    
    if (!fs.existsSync(oldFilePath)) {
      console.log('❌ Файл orders.json не найден')
      return
    }
    
    console.log('📦 Начинаем миграцию заказов...')
    
    // Читаем старые заказы
    const fileContent = fs.readFileSync(oldFilePath, 'utf8')
    const allOrders = JSON.parse(fileContent)
    
    console.log(`📊 Прочитано ${allOrders.length} заказов`)
    
    // Создаем папку для заказов по неделям
    const ordersDir = path.join(process.cwd(), 'data', 'orders')
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir, { recursive: true })
      console.log('📁 Создана папка:', ordersDir)
    }
    
    // Группируем заказы по неделям
    const ordersByWeek: Record<string, Record<string, any>> = {}
    
    allOrders.forEach((order: any, index: number) => {
      const weekCode = order.week_code
      
      if (!weekCode) {
        console.warn(`⚠️  Заказ ${index} пропущен (нет week_code):`, order.user_id)
        return
      }
      
      if (!ordersByWeek[weekCode]) {
        ordersByWeek[weekCode] = {}
      }
      
      // Сохраняем под ключом user_id
      ordersByWeek[weekCode][String(order.user_id)] = order
    })
    
    console.log(`📅 Сгруппировано по ${Object.keys(ordersByWeek).length} неделям`)
    
    // Сохраняем заказы по неделям
    let totalSaved = 0
    
    for (const [weekCode, weekOrders] of Object.entries(ordersByWeek)) {
      const weekFilePath = path.join(ordersDir, `${weekCode}.json`)
      
      // Проверяем, не существует ли уже файл
      if (fs.existsSync(weekFilePath)) {
        console.log(`📄 Файл ${weekCode}.json уже существует, объединяем...`)
        
        try {
          const existingContent = fs.readFileSync(weekFilePath, 'utf8')
          const existingOrders = JSON.parse(existingContent)
          
          // Объединяем заказы
          Object.assign(existingOrders, weekOrders)
          
          fs.writeFileSync(
            weekFilePath,
            JSON.stringify(existingOrders, null, 2),
            'utf8'
          )
          
          console.log(`✅ Объединен файл: ${weekCode}.json (+${Object.keys(weekOrders).length} заказов)`)
          
        } catch (error) {
          console.error(`❌ Ошибка объединения ${weekCode}.json:`, error)
        }
      } else {
        // Создаем новый файл
        fs.writeFileSync(
          weekFilePath,
          JSON.stringify(weekOrders, null, 2),
          'utf8'
        )
        
        console.log(`✅ Создан файл: ${weekCode}.json (${Object.keys(weekOrders).length} заказов)`)
      }
      
      totalSaved += Object.keys(weekOrders).length
    }
    
    console.log(`🎉 Миграция завершена! Всего сохранено: ${totalSaved} заказов`)
    
    // Создаем backup старого файла
    const backupPath = path.join(process.cwd(), 'data', 'orders-backup.json')
    fs.copyFileSync(oldFilePath, backupPath)
    console.log(`💾 Создана резервная копия: orders-backup.json`)
    
  } catch (error) {
    console.error('❌ Ошибка миграции:', error)
  }
}

// Если файл запускается напрямую
if (require.main === module) {
  migrateToWeekly()
}