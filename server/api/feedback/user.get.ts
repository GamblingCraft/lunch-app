// app/api/feedback/user.get.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const { user_id } = getQuery(event)
    
    if (!user_id) {
      return {
        success: false,
        message: 'Не указан ID пользователя',
        feedback: []
      }
    }
    
    const feedbackFilePath = path.join(process.cwd(), 'data', 'feedback', 'feedback.json')
    
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
        feedback: []
      }
    }
    
    // Фильтруем отзывы пользователя
    const userFeedback = allFeedback.filter(f => f.user_id.toString() === user_id.toString())
    
    return {
      success: true,
      feedback: userFeedback,
      total: userFeedback.length
    }
  } catch (error) {
    console.error('Ошибка получения отзывов пользователя:', error)
    return {
      success: false,
      message: 'Ошибка получения отзывов',
      error: error instanceof Error ? error.message : 'Unknown error',
      feedback: []
    }
  }
})