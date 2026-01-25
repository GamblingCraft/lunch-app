// app/api/menu/current.ts
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
    
    // Путь к папке с меню
    const menuDir = path.join(process.cwd(), 'data', 'menu')
    const menuFilePath = path.join(menuDir, `${currentWeekCode}.json`)
    
    let menuData = {}
    let fileExists = false
    
    if (fs.existsSync(menuFilePath)) {
      try {
        // Читаем файл
        const fileContent = fs.readFileSync(menuFilePath, 'utf8')
        const parsedData = JSON.parse(fileContent)
        menuData = parsedData.menu || parsedData || {}
        fileExists = true
      } catch (error) {
        console.error(`Ошибка чтения файла ${currentWeekCode}.json:`, error)
        menuData = {}
      }
    }
    
    // Определяем текущий день недели
    const today = new Date().getDay() // 0-воскресенье, 1-понедельник...
    const daysMap: Record<number, string> = {
      1: 'Понедельник',
      2: 'Вторник',
      3: 'Среда',
      4: 'Четверг',
      5: 'Пятница'
    }
    
    const todayName = daysMap[today] || 'Сегодня'
    const todayMenu = menuData[todayName] || {}
    
    // Создаем объект текущей недели
    const weekInfo = {
      week_code: currentWeekCode,
      week_period: getWeekPeriod(currentWeekCode),
      is_current: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    return {
      success: true,
      week: weekInfo,
      menu: menuData,
      todayMenu: todayMenu,
      todayName: todayName,
      menu_file_exists: fileExists,
      menu_file_path: menuFilePath
    }
  } catch (error) {
    console.error('Ошибка загрузки текущего меню:', error)
    return {
      success: false,
      message: 'Ошибка загрузки меню',
      error: error.message
    }
  }
})