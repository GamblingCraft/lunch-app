// scripts/set-webhook.js
import { config } from 'dotenv'

config()

const BOT_TOKEN = process.env.NUXT_PUBLIC_TELEGRAM_BOT_TOKEN
const WEBHOOK_URL = 'http://localhost:3000/api/telegram' // Замените на ваш URL

async function setWebhook() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ['message', 'callback_query']
      })
    })
    
    const data = await response.json()
    console.log('Webhook установлен:', data)
  } catch (error) {
    console.error('Ошибка установки webhook:', error)
  }
}

setWebhook()