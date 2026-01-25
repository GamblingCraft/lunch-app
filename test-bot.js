const TOKEN = '8411252683:AAGRfQwhQj_geJ7njS1r54zsqunt9x39obs'
const BOT_USERNAME = 'et_lunch_bot'

console.log('Проверка бота:', BOT_USERNAME)
console.log('Токен начинается с:', TOKEN.split(':')[0])

// Проверяем через Telegram Bot API
fetch(`https://api.telegram.org/bot${TOKEN}/getMe`)
  .then(r => r.json())
  .then(data => {
    console.log('Информация о боте:', data)
    if (data.ok) {
      console.log('✅ Бот активен:', data.result.username)
    } else {
      console.log('❌ Ошибка бота:', data.description)
    }
  })
  .catch(error => console.error('Ошибка запроса:', error))
