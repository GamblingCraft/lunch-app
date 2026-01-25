import { JSONStorage } from '../utils/storage'
import { usersStorage } from './users'

export interface Feedback {
  id: string
  user_id: string | null
  message: string
  rating: number | null
  created_at: string
  user?: {
    fio: string
    department: string | null
  }
}

class FeedbackStorage extends JSONStorage<Feedback> {
  constructor() {
    super('feedback.json')
  }
  
  // Добавить отзыв
  addFeedback(userId: string | null, message: string, rating: number | null = null): Feedback {
    const user = userId ? usersStorage.getById(userId) : null
    
    return this.create({
      user_id: userId,
      message,
      rating,
      created_at: new Date().toISOString(),
      user: user ? {
        fio: user.fio,
        department: user.department
      } : undefined
    })
  }
  
  // Получить все отзывы с информацией о пользователях
  getAllWithUsers() {
    const feedbacks = this.getAll()
    
    return feedbacks.map(feedback => {
      if (feedback.user_id) {
        const user = usersStorage.getById(feedback.user_id)
        return {
          ...feedback,
          user: user ? {
            fio: user.fio,
            department: user.department
          } : null
        }
      }
      return feedback
    })
  }
  
  // Получить отзывы с пагинацией
  getPaginated(page: number = 1, limit: number = 20) {
    const feedbacks = this.getAllWithUsers()
    const start = (page - 1) * limit
    const end = start + limit
    
    return {
      feedbacks: feedbacks.slice(start, end),
      total: feedbacks.length,
      page,
      totalPages: Math.ceil(feedbacks.length / limit)
    }
  }
  
  // Получить средний рейтинг
  getAverageRating(): number | null {
    const feedbacks = this.getAll()
    const ratedFeedbacks = feedbacks.filter(f => f.rating !== null)
    
    if (ratedFeedbacks.length === 0) return null
    
    const sum = ratedFeedbacks.reduce((acc, f) => acc + (f.rating || 0), 0)
    return Math.round((sum / ratedFeedbacks.length) * 10) / 10
  }
}

export const feedbackStorage = new FeedbackStorage()