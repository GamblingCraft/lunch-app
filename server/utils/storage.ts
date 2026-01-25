import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, '../../data')

// Проверяем и создаем структуру директорий
function ensureDataStructure() {
  const dirs = [
    DATA_DIR,
    path.join(DATA_DIR, 'menus'),
    path.join(DATA_DIR, 'orders')
  ]
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
  
  // Создаем файлы по умолчанию если их нет
  const defaultFiles = {
    'users.json': { users: [], last_id: 0 },
    'weeks.json': { current_week: null, next_week: null, weeks: [] },
    'departments.json': { departments: [] },
    'feedback.json': { feedback: [], last_id: 0 }
  }
  
  Object.entries(defaultFiles).forEach(([filename, defaultData]) => {
    const filepath = path.join(DATA_DIR, filename)
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, JSON.stringify(defaultData, null, 2), 'utf8')
    }
  })
}

// Базовые функции для работы с JSON
export class JSONStorage<T extends { id?: string | number }> {
  private filePath: string
  
  constructor(filename: string) {
    ensureDataStructure()
    this.filePath = path.join(DATA_DIR, filename)
  }
  
  private read(): { [key: string]: any } {
    try {
      const content = fs.readFileSync(this.filePath, 'utf8')
      return JSON.parse(content)
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error)
      return {}
    }
  }
  
  private write(data: any): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8')
    } catch (error) {
      console.error(`Error writing to ${this.filePath}:`, error)
    }
  }
  
  getAll(): T[] {
    const data = this.read()
    const key = Object.keys(data).find(k => Array.isArray(data[k]))
    return key ? data[key] : []
  }
  
  getById(id: string | number): T | undefined {
    const items = this.getAll()
    return items.find(item => item.id === id)
  }
  
  create(item: Omit<T, 'id'>): T {
    const data = this.read()
    const key = Object.keys(data).find(k => Array.isArray(data[k]))
    if (!key) throw new Error('Invalid data structure')
    
    const lastId = data.last_id || 0
    const newItem = { id: (lastId + 1).toString(), ...item } as T
    
    data[key].push(newItem)
    data.last_id = lastId + 1
    this.write(data)
    
    return newItem
  }
  
  update(id: string | number, updates: Partial<T>): T | null {
    const data = this.read()
    const key = Object.keys(data).find(k => Array.isArray(data[k]))
    if (!key) return null
    
    const index = data[key].findIndex((item: T) => item.id === id)
    if (index === -1) return null
    
    data[key][index] = { ...data[key][index], ...updates }
    this.write(data)
    
    return data[key][index]
  }
  
  delete(id: string | number): boolean {
    const data = this.read()
    const key = Object.keys(data).find(k => Array.isArray(data[k]))
    if (!key) return false
    
    const index = data[key].findIndex((item: T) => item.id === id)
    if (index === -1) return false
    
    data[key].splice(index, 1)
    this.write(data)
    
    return true
  }
  
  find(predicate: (item: T) => boolean): T | undefined {
    const items = this.getAll()
    return items.find(predicate)
  }
  
  filter(predicate: (item: T) => boolean): T[] {
    const items = this.getAll()
    return items.filter(predicate)
  }
}