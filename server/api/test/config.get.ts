// server/api/test/config.get.ts
export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  return {
    telegramBotName: config.public.telegramBotName,
    telegramBotToken: config.public.telegramBotToken ? '***' + config.public.telegramBotToken.slice(-4) : 'none',
    accessCode: config.public.accessCode,
    nodeEnv: process.env.NODE_ENV,
    loaded: true
  }
})