// types/menu.ts
export interface Week {
  id: number
  week_code: string
  week_period: string
  is_current: boolean
  created_at: string
  updated_at: string
}

export interface MenuData {
  week_code: string
  menu: {
    [day: string]: {
      [category: string]: string[]
    }
  }
}

export interface UserOrder {
  user_id: number
  week_code: string
  orders: {
    [day: string]: {
      [category: string]: string
    }
  }
  created_at: string
  updated_at: string
}