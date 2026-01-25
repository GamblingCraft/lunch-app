// app/api/admin/orders-summary.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const { week_code } = getQuery(event)
    
    if (!week_code) {
      return {
        success: false,
        message: 'Не указана неделя'
      }
    }
    
    // Пути к файлам
    const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json')
    const usersFilePath = path.join(process.cwd(), 'data', 'users', 'users.json')
    
    // Проверяем существование файлов
    if (!fs.existsSync(ordersFilePath)) {
      return {
        success: true,
        message: 'Заказов нет',
        summary: [],
        departmentStats: [],
        totalOrders: 0
      }
    }
    
    // Читаем заказы
    let allOrders: any[] = []
    try {
      const ordersContent = fs.readFileSync(ordersFilePath, 'utf8')
      allOrders = JSON.parse(ordersContent)
    } catch (error) {
      console.error('Ошибка чтения файла заказов:', error)
      return {
        success: false,
        message: 'Ошибка чтения заказов'
      }
    }
    
    // Фильтруем заказы по неделе
    const weekOrders = allOrders.filter(order => order.week_code === week_code)
    
    if (weekOrders.length === 0) {
      return {
        success: true,
        message: 'На эту неделю заказов нет',
        summary: [],
        departmentStats: [],
        totalOrders: 0
      }
    }
    
    // Читаем пользователей для получения отделов
    let allUsers: any[] = []
    if (fs.existsSync(usersFilePath)) {
      try {
        const usersContent = fs.readFileSync(usersFilePath, 'utf8')
        allUsers = JSON.parse(usersContent)
      } catch (error) {
        console.error('Ошибка чтения файла пользователей:', error)
      }
    }
    
    // Агрегируем данные по блюдам
    const dishCounts: Record<string, any> = {}
    const departmentCounts: Record<string, number> = {}
    const userDepartments: Record<number, string> = {}
    
    // Создаем мапу пользователь -> отдел
    allUsers.forEach(user => {
      userDepartments[user.id] = user.department || 'Не указан'
    })
    
    // Обрабатываем каждый заказ
    weekOrders.forEach(order => {
      const department = userDepartments[order.user_id] || 'Не указан'
      
      // Считаем заказы по отделам
      departmentCounts[department] = (departmentCounts[department] || 0) + 1
      
      // Обрабатываем заказы по дням
      if (order.orders && typeof order.orders === 'object') {
        Object.entries(order.orders).forEach(([day, categories]) => {
          if (categories && typeof categories === 'object') {
            Object.entries(categories).forEach(([category, dish]) => {
              if (typeof dish === 'string') {
                const key = `${day}-${category}-${dish}`
                
                if (!dishCounts[key]) {
                  // Определяем, самостоятельное ли это блюдо
                  const isStandalone = dish.includes('(самост.)')
                  const cleanDishName = dish.replace(' (самост.)', '')
                  
                  dishCounts[key] = {
                    day,
                    category,
                    dish: cleanDishName,
                    count: 0,
                    isStandalone
                  }
                }
                
                dishCounts[key].count++
              }
            })
          }
        })
      }
    })
    
    // Преобразуем в массив и сортируем
    const summary = Object.values(dishCounts)
      .map(item => ({
        ...item,
        id: `${item.day}-${item.category}-${item.dish}`.replace(/\s+/g, '-')
      }))
      .sort((a, b) => {
        // Сортируем по дню (порядок дней)
        const dayOrder = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
        const dayA = dayOrder.indexOf(a.day)
        const dayB = dayOrder.indexOf(b.day)
        
        if (dayA !== dayB) return dayA - dayB
        
        // Затем по категории
        const categoryOrder = ['Салат', 'Суп', 'Горячее', 'Гарнир']
        const categoryA = categoryOrder.indexOf(a.category)
        const categoryB = categoryOrder.indexOf(b.category)
        
        if (categoryA !== categoryB) return categoryA - categoryB
        
        // Затем по названию блюда
        return a.dish.localeCompare(b.dish)
      })
    
    // Добавляем проценты (от общего количества заказов этой категории в день)
    const dayCategoryTotals: Record<string, number> = {}
    
    // Сначала считаем общее количество заказов по каждой категории в каждый день
    summary.forEach(item => {
      const key = `${item.day}-${item.category}`
      dayCategoryTotals[key] = (dayCategoryTotals[key] || 0) + item.count
    })
    
    // Затем добавляем проценты
    summary.forEach(item => {
      const key = `${item.day}-${item.category}`
      const total = dayCategoryTotals[key] || 1
      item.percentage = Math.round((item.count / total) * 100)
    })
    
    // Статистика по отделам
    const departmentStats = Object.entries(departmentCounts)
      .map(([name, orders]) => ({
        name,
        orders,
        percentage: Math.round((orders / weekOrders.length) * 100)
      }))
      .sort((a, b) => b.orders - a.orders)
    
    return {
      success: true,
      summary,
      departmentStats,
      totalOrders: weekOrders.length,
      week_code,
      week_period: weekOrders[0]?.week_period || week_code
    }
  } catch (error) {
    console.error('Ошибка агрегации заказов:', error)
    return {
      success: false,
      message: 'Ошибка получения сводки заказов',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})