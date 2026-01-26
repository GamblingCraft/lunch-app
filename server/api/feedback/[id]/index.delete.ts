// app/api/feedback/[id]/index.delete.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const feedbackId = getRouterParam(event, 'id')
    
    if (!feedbackId) {
      return {
        success: false,
        message: 'Не указан ID отзыва'
      }
    }
    
    const feedbackFilePath = path.join(process.cwd(), 'data', 'feedback', 'feedback.json')
    
    // Проверяем существование файла
    if (!fs.existsSync(feedbackFilePath)) {
      return {
        success: false,
        message: 'Файл отзывов не найден'
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
        message: 'Ошибка чтения отзывов'
      }
    }
    
    // Фильтруем отзыв
    const initialLength = allFeedback.length
    allFeedback = allFeedback.filter(f => f.id.toString() !== feedbackId.toString())
    
    if (allFeedback.length === initialLength) {
      return {
        success: false,
        message: 'Отзыв не найден'
      }
    }
    
    // Сохраняем в файл
    fs.writeFileSync(
      feedbackFilePath, 
      JSON.stringify(allFeedback, null, 2),
      'utf8'
    )
    
    return {
      success: true,
      message: 'Отзыв удален',
      total: allFeedback.length
    }
  } catch (error) {
    console.error('Ошибка удаления отзыва:', error)
    return {
      success: false,
      message: 'Ошибка удаления отзыва',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})