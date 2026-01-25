import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { usersStorage } from './users'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ORDERS_DIR = path.join(__dirname, '../../data/orders')

export interface OrderDay {
  Салат?: string
  Суп?: string
  Горячее?: string
  Гарнир?: string
  __skipped__?: boolean
}

export interface WeekOrder {
  [day: string]: OrderDay
}

export interface UserOrder {
  user_id: string
  week_code: string
  fio?: string
  department?: string
  orders: WeekOrder
  created_at: string
  updated_at: string
}

export class OrdersStorage {
  // Получить путь к файлу заказа
  private getOrderFilePath(weekCode: string, userId: string): string {
    const weekDir = path.join(ORDERS_DIR, weekCode)
    if (!fs.existsSync(weekDir)) {
      fs.mkdirSync(weekDir, { recursive: true })
    }
    return path.join(weekDir, `user_${userId}.json`)
  }
  
  // Получить заказ пользователя на неделю
  getUserOrder(weekCode: string, userId: string): UserOrder | null {
    const filePath = this.getOrderFilePath(weekCode, userId)
    
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    } catch (error) {
      console.error(`Error reading order for user ${userId}, week ${weekCode}:`, error)
      return null
    }
  }
  
  // Сохранить заказ пользователя на неделю
  saveUserOrder(weekCode: string, userId: string, orders: WeekOrder): UserOrder {
    const user = usersStorage.getById(userId)
    const filePath = this.getOrderFilePath(weekCode, userId)
    const now = new Date().toISOString()
    
    const userOrder: UserOrder = {
      user_id: userId,
      week_code: weekCode,
      fio: user?.fio,
      department: user?.department || null,
      orders,
      created_at: now,
      updated_at: now
    }
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(userOrder, null, 2), 'utf8')
    } catch (error) {
      console.error(`Error saving order for user ${userId}, week ${weekCode}:`, error)
      throw error
    }
    
    return userOrder
  }
  
  // Получить все заказы на неделю
  getWeekOrders(weekCode: string): UserOrder[] {
    const weekDir = path.join(ORDERS_DIR, weekCode)
    
    if (!fs.existsSync(weekDir)) {
      return []
    }
    
    const files = fs.readdirSync(weekDir)
    const orders: UserOrder[] = []
    
    files.forEach(file => {
      if (file.startsWith('user_') && file.endsWith('.json')) {
        const filePath = path.join(weekDir, file)
        try {
          const content = fs.readFileSync(filePath, 'utf8')
          const order = JSON.parse(content)
          orders.push(order)
        } catch (error) {
          console.error(`Error reading order file ${file}:`, error)
        }
      }
    })
    
    return orders
  }
  
  // Получить статистику по блюдам за неделю
  getWeekDishTotals(weekCode: string): Array<{
    day: string
    category: string
    dish: string
    count: number
  }> {
    const orders = this.getWeekOrders(weekCode)
    const totals: Map<string, number> = new Map()
    
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
    const categories = ['Салат', 'Суп', 'Горячее', 'Гарнир']
    
    orders.forEach(order => {
      days.forEach(day => {
        const dayOrder = order.orders[day]
        if (!dayOrder || dayOrder.__skipped__) return
        
        categories.forEach(category => {
          const dish = (dayOrder as any)[category]
          if (dish && typeof dish === 'string' && dish.trim()) {
            const key = `${day}|${category}|${dish.trim()}`
            totals.set(key, (totals.get(key) || 0) + 1)
          }
        })
      })
    })
    
    // Преобразуем в массив и сортируем
    return Array.from(totals.entries())
      .map(([key, count]) => {
        const [day, category, dish] = key.split('|')
        return { day, category, dish, count }
      })
      .sort((a, b) => {
        // Сортировка по дню и категории
        const dayOrder = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
        const catOrder = ['Салат', 'Суп', 'Горячее', 'Гарнир']
        
        const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
        if (dayDiff !== 0) return dayDiff
        return catOrder.indexOf(a.category) - catOrder.indexOf(b.category)
      })
  }
  
  // Получить статистику по отделам
  getDepartmentTotals(weekCode: string): Array<{
    department: string
    total: number
    details: Array<{ day: string, count: number }>
  }> {
    const orders = this.getWeekOrders(weekCode)
    const deptMap: Map<string, any> = new Map()
    
    orders.forEach(order => {
      const dept = order.department || 'Не указан'
      if (!deptMap.has(dept)) {
        deptMap.set(dept, {
          department: dept,
          total: 0,
          details: {}
        })
      }
      
      const deptData = deptMap.get(dept)!
      const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
      
      days.forEach(day => {
        const dayOrder = order.orders[day]
        if (dayOrder && !dayOrder.__skipped__) {
          // Проверяем, есть ли хоть одно блюдо в заказе на день
          const hasOrder = ['Салат', 'Суп', 'Горячее', 'Гарнир'].some(
            cat => (dayOrder as any)[cat]
          )
          
          if (hasOrder) {
            deptData.total++
            deptData.details[day] = (deptData.details[day] || 0) + 1
          }
        }
      })
    })
    
    // Преобразуем в нужный формат
    return Array.from(deptMap.values()).map(dept => ({
      department: dept.department,
      total: dept.total,
      details: Object.entries(dept.details).map(([day, count]) => ({
        day,
        count: count as number
      }))
    }))
  }
  
  // Удалить заказ пользователя на неделю
  deleteUserOrder(weekCode: string, userId: string): boolean {
    const filePath = this.getOrderFilePath(weekCode, userId)
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath)
        return true
      } catch (error) {
        console.error(`Error deleting order for user ${userId}:`, error)
        return false
      }
    }
    
    return false
  }
  
  // Проверить, есть ли заказ у пользователя на неделю
  hasUserOrder(weekCode: string, userId: string): boolean {
    const filePath = this.getOrderFilePath(weekCode, userId)
    return fs.existsSync(filePath)
  }
  
  // Получить заказы пользователя за все время
  getUserOrderHistory(userId: string): UserOrder[] {
    const allOrders: UserOrder[] = []
    
    if (!fs.existsSync(ORDERS_DIR)) {
      return []
    }
    
    const weekDirs = fs.readdirSync(ORDERS_DIR)
    
    weekDirs.forEach(weekCode => {
      const filePath = path.join(ORDERS_DIR, weekCode, `user_${userId}.json`)
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8')
          allOrders.push(JSON.parse(content))
        } catch (error) {
          console.error(`Error reading order history for user ${userId}:`, error)
        }
      }
    })
    
    return allOrders.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }
}

export const ordersStorage = new OrdersStorage()