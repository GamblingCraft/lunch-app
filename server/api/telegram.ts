// server/api/telegram.ts
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('Telegram webhook data:', body)
    
    // Здесь обработка сообщений от бота
    // Например, если пользователь нажал кнопку "Start"
    
    return { ok: true }
  } catch (error) {
    console.error('Webhook error:', error)
    return { ok: false, error: error.message }
  }
})