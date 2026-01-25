import { JSONStorage } from '../utils/storage'

export interface Week {
  week_code: string // "2024-W45"
  week_period: string // "11.11.2024 - 17.11.2024"
  start_date: string // "2024-11-11"
  end_date: string // "2024-11-17"
  is_current: boolean
}

class WeeksStorage extends JSONStorage<Week> {
  constructor() {
    super('weeks.json')
  }
  
  // Получить текущую неделю
  getCurrentWeek(): Week | undefined {
    const data = this.read()
    const currentWeekCode = data.current_week
    return this.getAll().find(week => week.week_code === currentWeekCode)
  }
  
  // Получить следующую неделю
  getNextWeek(): Week | undefined {
    const data = this.read()
    const nextWeekCode = data.next_week
    return this.getAll().find(week => week.week_code === nextWeekCode)
  }
  
  // Установить текущую и следующую неделю
  setCurrentWeeks(currentWeek: Week, nextWeek: Week): void {
    const data = this.read()
    
    // Обновляем флаги
    const weeks = this.getAll().map(week => ({
      ...week,
      is_current: week.week_code === currentWeek.week_code
    }))
    
    // Добавляем новые недели если их нет
    if (!weeks.find(w => w.week_code === currentWeek.week_code)) {
      weeks.push({ ...currentWeek, is_current: true })
    }
    if (!weeks.find(w => w.week_code === nextWeek.week_code)) {
      weeks.push({ ...nextWeek, is_current: false })
    }
    
    data.weeks = weeks
    data.current_week = currentWeek.week_code
    data.next_week = nextWeek.week_code
    
    this.write(data)
  }
  
  // Получить неделю по коду
  getWeekByCode(weekCode: string): Week | undefined {
    return this.getAll().find(week => week.week_code === weekCode)
  }
  
  // Создать новую неделю
  createWeek(weekData: Omit<Week, 'is_current'>): Week {
    const existing = this.getWeekByCode(weekData.week_code)
    if (existing) return existing
    
    const newWeek: Week = {
      ...weekData,
      is_current: false
    }
    
    const data = this.read()
    data.weeks.push(newWeek)
    this.write(data)
    
    return newWeek
  }
  
  // Автоматическое определение текущей и следующей недели
  autoSetWeeks(): { current: Week | null; next: Week | null } {
    const now = new Date()
    const year = now.getFullYear()
    const currentWeekNumber = this.getWeekNumber(now)
    const currentWeekCode = `${year}-W${currentWeekNumber.toString().padStart(2, '0')}`
    
    // Следующая неделя
    const nextWeekDate = new Date(now)
    nextWeekDate.setDate(nextWeekDate.getDate() + 7)
    const nextYear = nextWeekDate.getFullYear()
    const nextWeekNumber = this.getWeekNumber(nextWeekDate)
    const nextWeekCode = `${nextYear}-W${nextWeekNumber.toString().padStart(2, '0')}`
    
    // Форматируем период
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      return `${day}.${month}.${date.getFullYear()}`
    }
    
    // Получаем даты понедельника и пятницы для недели
    const getWeekDates = (weekCode: string) => {
      const [yearStr, weekStr] = weekCode.split('-W')
      const year = parseInt(yearStr)
      const week = parseInt(weekStr)
      
      const januaryFirst = new Date(year, 0, 1)
      const daysOffset = (januaryFirst.getDay() || 7) - 1
      const firstMonday = new Date(januaryFirst)
      firstMonday.setDate(januaryFirst.getDate() + (week - 1) * 7 - daysOffset)
      
      const monday = new Date(firstMonday)
      const friday = new Date(firstMonday)
      friday.setDate(friday.getDate() + 4)
      
      return { monday, friday }
    }
    
    const currentDates = getWeekDates(currentWeekCode)
    const nextDates = getWeekDates(nextWeekCode)
    
    const currentWeek: Week = {
      week_code: currentWeekCode,
      week_period: `${formatDate(currentDates.monday)} - ${formatDate(currentDates.friday)}`,
      start_date: currentDates.monday.toISOString().split('T')[0],
      end_date: currentDates.friday.toISOString().split('T')[0],
      is_current: true
    }
    
    const nextWeek: Week = {
      week_code: nextWeekCode,
      week_period: `${formatDate(nextDates.monday)} - ${formatDate(nextDates.friday)}`,
      start_date: nextDates.monday.toISOString().split('T')[0],
      end_date: nextDates.friday.toISOString().split('T')[0],
      is_current: false
    }
    
    this.setCurrentWeeks(currentWeek, nextWeek)
    
    return { current: currentWeek, next: nextWeek }
  }
  
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }
}

export const weeksStorage = new WeeksStorage()