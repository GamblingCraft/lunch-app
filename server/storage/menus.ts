import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MENUS_DIR = path.join(__dirname, '../../data/menus')

export interface MenuItem {
  day_of_week: 'Понедельник' | 'Вторник' | 'Среда' | 'Четверг' | 'Пятница'
  category: 'Салат' | 'Суп' | 'Горячее' | 'Гарнир'
  dish_name: string
  is_standalone: boolean
}

export type DayMenu = {
  Салат: string[]
  Суп: string[]
  Горячее: string[]
  Гарнир: string[]
}

export type WeekMenu = {
  week_period: string
  Понедельник: DayMenu
  Вторник: DayMenu
  Среда: DayMenu
  Четверг: DayMenu
  Пятница: DayMenu
}

export class MenusStorage {
  // Получить меню на неделю
  getWeekMenu(weekCode: string): WeekMenu | null {
    const filePath = path.join(MENUS_DIR, `${weekCode}.json`)
    
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    } catch (error) {
      console.error(`Error reading menu ${weekCode}:`, error)
      return null
    }
  }
  
  // Сохранить меню на неделю
  saveWeekMenu(weekCode: string, menu: WeekMenu): void {
    const filePath = path.join(MENUS_DIR, `${weekCode}.json`)
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(menu, null, 2), 'utf8')
    } catch (error) {
      console.error(`Error saving menu ${weekCode}:`, error)
      throw error
    }
  }
  
  // Создать пустое меню на неделю
  createEmptyMenu(weekCode: string, weekPeriod: string): WeekMenu {
    const emptyDay: DayMenu = {
      Салат: [],
      Суп: [],
      Горячее: [],
      Гарнир: []
    }
    
    const menu: WeekMenu = {
      week_period: weekPeriod,
      Понедельник: { ...emptyDay },
      Вторник: { ...emptyDay },
      Среда: { ...emptyDay },
      Четверг: { ...emptyDay },
      Пятница: { ...emptyDay }
    }
    
    this.saveWeekMenu(weekCode, menu)
    return menu
  }
  
  // Добавить блюдо в меню
  addDishToMenu(weekCode: string, day: string, category: string, dishName: string, isStandalone: boolean = false): void {
    const menu = this.getWeekMenu(weekCode)
    if (!menu) {
      throw new Error(`Menu for week ${weekCode} not found`)
    }
    
    if (!(day in menu) || !(category in (menu as any)[day])) {
      throw new Error(`Invalid day or category`)
    }
    
    // Добавляем блюдо, если его еще нет
    const dishes = (menu as any)[day][category]
    if (!dishes.includes(dishName)) {
      dishes.push(dishName)
    }
    
    // Для самостоятельных блюд помечаем в названии
    if (isStandalone && !dishName.includes('(самост.)')) {
      const index = dishes.indexOf(dishName)
      if (index !== -1) {
        dishes[index] = `${dishName} (самост.)`
      }
    }
    
    this.saveWeekMenu(weekCode, menu)
  }
  
  // Получить все самостоятельные блюда
  getStandaloneDishes(weekCode: string): string[] {
    const menu = this.getWeekMenu(weekCode)
    if (!menu) return []
    
    const standaloneDishes: string[] = []
    
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
    const categories = ['Салат', 'Суп', 'Горячее', 'Гарнир']
    
    days.forEach(day => {
      categories.forEach(category => {
        const dishes = (menu as any)[day][category]
        dishes.forEach((dish: string) => {
          if (dish.includes('(самост.)')) {
            standaloneDishes.push(dish.replace(' (самост.)', ''))
          }
        })
      })
    })
    
    return [...new Set(standaloneDishes)]
  }
  
  // Получить меню для дня
  getDayMenu(weekCode: string, day: string): DayMenu | null {
    const menu = this.getWeekMenu(weekCode)
    if (!menu || !(day in menu)) {
      return null
    }
    
    return (menu as any)[day]
  }
  
  // Удалить блюдо из меню
  removeDishFromMenu(weekCode: string, day: string, category: string, dishName: string): boolean {
    const menu = this.getWeekMenu(weekCode)
    if (!menu) return false
    
    if (!(day in menu) || !(category in (menu as any)[day])) {
      return false
    }
    
    const dishes = (menu as any)[day][category]
    const index = dishes.indexOf(dishName)
    
    if (index === -1) return false
    
    dishes.splice(index, 1)
    this.saveWeekMenu(weekCode, menu)
    return true
  }
  
  // Проверить, является ли блюдо самостоятельным
  isDishStandalone(weekCode: string, dishName: string): boolean {
    const standaloneDishes = this.getStandaloneDishes(weekCode)
    return standaloneDishes.some(dish => 
      dish.toLowerCase() === dishName.toLowerCase().replace(' (самост.)', '')
    )
  }
}

export const menusStorage = new MenusStorage()