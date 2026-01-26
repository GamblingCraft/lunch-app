// app/api/feedback/mark-seen.post.ts
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const { feedback_ids, user_id } = body
    
    if (!feedback_ids || !Array.isArray(feedback_ids) || !user_id) {
      return {
        success: false,
        message: 'Недостаточно данных'
      }
    }
    
    const feedbackFilePath = path.join(process.cwd(), 'data', 'feedback', 'feedback.json')
    
    // Проверяем существование файла
    if (!fs.existsSync(feedbackFilePath)) {
      return {
        success: true,
        message: 'Файл отзывов не найден',
        updated: 0
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
    
    // Помечаем отзывы как прочитанные
    let updatedCount = 0
    allFeedback = allFeedback.map(feedback => {
      if (feedback_ids.includes(feedback.id) && 
          feedback.user_id.toString() === user_id.toString() &&
          !feedback.seen_by_user) {
        updatedCount++
        return {
          ...feedback,
          seen_by_user: true,
          seen_at: new Date().toISOString()
        }
      }
      return feedback
    })
    
    // Сохраняем в файл
    fs.writeFileSync(
      feedbackFilePath, 
      JSON.stringify(allFeedback, null, 2),
      'utf8'
    )
    
    console.log(`Помечено как прочитанных: ${updatedCount} отзывов для пользователя ${user_id}`)
    
    return {
      success: true,
      message: `Помечено как прочитанных: ${updatedCount}`,
      updated: updatedCount
    }
  } catch (error) {
    console.error('Ошибка отметки прочтения:', error)
    return {
      success: false,
      message: 'Ошибка отметки прочтения',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})