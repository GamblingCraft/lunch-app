// app/api/menu/next.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    // Функция для получения кода недели
    const getWeekCode = (date: Date): string => {
      const year = date.getFullYear()
      const firstDayOfYear = new Date(year, 0, 1)
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
      const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
      return `${year}-W${weekNumber.toString().padStart(2, '0')}`
    }
    
    // Функция для получения периода недели
    const getWeekPeriod = (weekCode: string): string => {
      if (!weekCode) return ''
      
      try {
        const [year, week] = weekCode.split('-W').map(Number)
        const januaryFirst = new Date(year, 0, 1)
        const daysOffset = (week - 1) * 7
        const monday = new Date(januaryFirst)
        monday.setDate(januaryFirst.getDate() + daysOffset - januaryFirst.getDay() + 1)
        
        const friday = new Date(monday)
        friday.setDate(monday.getDate() + 4)
        
        const formatDate = (date: Date) => {
          const day = date.getDate().toString().padStart(2, '0')
          const month = (date.getMonth() + 1).toString().padStart(2, '0')
          const year = date.getFullYear()
          return `${day}.${month}.${year}`
        }
        
        return `${formatDate(monday)} - ${formatDate(friday)}`
      } catch (error) {
        return weekCode
      }
    }
    
    // Получаем текущую дату
    const now = new Date()
    
    // Текущая неделя
    const currentWeekCode = getWeekCode(now)
    
    // Следующая неделя (прибавляем 7 дней)
    const nextWeekDate = new Date(now)
    nextWeekDate.setDate(now.getDate() + 7)
    const nextWeekCode = getWeekCode(nextWeekDate)
    
    // Путь к папке с меню
    const menuDir = path.join(process.cwd(), 'data', 'menu')
    
    // Проверяем существование файла
    const menuFilePath = path.join(menuDir, `${nextWeekCode}.json`)
    const fileExists = fs.existsSync(menuFilePath)
    
    let menuData = {}
    
    if (fileExists) {
      try {
        // Читаем файл
        const fileContent = fs.readFileSync(menuFilePath, 'utf8')
        const parsedData = JSON.parse(fileContent)
        menuData = parsedData.menu || parsedData || {}
      } catch (error) {
        console.error(`Ошибка чтения файла ${nextWeekCode}.json:`, error)
        menuData = {}
      }
    }
    
    // Получаем список всех файлов меню
    let menuFiles: string[] = []
    if (fs.existsSync(menuDir)) {
      menuFiles = fs.readdirSync(menuDir)
        .filter(file => file.endsWith('.json') && !file.includes('weeks'))
        .sort()
        .reverse() // Сначала новые
    }
    
    // Создаем объект следующей недели
    const weekInfo = {
      week_code: nextWeekCode,
      week_period: getWeekPeriod(nextWeekCode),
      is_current: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    return {
      success: true,
      week: weekInfo,
      menu: menuData,
      current_week_code: currentWeekCode,
      next_week_code: nextWeekCode,
      today: now.toISOString().split('T')[0],
      menu_file_exists: fileExists,
      menu_file_path: menuFilePath,
      available_files: menuFiles
    }
  } catch (error) {
    console.error('Ошибка загрузки меню следующей недели:', error)
    return {
      success: false,
      message: 'Ошибка загрузки меню',
      error: error.message
    }
  }
})