// app/api/orders/my.ts - полное исправление
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userId = query.userId || getCookie(event, 'user_id')
    
    console.log('🔍 Поиск заказов для user_id:', userId)
    
    if (!userId) {
      return {
        success: false,
        message: 'Пользователь не авторизован'
      }
    }
    
    // Получаем ВСЕ заказы пользователя из всех источников
    const allUserOrders: any[] = []
    
    // 1. Ищем в общем файле orders.json
    const ordersDir = path.join(process.cwd(), 'data')
    const ordersFilePath = path.join(ordersDir, 'orders.json')
    
    console.log('📄 Проверка общего файла:', ordersFilePath)
    
    if (fs.existsSync(ordersFilePath)) {
      try {
        const fileContent = fs.readFileSync(ordersFilePath, 'utf8')
        const orders = JSON.parse(fileContent)
        
        // Фильтруем заказы пользователя
        const userOrders = orders.filter((order: any) => 
          String(order.user_id) === String(userId)
        )
        
        allUserOrders.push(...userOrders)
        console.log(`✅ Из общего файла: ${userOrders.length} заказов`)
        
      } catch (error) {
        console.error('❌ Ошибка чтения общего файла:', error)
      }
    } else {
      console.log('ℹ️  Общий файл orders.json не существует')
    }
    
    // 2. Ищем в отдельных файлах недель
    const weeklyOrdersDir = path.join(ordersDir, 'orders')
    console.log('📁 Проверка папки недельных заказов:', weeklyOrdersDir)
    
    if (fs.existsSync(weeklyOrdersDir)) {
      try {
        const weekFiles = fs.readdirSync(weeklyOrdersDir).filter(file => 
          file.endsWith('.json') && file.startsWith('2026-')
        )
        
        console.log(`📋 Найдено файлов недель: ${weekFiles.length}`)
        
        for (const weekFile of weekFiles) {
          const weekFilePath = path.join(weeklyOrdersDir, weekFile)
          const fileContent = fs.readFileSync(weekFilePath, 'utf8')
          const weekOrders = JSON.parse(fileContent)
          
          // Ищем заказ пользователя в файле недели
          const userOrder = weekOrders[String(userId)]
          
          if (userOrder) {
            // Проверяем, нет ли уже такого заказа в списке
            const existingIndex = allUserOrders.findIndex(order => 
              order.week_code === userOrder.week_code
            )
            
            if (existingIndex === -1) {
              allUserOrders.push(userOrder)
              console.log(`✅ Из файла ${weekFile}: найден заказ на неделю ${userOrder.week_code}`)
            }
          }
        }
      } catch (error) {
        console.error('❌ Ошибка чтения файлов недель:', error)
      }
    } else {
      console.log('ℹ️  Папка недельных заказов не существует')
    }
    
    // 3. Определяем текущую неделю
    const getWeekCode = (date: Date): string => {
      const year = date.getFullYear()
      const firstDayOfYear = new Date(year, 0, 1)
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
      const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
      return `${year}-W${weekNumber.toString().padStart(2, '0')}`
    }
    
    const currentWeekCode = getWeekCode(new Date())
    console.log('📅 Текущая неделя:', currentWeekCode)
    
    // 4. Находим заказ на текущую неделю
    const currentOrder = allUserOrders.find(order => 
      order.week_code === currentWeekCode
    )
    
    // 5. Находим заказ на указанную неделю (если передан weekCode)
    const weekCode = query.weekCode as string
    let weekOrder = null
    if (weekCode) {
      weekOrder = allUserOrders.find(order => 
        order.week_code === weekCode
      )
    }
    
    console.log('📊 Результаты поиска:', {
      totalOrdersFound: allUserOrders.length,
      currentWeekCode,
      hasCurrentOrder: !!currentOrder,
      weekCodeRequested: weekCode,
      hasWeekOrder: !!weekOrder,
      allWeekCodes: allUserOrders.map(o => o.week_code)
    })
    
    // 6. Определяем сегодняшний день
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
    
    // 7. Сортируем историю заказов
    const userOrdersHistory = allUserOrders
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
      totalOrders: allUserOrders.length,
      debug: {
        allWeekCodes: allUserOrders.map(o => o.week_code),
        userId: String(userId),
        sources: ['orders.json', 'weekly files']
      }
    }
  } catch (error: any) {
    console.error('🔥 Ошибка загрузки заказов:', error)
    return {
      success: false,
      message: 'Ошибка загрузки заказов',
      error: error.message
    }
  }
})