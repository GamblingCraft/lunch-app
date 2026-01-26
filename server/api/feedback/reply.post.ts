// app/api/feedback/reply.post.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const { 
      feedback_id,
      reply_message,
      reply_user_id,
      reply_user_fio
    } = body
    
    if (!feedback_id || !reply_message || !reply_user_id) {
      return {
        success: false,
        message: 'Недостаточно данных для ответа'
      }
    }
    
    // Путь к файлу отзывов
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
    
    // Ищем отзыв
    const feedbackIndex = allFeedback.findIndex(f => f.id === feedback_id)
    
    if (feedbackIndex === -1) {
      return {
        success: false,
        message: 'Отзыв не найден'
      }
    }
    
    // Обновляем отзыв
    allFeedback[feedbackIndex] = {
      ...allFeedback[feedbackIndex],
      reply: reply_message.trim(),
      reply_user_id,
      reply_user_fio: reply_user_fio || 'Администратор',
      reply_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'replied'
    }
    
    // Сохраняем в файл
    fs.writeFileSync(
      feedbackFilePath, 
      JSON.stringify(allFeedback, null, 2),
      'utf8'
    )
    
    return {
      success: true,
      message: 'Ответ успешно отправлен',
      feedback: allFeedback[feedbackIndex]
    }
  } catch (error) {
    console.error('Ошибка отправки ответа:', error)
    return {
      success: false,
      message: 'Ошибка отправки ответа',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})