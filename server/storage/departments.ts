import { JSONStorage } from '../utils/storage'

export interface Department {
  id: string
  name: string
  lunch_start: string // "12:00"
  lunch_end: string // "13:00"
  created_at: string
}

class DepartmentsStorage extends JSONStorage<Department> {
  constructor() {
    super('departments.json')
  }
  
  // Получить расписание обеда для отдела
  getLunchSchedule(departmentName: string): { start: string; end: string } | null {
    const dept = this.find(dept => dept.name === departmentName)
    if (!dept) return null
    
    return {
      start: dept.lunch_start,
      end: dept.lunch_end
    }
  }
  
  // Получить время обеда в текстовом формате
  getLunchTimeText(departmentName: string): string {
    const schedule = this.getLunchSchedule(departmentName)
    if (!schedule) return 'по графику вашего подразделения'
    
    return `${schedule.start} – ${schedule.end}`
  }
  
  // Добавить отдел
  addDepartment(name: string, lunchStart: string, lunchEnd: string): Department {
    const existing = this.find(dept => dept.name === name)
    if (existing) {
      throw new Error(`Отдел "${name}" уже существует`)
    }
    
    return this.create({
      name,
      lunch_start: lunchStart,
      lunch_end: lunchEnd,
      created_at: new Date().toISOString()
    })
  }
  
  // Обновить расписание отдела
  updateDepartmentSchedule(departmentId: string, lunchStart: string, lunchEnd: string): Department | null {
    return this.update(departmentId, {
      lunch_start: lunchStart,
      lunch_end: lunchEnd
    })
  }
  
  // Получить все отделы с количеством сотрудников
  getAllWithUserCount(users: Array<{ department?: string | null }>) {
    const departments = this.getAll()
    
    return departments.map(dept => {
      const userCount = users.filter(user => user.department === dept.name).length
      return {
        ...dept,
        user_count: userCount
      }
    })
  }
}

export const departmentsStorage = new DepartmentsStorage()