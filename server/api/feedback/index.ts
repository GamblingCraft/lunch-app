// app/api/feedback/index.ts
import fs from 'fs'
import path from 'path'

// GET - получение всех отзывов
export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    try {
      const feedbackDir = path.join(process.cwd(), 'data', 'feedback')
      const feedbackFilePath = path.join(feedbackDir, 'feedback.json')
      
      // Проверяем существование файла
      if (!fs.existsSync(feedbackFilePath)) {
        return {
          success: true,
          feedback: [],
          total: 0
        }
      }
      
      // Читаем отзывы
      let allFeedback: any[] = []
      try {
        const fileContent = fs.readFileSync(feedbackFilePath, 'utf8')
        allFeedback = JSON.parse(fileContent)
      } catch (error) {
        console.error('Ошибка чтения файла отзывов:', error)
        return {
          success: false,
          message: 'Ошибка чтения отзывов',
          feedback: [],
          total: 0
        }
      }
      
      // Сортируем по дате (новые сверху)
      const sortedFeedback = allFeedback.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
      
      return {
        success: true,
        feedback: sortedFeedback,
        total: allFeedback.length
      }
    } catch (error) {
      console.error('Ошибка получения отзывов:', error)
      return {
        success: false,
        message: 'Ошибка получения отзывов',
        error: error instanceof Error ? error.message : 'Unknown error',
        feedback: [],
        total: 0
      }
    }
  }
  
  // POST - создание нового отзыва
  if (event.method === 'POST') {
    try {
      const body = await readBody(event)
      
      const { 
        user_id,
        user_fio,
        department,
        message,
        rating = null,
        user_telegram_id
      } = body
      
      if (!user_id || !message || !user_fio) {
        return {
          success: false,
          message: 'Недостаточно данных для отзыва'
        }
      }
      
      // Путь к файлу отзывов
      const feedbackDir = path.join(process.cwd(), 'data', 'feedback')
      const feedbackFilePath = path.join(feedbackDir, 'feedback.json')
      
      // Создаем папку, если не существует
      if (!fs.existsSync(feedbackDir)) {
        fs.mkdirSync(feedbackDir, { recursive: true })
      }
      
      let allFeedback: any[] = []
      
      // Читаем существующие отзывы
      if (fs.existsSync(feedbackFilePath)) {
        try {
          const fileContent = fs.readFileSync(feedbackFilePath, 'utf8')
          allFeedback = JSON.parse(fileContent)
        } catch (error) {
          console.error('Ошибка чтения файла отзывов:', error)
          allFeedback = []
        }
      }
      
      // Создаем новый отзыв
      const newFeedback = {
        id: Date.now(),
        user_id,
        user_fio,
        user_telegram_id: user_telegram_id || null,
        department: department || 'Не указан',
        rating: rating ? parseInt(rating) : null,
        message: message.trim(),
        reply: null,
        reply_user_id: null,
        reply_user_fio: null,
        reply_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'new' // new, replied, resolved
      }
      
      // Добавляем отзыв
      allFeedback.push(newFeedback)
      
      // Сохраняем в файл
      fs.writeFileSync(
        feedbackFilePath, 
        JSON.stringify(allFeedback, null, 2),
        'utf8'
      )
      
      console.log('Сохранен новый отзыв:', {
        user_fio: newFeedback.user_fio,
        rating: newFeedback.rating,
        message_length: newFeedback.message.length
      })
      
      return {
        success: true,
        message: 'Отзыв успешно отправлен!',
        feedback: newFeedback,
        total: allFeedback.length
      }
    } catch (error) {
      console.error('Ошибка сохранения отзыва:', error)
      return {
        success: false,
        message: 'Ошибка сохранения отзыва',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  return {
    success: false,
    message: 'Метод не поддерживается'
  }
})